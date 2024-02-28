from app import app
from flask import render_template, request, session, redirect, url_for, flash
from app import register_chk_user_email, login_chk_email_pwd, handle_tenant
from app import LoginForm, RegisterForm
from datetime import timedelta

app.permanent_session_lifetime = timedelta(minutes=5)
@app.route('/')
@app.route('/login', methods=['POST', 'GET'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        email = form.email.data
        pwd = form.password.data
        chk_owner =  login_chk_email_pwd(email, pwd)
        
        if chk_owner:
            session.permanent = True
            session['loggedin'] = True
            session['owner_id'] = chk_owner['owner_id']
            session['owner_name'] = chk_owner['owner_name']
            return render_template('overallfile.html', \
                                   owner_name=chk_owner['owner_name'].capitalize(), \
                                   owner_id = chk_owner['owner_id'])
        else:
            flash('Invalid Login Credentials', 'error')
            return render_template('zlogin.html', form=form)
    if 'loggedin' in session:
        return render_template('overallfile.html', \
                                   owner_name=session['owner_name'].capitalize(), \
                                   owner_id = session['owner_id'])
    return render_template('zlogin.html', form=form)


@app.route('/register', methods=['POST', 'GET'])
def register():
    form = RegisterForm()

    if form.validate_on_submit():
        user_name = form.user_name.data
        email = form.email.data
        password = form.password.data
        result = register_chk_user_email(user_name, email, password)

        if result == 'success':
            flash('Registered Successfully! ', 'success')
            return render_template('zregister.html', form=form)
        elif result == 'usernameError':
            flash('Username already in use!','error')
            return render_template('zregister.html', form=form)
        
        elif result == 'emailError':
            flash('Email already in use!', 'error')
            return render_template('zregister.html', form=form)
        else:
            return result

    return render_template('zregister.html', form=form)


@app.route('/handle_data', methods=['POST', 'PUT', 'DELETE'])
def handle_data():
    data = request.get_json()
    render_tenants = handle_tenant(data)
    return render_tenants


@app.route('/logout')
def logout():
    session.pop('loggedin', None)
    session.pop('owner_id', None)
    session.pop('owner_name', None)

    return redirect(url_for('login'))