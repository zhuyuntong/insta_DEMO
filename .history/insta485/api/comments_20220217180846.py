"""REST API for posts."""
import flask
from flask import request, session
import insta485
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


@insta485.app.route('/api/v1/comments/', methods=['POST'])
@is_login
def post_comments():
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

    postid = request.args.get('postid')

    context = {}

    text = request.json['text']

    connection.execute(
        "INSERT INTO comments(owner, postid, text) "
        "VALUES(?, ?, ?)",
        (
            accusername,
            postid,
            text,
        ),
    )

    cur = connection.execute("SELECT last_insert_rowid() ")
    commentid = cur.fetchall()

    context['commentid'] = commentid[0]['last_insert_rowid()']
    context['lognameOwnsThis'] = True
    context['owner'] = accusername
    context['ownerShowUrl'] = '/users/' + accusername + '/'
    context['text'] = text
    context['url'] = url + str(commentid)

    return flask.jsonify(**context), 201


@insta485.app.route(
    '/api/v1/comments/<commentid>/', methods=['DELETE']
)
@is_login
def delete_comments(commentid):
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

    context = {}

    cur = connection.execute(
        "SELECT owner " "FROM comments " "WHERE commentid =?",
        (commentid,),
    )
    commentsdb = cur.fetchall()

    if not commentsdb:
        raise InvalidUsage('comment does not exist', 404)
    elif commentsdb[0]['owner'] != accusername:
        raise InvalidUsage('user does not own the comment', 403)

    connection.execute(
        "DELETE FROM comments " "WHERE owner = ? AND commentid = ?",
        (
            accusername,
            commentid,
        ),
    )

    return flask.Response(status=204)
