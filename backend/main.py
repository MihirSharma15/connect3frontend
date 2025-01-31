import uuid
import os
from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import RedirectResponse
import kuzu

app = FastAPI()

DB_PATH = "kuzu_db"

if not os.path.exists(DB_PATH):
    os.makedirs(DB_PATH)

db = kuzu.Database(DB_PATH, read_only=False)
conn = kuzu.Connection(db)

def init_db():
    conn.execute("""
        CREATE NODE TABLE IF NOT EXISTS users (
            id STRING PRIMARY KEY,
            name STRING,
            password STRING,
            phone STRING
        );
    """)
    conn.execute("""
        CREATE REL TABLE IF NOT EXISTS connections (
            FROM users TO users,
            creator STRING
        );
    """)

init_db()

@app.on_event("shutdown")
def shutdown():
    global conn
    if conn:
        del conn

@app.get("/")
async def root():
    return RedirectResponse(url="/login")

@app.get("/login")
async def login_page():
    return {"message": "Welcome to login page"}

@app.post("/login")
def login(phone: str = Form(...), password: str = Form(...)):
    query = f"MATCH (u:users) WHERE u.phone = '{phone}' AND u.password = '{password}' RETURN u.id;"
    result = conn.execute(query)
    user_data = result.get_as_df()
    
    if len(user_data) == 1:
        user_id = user_data.iloc[0, 0]
        return {"message": "Login successful!", "user_id": user_id, "phone": phone}
    elif len(user_data) > 1:
        raise HTTPException(status_code=500, detail="Duplicate phone number")
    else:
        raise HTTPException(status_code=401, detail="Invalid phone number or password")

@app.get("/signup")
async def signup_page():
    return {"message": "Welcome to signup page"}

@app.post("/signup")
def signup(name: str = Form(...), password: str = Form(...), phone: str = Form(...)):
    try:
        # Check if phone number exists
        check_query = f"MATCH (u:users) WHERE u.phone = '{phone}' RETURN u.id, u.name;"
        result = conn.execute(check_query).get_as_df()
        
        if len(result) > 0:
            existing_user_id = result.iloc[0, 0]
            existing_name = result.iloc[0, 1]

            if isinstance(existing_name, str) and existing_name.strip(): 
                raise HTTPException(status_code=400, detail="Phone number already registered")

            # Update placeholder user
            update_query = f"""
                MATCH (u:users) WHERE u.id = '{existing_user_id}'
                SET u.name = '{name}', u.password = '{password}';
            """
            conn.execute(update_query)
            return {"message": "Signup successful (updated placeholder)", "user_id": existing_user_id, "phone": phone}

        # Create new user
        user_id = str(uuid.uuid4())
        
        insert_query = f"""
            CREATE (u:users {{id: '{user_id}', name: '{name}', password: '{password}', phone: '{phone}'}}); 
        """
        conn.execute(insert_query)

        return {"message": "Signup successful", "user_id": user_id, "phone": phone}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/createconnection")
def create_connection(user_id: str = Form(...), phone: str = Form(...)):
    # Ensure user exists
    user_check_query = f"MATCH (u:users) WHERE u.id = '{user_id}' RETURN u;"
    if len(conn.execute(user_check_query).get_as_df()) == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # Count connections that user has initiated
    count_query = f"""
        MATCH (u1:users)-[c:connections]->(u2:users) 
        WHERE u1.id = '{user_id}' AND c.creator = '{user_id}'
        RETURN COUNT(u2);
    """
    result = conn.execute(count_query)
    initiated_connections = int(result.get_as_df().iloc[0, 0]) if len(result.get_as_df()) > 0 else 0

    if initiated_connections >= 3:
        raise HTTPException(status_code=400, detail="You can only add up to 3 connections")

    # Check if users already connected
    connection_check_query = f"""
        MATCH (u1:users)-[:connections]-(u2:users) 
        WHERE u1.id = '{user_id}' AND u2.phone = '{phone}' 
        RETURN u2;
    """
    if len(conn.execute(connection_check_query).get_as_df()) > 0:
        raise HTTPException(status_code=400, detail="This user is already connected")

    # Prevent self-connection
    self_check_query = f"MATCH (u:users) WHERE u.id = '{user_id}' AND u.phone = '{phone}' RETURN u;"
    if len(conn.execute(self_check_query).get_as_df()) > 0:
        raise HTTPException(status_code=400, detail="Cannot connect to self")

    # Check if phone number is registered
    check_query = f"MATCH (u:users) WHERE u.phone = '{phone}' RETURN u.id;"
    phone_result = conn.execute(check_query)

    if len(phone_result.get_as_df()) == 0:
        # Create a placeholder user
        placeholder_id = str(uuid.uuid4())
        insert_query = f"CREATE (u:users {{id: '{placeholder_id}', phone: '{phone}'}});"
        conn.execute(insert_query)

        phone_user_id = placeholder_id
    else:
        phone_user_id = phone_result.get_as_df().iloc[0, 0]

    # Add the connection
    insert_connection_query = f"""
        MATCH (u1:users), (u2:users) 
        WHERE u1.id = '{user_id}' AND u2.id = '{phone_user_id}' 
        CREATE (u1)-[:connections {{creator: '{user_id}'}}]->(u2),
               (u2)-[:connections {{creator: '{user_id}'}}]->(u1);
    """
    conn.execute(insert_connection_query)

    return {"message": "Connection added successfully"}

@app.get("/search")
def search_connection(user1_id: str, user2_id: str):
    query = f"""
        MATCH (u1:users {{id: '{user1_id}'}}), (u2:users {{id: '{user2_id}'}})
        RETURN SHORTEST_PATH((u1)-[:connections*]-(u2));
    """
    result = conn.execute(query)

    if len(result.get_as_df()) == 0:
        return {"message": f"No connection found between {user1_id} and {user2_id}"}

    return {"message": "Connection found", "path": result.get_as_df().iloc[0, 0]}
