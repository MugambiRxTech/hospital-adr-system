from extensions import db

class Patient(db.Model):
    __tablename__ = 'patients'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    ward = db.Column(db.String(50), nullable=False)
    hospital_number = db.Column(db.String(50), unique=True, nullable=False)

    reports = db.relationship('ADRReport', backref='patient', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'age': self.age,
            'gender': self.gender,
            'ward': self.ward,
            'hospital_number': self.hospital_number
        }