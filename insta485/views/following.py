"""
Insta485 index (main) view.

URLs include: GET & POST
/
"""
from flask import session, render_template
from flask import abort, request, redirect, url_for
from insta485.views.utils import is_login
import insta485


@insta485.app.route('/users/<user_url_slug>/following/', methods=['GET'])
@is_login
def following(user_url_slug):
    """Require."""
    logname = session['username']
    connection = insta485.model.get_db()

    accusername = user_url_slug

    cur02 = connection.execute(
        "SELECT COUNT(username) "
        "FROM users "
        "WHERE username=?",
        (accusername, )
    )
    existsdb = cur02.fetchall()

    if existsdb[0]['COUNT(username)'] == 0:
        abort(404)

    cur = connection.execute(
        "SELECT f.username2, u.filename "
        "FROM users u, following f "
        "WHERE u.username = f.username2 AND f.username1 =?",
        (accusername, )
    )
    followingdb = cur.fetchall()

    for followee in followingdb:
        followee['filename'] = url_for('get_file',
                                       filename=followee['filename'])
        cur2 = connection.execute(
            "SELECT COUNT(f.username1) "
            "FROM following f "
            "WHERE f.username1 =? AND f.username2 =?",
            (logname, followee['username2'], )
        )
        isfollowdb = cur2.fetchall()
        followee['isfollow'] = isfollowdb[0]['COUNT(f.username1)']

    context = {
            "logname": logname, "following": followingdb,
            "username": accusername
    }

    return render_template("following.html", **context)


@insta485.app.route('/following/', methods=['POST'])
@is_login
def follow():
    """Require."""
    if request.args.get('target') is None:
        return redirect(url_for('show_index'))

    target = request.args.get('target')

    operation = request.form['operation']

    connection = insta485.model.get_db()

    logname = session['username']
    targetuser = request.form['username']

    cur = connection.execute(
        "SELECT f.username1 "
        "FROM following f "
        "WHERE username1=? AND username2=?",
        (logname, targetuser, )
    )
    followdb = cur.fetchall()

    if operation == 'follow':
        if followdb:
            abort(409)
        else:
            connection.execute(
                "INSERT INTO following(username1,username2) "
                "VALUES (?,?)",
                (logname, targetuser, )
            )
    elif operation == 'unfollow':
        if not followdb:
            abort(409)
        else:
            connection.execute(
                "DELETE FROM following WHERE "
                "username1 = ? AND username2 =?",
                (logname, targetuser, )
            )
    return redirect(target)
