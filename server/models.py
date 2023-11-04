from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from flask_bcrypt import bcrypt





metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)


class Story(db.Model, SerializerMixin):
    __tablename__ = 'stories'

    id = db.Column(db.Integer, primary_key =True)
    theStory = db.Column(db.String)
    storyPrompt = db.Column(db.String)
    imageBase64 = db.Column(db.Text)
    storyFromImage = db.Column(db.Text)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    serialize_rules = ('-user_id.stories',)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String)

    stories = db.relationship('Story', backref='user')

    serialize_rules =('-stories','-password')


    
    def __repr__(self):
        return f'<User {self.username}>'