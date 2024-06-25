"""
Insta485 index (main) view.

URLs include: GET
/posts/<postid_url_slug>/
"""
import uuid
import pathlib
import os
import arrow
import flask
from flask import session
from flask import render_template, url_for, request, redirect
from insta485.views.utils import is_login
import insta485


def postdb_helper(connection, accpostid):
    """Require."""
    cur = connection.execute(
        "SELECT DISTINCT p.owner, p.filename, "
        "p.created AS timestamp, u.filename AS owner_img_url "
        "FROM posts p, users u "
        "WHERE p.postid =? AND p.owner = u.username",
        (accpostid, )
    )
    postsdb = cur.fetchall()
    return postsdb


def likesdb_helper(connection, accpostid):
    """Require."""
    cur2 = connection.execute(
        "SELECT postid, COUNT(likeid) "
        "FROM likes "
        "WHERE postid =?",
        (accpostid, )
    )
    likesdb = cur2.fetchall()
    return likesdb


def islike_helper(connection, logname, accpostid):
    """Require."""
    cur25 = connection.execute(
        "SELECT COUNT(likeid) "
        "FROM likes "
        "WHERE owner =? AND postid = ?",
        (logname, accpostid, )
    )
    islike = cur25.fetchall()
    return islike


def islogname_helper(connection, logname, accpostid):
    """Require."""
    cur26 = connection.execute(
        "SELECT COUNT(owner) "
        "FROM posts "
        "WHERE owner =? AND postid =?",
        (logname, accpostid, )
    )
    islogname = cur26.fetchall()
    return islogname


@insta485.app.route('/posts/<postid_url_slug>/', methods=['GET'])
@is_login
def post(postid_url_slug):
    """Require."""
    logname = session['username']
    accpostid = postid_url_slug

    connection = insta485.model.get_db()

    postsdb = postdb_helper(connection, accpostid)

    likesdb = likesdb_helper(connection, accpostid)

    islike = islike_helper(connection, logname, accpostid)

    islogname = islogname_helper(connection, logname, accpostid)

    cur3 = connection.execute(
        "SELECT c.owner, c.commentid, c.text "
        "FROM comments c "
        "WHERE c.postid =? "
        "ORDER BY c.commentid",
        (accpostid, )
    )
    commentsdb = cur3.fetchall()

    # cur4 = connection.execute(
    #     "SELECT COUNT(likeid) "
    #     "FROM likes "
    #     "WHERE owner = ?",
    #     (logname, )
    # )
    # islikedb = cur4.fetchall()

    for i in postsdb:
        past = arrow.get(i['timestamp'], 'YYYY-MM-DD HH:mm:ss')
        i['timestamp'] = past.humanize()
        i['filename'] = url_for('get_file', filename=i['filename'])
        i['owner_img_url'] = url_for('get_file', filename=i['owner_img_url'])

    context = {
            "logname": logname, "islogname": islogname,
            "posts": postsdb, "likes": likesdb,
            "comments": commentsdb, "islike": islike,
            "postid": accpostid
    }
    return render_template("post.html", **context)


@insta485.app.route('/posts/', methods=['POST'])
@is_login
def post_posts():
    """Require."""
    logname = session['username']
    connection = insta485.model.get_db()
    operation = request.form['operation']
    target = "/users/" + logname + "/"
    if request.args.get('target') is not None:
        target = request.args.get('target')

    if operation == "create":
        # check whether the file is empty
        fileobj = flask.request.files["file"]
        filename = fileobj.filename
        filesize = os.path.getsize(filename)
        if filesize == 0:
            flask.abort(400)

        stem = uuid.uuid4().hex
        suffix = pathlib.Path(filename).suffix
        uuid_basename = f"{stem}{suffix}"
        # Save to disk
        path = insta485.app.config["UPLOAD_FOLDER"]/uuid_basename
        fileobj.save(path)

        connection.execute(
            "INSERT INTO posts(filename,owner) "
            "VALUES (?,?)",
            (uuid_basename, logname, )
        )
    else:
        postid = request.form['postid']

        cur = connection.execute(
            "SELECT filename "
            "FROM posts "
            "WHERE postid =? AND owner=?",
            (postid, logname, )
        )
        owndb = cur.fetchall()

        if not owndb:
            flask.abort(403)

        filename = owndb[0]['filename']
        if os.path.exists(insta485.app.config["UPLOAD_FOLDER"]/filename):
            os.remove(insta485.app.config["UPLOAD_FOLDER"]/filename)

        connection.execute(
            "DELETE FROM posts "
            "WHERE postid =? AND owner =?",
            (postid, logname, )
        )

    return redirect(target)
