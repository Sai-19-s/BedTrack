from app import mysql
import MySQLdb.cursors
from flask import jsonify, request
from datetime import datetime

def handle_tenant(data):
    owner_id = data.get('owner_id')
    floor_idx = data.get('floor_idx')
    room_idx = data.get('room_idx')
    row_idx = data.get('row_idx')
    tname = data.get('Name')
    tphone = data.get('Phone')
    temail = data.get('Email')
    taddress = data.get('Address')
    def fetch_result():
        cursor.execute("Select * from rooms where owner_id=%s and floor_number=%s and room_number=%s",\
                   (owner_id, floor_idx, room_idx))
        return cursor.fetchall()
   
    cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
    res_data = []

    try:
        if request.method == 'POST' and row_idx is None:
            res_data = fetch_result()
            for row in res_data:
                if 'check_in' in row:
                    row['check_in'] = row['check_in'].strftime("%d-%m-%Y")

        elif request.method == 'POST' and row_idx is not None:

            cursor.execute("INSERT INTO rooms (owner_id, floor_number, room_number, tenant_number, name, phone, email, address) \
                            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (owner_id, floor_idx, room_idx, row_idx, tname, tphone, temail, taddress))

            mysql.connection.commit()

            res_data = fetch_result()
            for row in res_data:
                if 'check_in' in row:
                    row['check_in'] = row['check_in'].strftime("%d-%m-%Y")
        elif request.method == 'PUT':
            cursor.execute("Set sql_safe_updates = 0")
            cursor.execute("UPDATE rooms SET name = %s, phone = %s, email = %s, address = %s WHERE owner_id = %s AND floor_number = %s AND room_number = %s AND tenant_number = %s", \
                           (tname, tphone, temail, taddress, owner_id, floor_idx, room_idx, row_idx))
            mysql.connection.commit()
            cursor.execute("Set sql_safe_updates = 1")

            res_data = fetch_result()
            for row in res_data:
                if 'check_in' in row:
                    row['check_in'] = row['check_in'].strftime("%d-%m-%Y")
        elif request.method == 'DELETE':
            cursor.execute("Set sql_safe_updates = 0")
            cursor.execute("delete from rooms where owner_id=%s and floor_number=%s and room_number=%s and tenant_number=%s",\
                           (owner_id, floor_idx, room_idx, row_idx))
            mysql.connection.commit()
            cursor.execute("Set sql_safe_updates = 1")

            res_data = fetch_result()
            for row in res_data:
                if 'check_in' in row:
                    row['check_in'] = row['check_in'].strftime("%d-%m-%Y")
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        cursor.close()
    return jsonify({'status': 'success', 'data': res_data})
