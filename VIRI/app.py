from flask import Flask, render_template, redirect, url_for, session, request
import os
from dotenv import load_dotenv
import bcrypt
load_dotenv()
print(os.environ)
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/admin")
def admin():
    if "admin" in session:
        if is_admin(session["admin"][0], session["admin"][1]):
            return render_template("admin.html")
    else:
        return redirect(url_for('login'))

def is_admin(username, password = ""):
    
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
    ADMIN_PASSWORD = os.getenv(".gitignore/ADMIN_PASSWORD_HASH")
    print(ADMIN_USERNAME)
    # print(bcrypt.checkpw(password.encode(), ADMIN_PASSWORD.encode()))
    return username == ADMIN_USERNAME 
# and bcrypt.checkpw(password.encode(), ADMIN_PASSWORD.encode())

@app.route('/login', methods = ["GET", "POST"])
def login():
    if request.method == "POST":
        adminUsername = request.form.get('username')
        adminPassword = request.form.get("password")
        # print(adminUsername)
        # print(adminPassword)
        # print(is_admin(adminUsername, adminPassword))
        if is_admin(adminUsername, adminPassword):
            return redirect(url_for("admin"))

    return render_template('login.html')

if __name__ == "__main__":
    app.run(debug=True)