
from flask import Flask
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from resources.visitCollection_resource import VISIT_COLLECTION_ENDPOINT, VisitsCollection
from resources.visitItem_resource import VisitItemResource, VISIT_ITEM_ENDPOINT
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from flask_sqlalchemy import SQLAlchemy


def create_app():
    """
    Function that creates our Flask application.
    This function creates the Flask app, Flask-Restful API,
    and Flask-SQLAlchemy connection
    :param db_location: Connection string to the database
    :return: Initialized Flask app
    """

    app = Flask(__name__)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://opiffoii:hmpiEyw0MtnViId-CFCvEaR7KIVpGpT3@castor.db.elephantsql.com/opiffoii"
    db = SQLAlchemy()
    CORS(app)

    db.init_app(app)
    api = Api(app)

    api.add_resource(VisitsCollection, VISIT_COLLECTION_ENDPOINT,
                     f"{VISIT_COLLECTION_ENDPOINT}/")
    api.add_resource(VisitItemResource, VISIT_ITEM_ENDPOINT,
                     f"{VISIT_ITEM_ENDPOINT}/")
    return app


if __name__ == "__main__":
    app = create_app()
    if app.config["ENV"] == "production":
        print('\n\n-------- PROD ------>\n\n')
        app.config.from_object("config.ProductionConfig")
        http_server = WSGIServer(('localhost', 5000), app)
        http_server.serve_forever()
    elif app.config["ENV"] == "development":
        print('\n\n-------- DEV ------>\n\n')
        app.config.from_object("config.DevelopmentConfig")
        app.run(host="localhost", port=5000, debug=True)
