from app import app
from app.models import Registry, User, Ride, Booking, Record
from mongoengine.queryset.visitor import Q

def get_user(email):
    user = User.objects(email = email).first()
    return user if user else None


def get_rides():
    rides = Ride.objects.all()
    return rides

def user_exists(uname: str = None, email: str = None)->bool:
    '''
    This Function checks if the user exists with the set of fields or not
    '''
    if not email and not uname:
        return False

    user = Registry.objects(Q(email = email) | Q(username = uname)).first()
    if user:
        return True
    return False


def check_user_cred(email, pswd):
    '''
    This Function checks if the user exists with the set of credentials or not
    '''
    user = Registry.objects(email = email, password = pswd).first()
    if user:
        return True
    return False

def create_new_user(email):
    '''
    This Function checks if the user exists, if it doesnot then creates a new user
    '''
    user = User.objects(email = email).first()
    if not user:
        user =  Registry.objects(email = email).first()
        new_user = User(email = user.email, username = user.username)
        User.save(new_user)
    user = User.objects(email = email).first()
    return user


def create_new_ride(data, user):
    print(data)
    ride =  Ride(owner = user, origin = data['origin'], destination = data['destination'], date = data['departure_date'], time = data['departure_time'], seats_available = data['available_seats'], price = data['price'], car_details = data['car_details'], notes = data['notes'])
    # ride.notes = data['notes']
    # Ride.save(ride)
    return True
