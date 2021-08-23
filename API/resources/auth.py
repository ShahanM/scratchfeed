from flask import request, jsonify
from flask_jwt_extended.utils import get_jwt_identity
from flask_jwt_extended.view_decorators import jwt_required
from flask_restful import Resource, fields, marshal_with
from flask_jwt_extended import create_access_token, create_refresh_token

import datetime

from mongoengine.errors import DoesNotExist, FieldDoesNotExist, \
    NotUniqueError

from database.models import User

from resources.errors import UserAlreadyExists, \
    InternalServerError, SchemavalidationError, UnauthorizedError


user_info_schema = {
    'id': fields.String,
    'username': fields.String,
    'firstname': fields.String,
    'lastname': fields.String,
    'enabled': fields.Boolean,
    'email': fields.String
}


class SignupApi(Resource):
    def post(self):
        try:
            body = request.get_json()
            user = User(**body)
            user.hash_password()

            user.save()
            id = user.id
            return {'id': str(id)}, 200
        except FieldDoesNotExist:
            raise SchemavalidationError
        except NotUniqueError:
            raise UserAlreadyExists
        except Exception as e:
            raise InternalServerError


class LoginApi(Resource):
    def post(self):
        try:
            body = request.get_json()
            user = User.objects.get(username=body.get('username'))
            authorized = user.check_password(body.get('password'))
            if not authorized:
                return {'error': 'Username or password invalid'}, 401

            expires = datetime.timedelta(days=7)
            access_token = create_access_token(identity=str(user.id),\
                expires_delta=expires)
            refresh_token = create_refresh_token(identity=str(user.id))
            return {'accessToken': access_token, 'refreshToken': refresh_token}, 200
        except (UnauthorizedError, DoesNotExist):
            raise UnauthorizedError
        except Exception as e:
            raise InternalServerError

    @jwt_required()
    @marshal_with(user_info_schema)
    def get(self):
        try:
            user_id =  get_jwt_identity()
            user = User.objects.get(id=user_id)
            return user, 200
        except (UnauthorizedError, DoesNotExist):
            raise UnauthorizedError
        except Exception as e:
            raise InternalServerError
