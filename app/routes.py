from flask import app, render_template, redirect, url_for, request, jsonify
from app import app
from app.models import Registry, User
from app.helpers import check_user_cred, user_exists, get_user, get_rides, create_new_ride, create_new_user,get_ride, update_user_profile, create_new_booking,home_page_data, handle_booking
from flask_login import current_user, login_required, login_user, logout_user



@app.route('/')
def land():
    return render_template('landing.html', title ='Share Rides along the Route')


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
    if user is None:
        user = create_new_user(email)
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
    home_data  = home_page_data(current_user)
    print(home_data)
    return render_template('home.html', title = 'Welcome', user = current_user.to_json(), data = home_data)

@app.route('/rides')
def avail_rides():
    date = request.args.get('date')
    dest = request.args.get('destination')      
    rides = get_rides(date, dest)
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

@app.route('/user/<string:user_id>')
@login_required
def profile(user_id):
    user = User.objects(id = user_id).first()
    return render_template('profile.html', user = user)

@app.route('/ride/<string:ride_id>')
def ride_details(ride_id):
    ride = get_ride(ride_id)
    return render_template('rideDetails.html', ride = ride)

@app.route('/save-profile-info', methods=['POST'])
@login_required
def user_profile():
    # user = get_user(current_user)
    data = request.json
    user = update_user_profile(data, current_user)
    # user = current_user
    # print(user.to_json())
    print(data)
    if user:
        return jsonify({
            "status": "success",
            "message": "Profile sent successfully!"
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "profile not saved!"
        }), 400


@app.route('/create-booking', methods = ['POST'])
def create_booking():
    data = request.json
    booking = create_new_booking(data, current_user)    
    
    if booking == 400:
        return jsonify({
            "status": "error",
            "message": 'Booking for own Ride is not Allowed'
        }), 400
    print(booking.to_json())
    return jsonify({
            "status": "success",
            "message": "Booking Request sent successfully!"
        }), 200

@app.route('/ride-booking', methods = ['POST'])
def ride_booking():
    data = request.json
    booking = handle_booking(data, current_user)

    return jsonify({
            "status": "success",
            "message": "Booking confirmation received!"
        }), 200