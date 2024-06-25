"""Insta485 index (main) view."""
from functools import wraps
import hashlib
from flask import (
    session,
    request,
)
from flask import jsonify
from flask.helpers import send_from_directory
import insta485


class InvalidUsage(Exception):
    """Require."""

    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        """Require."""
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Require."""
        rvvvv = dict(self.payload or ())
        rvvvv['message'] = self.message
        rvvvv['status_code'] = self.status_code
        return rvvvv

def passworddb(connection, accusername):
    cur = connection.execute(
                "SELECT password " "FROM users " "WHERE username=?",
                (accusername,),
            )
            passworddb = cur.fetchall()
            
def is_login(func):
    """Return if a user logs in successfully."""

    @wraps(func)
    def guard(*args, **kwargs):
        auth = request.authorization
        if auth:
            # check if authorized
            accusername = auth['username']
            accpassword = auth['password']

            connection = insta485.model.get_db()
            cur = connection.execute(
                "SELECT password " "FROM users " "WHERE username=?",
                (accusername,),
            )
            passworddb = cur.fetchall()

            if passworddb:
                temppassword = passworddb[0]['password']
                algorithm = 'sha512'
                _, salt, _ = temppassword.split('$')
                hash_obj = hashlib.new(algorithm)
                password_salted = salt + accpassword
                hash_obj.update(password_salted.encode('utf-8'))
                password_hash = hash_obj.hexdigest()
                password_db_string = "$".join(
                    [algorithm, salt, password_hash]
                )

                if password_db_string != temppassword:
                    raise InvalidUsage('wrong password', 403)
            else:
                raise InvalidUsage('wrong username', 403)
            return func(*args, **kwargs)
        elif 'username' in session:
            return func(*args, **kwargs)
        raise InvalidUsage('not logged in', 403)

    # raise redirect(url_for('login'))
    return guard


@insta485.app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    """Require."""
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response
