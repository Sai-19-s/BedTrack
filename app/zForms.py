from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField #, validators
from wtforms.validators import DataRequired, Length, EqualTo, Regexp, Email

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email(message="- Enter a valid Email")],
                        render_kw={"placeholder": "Enter Email"})
    
    password = PasswordField('Password', validators=[DataRequired(), Length(min=8, max=18, message="- Password should be between greter than 8")], render_kw={"placeholder": "Enter your password"})

    submit = SubmitField('Log In')

class RegisterForm(FlaskForm):
    user_name = StringField('Username', validators=[DataRequired(), Regexp(r'^[a-zA-Z0-9_-]+$', message='- Allow only (a-zA-Z0-9_-)')], 
                                                    filters=[lambda x: x.lower() if x is not None else x], 
                                                    render_kw={"placeholder": "Username"})
    email = StringField('Email', validators=[DataRequired(), Email(message="- Enter a valid Email")],
                        render_kw={"placeholder": "Enter Email"})
    password = PasswordField('Password', validators=[DataRequired(),
                                                     Regexp(r'^[a-zA-Z0-9_!@#$%^&*()-]{8,18}$', message="- Invalid Password Format")], 
                                                     render_kw={"placeholder": "Enter your password"})
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password', message="- Password not matched")],
                                     render_kw={"placeholder": "Confirm password"})

    submit = SubmitField('Sign Up')