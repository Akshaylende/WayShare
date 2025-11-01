from app import app, db

def Initialise_dB() -> None:
    db['registry'] = []

def create_user(uname, email, pswd):
    '''
    This function creates a new user ensuring the unqiue user details
    '''
    if check_valid_user(uname, email) is False:
        return None

    user = {}
    user["userName"] = uname
    user["email"] = email
    user["password"] = pswd

    return user


def check_valid_user(uname, email) -> bool:

    for user in db.users:
        if user.userName == uname or user.email == email:
            return False 
    
    return True