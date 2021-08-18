from .comment import CommentApi, CommentsApi
from .post import PostApi, PostsApi
from .auth import SignupApi, LoginApi

def initialize_routes(api):
    api.add_resource(CommentsApi, '/api/comments')
    api.add_resource(CommentApi, '/api/comment/<id>')

    api.add_resource(PostsApi, '/api/posts')
    api.add_resource(PostApi, '/api/post/<id>')

    api.add_resource(SignupApi, '/api/auth/signup')
    api.add_resource(LoginApi, '/api/auth/login')