from flask_restful import HTTPException

class InternalServerError(HTTPException):
    pass

class SchemavalidationError(HTTPException):
    pass

class UserAlreadyExists(HTTPException):
    pass

class UpdatingProfileError(HTTPException):
    pass

class DeletingPostError(HTTPException):
    pass

class ResourceNotExistsError(HTTPException):
    pass

class UnauthorizedError(HTTPException):
    pass

errors = {
    "InternalServerError": {
        "message": "Something went wrong",
        "status": 500
    },
    "SchemaValidationError":{
        "message": "Request is missing required fields",
        "status": 400
    },
    "UserlreadyExistsError":{
        "message": "Username already exists",
        "status": 400
    },
    "UpdatingProfileError":{
        "message": "Updating profile added by other is forbidden",
        "status": 403
    },
     "DeletingPostError": {
         "message": "Deleting post added by other is forbidden",
         "status": 403
     },
     "ResourceNotExistsError": {
         "message": "Resource with given id doesn't exists",
         "status": 400
     },
     "UnauthorizedError": {
         "message": "Invalid username or password",
         "status": 401
     }
}