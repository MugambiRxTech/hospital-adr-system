from flask import Blueprint, request, jsonify
from extensions import db
from models.symptom import Symptom
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

symptoms_bp = Blueprint('symptoms', __name__)

# Get all symptoms
@symptoms_bp.route('/', methods=['GET'])
@jwt_required()
def get_symptoms():
    symptoms = Symptom.query.all()
    return jsonify([s.to_dict() for s in symptoms]), 200


# Create symptom (admin only)
@symptoms_bp.route('/', methods=['POST'])
@jwt_required()
def create_symptom():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    data = request.get_json()

    if Symptom.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Symptom already exists'}), 400

    symptom = Symptom(name=data['name'])
    db.session.add(symptom)
    db.session.commit()

    return jsonify(symptom.to_dict()), 201


# Delete symptom (admin only)
@symptoms_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_symptom(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    symptom = Symptom.query.get_or_404(id)
    db.session.delete(symptom)
    db.session.commit()

    return jsonify({'message': 'Symptom deleted successfully'}), 200