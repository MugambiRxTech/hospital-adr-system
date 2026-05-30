from extensions import db

# Junction table for Many-to-Many relationship between ADRReport and Symptom
report_symptoms = db.Table('report_symptoms',
    db.Column('report_id', db.Integer, db.ForeignKey('adr_reports.id'), primary_key=True),
    db.Column('symptom_id', db.Integer, db.ForeignKey('symptoms.id'), primary_key=True)
)

class Symptom(db.Model):
    __tablename__ = 'symptoms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }