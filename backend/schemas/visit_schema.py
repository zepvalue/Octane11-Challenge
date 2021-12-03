from marshmallow import Schema, fields, post_load
from models.visit import Visit

class VisitSchema(Schema):
    """
    Visit Marshmallow Schema
    Marshmallow schema used for loading/dumping Visits
    """

    visit_id = fields.Integer()
    ip_address = fields.String(allow_none=False)
    last_access = fields.String(allow_none=False)

    @post_load
    def make_visit(self, data, **kwargs):
        return Visit(**data)