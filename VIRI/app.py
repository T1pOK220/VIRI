# Доробити шаблон. Чогось не робить правильно

from flask import Flask, render_template, redirect, url_for, session, request, flash
import os
from dotenv import load_dotenv
import bcrypt

app = Flask(__name__)

load_dotenv(dotenv_path="VIRI\\.gitignore\\admin.env")

print(os.getenv("SECRET_KEY"))
app.secret_key = os.getenv("SECRET_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    if "admin" in session:
        if is_admin(session["admin"][0], session["admin"][1]):
            projects = get_project_photos()
            print(projects)
            return render_template("admin.html", projects = projects)
    else:
        return redirect(url_for('login'))

def is_admin(username, password = ""):
    
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD_HASH")

    return username == ADMIN_USERNAME and bcrypt.checkpw(password.encode(), ADMIN_PASSWORD.encode())

@app.route('/login', methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        adminUsername = request.form.get('username')
        adminPassword = request.form.get("password")
        
        if is_admin(adminUsername, adminPassword):
            session["admin"] = [adminUsername, adminPassword]
            return redirect(url_for("admin"))

        flash("Неправильний логін або пароль!")
    return render_template('login.html')

def get_project_photos():
    files = os.listdir("VIRI\\static\\imgs\\project-images")

    return files

if __name__ == "__main__":
    app.run(debug=True)