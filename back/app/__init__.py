from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_login import LoginManager
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_pyfile('./config.py')
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
app.config['WTF_CSRF_ENABLED'] = False
app.config['SESSION_TYPE'] = 'filesystem'
db = SQLAlchemy(app)
jwt = JWTManager(app)
# login_manager = LoginManager(app)

from app.routes import admin_routes, vote_routes

app.register_blueprint(admin_routes.admin_bp)
app.register_blueprint(vote_routes.vote_bp)

# Configuração adicional para retornar JSON nas respostas de erro
@app.errorhandler(404)
def not_found_error(error):
    return {'error': 'Not Found'}, 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return {'error': 'Internal Server Error'}, 500