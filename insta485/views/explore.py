"""
Insta485 index (main) view.

URLs include: GET
/
"""
from flask import session, render_template, url_for
from insta485.views.utils import is_login
import insta485


@insta485.app.route('/explore/', methods=['GET'])
@is_login
def explore():
    """Require."""
    logname = session['username']
    database = insta485.model.get_db()

    cur = database.execute(
        "SELECT u.username, u.filename "
        "FROM users u JOIN following f "
        "ON u.username = f.username2 "
        "AND f.username2 !=? "
        "AND f.username1 !=?"
        "EXCEPT "
        "SELECT u2.username, u2.filename "
        "FROM users u2 JOIN following f2 "
        "ON u2.username = f2.username2 AND "
        "f2.username1=?",
        (logname, logname, logname, )
    )

    notfollowdb = cur.fetchall()

    for notfollow in notfollowdb:
        notfollow['filename'] = url_for('get_file',
                                        filename=notfollow['filename'])

    context = {
            "logname": logname,
            "not_follow": notfollowdb
    }
    return render_template('explore.html', **context)
