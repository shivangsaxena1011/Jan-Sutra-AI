"""Provision an officer or admin account from a trusted operator terminal.

Usage: python -m scripts.create_staff --name "Officer Name" --email name@agency.gov.in --role officer --ward "Ward 12"
"""
import argparse
from getpass import getpass
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models import User


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--name", required=True)
    parser.add_argument("--email", required=True)
    parser.add_argument("--role", choices=["officer", "admin"], required=True)
    parser.add_argument("--ward", default=None)
    args = parser.parse_args()
    password = getpass("Temporary password (10+ chars, mixed case and number): ")
    if len(password) < 10 or not any(c.isupper() for c in password) or not any(c.islower() for c in password) or not any(c.isdigit() for c in password):
        raise SystemExit("Password does not meet the minimum policy")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email.ilike(args.email)).first():
            raise SystemExit("An account with this email already exists")
        user = User(name=args.name.strip(), email=args.email.lower(), password_hash=hash_password(password), role=args.role, preferred_language="en", ward=args.ward, is_active=True)
        db.add(user)
        db.commit()
        print(f"Created {args.role} account for {args.email}. Enforce a password reset through your organization before operational use.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
