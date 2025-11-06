from flask import app, render_template, redirect, url_for, request, jsonify
from app import app
from app.models import Registry, User
from app.helpers import check_user_cred, user_exists, get_user, get_rides, create_new_ride
from flask_login import current_user, login_required, login_user, logout_user



@app.route('/')
def land():
    return render_template('land.html')


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
    
    user = user_exists(uname, email)
    
    if user:
        return jsonify({"status": "error", 
                        "message": "User with username or email already exists"}), 400
    else:
        new_user = Registry(username = uname, email = email, password = pswd)
        User.save(new_user)
    
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
    if not check_user_cred(email, pwsd):
        return jsonify({"status": "error",
                        "message":"Invalid Credentials" }), 400
    
    user = get_user(email)
    login_user(user)
    return jsonify({"status": "success",
                    "message": "Welcome back! {uname} "}), 200

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('signin'))

@app.route('/home')
@login_required
def home():
    return render_template('home.html', title = 'Welcome')

@app.route('/rides')
def avail_rides():
    rides = get_rides()
    return render_template('rides.html', title = 'Available Rides', rides = rides)

@app.route('/share-ride')
@login_required
def share_a_ride():
    return render_template('newRide.html', title = 'New Ride')

@app.route('/newride', methods = ['POST'])
def new_ride():
    data = request.form
    # user = get_user(current_user)
    ride = create_new_ride(data, current_user)
    return redirect(url_for('home'))