from flask import Flask
from flask_cors import CORS
from config import Config
from extensions import db, jwt, bcrypt

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    CORS(app)

    with app.app_context():
        from models.user import User
        from models.patient import Patient
        from models.drug import Drug
        from models.symptom import Symptom, report_symptoms
        from models.report import ADRReport

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