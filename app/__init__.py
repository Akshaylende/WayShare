from flask import Flask
from mongoengine import connect
from flask_login import LoginManager

app = Flask(__name__)
login_manager = LoginManager(app)
def create_app():
    '''
    Application factory function.
    This function creates and configures the Flask application instance.
    '''
    
    app.secret_key = 'f633126a21c0aae16266af82ee0772b5947f58d2f3236aa9f7f18a59a2a80742'
   
    # Initializing db connection 
    connect(
        db = "wayshare_db",
        host = "mongodb+srv://akshaylende2408_db_user:HMIbHKzx97BViQhB@cluster0.a2namms.mongodb.net/" 
    )

    
    # Importing routes
    from app import routes
    
    return app


