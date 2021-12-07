from config import MONGODB_SETTINGS
from utils.mongoflask import MongoJSONEncoder
from flask import Flask
from flask_cors import CORS
from flask_restful import Api
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

from resources.routes import initialize_routes
from resources.errors import errors

from database.db import initialize_db

app = Flask(__name__)
app.json_encoder = MongoJSONEncoder
app.config.from_envvar('ENV_FILE_LOCATION')
app.config['MONGODB_SETTINGS'] = MONGODB_SETTINGS

bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app, resources={r'/api/*': {'origins': '*'}})

api = Api(app, errors=errors)

initialize_db(app)
initialize_routes(api)


if __name__ == '__main__':
    app.run(debug=True)
