from flask import Flask, render_template, redirect, url_for, session, request, flash, jsonify
import os
from dotenv import load_dotenv
import bcrypt

app = Flask(__name__)

PROJECT_IMAGES_PATH = "static\\imgs\\project-images"

load_dotenv(dotenv_path="admin\\admin.env")

os.getenv("SECRET_KEY")
app.secret_key = os.getenv("SECRET_KEY")

@app.route("/")
def home():
    projects = sorted(get_project_photos(), key=lambda x: os.path.getmtime(PROJECT_IMAGES_PATH + "\\" +x))
    return render_template("index.html", projects = projects)

@app.route("/admin")
def admin():
    if "admin" in session:
        projects = sorted(get_project_photos(), key=lambda x: os.path.getmtime(PROJECT_IMAGES_PATH + "\\" + x))
        return render_template("admin.html", projects = projects)
    else:
        return redirect(url_for('login'))

def is_admin(username, password = ""):
    
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD_HASH")

    return username == ADMIN_USERNAME and bcrypt.checkpw(password.encode(), ADMIN_PASSWORD.encode())

@app.route("/delete-photo", methods = ["POST"])
def delete_photo():
    if "admin" in session:
        data = request.get_json()
        photoName = data.get("photo_name")

        if not photoName:
            return jsonify({'success': False, 'message': "Фото не знайдено"})
        
        photoPath = PROJECT_IMAGES_PATH + "\\" + photoName

        if os.path.exists(photoPath):
            os.remove(photoPath)
        
        return jsonify({"success": True})

    else:
        flash("Спершу вам потрібно авторизуватись!")
        return redirect(url_for("login"))
    
@app.route("/add-photo", methods = ["POST"])
def add_photo():
    if "admin" in session:
      
        if "file" not in request.files:
            return jsonify({"message": "Файл не знайдено"}), 400

        file = request.files["file"]

        filepath = PROJECT_IMAGES_PATH + "\\" + file.filename
        file.save(filepath)
        
        return jsonify({"message": "Файл успішно додано"})
    else:
        flash("Спершу потрібно авторизуватись!")
        return(url_for(login))


@app.route('/login', methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        adminUsername = request.form.get('username')
        adminPassword = request.form.get("password")
        
        if is_admin(adminUsername, adminPassword):
            session["admin"] = True
            return redirect(url_for("admin"))

        flash("Неправильний логін або пароль!")
    return render_template('login.html')

def get_project_photos():
    files = os.listdir(PROJECT_IMAGES_PATH)

    return files

if __name__ == "__main__":
    app.run(debug=True)