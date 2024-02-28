from app import mysql
import MySQLdb.cursors

def check_username(chk_user):
    cursor = mysql.connection.cursor()

    cursor.execute("Select count(*) from Owners where owner_name=%s", (chk_user,))
    
    user_res = cursor.fetchone()
    cursor.close()
    return str(user_res[0])

def check_email(chk_email):
    cursor = mysql.connection.cursor()

    cursor.execute("Select count(*) from Owners where owner_email=%s", (chk_email,))

    email_res = cursor.fetchone()
    cursor.close()
    return str(email_res[0])

def register_chk_user_email(user_name, email, password):
    chk_username = check_username(user_name)
    chk_email = check_email(email)
    cursor = mysql.connection.cursor()
    try:
        if int(chk_username) == 0 and int(chk_email) == 0:
            cursor.execute("Insert Into Owners(owner_name, owner_email, owner_pwd) values(%s, %s, %s)", (user_name, email, password))
            mysql.connection.commit()

            return 'success'
        
        elif int(chk_username) != 0:
            return "usernameError"
        
        elif int(chk_email) != 0:
            return 'emailError'
    
    except Exception as e:
        return f"Error = {e}"
    
    finally:
        cursor.close()

def login_chk_email_pwd(chk_email, chk_pwd):
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)

    try:
        cursor.execute("Select * from Owners where owner_email = %s and owner_pwd = %s", (chk_email, chk_pwd))

        login_res = cursor.fetchone()
        return login_res
    except Exception as e:
        return f"Error = {e}"
    finally:
        cursor.close()
