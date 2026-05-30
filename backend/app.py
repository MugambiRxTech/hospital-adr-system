from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    from routes.auth import auth_bp
    from routes.patients import patients_bp
    from routes.drugs import drugs_bp
    from routes.reports import reports_bp
    from routes.symptoms import symptoms_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(drugs_bp, url_prefix='/api/drugs')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(symptoms_bp, url_prefix='/api/symptoms')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)