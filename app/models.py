from datetime import datetime
from mongoengine import Document, StringField, DateTimeField, IntField, ReferenceField, EmailField, ListField, FloatField, DateField, BooleanField,EmbeddedDocument, EmbeddedDocumentField
from flask_login import UserMixin
from app import login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.objects(id = user_id).first()



# Registry Collection
class Registry(Document):
    # id  = IntField(required = True, unique = True) 
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

class Vehicle(Document):
    # id = IntField(required = True, unique = True)
    # owner = ReferenceField(User)
    model_name = StringField(max_length=50)
    reg_number = StringField(max_length=30, unique=True)
    color = StringField(max_length=20)
    seats = IntField()
    type = StringField(max_length=20)



# User collection
class User(Document, UserMixin):
    # id = IntField(required = True, unique = True)
    name = StringField()
    username = StringField(required=True, unique=True)
    email = EmailField(required=True, unique=True)
    profession = StringField()
    preferences = ListField(StringField())
    vehicle_details = ListField(ReferenceField(Vehicle))
    created_at = DateTimeField(default=datetime.utcnow)
    ratings = IntField()
    location = StringField(default = 'INDIA')
    verification = BooleanField(default = False)
    
    def get_id(self):
        return str(self.id)
    
    def to_json(self):
        return{
            'name' : self.name,
            'username' : self.username, 
            'email' : self.email,
            'profession': self.profession,
            'preferences': self.preferences,
            'vehicle_details' : self.vehicle_details,
            'ratings' : self.ratings,
            'location' : self.location,
            'verification' : self.verification,
            'created_at' : self.created_at
        }


# Ride collection
class Ride(Document):
    # id  = IntField(required = True, unique = True) 
    owner =  ReferenceField(User, required = True) # link to User.id
    origin = StringField(required = True)
    destination = StringField(required = True)
    date = DateField(required = True)
    time = StringField(required = True)
    price = FloatField(required = True, min_value = 0)
    seats_available = IntField(required = True)
    car_details = StringField(required = True)
    notes = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
        

    def to_json(self):
        return{
            'owner' : self.owner,
            'origin' : self.origin,
            'destination' : self.destination,
            'date' : self.date,
            'time' : self.time,
            'price' : self.price,
            'seats_available' : self.seats_available,
            'car_details' : self.car_details,
            'notes' : self.notes,
            'created_at' : self.created_at
        }

# Booking collection
class Booking(Document):
    # id  = IntField(required = True, unique = True) 
    ride = ReferenceField(Ride, required = True)
    user = ReferenceField(User, required = True)
    seats_requested = IntField(required = True)
    owner = ReferenceField(User, required = True)
    created_at = DateTimeField(default = datetime.utcnow())

    def to_json(self):
        return{
            'ride' : self.ride,
            'user' : self.user,
            'seats_requested' : self.seats_requested,
            'owner' : self.owner,
            'created_at' : self.created_at
        }


# Record collection (history/logs)
class Record(Document):
        # id  = IntField(required = True, unique = True) 
        ride  = ReferenceField(Ride, required = True)
        owner = ReferenceField(User, required = True)
        passengers = ListField(ReferenceField(User))
        created_at = DateTimeField(default = datetime.utcnow())

    