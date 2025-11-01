from flask import app, render_template, redirect, url_for, request, jsonify
from app import app, db 
from app.helpers import create_user, user_exists

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/sign-up', methods = ['GET'])
def signup():
    return render_template('signup.html')



@app.route('/register', methods = ['POST'])
def register():
    '''
    This function handles the registry of the new user on the platform 
    '''
    data = request.get_json()
    uname = data.get('username')
    email = data.get('email')
    pswd = data.get('password')

    new_user = create_user(uname, email, pswd)
    if new_user is None:
        return jsonify({"status": "error", 
                        "message": "User with username already exists"}), 400
    else:
        db['registry'].append(new_user)
    
    return jsonify({"status": "success",
                    "message": "New User Created Successfully"}), 200

@app.route('/sign-in',  methods = ['GET'])
def signin():
    return render_template('signin.html')

@app.route('/login', methods = ['POST'])
def login():
    '''
    This function checks for the user in our db and checks for validity
    '''
    user = request.get_json()
    email = user['email']
    pwsd  = user['password']
    if not user_exists(email, pwsd):
        return jsonify({"status": "error",
                        "message":"Invalid Credentials" }), 400
    
    return jsonify({"status": "success",
                    "message": "Welcome back! {uname}"}), 200