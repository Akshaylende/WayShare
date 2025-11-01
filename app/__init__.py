from flask import Flask


db = {}
app = Flask(__name__)

def create_app():
    '''
    Application factory function.
    This function creates and configures the Flask application instance.
    '''
    # Initializing user collection 
    db['registry'] = []
    
    # Importing routes
    from app import routes
    
    return app


