import logging
from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from constants import OCTANE_11_DATABASE
from database import db
from resources.visitCollection_resource import VisitCollectionResource, VISIT_COLLECTION_ENDPOINT
from resources.visitItem_resource import VisitItemResource, VISIT_ITEM_ENDPOINT
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS


def create_app():
    """
    Function that creates our Flask application.
    This function creates the Flask app, Flask-Restful API,
    and Flask-SQLAlchemy connection
    :param db_location: Connection string to the database
    :return: Initialized Flask app
    """

    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        datefmt="%m-%d %H:%M",
        handlers=[logging.FileHandler(
            "visits_api.log"), logging.StreamHandler()],
    )

    app = Flask(__name__)
    CORS(app)

    db.init_app(app)
    api = Api(app)
    api.add_resource(VisitCollectionResource, VISIT_COLLECTION_ENDPOINT,
                     f"{VISIT_COLLECTION_ENDPOINT}/<date>")
    api.add_resource(VisitItemResource, VISIT_ITEM_ENDPOINT,
                     f"{VISIT_ITEM_ENDPOINT}/")
    return app


if __name__ == "__main__":
    app = create_app()
    app.config.from_object("config.DevelopmentConfig")
    app.run(debug=True)
