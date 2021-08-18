from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import datetime

from .db import db


class Comment(db.Document):
    created_at = db.DateTimeField(default=datetime.utcnow)
    text_content = db.StringField(required=True)
    commented_by = db.ReferenceField('User')
    commented_on = db.ReferenceField('Post')


class Post(db.Document):
    created_at = db.DateTimeField(default=datetime.utcnow)
    text_content = db.StringField(required=True)
    img_urls = db.ListField(db.StringField())
    posted_by = db.ReferenceField('User')
    comments = db.ListField(db.ReferenceField('Comment', \
        reverse_delete_rule=db.PULL))


class User(db.Document):
    created_at = db.DateTimeField(default=datetime.utcnow)
    username = db.StringField(required=True, unique=True)
    password = db.StringField(required=True, min_length=6)
    email = db.EmailField(required=True, unique=True)
    posts = db.ListField(db.ReferenceField('Post', \
        reverse_delete_rule=db.PULL))
    
    def hash_password(self):
        self.password = generate_password_hash(self.password).decode('utf8')
    
    def check_password(self, password):
        return check_password_hash(self.password, password)


User.register_delete_rule(Post, 'posted_by', db.CASCADE)
Post.register_delete_rule(Comment, 'commented_on', db.CASCADE)
