"""
Insta485 index (main) view.

URLs include:
/likes/
"""
from flask import session, render_template, abort
from insta485.views.utils import is_login, url_for
import insta485


def existsdb_helper(connection, accusername):
    """Require."""
    cur0 = connection.execute(
        "SELECT COUNT(username) "
        "FROM users "
        "WHERE username=?",
        (accusername, )
    )
    existsdb = cur0.fetchall()
    return existsdb


def fullnamedb_helper(connection, accusername):
    """Require."""
    cur = connection.execute(
        "SELECT fullname "
        "FROM users "
        "WHERE username=?",
        (accusername, )
    )
    fullnamedb = cur.fetchall()
    return fullnamedb


def postsdb_helper(connection, accusername):
    """Require."""
    cur2 = connection.execute(
        "SELECT DISTINCT p.postid, p.filename "
        "FROM posts p "
        "WHERE p.owner =? "
        "ORDER BY p.postid",
        (accusername, )
    )
    postsdb = cur2.fetchall()
    return postsdb


def followersdb_helper(connection, accusername):
    """Require."""
    cur3 = connection.execute(
        "SELECT COUNT(f.username1) "
        "FROM following f "
        "WHERE f.username2 =?",
        (accusername, )
    )
    followersdb = cur3.fetchall()
    return followersdb


def followingdb_helper(connection, accusername):
    """Require."""
    cur4 = connection.execute(
        "SELECT COUNT(f.username2) "
        "FROM following f "
        "WHERE f.username1 =?",
        (accusername, )
    )
    followingdb = cur4.fetchall()
    return followingdb


@insta485.app.route('/users/<user_url_slug>/', methods=['GET'])
@is_login
def user(user_url_slug):
    """Require."""
    logname = session['username']
    connection = insta485.model.get_db()

    accusername = user_url_slug

    existsdb = existsdb_helper(connection, accusername)

    if existsdb[0]['COUNT(username)'] == 0:
        abort(404)

    fullnamedb = fullnamedb_helper(connection, accusername)

    postsdb = postsdb_helper(connection, accusername)

    followersdb = followersdb_helper(connection, accusername)

    followingdb = followingdb_helper(connection, accusername)

    cur5 = connection.execute(
        "SELECT COUNT(p.postid) "
        "FROM posts p "
        "WHERE p.owner =?",
        (accusername, )
    )
    postscountdb = cur5.fetchall()

    cur6 = connection.execute(
        "SELECT COUNT(f.username1) "
        "FROM following f "
        "WHERE f.username1 =? AND f.username2 =?",
        (logname, accusername, )
    )
    isfollowdb = cur6.fetchall()

    for i in postsdb:
        i['filename'] = url_for('get_file', filename=i['filename'])

    context = {
            "logname": logname, "is_follow": isfollowdb[0],
            "username": accusername, "fullname": fullnamedb[0],
            "posts": postsdb, "following": followingdb[0],
            "followers": followersdb[0], "postscount": postscountdb[0]
    }

    return render_template("user.html", **context)
