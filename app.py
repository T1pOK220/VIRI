from flask import Flask, render_template, redirect, url_for, session, request, flash, jsonify
import os
import bcrypt
from config import Config
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

PROJECT_IMAGES_PATH = "static/imgs/project-images/"

app.config.from_object(Config)

db = SQLAlchemy(app=app)

class admins(db.Model):
    login = db.Column("login", db.String(100), primary_key = True)
    password = db.Column("password", db.String(100))

    def __init__(self, login, password):
        self.login = login
        self.password = password

@app.route("/")
def home():
    projects = sorted(get_project_photos(), key=lambda x: os.path.getmtime(PROJECT_IMAGES_PATH + x))
    return render_template("index.html", projects = projects)

@app.route("/admin")
def admin_panel():
    if "admin" in session:
        projects = sorted(get_project_photos(), key=lambda x: os.path.getmtime(PROJECT_IMAGES_PATH + x))
        return render_template("admin-panel.html", projects = projects, admin = session["admin"])
    else:
        return redirect(url_for('login'))

def is_admin(login, password = ""):
    
    found_user = admins.query.filter_by(login=login).first()

    if(found_user):
        return bcrypt.checkpw(password.encode(), found_user.password.encode())
    
    return False


@app.route("/admin/profile")
def admin_profile():
    if "admin" in session:
        return render_template("admin-profile.html", adminLogin = session["admin"])
    
    else:
        flash("Спершу вам потрібно авторизуватись!")
        return redirect(url_for("login"))


@app.route("/admin/delete-photo", methods = ["POST"])
def delete_photo():
    if "admin" in session:
        data = request.get_json()
        photoName = data.get("photo_name")

        if not photoName:
            return jsonify({'success': False, 'message': "Фото не знайдено"})
        
        photoPath = PROJECT_IMAGES_PATH + photoName

        if os.path.exists(photoPath):
            os.remove(photoPath)
        
        return jsonify({"success": True})

    else:
        flash("Спершу вам потрібно авторизуватись!")
        return redirect(url_for("login"))
    
@app.route("/admin/add-photo", methods = ["POST"])
def add_photo():
    if "admin" in session:
      
        if "file" not in request.files:
            return jsonify({"message": "Файл не знайдено"}), 400

        file = request.files["file"]

        filepath = PROJECT_IMAGES_PATH + file.filename
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
            session["admin"] = adminUsername
            return redirect(url_for("admin_panel"))

        flash("Неправильний логін або пароль!")
    return render_template('login.html')

@app.route("/change-login", methods=["POST"])
def change_login():
    if request.method == "POST":
        if "admin" in session:

            new_login = request.form.get("newLogin")

            admin = admins.query.filter_by(login = session["admin"]).first()

            admin.login = new_login
            db.session.commit()

            session["admin"] = new_login

            flash("Логін успішно змінено!")
            return redirect(url_for("admin_profile"))
        else:
            flash("Спершу потрібно авторизуватись!")
            return redirect(url_for("login"))

@app.route("/change-password", methods=["POST"])
def change_password():
    if request.method == "POST":
        if "admin" in session:
            old_password = request.form.get("oldPassword")
            new_password = bcrypt.hashpw(request.form.get("newPassword").encode(), bcrypt.gensalt()).decode()

            if is_admin(session["admin"], old_password):
                admin = admins.query.filter_by(login = session["admin"]).first()

                admin.password = new_password

                db.session.commit()

                flash("Пароль успішно змінено!")
                

            else:
                flash("Неправильний пароль!")

            return redirect(url_for("admin_profile"))
        else:
            flash("Спершу потрібно авторизуватись!")
            return redirect(url_for("login"))
        
def get_project_photos():
    files = os.listdir(PROJECT_IMAGES_PATH)

    return files

if __name__ == "__main__":
    app.run(debug=True)
