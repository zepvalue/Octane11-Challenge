import logging
from flask import request
from models.visit import Visit
from flask_restful import Resource, abort
from sqlalchemy.orm.exc import NoResultFound
from schemas.visit_schema import VisitSchema
from flask_cors import cross_origin


VISIT_COLLECTION_ENDPOINT = "/api/visits/show"
logger = logging.getLogger(__name__)


class VisitsCollection(Resource):
    def get(self, date=None, country=None):
        """
        VisitsResource GET method. Retrieves all visits found in the Octane11
        database, unless the date parameter is provided. If the date
        is provided then the visit with the related date of access is retrieved.
        :param date: Visit DATE to retrieve, this query parameter is optional
        :return: Visit, 200 HTTP status code
        """

        date = request.args.get('date')
        country = request.args.get('country')

        if not date and not country:
            logger.info(f"Retrieving all visits")
            try:
                return self._get_all_visits(), 200
            except NoResultFound:
                abort(404, message="Visit not found")

        if date:
            logger.info(f"Retrieving visits by date")
            try:
                return self._get_visits_by_date(date), 200
            except NoResultFound:
                abort(404, message="Visit not found")

        if country:
            logger.info(f"Retrieving visits by country")
            try:
                return self._get_visits_by_country(country), 200
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

    def _get_visits_by_country(self, country):
        visits = Visit.query.filter_by(country=country)
        visits_json = [VisitSchema().dump(visit) for visit in visits]

        if not visits:
            raise NoResultFound()

        return visits_json
