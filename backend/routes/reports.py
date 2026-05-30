from flask import Blueprint, request, jsonify
from app import db
from models.report import ADRReport
from models.symptom import Symptom
from models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

reports_bp = Blueprint('reports', __name__)

# Get all reports
@reports_bp.route('/', methods=['GET'])
@jwt_required()
def get_reports():
    reports = ADRReport.query.all()
    return jsonify([r.to_dict() for r in reports]), 200


# Get single report
@reports_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_report(id):
    report = ADRReport.query.get_or_404(id)
    return jsonify(report.to_dict()), 200


# Create report
@reports_bp.route('/', methods=['POST'])
@jwt_required()
def create_report():
    user_id = get_jwt_identity()
    data = request.get_json()

    report = ADRReport(
        reporter_id=user_id,
        patient_id=data['patient_id'],
        drug_id=data['drug_id'],
        description=data['description'],
        severity=data['severity'],
        outcome=data['outcome'],
        causality=data['causality'],
        action_taken=data['action_taken'],
        onset_date=datetime.strptime(data['onset_date'], '%Y-%m-%d').date()
    )

    # Add symptoms (Many-to-Many)
    symptom_ids = data.get('symptom_ids', [])
    for symptom_id in symptom_ids:
        symptom = Symptom.query.get(symptom_id)
        if symptom:
            report.symptoms.append(symptom)

    db.session.add(report)
    db.session.commit()

    return jsonify(report.to_dict()), 201


# Update report
@reports_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_report(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    report = ADRReport.query.get_or_404(id)

    # Only reporter or admin can update
    if str(report.reporter_id) != str(user_id) and user.role != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()

    report.patient_id = data.get('patient_id', report.patient_id)
    report.drug_id = data.get('drug_id', report.drug_id)
    report.description = data.get('description', report.description)
    report.severity = data.get('severity', report.severity)
    report.outcome = data.get('outcome', report.outcome)
    report.causality = data.get('causality', report.causality)
    report.action_taken = data.get('action_taken', report.action_taken)

    if 'onset_date' in data:
        report.onset_date = datetime.strptime(data['onset_date'], '%Y-%m-%d').date()

    # Update symptoms
    if 'symptom_ids' in data:
        report.symptoms = []
        for symptom_id in data['symptom_ids']:
            symptom = Symptom.query.get(symptom_id)
            if symptom:
                report.symptoms.append(symptom)

    db.session.commit()

    return jsonify(report.to_dict()), 200


# Delete report
@reports_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_report(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    report = ADRReport.query.get_or_404(id)

    # Only admin can delete
    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    db.session.delete(report)
    db.session.commit()

    return jsonify({'message': 'Report deleted successfully'}), 200


# Get reports by current user
@reports_bp.route('/my-reports', methods=['GET'])
@jwt_required()
def my_reports():
    user_id = get_jwt_identity()
    reports = ADRReport.query.filter_by(reporter_id=user_id).all()
    return jsonify([r.to_dict() for r in reports]), 200


# Analytics summary (admin only)
@reports_bp.route('/analytics/summary', methods=['GET'])
@jwt_required()
def analytics_summary():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.role != 'admin':
        return jsonify({'error': 'Admin access required'}), 403

    total = ADRReport.query.count()

    severity_counts = {}
    for level in ['mild', 'moderate', 'severe', 'fatal']:
        severity_counts[level] = ADRReport.query.filter_by(severity=level).count()

    return jsonify({
        'total_reports': total,
        'severity_breakdown': severity_counts
    }), 200