import requests
import json
import time


def test_set():
    print "====================test_set===================="
    url = 'http://localhost:8080/tim-gui-backend/tables/set/Eqinson'
    data = {
        'oldData': {'name': 'eqinson1', 'age': '13', "job": "principle software engineer", "hometown": "NT"},
        'newData': {'name': 'eqinson1', 'age': '13', "job": "senior software engineer", "hometown": "SH"}
    }
    payload = json.dumps(data)
    response = requests.put(url, data=payload)
    print(response.content)


def test_filter():
    print "====================test_filter===================="
    url = 'http://localhost:8080/tim-gui-backend/tables/filter/Eqinson'
    # payload = {'name': 'eqinson1', 'age': '13',"job":"software engineer","hometown":"SH"}
    payload = {'name': 'eqinson1', 'age': '13', }
    response = requests.get(url, params=payload)
    parsed = json.loads(response.content)
    print json.dumps(parsed, indent=4, sort_keys=True)


def test_set_rollback():
    print "====================test_set_rollback===================="
    url = 'http://localhost:8080/tim-gui-backend/tables/set/Eqinson'
    data = {
        'oldData': {'name': 'eqinson1', 'age': '13', "job": "senior software engineer", "hometown": "SH"},
        'newData': {'name': 'eqinson1', 'age': '13', "job": "principle software engineer", "hometown": "NT"}
    }
    payload = json.dumps(data)
    response = requests.put(url, data=payload)
    print(response.content)


if __name__ == "__main__":
    test_filter()
    time.sleep(5)
    test_set()
    time.sleep(5)
    test_filter()
    time.sleep(5)
    test_set_rollback()
    time.sleep(5)
    test_filter()
