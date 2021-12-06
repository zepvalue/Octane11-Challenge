from dotenv import dotenv_values
import logging

config = dotenv_values(".env")


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = config['OCTANE_DB']
    FLASK_ENV = config['FLASK_ENV']
    SECRET_KEY = config['SECRET_KEY']
    SQLALCHEMY_TRACK_MODIFICATIONS = False

# Should check the generation of the logs under this profile


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(Config):
    FLASK_ENV = "development"
    DEVELOPMENT = True
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        datefmt="%m-%d %H:%M",
        handlers=[logging.FileHandler(
            "visits_api.log"), logging.StreamHandler()],
    )
