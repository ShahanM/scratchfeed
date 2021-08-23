from flask import Response, request
from flask_restful import Resource, fields, marshal_with
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import FieldDoesNotExist, \
    NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError
from werkzeug.exceptions import InternalServerError

from resources.errors import ResourceNotExistsError, SchemavalidationError


from database.models import Post, User


post_response_schema = {
    'id': fields.String,
    'created_at': fields.DateTime(dt_format='rfc822'),
    'text_content': fields.String,
    'img_urls': fields.List(fields.String),
    'posted_by': fields.String(attribute='posted_by.id'),
    'comments': fields.List(fields.String(attribute='id'))
}

post_reponse_list_schema = {
    'posts': fields.List(fields.Nested(post_response_schema))
}


class PostsApi(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            user = User.objects.get(id=user_id)
            post = Post(**body, posted_by=user)
            post.save()
            user.update(push__posts=post)
            user.save()
            id = post.id
            return {'id': str(id)}, 200
        except (FieldDoesNotExist, ValidationError):
            raise SchemavalidationError
        except Exception as e:
            raise InternalServerError

    @jwt_required()
    @marshal_with(post_reponse_list_schema)
    def get(self):
        try:
            user_id = get_jwt_identity()
            posts = Post.objects(posted_by=user_id)
            # return Response(posts, mimetype='application/json', status=200)
            # return jsonify(posts)
            # return Response(posts, mimetype='application/json', status=200)
            return {'posts': posts}, 200
        except (FieldDoesNotExist, ValidationError):
            raise SchemavalidationError
        except Exception as e:
            raise InternalServerError


class PostApi(Resource):
    def get(self, id):
        try:
            post = Post.objects.get(id=id).to_json()
            return Response(post, mimetype='application/json', status=200)
        except DoesNotExist:
            raise ResourceNotExistsError
        except Exception as e:
            raise InternalServerError

    @jwt_required()
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            post = Post.objects.get(id=id, posted_by=user_id)
            body = request.get_json()
            Post.objects.get(id=id).update(**body)
            return '', 200
        except InvalidQueryError:
            raise SchemavalidationError
        except DoesNotExist:
            raise ResourceNotExistsError
        except Exception as e:
            raise InternalServerError
            
    @jwt_required()
    def delete(self, id):
        try:
            user_id = get_jwt_identity()
            post = Post.objects.get(id=id, added_by=user_id)
            post.delete()
            return '', 200
        except DoesNotExist:
            raise ResourceNotExistsError
        except Exception as e:
            raise InternalServerError
