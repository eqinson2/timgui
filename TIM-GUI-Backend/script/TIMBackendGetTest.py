import json
import requests


def test_getall():
    url = 'http://localhost:8080/tim-gui-backend/tables/get/listAll'
    response = requests.get(url)
    print response.content
    parsed = json.loads(response.content)
    print json.dumps(parsed, indent=4, sort_keys=True)


def test_get():
    url = 'http://localhost:8080/tim-gui-backend/tables/get/Eqinson'
    response = requests.get(url)
    parsed = json.loads(response.content)
    print json.dumps(parsed, indent=4, sort_keys=True)


def test_filter():
    url = 'http://localhost:8080/tim-gui-backend/tables/filter/Eqinson'
    payload = {'name': 'eqinson1', 'age': '13', "job": "software engineer"}
    response = requests.get(url, params=payload)
    parsed = json.loads(response.content)
    print json.dumps(parsed, indent=4, sort_keys=True)


if __name__ == "__main__":
    test_getall()
    test_get()
    test_filter()
