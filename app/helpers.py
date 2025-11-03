from app import app
from app.models import Registry, User



# def Initialise_dB() -> None:
#     db['registry'] = []

# def create_user(uname, email, pswd):
#     '''
#     This function creates a new user ensuring the unqiue user details
#     '''
#     if check_valid_user(uname, email) is False:
#         return None

#     user = {}
#     user["username"] = uname
#     user["email"] = email
#     user["password"] = pswd

#     return user


# def check_valid_user(uname, email) -> bool:

#     for user in db['registry']:
#         if user['username'] == uname or user['email'] == email:
#             return False 
    
#     return True

def user_exists(email, uname)->bool:
    
    user = Registry.objects(email = email).first()
    if user:
        return True
    user = Registry.objects(username = uname).first()
    if user:
        return True
    return False

def check_user_cred(email, pswd):
    user = Registry.objects(email = email, password = pswd).first()
    if user:
        return True
    return False