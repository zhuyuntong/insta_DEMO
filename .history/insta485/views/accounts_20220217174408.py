"""Insta485 account view."""
import uuid
import hashlib
import os
from pathlib import Path
from flask import (
    request,
    session,
    redirect,
    render_template,
    abort,
    url_for,
)
import insta485

insta485.app.secret_key = os.urandom(24)


@insta485.app.route('/accounts/login/', methods=['GET'])
def login():
    """Log in the user."""
    if 'username' in session:
        return redirect(url_for('show_index'))
    return render_template('login.html')


@insta485.app.route('/accounts/', methods=['POST'])
def accounts_main():
    """Require."""
    operation = request.form['operation']
    target = '/'
    if request.args.get('target') is not None:
        target = request.args.get('target')
    if operation == 'login':
        accounts_login()
    elif operation == 'create':
        accounts_create()
    elif operation == 'delete':
        accounts_delete()
    elif operation == 'edit_account':
        accounts_edit()
    elif operation == 'update_password':
        accounts_update()
    return redirect(target)


def accounts_login():
    """Require."""
    # CASE1: look ino session
    connection = insta485.model.get_db()
    accusername = request.form['username']
    accpassword = request.form['password']

    # TODO: newly added for P3 HTTP AUTH
    # CASE2: http basic auth header AUTH
    # auth = request.authorization
    # # check if authorized
    # if auth:
    #     if not auth.get("username"):
    #         raise AuthenticationError("basic auth: no name provided.")
    #     if not auth.get("password"):
    #         raise AuthenticationError("basic auth: no pwd provided.")
    #     accusername = auth['username']
    #     accpassword = auth['password']

    if accusername == '' or accpassword == '':
        abort(400)
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
            abort(403)

        session['username'] = accusername
    else:
        abort(403)


@insta485.app.route('/accounts/create/', methods=['GET'])
def create():
    """Require."""
    if 'username' in session:
        return redirect(url_for('edit'))
    return render_template('create.html')


def accounts_create():
    """Require."""
    connection = insta485.model.get_db()

    fileobj = request.files['file']
    accusername = request.form['username']
    accfullname = request.form['fullname']
    accemail = request.form['email']
    accpassword = request.form['password']

    # Unpack flask object
    filename = fileobj.filename
    # Compute base name (filename without directory).
    # We use a UUID to avoid
    # clashes with existing files, and ensure that
    # the name is compatible with the filesystem.
    stem = uuid.uuid4().hex
    suffix = Path(filename).suffix
    uuid_basename = f"{stem}{suffix}"
    # Save to disk
    path = insta485.app.config["UPLOAD_FOLDER"] / uuid_basename
    fileobj.save(path)

    if uuid_basename == '' or accusername == '':
        abort(400)
    if accfullname == '' or accemail == '' or accpassword == '':
        abort(400)

    cur = connection.execute(
        "SELECT username " "FROM users " "WHERE username=?",
        (accusername,),
    )
    data = cur.fetchall()

    if not data:

        session['username'] = accusername

        password_db_string = password_helper(accpassword)
        connection.execute(
            "INSERT INTO users "
            "(username, fullname, email, filename, password) "
            "VALUES (?, ?, ?, ?, ?)",
            (
                accusername,
                accfullname,
                accemail,
                uuid_basename,
                password_db_string,
            ),
        )
    else:
        abort(409)


def password_helper(accpassword):
    """Require."""
    algorithm = 'sha512'
    salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + accpassword
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])
    return password_db_string


@insta485.app.route('/accounts/delete/', methods=['GET'])
def delete():
    """Require."""
    context = {'logname': session['username']}
    return render_template('delete.html', **context)


def accounts_delete():
    """Require."""
    connection = insta485.model.get_db()

    if 'username' not in session:
        abort(403)

    accusername = session['username']

    cur = connection.execute(
        "SELECT filename " "FROM posts " "WHERE owner=?",
        (accusername,),
    )
    postfiles = cur.fetchall()
    for post in postfiles:
        os.remove(
            Path(
                insta485.app.config["UPLOAD_FOLDER"]
                / post['filename']
            )
        )

    cur2 = connection.execute(
        "SELECT filename " "FROM users " "WHERE username=?",
        (accusername,),
    )
    userfiles = cur2.fetchall()
    os.remove(
        Path(
            insta485.app.config["UPLOAD_FOLDER"]
            / userfiles[0]['filename']
        )
    )

    connection.execute(
        "DELETE FROM users " "WHERE username=?", (accusername,)
    )
    session.pop('username')


