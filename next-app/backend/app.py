from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# ==========================================
# 📂 PHOTO CONFIGURATION
# ==========================================
UPLOAD_FOLDER = "photos"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ==========================================
# 🗄 DATABASE CONNECTION (Railway Ready)
# ==========================================

db = mysql.connector.connect(
    host=os.getenv("MYSQLHOST", "localhost"),
    port=int(os.getenv("MYSQLPORT", 3307)),
    user=os.getenv("MYSQLUSER", "root"),
    password=os.getenv("MYSQLPASSWORD", ""),
    database=os.getenv("MYSQLDATABASE", "school")
)

# ==========================================
# 🖼️ SERVE IMAGES
# ==========================================
@app.route('/photos/<filename>')
def get_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ==========================================
# 📸 UPLOAD PHOTO
# ==========================================
@app.route("/student/photo/<int:reg_no>", methods=["POST"])
def upload_photo(reg_no):
    if 'photo' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['photo']
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400

    ext = os.path.splitext(file.filename)[1]
    filename = secure_filename(f"student_{reg_no}{ext}")
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    cursor = db.cursor()
    cursor.execute("UPDATE students SET photo=%s WHERE reg_no=%s", (filename, reg_no))
    db.commit()

    return jsonify({"message": "Photo uploaded successfully", "photo": filename})

# ==========================================
# 🏠 HOME ROUTE
# ==========================================
@app.route("/")
def home():
    return "School ERP Backend Running"

# ==========================================
# ➕ ADD STUDENT
# ==========================================
@app.route("/student", methods=["POST"])
def add_student():
    data = request.json
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO students
        (name, standard, section, dob, father, phone)
        VALUES (%s,%s,%s,%s,%s,%s)
    """, (
        data.get("name"),
        data.get("standard"),
        data.get("section"),
        data.get("dob") or None,
        data.get("father"),
        data.get("phone")
    ))
    db.commit()
    return jsonify({"message": "Student added successfully"})

# ==========================================
# 📋 GET ALL STUDENTS
# ==========================================
@app.route("/students", methods=["GET"])
def get_students():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students ORDER BY standard, reg_no")
    return jsonify(cursor.fetchall())

# ==========================================
# 🔍 GET ONE STUDENT
# ==========================================
@app.route("/student/<int:reg_no>", methods=["GET"])
def get_student(reg_no):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE reg_no=%s", (reg_no,))
    student = cursor.fetchone()

    if not student:
        return jsonify({"message": "Student not found"}), 404

    return jsonify(student)

# ==========================================
# ✏ UPDATE STUDENT
# ==========================================
@app.route("/student/<int:reg_no>", methods=["PUT"])
def update_student(reg_no):
    data = request.json
    cursor = db.cursor()
    cursor.execute("""
        UPDATE students
        SET name=%s, standard=%s, section=%s, dob=%s, father=%s, phone=%s
        WHERE reg_no=%s
    """, (
        data.get("name"),
        data.get("standard"),
        data.get("section"),
        data.get("dob") or None,
        data.get("father"),
        data.get("phone"),
        reg_no
    ))
    db.commit()
    return jsonify({"message": "Student updated successfully"})

# ==========================================
# ❌ DELETE STUDENT
# ==========================================
@app.route("/student/<int:reg_no>", methods=["DELETE"])
def delete_student(reg_no):
    cursor = db.cursor()
    cursor.execute("DELETE FROM students WHERE reg_no=%s", (reg_no,))
    db.commit()
    return jsonify({"message": "Student deleted successfully"})

# ==========================================
# 🚀 START SERVER (Cloud Ready)
# ==========================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
