
from sqlalchemy import DateTime, Column, Integer, String
from database import db


class Visit(db.Model):
    # For logging purposes
    """
    Visit Flask-SQLAlchemy Model
    Represents objects contained in the Visits table
    """

    __tablename__ = "visits"

    visit_id = Column('visit_id', Integer(), primary_key=True,
                      autoincrement=True, nullable=False)
    ip_address = Column('ip_address', String(80), nullable=False)
    last_access = Column('last_access', String(80), nullable=False)
    country = Column('country', String(80), nullable=False)

    def __repr__(self):
        return (
            f"**Visit** "
            f"visit_id: {self.visit_id} "
            f"ip_address: {self.ip_address} "
            f"last_access: {self.last_access}"
            f"country: {self.country}"
            f"**Visit** "
        )
