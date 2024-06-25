"""Insta485 index (main) view."""
from functools import wraps
from pathlib import Path
from flask import session, redirect, url_for, abort
from flask.helpers import send_from_directory
import insta485


def is_login(func):
    """Return if a user logs in successfully."""
    @wraps(func)
    def guard(*args, **kwargs):
        if 'username' in session:
            return func(*args, **kwargs)
        return redirect(url_for('login'))
    return guard


@insta485.app.route('/uploads/<path:filename>')
def get_file(filename):
    """Return the file given filename."""
    if 'username' not in session:
        abort(403)
    if Path(insta485.app.config['UPLOAD_FOLDER'] / filename).exists() is False:
        abort(404)
    return send_from_directory(insta485.app.config['UPLOAD_FOLDER'], filename)
