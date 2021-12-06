from .comment import CommentApi, CommentsApi
from .post import PostApi, PostsApi
from .auth import RegistrationApi, LoginApi, TokenApi

def initialize_routes(api):
    api.add_resource(CommentsApi, '/api/comments')
    api.add_resource(CommentApi, '/api/comment/<id>')

    api.add_resource(PostsApi, '/api/posts')
    api.add_resource(PostApi, '/api/post/<id>')

    api.add_resource(RegistrationApi, '/api/auth/register')
    api.add_resource(LoginApi, '/api/auth/login')
    api.add_resource(TokenApi, '/api/auth/refresh')