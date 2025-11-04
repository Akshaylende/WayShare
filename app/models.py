from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, IntField, ReferenceField, EmailField



# Registry Collection
class Registry(Document):
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)




# User collection
class User(Document):
    name = StringField()
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    profession = StringField()
    preferences = StringField()
    vehicle_details = StringField()
    created_at = datetime.utcnow()
    ratings = 0
    
    def get_id(self):
        return str(self.id)


# # Ride collection
# class Ride:
#     def __init__(self, driver_id, origin, destination, time, price, car_details, seats_available):
#         # self.id = str(uuid.uuid4())
#         self.driver_id = driver_id  # link to User.id
#         self.origin = origin
#         self.destination = destination
#         self.time = time
#         self.price = price
#         self.seats_available = seats_available
#         self.car_details = car_details
#         self.created_at = datetime.utcnow()
#         self.notes = []

#     def save(self):
#         db["rides"].append(self)


# # Booking collection
# class Booking:
#     def __init__(self, ride_id, user_id, seats_booked):
#         # self.id = str(uuid.uuid4())
#         self.ride_id = ride_id
#         self.user_id = user_id
#         self.seats_requested = seats_booked
#         self.created_at = datetime.utcnow()

#     def save(self):
#         db["bookings"].append(self)


# # Record collection (history/logs)
# class Record:
#     def __init__(self, ride_id, user_id, details=""):
#         # self.id = str(uuid.uuid4())
#         self.ride_id  = ride_id
#         self.owner_id = user_id
#         self.passengers = []
#         self.timestamp = datetime.utcnow()

#     def save(self):
#         db["records"].append(self)