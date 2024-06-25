"""
Insta485 index (main) view.

URLs include: LIKES

- Create or delete a like and immediately redirect to URL.
- Use the operation and postid values from the POST request form content.
    - If operation is like, create a like for postid
    - If operation is unlike, delete a like for postid.
- Then, redirect to URL. If the value of ?target is not set, redirect to /
"""
import flask
from flask import request, redirect, session
import insta485
from insta485.views.utils import is_login
from insta485.model import get_db


@insta485.app.route('/likes/', methods=['POST'])
@is_login
def like():
    """Require."""
    postid = request.form['postid']
    operation = request.form['operation']
    error = None
    database = get_db()
    user = ''

    target_dir = '/'
    if request.args.get('target'):
        target_dir = request.args.get('target')

    if error is None:
        # session.clear()
        user = session['username']

    # If someone tries to like a post they have already
    # liked or unlike a post they have not liked, then abort(409)

    # check the status of LIKE
    user_likes = database.execute(
        "SELECT * "
        "FROM likes "
        "WHERE postid = ? AND owner = ?",
        (postid, user)
    ).fetchall()

    if operation == 'like':
        if user_likes:
            flask.abort(409)
        # create a like for postid
        database.execute("INSERT INTO likes (owner, postid) \
                    VALUES (?, ?)", (user, postid))
    else:
        if not user_likes:
            flask.abort(409)
        # delete a like for postid
        database.execute("DELETE FROM likes WHERE \
                    owner = ? AND postid =?", (user, postid))

    return redirect(target_dir)
