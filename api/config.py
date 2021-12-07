from dotenv import dotenv_values
import logging

dotEnv = dotenv_values(".env")


class Config(object):
    DEBUG = False
    TESTING = False
    SQLALCHEMY_DATABASE_URI = dotEnv["OCTANE_DB"]
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ENV = dotEnv['FLASK_ENV']
    SECRET_KEY = dotEnv['SECRET_KEY']

# Should check the generation of the logs under this profile


class ProductionConfig(Config):
    ENV = 'production'
    DEBUG = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        datefmt="%m-%d %H:%M",
        handlers=[logging.FileHandler(
            "logs/visits_api_prod.log"), logging.StreamHandler()],
    )


class DevelopmentConfig(Config):
    ENV = "development"
    DEVELOPMENT = True
    DEBUG = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True

    logging.basicConfig(
        level=logging.DEBUG,
        format="%(asctime)s %(name)-12s %(levelname)-8s %(message)s",
        datefmt="%m-%d %H:%M",
        handlers=[logging.FileHandler(
            "logs/visits_api_dev.log"), logging.StreamHandler()],
    )
