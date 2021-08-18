from flask import Response, request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

from mongoengine.errors import FieldDoesNotExist, \
    NotUniqueError, DoesNotExist, ValidationError, InvalidQueryError
from werkzeug.exceptions import InternalServerError

from resources.errors import ResourceNotExistsError, SchemavalidationError


from database.models import Post, User, Comment


class CommentsApi(Resource):
    @jwt_required()
    def post(self):
        try:
            user_id = get_jwt_identity()
            body = request.get_json()
            post_id = body['post_id']
            post = Post.objects.get(id=post_id)
            user = User.objects.get(id=user_id)
            del body['post_id']
            comment = Comment(**body, commented_by=user, commented_on=post)
            comment.save()
            post.update(push__comments=comment)
            comment.save()
            id = comment.id
            return {'id': str(id)}, 200
        except (FieldDoesNotExist, ValidationError):
            raise SchemavalidationError
        except Exception as e:
            raise InternalServerError
            

class CommentApi(Resource):
    def get(self, id):
        try:
            comment = Comment.objects.get(id=id).to_json()
            return Response(comment, mimetype='application/json', status=200)
        except DoesNotExist:
            raise ResourceNotExistsError
        except Exception as e:
            raise InternalServerError

    @jwt_required()
    def put(self, id):
        try:
            user_id = get_jwt_identity()
            comment = Comment.objects.get(id=id, posted_by=user_id)
            body = request.get_json()
            Comment.objects.get(id=id).update(**body)
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
            comment = Comment.objects.get(id=id, added_by=user_id)
            comment.delete()
            return '', 200
        except DoesNotExist:
            raise ResourceNotExistsError
        except Exception as e:
            raise InternalServerError
