"""
Insta485 index (main) view.

URLs include:
/
"""
import arrow
from flask import session, render_template, url_for
from insta485.views.utils import is_login
import insta485


@insta485.app.route('/', methods=['GET'])
@is_login
def show_index():
    """Require."""
    logname = session['username']
    connection = insta485.model.get_db()
    cur = connection.execute(
        "SELECT DISTINCT p.postid, p.owner, p.filename, "
        "p.created AS timestamp, u.filename AS owner_img_url "
        "FROM posts p JOIN users u "
        "ON p.owner = u.username "
        "JOIN following f "
        "ON (p.owner = ? OR (? = f.username1 AND f.username2 = p.owner)) "
        "ORDER BY p.postid",
        (logname, logname, )
    )
    postsdb = cur.fetchall()

    cur2 = connection.execute(
        "SELECT postid, COUNT(likeid) "
        "FROM likes "
        "GROUP BY postid "
    )
    likesdb = cur2.fetchall()

    cur3 = connection.execute(
        "SELECT c.owner, c.postid, c.text "
        "FROM comments c "
        "ORDER BY c.commentid "
    )
    commentsdb = cur3.fetchall()

    cur4 = connection.execute(
        "SELECT owner, postid "
        "FROM likes "
        "WHERE owner = ?",
        (logname, )
    )
    islikedb = cur4.fetchall()

    for info in postsdb:
        past = arrow.get(info['timestamp'], 'YYYY-MM-DD HH:mm:ss')
        info['timestamp'] = past.humanize()
        info['filename'] = url_for('get_file', filename=info['filename'])
        info['owner_img_url'] = url_for('get_file',
                                        filename=info['owner_img_url'])

    context = {
            "logname": logname,
            "posts": postsdb, "likes": likesdb,
            "comments": commentsdb, "islike": islikedb
    }
    return render_template("index.html", **context)
