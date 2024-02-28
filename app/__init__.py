# __init__.py or your initialization script
from flask import Flask
from flask_mysqldb import MySQL

app = Flask(__name__)
app.config.from_object('config') # here, the name in the () is a module name

# print(app.config)

mysql = MySQL(app)

from app.handle_tenants_data import handle_tenant
from app.db_operations import register_chk_user_email, login_chk_email_pwd
from app.zForms import LoginForm, RegisterForm
from app import mainProject