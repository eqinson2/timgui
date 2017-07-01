import requests
import json
import time


def test_insert():
    print "====================test_insert===================="
    url = 'http://localhost:8080/tim-gui-backend/tables/insert/Eqinson'
    payload = {'name': 'eqinson111111111111111', 'age': '22', "job": "CEO", "hometown": "LA"}
    response = requests.post(url, params=payload)
    print(response.content)


def test_filter():
    print "====================test_filter===================="
    url = 'http://localhost:8080/tim-gui-backend/tables/filter/Eqinson'
    payload = {'name': 'eqinson111111111111111', 'age': '22'}
    response = requests.get(url, params=payload)
    parsed = json.loads(response.content)
    print json.dumps(parsed, indent=4, sort_keys=True)


def test_delete():
    print "====================test_delete===================="
    url = 'http://localhost:8080/tim-gui-backend/tables/delete/Eqinson'
    payload = {'name': 'eqinson111111111111111', 'age': '22', "job": "CEO", "hometown": "LA"}
    response = requests.delete(url, params=payload)
    print(response.content)


if __name__ == "__main__":
    test_filter()
    time.sleep(5)
    test_insert()
    time.sleep(5)
    test_filter()
    time.sleep(5)
    test_delete()
    time.sleep(5)
    test_filter()
