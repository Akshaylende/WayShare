from flask import app, render_template, redirect, url_for, request
from app import app, db 
from app.helpers import create_user

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

    new_user = create_user('test1', 'test1@gmail.com', 'test1')
    if new_user is None:
        return "User already exists"
    else:
        db['registry'].append(new_user)
    
    redirect(url_for('home'))


