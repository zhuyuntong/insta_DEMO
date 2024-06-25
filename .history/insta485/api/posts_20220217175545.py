"""REST API for posts."""
import flask
import insta485
from flask import request, session
from pathlib import Path
from insta485.api.utils import InvalidUsage, is_login


def postdb_helper(connection, accpostid):
    """Require."""
    cur = connection.execute(
        "SELECT p.postid, p.created, p.owner, "
        "p.filename AS imgUrl, u.filename AS ownerImgUrl "
        "FROM posts p, users u "
        "WHERE p.postid =? AND p.owner = u.username",
        (accpostid,),
    )
    postsdb = cur.fetchall()
    # print(postsdb)
    return postsdb


def likesdb_helper(connection, accpostid):
    """Require."""
    cur2 = connection.execute(
        "SELECT postid, COUNT(likeid) "
        "FROM likes "
        "WHERE postid =?",
        (accpostid,),
    )
    likesdb = cur2.fetchall()
    return likesdb


def likesowner_helper(connection, accpostid, accusername):
    """Require."""
    cur2 = connection.execute(
        "SELECT likeid " "FROM likes " "WHERE postid =? AND owner =?",
        (
            accpostid,
            accusername,
        ),
    )
    likesdb = cur2.fetchall()
    return likesdb


def postcount_helper(connection, accusername):
    """Require."""
    cur = connection.execute(
        "SELECT postid FROM ( "
        "SELECT p.postid "
        "FROM posts p "
        "WHERE p.owner = ? "
        "UNION "
        "SELECT p2.postid "
        "FROM posts p2, following f2 "
        "WHERE p2.owner = f2.username2 AND f2.username1 = ?) "
        "ORDER BY postid DESC",
        (
            accusername,
            accusername,
        ),
    )
    postcount = cur.fetchall()
    return postcount


@insta485.app.route('/api/v1/posts/')
@is_login
def get_post():
    """Return post."""
    # TBD later
    auth = request.authorization
    accusername = ''
    if auth:
        accusername = auth['username']
    else:
        accusername = session['username']
    # Username
    connection = insta485.model.get_db()
    url = request.path
    # size = 10
    # if request.args.get('size') is not None:
    #   size = int(request.args.get('size'))

    # page = 0
    # if request.args.get('page') is not None:
    #   page = int(request.args.get('page'))

    size = request.args.get("size", default=10, type=int)
    tempsize = size
    page = request.args.get("page", default=0, type=int)
    if size < 0 or page < 0:
        raise InvalidUsage('Bad Request', 400)

    cur = connection.execute(
        "SELECT postid FROM ( "
        "SELECT p.postid "
        "FROM posts p "
        "WHERE p.owner = ? "
        "UNION "
        "SELECT p2.postid "
        "FROM posts p2, following f2 "
        "WHERE p2.owner = f2.username2 AND f2.username1 = ?) "
        "ORDER BY postid DESC",
        (
            accusername,
            accusername,
        ),
    )
    postcount = postcount_helper(connection, accusername)

    cur2 = connection.execute(
        "SELECT COUNT(postid) FROM ( "
        "SELECT p.postid "
        "FROM posts p "
        "WHERE p.owner = ? "
        "UNION "
        "SELECT p2.postid "
        "FROM posts p2, following f2 "
        "WHERE p2.owner = f2.username2 AND f2.username1 = ?) "
        "ORDER BY postid DESC",
        (
            accusername,
            accusername,
        ),
    )
    totalpost = cur2.fetchall()
    if postcount[0]['postid'] < size:
        size = postcount[0]['postid']

    postid_lte = postcount[0]['postid']

    if request.args.get('size') is not None:
        url = url + '?size=' + str(size)

    if request.args.get('page') is not None:
        url = url + '&page=' + str(page)

    if request.args.get('postid_lte') is not None:
        postid_lte = int(request.args.get('postid_lte'))
        url = url + '&postid_lte=' + str(postid_lte)

    offset = page * size
    cur2 = connection.execute(
        "SELECT p.postid "
        "FROM posts p "
        "WHERE p.owner = ? AND p.postid <= ? "
        "UNION "
        "SELECT p.postid "
        "FROM posts p, following f "
        "WHERE p.owner = f.username2 AND f.username1 = ? "
        "AND p.postid <= ? "
        "ORDER BY p.postid DESC "
        "LIMIT ? OFFSET ?",
        (
            accusername,
            postid_lte,
            accusername,
            postid_lte,
            size,
            offset,
        ),
    )
    postsdb = cur2.fetchall()

    context = {'next': ""}
    if (
        totalpost[0]['COUNT(postid)'] > (size * (page + 1))
        or totalpost[0]['COUNT(postid)'] % (tempsize * (page + 1))
        == 0
    ):
        context['next'] = (
            request.path
            + '?size='
            + str(size)
            + '&page='
            + str(page + 1)
            + '&postid_lte='
            + str(postid_lte)
        )
    for post in postsdb:
        temp = post['postid']
        post['url'] = '/api/v1/posts/' + str(temp) + '/'

    context['results'] = postsdb
    context['url'] = url
    return flask.jsonify(**context)


@insta485.app.route('/api/v1/posts/<int:postid_url_slug>/')
@is_login
def get_postid(postid_url_slug):
    """Require."""
    # TBD later
    auth = request.authorization
    accusername = ''
    if auth:
        accusername = auth['username']
    else:
        accusername = session['username']
    # Username
    connection = insta485.model.get_db()

    cur = connection.execute(
        "SELECT c.owner, c.commentid, c.text "
        "FROM comments c "
        "WHERE c.postid =? "
        "ORDER BY c.commentid",
        (postid_url_slug,),
    )
    commentsdb = cur.fetchall()

    for comment in commentsdb:
        comment['lognameOwnsThis'] = False
        if comment['owner'] == accusername:
            comment['lognameOwnsThis'] = True
        comment['ownerShowUrl'] = '/users/' + comment['owner'] + '/'
        comment['url'] = (
            '/api/v1/comments/' + str(comment['commentid']) + '/'
        )

    postsdb = postdb_helper(connection, postid_url_slug)

    likescount = likesdb_helper(connection, postid_url_slug)

    likesowner = likesowner_helper(
        connection, postid_url_slug, accusername
    )

    likes = {}
    likes['lognameLikesThis'] = False
    if likesowner:
        likes['lognameLikesThis'] = True

    likes['numLikes'] = likescount[0]['COUNT(likeid)']
    likes['url'] = None
    if likes['lognameLikesThis'] is True:
        likes['url'] = (
            '/api/v1/likes/' + str(likesowner[0]['likeid']) + '/'
        )

    context = {}
    context['likes'] = likes
    context['comments'] = commentsdb
    if postsdb:
        context['created'] = postsdb[0]['created']
        context['imgUrl'] = '/uploads/' + postsdb[0]['imgUrl']
        context['owner'] = postsdb[0]['owner']
        context['ownerImgUrl'] = (
            '/uploads/' + postsdb[0]['ownerImgUrl']
        )
        context['ownerShowUrl'] = (
            '/users/' + postsdb[0]['owner'] + '/'
        )
        context['postShowUrl'] = (
            '/posts/' + str(postsdb[0]['postid']) + '/'
        )
        context['postid'] = postsdb[0]['postid']
        context['url'] = (
            '/api/v1/posts/' + str(postsdb[0]['postid']) + '/'
        )
    else:
        raise InvalidUsage('no post exists', 404)
    return flask.jsonify(**context)