@insta485.app.route('/accounts/edit/', methods=['GET'])
def edit():
    """Require."""
    connection = insta485.model.get_db()
    accusername = session['username']

    cur = connection.execute(
        "SELECT filename, fullname, email "
        "FROM users "
        "WHERE username=?",
        (accusername,),
    )
    userdb = cur.fetchall()
    userfile = userdb[0]['filename']
    for user in userdb:
        user['filename'] = url_for(
            'get_file', filename=user['filename']
        )
    context = {
        'logname': accusername,
        'filename': '/uploads' / Path(userfile),
        'username': accusername,
        'email': userdb[0]['email'],
        'fullname': userdb[0]['fullname'],
    }
    return render_template('edit.html', **context)


def accounts_edit():
    """Require."""
    connection = insta485.model.get_db()
    if 'username' not in session:
        abort(403)

    logname = session['username']
    fileobj = request.files['file']
    fullname = request.form['fullname']
    email = request.form['email']
    cur = connection.execute(
        "SELECT fullname, email, filename "
        "FROM users "
        "WHERE username=?",
        (logname,),
    )
    userdb = cur.fetchall()

    if fileobj.filename != '' and fileobj:
        origfilename = userdb[0]['filename']
        os.remove(
            Path(insta485.app.config["UPLOAD_FOLDER"] / origfilename)
        )

        # Unpack flask object
        filename = fileobj.filename
        # Compute base name (filename without directory).
        # We use a UUID to avoid
        # clashes with existing files, and ensure that
        # the name is compatible with the
        # filesystem.
        stem = uuid.uuid4().hex
        suffix = Path(filename).suffix
        uuid_basename = f"{stem}{suffix}"
        # Save to disk
        path = insta485.app.config["UPLOAD_FOLDER"] / uuid_basename
        fileobj.save(path)

        connection.execute(
            "UPDATE users " "SET filename=? " "WHERE username=?",
            (
                uuid_basename,
                logname,
            ),
        )

    if fullname != '':
        connection.execute(
            "UPDATE users " "SET fullname=? " "WHERE username=?",
            (
                fullname,
                logname,
            ),
        )
    else:
        abort(400)

    if email != '':
        connection.execute(
            "UPDATE users " "SET email=? " "WHERE username=?",
            (
                email,
                logname,
            ),
        )
    else:
        abort(400)


@insta485.app.route('/accounts/password/', methods=['GET'])
def password():
    """Require."""
    accusername = session['username']
    context = {'logname': accusername}
    return render_template('password.html', **context)


def accounts_update():
    """Require."""
    connection = insta485.model.get_db()
    if 'username' not in session:
        abort(403)
    accusername = session['username']
    prevpass = request.form['password']
    entpass = request.form['new_password1']
    entpassagain = request.form['new_password2']

    if prevpass == '' or entpass == '' or entpassagain == '':
        abort(400)

    cur = connection.execute(
        "SELECT password " "FROM users " "WHERE username=?",
        (accusername,),
    )
    passworddb = cur.fetchall()

    algorithm = 'sha512'
    temppassword = passworddb[0]['password']
    _, salt, _ = temppassword.split('$')
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + prevpass
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])

    if temppassword != password_db_string:
        abort(403)

    if entpass != entpassagain:
        abort(401)

    algorithm = 'sha512'
    salt = uuid.uuid4().hex
    hash_obj = hashlib.new(algorithm)
    password_salted = salt + entpass
    hash_obj.update(password_salted.encode('utf-8'))
    password_hash = hash_obj.hexdigest()
    password_db_string = "$".join([algorithm, salt, password_hash])

    connection.execute(
        "UPDATE users " "SET password=? " "WHERE username=?",
        (
            password_db_string,
            accusername,
        ),
    )


@insta485.app.route('/accounts/logout/', methods=['POST'])
def logout():
    """Require."""
    session.pop('username')
    return redirect(url_for('login'))
