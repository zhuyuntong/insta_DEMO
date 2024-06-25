"""
Insta485 index (main) view.

URLs include: GET
/
"""
from flask import session, render_template, abort
from flask import url_for
from insta485.views.utils import is_login
import insta485


@insta485.app.route('/users/<user_url_slug>/followers/', methods=['GET'])
@is_login
def followers(user_url_slug):
    """Require."""
    logname = session['username']
    connection = insta485.model.get_db()

    accusername = user_url_slug

    cur01 = connection.execute(
        "SELECT COUNT(username) "
        "FROM users "
        "WHERE username=?",
        (accusername, )
    )
    existsdb = cur01.fetchall()

    if existsdb[0]['COUNT(username)'] == 0:
        abort(404)

    cur = connection.execute(
        "SELECT f.username1, u.filename "
        "FROM users u, following f "
        "WHERE u.username = f.username1 AND f.username2 =?",
        (accusername, )
    )
    followersdb = cur.fetchall()
    for follower in followersdb:
        follower['filename'] = url_for('get_file',
                                       filename=follower['filename'])
        cur2 = connection.execute(
            "SELECT COUNT(f.username1) "
            "FROM following f "
            "WHERE f.username1 =? AND f.username2 =?",
            (logname, follower['username1'], )
        )
        isfollowdb = cur2.fetchall()
        follower['isfollow'] = isfollowdb[0]['COUNT(f.username1)']

    context = {
            "logname": logname, "followers": followersdb,
            "username": accusername
    }

    return render_template("followers.html", **context)
