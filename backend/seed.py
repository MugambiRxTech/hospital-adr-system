from app import create_app, db, bcrypt
from models.user import User
from models.patient import Patient
from models.drug import Drug
from models.report import ADRReport
from models.symptom import Symptom
from datetime import date

app = create_app()

with app.app_context():
    # Drop and recreate all tables
    db.drop_all()
    db.create_all()

    print("Seeding database...")

    # --- Users ---
    admin = User(
        username='admin',
        email='admin@hospital.com',
        password_hash=bcrypt.generate_password_hash('admin123').decode('utf-8'),
        role='admin'
    )
    pharmacist = User(
        username='pharmacist1',
        email='pharmacist@hospital.com',
        password_hash=bcrypt.generate_password_hash('pharma123').decode('utf-8'),
        role='pharmacist'
    )
    nurse = User(
        username='nurse1',
        email='nurse@hospital.com',
        password_hash=bcrypt.generate_password_hash('nurse123').decode('utf-8'),
        role='nurse'
    )

    db.session.add_all([admin, pharmacist, nurse])
    db.session.commit()

    # --- Patients ---
    p1 = Patient(name='John Kamau', age=45, gender='Male', ward='Medical', hospital_number='HN001')
    p2 = Patient(name='Mary Wanjiku', age=32, gender='Female', ward='Surgical', hospital_number='HN002')
    p3 = Patient(name='Peter Otieno', age=60, gender='Male', ward='ICU', hospital_number='HN003')
    p4 = Patient(name='Grace Akinyi', age=28, gender='Female', ward='Maternity', hospital_number='HN004')

    db.session.add_all([p1, p2, p3, p4])
    db.session.commit()

    # --- Drugs ---
    d1 = Drug(name='Amoxicillin', generic_name='Amoxicillin', category='Antibiotic', manufacturer='GSK')
    d2 = Drug(name='Ibuprofen', generic_name='Ibuprofen', category='NSAID', manufacturer='Pfizer')
    d3 = Drug(name='Metformin', generic_name='Metformin', category='Antidiabetic', manufacturer='Novartis')
    d4 = Drug(name='Lisinopril', generic_name='Lisinopril', category='ACE Inhibitor', manufacturer='AstraZeneca')
    d5 = Drug(name='Cotrimoxazole', generic_name='Sulfamethoxazole/Trimethoprim', category='Antibiotic', manufacturer='Roche')

    db.session.add_all([d1, d2, d3, d4, d5])
    db.session.commit()

    # --- Symptoms ---
    symptoms = [
        Symptom(name='Rash'),
        Symptom(name='Vomiting'),
        Symptom(name='Nausea'),
        Symptom(name='Anaphylaxis'),
        Symptom(name='Dizziness'),
        Symptom(name='Jaundice'),
        Symptom(name='Itching'),
        Symptom(name='Diarrhea'),
        Symptom(name='Headache'),
        Symptom(name='Shortness of Breath'),
    ]

    db.session.add_all(symptoms)
    db.session.commit()

    # --- ADR Reports ---
    r1 = ADRReport(
        reporter_id=pharmacist.id,
        patient_id=p1.id,
        drug_id=d1.id,
        description='Patient developed widespread rash and itching 2 hours after first dose of Amoxicillin.',
        severity='moderate',
        outcome='recovered',
        causality='probable',
        action_taken='drug_withdrawn',
        onset_date=date(2024, 1, 15)
    )
    r1.symptoms.extend([symptoms[0], symptoms[6]])  # Rash, Itching

    r2 = ADRReport(
        reporter_id=nurse.id,
        patient_id=p2.id,
        drug_id=d2.id,
        description='Patient experienced severe vomiting and nausea after Ibuprofen administration.',
        severity='mild',
        outcome='recovering',
        causality='certain',
        action_taken='dose_reduced',
        onset_date=date(2024, 2, 10)
    )
    r2.symptoms.extend([symptoms[1], symptoms[2]])  # Vomiting, Nausea

    r3 = ADRReport(
        reporter_id=pharmacist.id,
        patient_id=p3.id,
        drug_id=d4.id,
        description='Elderly patient developed severe dizziness and shortness of breath on Lisinopril.',
        severity='severe',
        outcome='not_recovered',
        causality='possible',
        action_taken='drug_withdrawn',
        onset_date=date(2024, 3, 5)
    )
    r3.symptoms.extend([symptoms[4], symptoms[9]])  # Dizziness, Shortness of Breath

    r4 = ADRReport(
        reporter_id=admin.id,
        patient_id=p4.id,
        drug_id=d5.id,
        description='Patient developed jaundice and nausea after one week on Cotrimoxazole.',
        severity='severe',
        outcome='recovering',
        causality='probable',
        action_taken='drug_withdrawn',
        onset_date=date(2024, 4, 20)
    )
    r4.symptoms.extend([symptoms[5], symptoms[2]])  # Jaundice, Nausea

    db.session.add_all([r1, r2, r3, r4])
    db.session.commit()

    print("Database seeded successfully!")
    print("Admin: admin@hospital.com / admin123")
    print("Pharmacist: pharmacist@hospital.com / pharma123")
    print("Nurse: nurse@hospital.com / nurse123")