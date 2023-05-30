from datetime import timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from config import config
import psycopg2.extras
import psycopg2
from database.db import get_connection
import pandas as pd
from sqlalchemy import text
import json
import cv2
import numpy as np
from PIL import Image
import os


app = Flask(__name__)

app.config['UPLOAD_EXTENSIONS'] = ['.jpg', '.jpeg', '.png']
app.config['ALLOWED_EXTENSIONS'] = {'.png', '.jpg', '.jpeg'}
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=10)
CORS(app, origins=['http://localhost:4200'])


conn = get_connection()


@app.route('/chat', methods=['POST'])
def chat():
    _user = request.form['user']
    image_path = request.files['imagen'] 
    image = Image.open(image_path)
    image.save('image.jpg')
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = "SELECT * FROM public.usuarios WHERE username=%s"
    sql_where = (_user,)

    cursor.execute(sql, sql_where)
    row = cursor.fetchone()
    neighborhood = row['neighborhood']
    print(neighborhood)

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = "SELECT name_hospital, contact FROM public.hospitales WHERE neighborhood_hospital=%s"
    sql_where = (neighborhood,)

    cursor.execute(sql, sql_where)
    rows = cursor.fetchall()

    if rows == []:
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        sql = "SELECT name_hospital, contact FROM public.hospitales"

        cursor.execute(sql)
        rows = cursor.fetchmany(5)

    dataframe = pd.DataFrame(rows, columns=['name_hospital', 'contact'])
    print(dataframe)

    hospitals = dataframe.to_dict(orient='records')

    # Inicio del reconocedor de imagenes

    protoFile = "pose_deploy_linevec_faster_4_stages.prototxt"
    weightsFile = "pose_iter_160000.caffemodel"
    net = cv2.dnn.readNetFromCaffe(protoFile, weightsFile)
    body_parts = {
        0: "Cabeza",
        1: "Pecho",
        2: "Espalda",
        3: "Pierna",
        4: "Brazo",
        5: "Mano",
        8: "Abdomen",
        10: "Pie"
    }
    part_indices = [0, 1, 2, 3, 4, 5, 8, 10]

    def detect_body_part(imagen_detec):
        # Cargar la imagen
        image = cv2.imread(imagen_detec)

        # Obtener las dimensiones de la imagen
        height, width, _ = image.shape

        # Crear un blob a partir de la imagen para la entrada al modelo
        blob = cv2.dnn.blobFromImage(image, 1.0, (368, 368), (127.5, 127.5, 127.5), swapRB=True, crop=False)

        # Pasar el blob a través de la red y obtener las detecciones
        net.setInput(blob)
        output = net.forward()

        # Inicializar una lista para almacenar las partes del cuerpo detectadas

        for index in part_indices:
            # Obtener la confianza de la parte del cuerpo actual
            confidence = output[0, index, :, :].max()

        # Si la confianza es lo suficientemente alta, devolver la parte del cuerpo detectada
            if confidence > 1:
                return body_parts[index]

        # Si no se encuentra ninguna parte del cuerpo, devolver None
        return None

    imagen_detec = "image.jpg"

    # Detectar las partes del cuerpo en la imagen
    bodypart = detect_body_part(imagen_detec)

    # Imprimir las partes del cuerpo detectadas
    if bodypart:
        print("La parte del cuerpo detectada es:", bodypart)
    else:
        print("No se detectó ninguna parte del cuerpo.", bodypart)

    response = {
        'hospitals': hospitals,
        'bodypart': bodypart
    }

    return json.dumps(response)


@app.route('/submit1', methods=['POST'])
def submit1():
    _json = request.json
    _username = _json['username']
    _password = _json['password']
    print(_username)
    print(_password)
    # validacion
    if _username and _password:
        # verificacion usuario exista
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        sql = "SELECT * FROM public.usuarios WHERE username=%s"
        sql_where = (_username,)

        cursor.execute(sql, sql_where)
        row = cursor.fetchone()
        username = row['username']
        password = row['password']
        print(username)
        print(password)
        if row:
            if password == _password:
                cursor.close()
                return jsonify({'message': 'You are logged in successfully', 'user': username})
            else:
                resp = jsonify(
                    {'message': 'Bad Request - invalid credendtials'})
                resp.status_code = 400
                return resp
    else:
        resp = jsonify({'message': 'Bad Request - invalid credendtials'})
        resp.status_code = 400
        return resp


@app.route('/submit', methods=['POST'])
def submit():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    _json = request.json
    _username = _json['username']
    _email = _json['email']
    _password = _json['password']
    _neighborhood = _json['neighborhood']
    print(_username)
    print(_email)
    print(_password)
    print(_neighborhood)
    if _username:
        # verificacion usuario exista

        sql = "SELECT * FROM public.usuarios WHERE username=%s"
        sql_where = (_username,)

        cursor.execute(sql, sql_where)
        row = cursor.fetchone()
        print(row)
        if row == None:
            cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            sql = "INSERT INTO public.usuarios (username, email, password, neighborhood) VALUES (%s, %s, %s, %s)"
            sql_where = (_username, _email, _password, _neighborhood)

            cursor.execute(sql, sql_where)
            conn.commit()
            cursor.close()
            return jsonify({'message': 'Register Completed'})

        else:
            resp = jsonify(
                {'message': 'Bad Request - User Already Exist'})
            resp.status_code = 400
            return resp

    else:
        resp = jsonify(
            {'message': 'Bad Request - Write all the sentences'})
        resp.status_code = 400
        return resp


if __name__ == '__main__':
    app.config.from_object(config['development'])
    app.run()
