from flask import Blueprint, request, jsonify
from extensions import db
from models.drug import Drug
from flask_jwt_extended import jwt_required
import requests

drugs_bp = Blueprint('drugs', __name__)

# Get all drugs
@drugs_bp.route('/', methods=['GET'])
@jwt_required()
def get_drugs():
    drugs = Drug.query.all()
    return jsonify([d.to_dict() for d in drugs]), 200


# Get single drug
@drugs_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_drug(id):
    drug = Drug.query.get_or_404(id)
    return jsonify(drug.to_dict()), 200


# Create drug manually
@drugs_bp.route('/', methods=['POST'])
@jwt_required()
def create_drug():
    data = request.get_json()
    drug = Drug(
        name=data['name'],
        generic_name=data['generic_name'],
        category=data['category'],
        manufacturer=data['manufacturer']
    )
    db.session.add(drug)
    db.session.commit()
    return jsonify(drug.to_dict()), 201


# Update drug
@drugs_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_drug(id):
    drug = Drug.query.get_or_404(id)
    data = request.get_json()
    drug.name = data.get('name', drug.name)
    drug.generic_name = data.get('generic_name', drug.generic_name)
    drug.category = data.get('category', drug.category)
    drug.manufacturer = data.get('manufacturer', drug.manufacturer)
    db.session.commit()
    return jsonify(drug.to_dict()), 200


# Delete drug
@drugs_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_drug(id):
    drug = Drug.query.get_or_404(id)
    db.session.delete(drug)
    db.session.commit()
    return jsonify({'message': 'Drug deleted successfully'}), 200


# Search drug from OpenFDA external API
@drugs_bp.route('/search-fda', methods=['GET'])
@jwt_required()
def search_fda():
    query = request.args.get('q', '')
    if not query:
        return jsonify({'error': 'Query parameter q is required'}), 400

    response = requests.get(
        f'https://api.fda.gov/drug/label.json?search=openfda.brand_name:{query}&limit=5'
    )

    if response.status_code != 200:
        return jsonify({'error': 'No results found from OpenFDA'}), 404

    data = response.json()
    results = []

    for item in data.get('results', []):
        openfda = item.get('openfda', {})
        results.append({
            'name': openfda.get('brand_name', ['Unknown'])[0],
            'generic_name': openfda.get('generic_name', ['Unknown'])[0],
            'manufacturer': openfda.get('manufacturer_name', ['Unknown'])[0],
            'category': openfda.get('product_type', ['Unknown'])[0],
        })

    return jsonify(results), 200


# Save drug from OpenFDA to database
@drugs_bp.route('/save-fda', methods=['POST'])
@jwt_required()
def save_fda_drug():
    data = request.get_json()

    existing = Drug.query.filter_by(name=data['name']).first()
    if existing:
        return jsonify({'error': 'Drug already exists in database'}), 400

    drug = Drug(
        name=data['name'],
        generic_name=data['generic_name'],
        category=data['category'],
        manufacturer=data['manufacturer']
    )
    db.session.add(drug)
    db.session.commit()
    return jsonify(drug.to_dict()), 201