from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from constants import OCTANE_11_DATABASE
from database import db
from resources.visitCollection_resource import VisitCollectionResource, VISIT_COLLECTION_ENDPOINT
from resources.visitItem_resource import VisitItemResource, VISIT_ITEM_ENDPOINT
from flask_sqlalchemy import SQLAlchemy


def create_app(db_location):
    """
    Function that creates our Flask application.
    This function creates the Flask app, Flask-Restful API,
    and Flask-SQLAlchemy connection
    :param db_location: Connection string to the database
    :return: Initialized Flask app
    """

    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = db_location

    db.init_app(app)
    api=Api(app)
    api.add_resource(VisitCollectionResource, VISIT_COLLECTION_ENDPOINT, f"{VISIT_COLLECTION_ENDPOINT}/<date>")
    api.add_resource(VisitItemResource, VISIT_ITEM_ENDPOINT, f"{VISIT_ITEM_ENDPOINT}/")
    return app


if __name__ == "__main__":
    app = create_app(OCTANE_11_DATABASE)
    app.run(debug=True)