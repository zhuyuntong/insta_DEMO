"""REST API for posts."""
import flask
import insta485
from flask import request, session
from pathlib import Path
from insta485.api.utils import InvalidUsage, is_login


@insta485.app.route('/api/v1/likes/', methods=['POST'])
@is_login
def post_likes():
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
    postid = 0
    if request.args.get('postid') is not None:
        postid = request.args.get('postid')

    context = {}

    cur0 = connection.execute(
        "SELECT likeid " "FROM likes " "WHERE owner =? AND postid =?",
        (
            accusername,
            postid,
        ),
    )
    exists = cur0.fetchall()

    if exists:
        context['likeid'] = exists[0]['likeid']
        context['url'] = (
            '/api/v1/likes/' + str(exists[0]['likeid']) + '/'
        )
        return flask.jsonify(**context), 200

    connection.execute(
        "INSERT INTO likes (owner, postid) " "VALUES (?, ?)",
        (
            accusername,
            postid,
        ),
    )

    cur = connection.execute("SELECT last_insert_rowid() ")
    likeid = cur.fetchall()

    context['likeid'] = likeid[0]
    context['url'] = '/api/v1/likes/' + str(likeid) + '/'

    return flask.jsonify(**context), 201


@insta485.app.route('/api/v1/likes/<likeid>/', methods=['DELETE'])
@is_login
def delete_likes(likeid):
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

    cur0 = connection.execute(
        "SELECT owner, likeid " "FROM likes " "WHERE likeid =?",
        (likeid,),
    )
    exists = cur0.fetchall()

    if not exists:
        raise InvalidUsage('Like does not exist', status_code=404)
    elif exists[0]['owner'] != accusername:
        raise InvalidUsage(
            'Logname does not own the like', status_code=403
        )

    connection.execute(
        "DELETE FROM likes WHERE " "likeid =?", (likeid,)
    )

    return flask.Response(status=204)
