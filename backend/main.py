from fastapi import FastAPI, Form
from fastapi.responses import RedirectResponse
import sqlite3
import kuzu

app = FastAPI()

import sqlite3

def init_users_db():
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            password TEXT NOT NULL,
            onyen TEXT UNIQUE NOT NULL,
            phone TEXT UNIQUE NOT NULL
        );
        """)

    conn.commit()
    conn.close()

init_users_db()


@app.get("/")
async def root():
    return RedirectResponse(url="/login")

@app.get("/login")
async def login_page():
    return {"message": "Welcome to the login page"}

@app.post("/login")
def login(username: str = Form(...), password: str = Form(...)):
    # Validate the username and password
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ? AND password = ?", (username, password))
    user = cursor.fetchone()
    conn.close()
    if user:
        return {"message": "Login successful!", "username": username}
    else:
        return {"error": "Invalid username or password"}

@app.get("/signup")
async def signup_page():
    return {"message": "Welcome to the signup page"}

@app.post("/signup")
def signup(username: str = Form(...), password: str = Form(...)):
    try:
        conn = sqlite3.connect("users.db")
        cursor = conn.cursor()
        # Insert the new user into the database
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        conn.close()
        return {"message": "Signup successful!", "username": username}
    except sqlite3.IntegrityError:
        return {"error": "Username already exists. Please choose a different username."}
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}
