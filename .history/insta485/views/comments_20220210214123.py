"""
Insta485 index (main) view.

URLs include: GET
/posts/<postid_url_slug>/

"""
import flask
from flask import session
from flask import request, redirect
from insta485.views.utils import is_login
import insta485


@insta485.app.route('/comments/', methods=['POST'])
@is_login
def comment():
    """Require."""
    target = '/'
    if request.args.get('target') is not None:
        target = request.args.get('target')

    logname = session['username']
    connection = insta485.model.get_db()
    operation = request.form['operation']

    if operation == "create":
        text = request.form['text']
        postid = request.form['postid']

        if text is None or text == "":
            flask.abort(400)

        connection.execute(
            "INSERT INTO comments(owner, postid, text) "
            "VALUES(?, ?, ?)",
            (logname, postid, text))
    else:
        commentid = request.form['commentid']

        cur = connection.execute(
            "SELECT COUNT(commentid) "
            "FROM comments "
            "WHERE commentid=? AND owner=?",
            (commentid, logname, )
            )
        isowndb = cur.fetchall()
        if isowndb[0]['COUNT(commentid)'] == 0:
            flask.abort(403)

        connection.execute(
            "DELETE FROM comments "
            "WHERE owner = ? AND commentid = ?",
            (logname, commentid, )
        )
    return redirect(target)
