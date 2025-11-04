from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, IntField, ReferenceField, EmailField, ListField
from flask_login import UserMixin


# Registry Collection
class Registry(Document):
    # id  = IntField(required = True, unique = True) 
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)




# User collection
class User(Document, UserMixin):
    # id = IntField(required = True, unique = True)
    name = StringField()
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    profession = StringField()
    preferences = StringField()
    vehicle_details = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    ratings = 0
    
    def get_id(self):
        return str(self.id)


# Ride collection
class Ride(Document):
        # id  = IntField(required = True, unique = True) 
        owner =  ReferenceField(User, required = True) # link to User.id
        origin = StringField(required = True)
        destination = StringField(required = True)
        time = DateTimeField(required = True, default=datetime.utcnow)
        price = IntField(required = True)
        seats_available = IntField(required = True)
        car_details = StringField(required = True)
        created_at = DateTimeField(default=datetime.utcnow)
        notes = ListField(StringField())

# Booking collection
class Booking:
    # id  = IntField(required = True, unique = True) 
    ride = ReferenceField(Ride, required = True)
    user = ReferenceField(User, required = True)
    seats_requested = IntField(required = True)
    created_at = DateTimeField(default = datetime.utcnow())



# Record collection (history/logs)
class Record:
        # id  = IntField(required = True, unique = True) 
        ride  = ReferenceField(Ride, required = True)
        owner = ReferenceField(User, required = True)
        passengers = ListField(ReferenceField(User))
        created_at = DateTimeField(default = datetime.utcnow())

    