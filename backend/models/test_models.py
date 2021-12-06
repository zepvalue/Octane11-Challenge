from visit import Visit

visitInstance = Visit(visit_id=3, ip_address='192.168.0.1',
                      last_access='14-02-2021')


def test_model():
    assert visitInstance.visit_id == 3
    assert visitInstance.ip_address == '192.168.0.1'
    assert visitInstance.last_access == '14-02-2021'
