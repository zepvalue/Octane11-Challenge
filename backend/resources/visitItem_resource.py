import logging
from flask import request
from flask_restful import Resource, abort
from sqlalchemy.exc import IntegrityError
from schemas.visit_schema import VisitSchema
from flask_cors import cross_origin
from database import db

VISIT_ITEM_ENDPOINT = "/api/visit"
logger = logging.getLogger(__name__)


class VisitItemResource(Resource):
    @cross_origin()
    def post(self):
        """
        VisitResource POST method. Adds a new visit to the Octane11 database.
        :param date: Visit DATE to retrieve, this query parameter is optional
        :return: Visit, 201 HTTP status code
        """
        logger.info(f"Adding new visit {request.data}.")
        visit = VisitSchema().load(request.get_json())
        try:
            db.create_all()
            db.session.add(visit)
            db.session.commit()
        except IntegrityError as e:
            logger.warning(
                f"Integrity Error, this visit is already in the database. Error: {e}.")
            abort(500, message="Unexpected Error!")
        else:
            logger.info(f"Successfully added new visit: {visit}.")
            return f"visit {visit.visit_id} saved", 201
