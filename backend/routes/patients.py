from flask import Blueprint, request, jsonify
from extensions import db
from models.patient import Patient
from flask_jwt_extended import jwt_required, get_jwt_identity

patients_bp = Blueprint('patients', __name__)

# Get all patients
@patients_bp.route('/', methods=['GET'])
@jwt_required()
def get_patients():
    patients = Patient.query.all()
    return jsonify([p.to_dict() for p in patients]), 200


# Get single patient
@patients_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_patient(id):
    patient = Patient.query.get_or_404(id)
    return jsonify(patient.to_dict()), 200


# Create patient
@patients_bp.route('/', methods=['POST'])
@jwt_required()
def create_patient():
    data = request.get_json()

    if Patient.query.filter_by(hospital_number=data['hospital_number']).first():
        return jsonify({'error': 'Hospital number already exists'}), 400

    patient = Patient(
        name=data['name'],
        age=data['age'],
        gender=data['gender'],
        ward=data['ward'],
        hospital_number=data['hospital_number']
    )

    db.session.add(patient)
    db.session.commit()

    return jsonify(patient.to_dict()), 201


# Update patient
@patients_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_patient(id):
    patient = Patient.query.get_or_404(id)
    data = request.get_json()

    patient.name = data.get('name', patient.name)
    patient.age = data.get('age', patient.age)
    patient.gender = data.get('gender', patient.gender)
    patient.ward = data.get('ward', patient.ward)
    patient.hospital_number = data.get('hospital_number', patient.hospital_number)

    db.session.commit()

    return jsonify(patient.to_dict()), 200


# Delete patient
@patients_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_patient(id):
    patient = Patient.query.get_or_404(id)

    if patient.reports:
        return jsonify({'error': 'Cannot delete patient with existing ADR reports'}), 400

    db.session.delete(patient)
    db.session.commit()

    return jsonify({'message': 'Patient deleted successfully'}), 200