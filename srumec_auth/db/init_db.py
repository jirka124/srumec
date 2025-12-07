# db/init_db.py
from sqlalchemy.orm import Session
from models import user_model
from services.auth_service import get_password_hash
import logging

logger = logging.getLogger(__name__)

def init_db(db: Session):
    """
    Funkce pro naseedování databáze základními daty. POUZE PRO TESTOVACÍ ÚČELY
    """
    # 1. Definice Admina
    admin_email = "admin@srumec.com"
    admin_password = "srumecpass"  # Ideálně brát z env proměnných

    # 2. Kontrola, zda už existuje
    user = db.query(user_model.User).filter(user_model.User.email == admin_email).first()

    if not user:
        logger.info(f"Creating admin user: {admin_email}")
        admin_user = user_model.User(
            email=admin_email,
            name="Super Admin",
            hashed_password=get_password_hash(admin_password),
            role="admin",  # Důležité: role admin
            banned=False
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        logger.info("Admin user created successfully.")
    else:
        logger.info("Admin user already exists. Skipping seeding.")

    # 3. Můžeš přidat i testovacího uživatele
    test_email = "jdostal@srumec.com"
    if not db.query(user_model.User).filter(user_model.User.email == test_email).first():
        logger.info(f"Creating test user: {test_email}")
        test_user = user_model.User(
            email=test_email,
            name="Jiří Dostál",
            hashed_password=get_password_hash("srumec"),
            role="user",
            banned=False
        )
        db.add(test_user)
        db.commit()

    # 3. Můžeš přidat i testovacího uživatele
    test_email = "jzak@srumec.com"
    if not db.query(user_model.User).filter(user_model.User.email == test_email).first():
        logger.info(f"Creating test user: {test_email}")
        test_user = user_model.User(
            email=test_email,
            name="Jiří Žák",
            hashed_password=get_password_hash("srumec"),
            role="user",
            banned=False
        )
        db.add(test_user)
        db.commit()


    # 3. Můžeš přidat i testovacího uživatele
    test_email = "user@example.com"
    if not db.query(user_model.User).filter(user_model.User.email == test_email).first():
        logger.info(f"Creating test user: {test_email}")
        test_user = user_model.User(
            email=test_email,
            name="Testovaci uživatel",
            hashed_password=get_password_hash("string"),
            role="user",
            banned=False
        )
        db.add(test_user)
        db.commit()