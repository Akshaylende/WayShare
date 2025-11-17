from app import app
from app.models import Registry, User, Ride, Booking, Record, Vehicle
from mongoengine.queryset.visitor import Q

def get_user(email):
    user = User.objects(email = email).first()
    return user if user else None


def get_rides(date, dest):
    rides = []
    if date and dest:
        rides = Ride.objects(date = date, destination = dest).all()
    elif date:
        rides = Ride.objects(date = date).all()
    elif dest:
        rides = Ride.objects(destination = dest).all()
    else:
        rides = Ride.objects().all()
    # rides = [ride.to_json() for ride in rides]
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

def get_ride(ride_id):
    ride = Ride.objects(id = ride_id).first()
    return ride if ride else None


def update_user_profile(data, user):
    name = data['name']
    profession = data['profession']
    preferences = data['preferences']
    vehicle_details = get_vehicle_details(data['vehicles'], user)
    location = data['location']

    print('In section', vehicle_details)

    user = User.objects.get(id = user.id)
    # print("Before ", user.to_json())
    user.name = name
    user.profession = profession
    user.preferences= preferences
    user.location = location
    user.vehicle_details = vehicle_details
    print("After ", user.to_json())
    User.save(user)
    return user


def get_vehicle_details(vehicles, user)-> list:
    result = []
    print(vehicles[0]['name'])
    
    for vehicle in vehicles:
        vehicle_ref = Vehicle.objects(reg_number = vehicle['plate']).first()
        if vehicle_ref:
            vehicle_ref.model_name = vehicle['name']
            vehicle_ref.reg_number = vehicle['plate']
            vehicle_ref.color = vehicle['color']
            vehicle_ref.seats = vehicle['seats']
            vehicle_ref.type = vehicle['type']
#           vehicle_ref.owner = user
            Vehicle.save(vehicle_ref)
        else:
            vehicle_ref = Vehicle(model_name = vehicle['name'], reg_number = vehicle['plate'], color = vehicle['color'], seats = vehicle['seats'], type = vehicle['type']).save()
        
        vehicle_ref = Vehicle.objects.get(reg_number = vehicle['plate'])
        print(vehicle_ref.to_json())
        result.append(vehicle_ref)
        
    # print("After",result)
    return result
