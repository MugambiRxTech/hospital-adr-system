from app import db
from datetime import datetime
from models.symptom import report_symptoms

class ADRReport(db.Model):
    __tablename__ = 'adr_reports'

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    drug_id = db.Column(db.Integer, db.ForeignKey('drugs.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), nullable=False)       # mild, moderate, severe, fatal
    outcome = db.Column(db.String(20), nullable=False)        # recovered, recovering, not_recovered, fatal
    causality = db.Column(db.String(20), nullable=False)      # certain, probable, possible, unlikely
    action_taken = db.Column(db.String(20), nullable=False)   # drug_withdrawn, dose_reduced, none
    onset_date = db.Column(db.Date, nullable=False)
    report_date = db.Column(db.DateTime, default=datetime.utcnow)

    symptoms = db.relationship('Symptom', secondary=report_symptoms, backref='reports', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'reporter_id': self.reporter_id,
            'reporter': self.reporter.username,
            'patient_id': self.patient_id,
            'patient': self.patient.to_dict(),
            'drug_id': self.drug_id,
            'drug': self.drug.to_dict(),
            'description': self.description,
            'severity': self.severity,
            'outcome': self.outcome,
            'causality': self.causality,
            'action_taken': self.action_taken,
            'onset_date': self.onset_date.isoformat(),
            'report_date': self.report_date.isoformat(),
            'symptoms': [s.to_dict() for s in self.symptoms]
        }