import logging
from flask import request
from models.visit import Visit
from flask_restful import Resource, abort
from sqlalchemy.orm.exc import NoResultFound
from schemas.visit_schema import VisitSchema

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
        if not date:
            date = request.args.get('date')
            logger.info(f"Retrieving all visits")
        
            return self._get_all_visits(), 200

        logger.info(f"Retrieving visit by date {date}")

        try: 
            return self._get_visit_by_date(date), 200
        except NoResultFound:
            abort(404, message="Visit not found")

   
    def _get_all_visits(self):
        visits = Visit.query.all()

        visits_json = [VisitSchema().dump(visit) for visit in visits]
        return visits_json

    def _get_visit_by_date(self, date):
        visit = Visit.query.filter_by(last_access=date).first()
        visit_json = VisitSchema().dump(visit)

        if not visit:
            raise NoResultFound()

        return visit_json
