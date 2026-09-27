from sqlalchemy.orm import Session

from core.security import get_password_hash
from models.role import Role
from models.user import User
from db.database import SessionLocal


def seed_roles_and_users():
    db: Session = SessionLocal()
    try:
        # ----- Seed Roles -----
        roles_to_create = [
            {"name": "admin", "description": "Administrator with full access"},
            {"name": "user", "description": "Regular user"},
        ]

        for role_data in roles_to_create:
            existing = db.query(Role).filter(Role.name == role_data["name"]).first()
            if not existing:
                db.add(Role(**role_data))
        db.commit()

        # ----- Seed Admin User -----
        admin_role = db.query(Role).filter(Role.name == "admin").first()
        if not admin_role:
            return
        user_role = db.query(Role).filter(Role.name == "user").first()
        if not user_role:
            return
        users_to_create = [
            {"email": "admin@helpdesk.com", "full_name": "System Admin", "password": "admin123", "role_id": admin_role.id},
            {"email": "user@helpdesk.com", "full_name": "Regular User", "password": "user123", "role_id": user_role.id}
        ]
        for user_data in users_to_create:
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing:
                user = User(
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),  # change in production!
                    full_name=user_data["full_name"],
                    is_active=True,
                    role_id=user_data["role_id"]
                )
                db.add(user)
                db.commit()
                print(f"✅ User created: {user_data['email']} / {user_data['password']}")
            else:
                print(f"ℹ️ User already exists: {user_data['email']}")    
    except Exception as e:
        print(f"❌ Error seeding roles and users: {e}") 
    finally:
        db.close()