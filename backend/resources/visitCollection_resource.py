import logging
from flask import request
from models.visit import Visit
from flask_restful import Resource, abort
from sqlalchemy.orm.exc import NoResultFound
from schemas.visit_schema import VisitSchema
from flask_cors import cross_origin


VISIT_COLLECTION_ENDPOINT = "/api/visits/show"
logger = logging.getLogger(__name__)


class VisitCollectionResource(Resource):
    def get(self, date=None):
        """
        VisitsResource GET method. Retrieves all visits found in the Octane11
        database, unless the date parameter is provided. If the date
        is provided then the visit with the related date of access is retrieved.
        :param date: Visit DATE to retrieve, this query parameter is optional
        :return: Visit, 200 HTTP status code
        """
        date = request.args.get('date')
        if not date:
            logger.info(f"Retrieving all visits")

            return self._get_all_visits(), 200

        logger.info(f"Retrieving visits by date {date}")

        try:
            return self._get_visits_by_date(date), 200
        except NoResultFound:
            abort(404, message="Visit not found")

    def _get_all_visits(self):
        visits = Visit.query.all()

        visits_json = [VisitSchema().dump(visit) for visit in visits]
        return visits_json

    def _get_visits_by_date(self, date):
        visits = Visit.query.filter_by(last_access=date)
        visits_json = [VisitSchema().dump(visit) for visit in visits]

        if not visits:
            raise NoResultFound()

        return visits_json
