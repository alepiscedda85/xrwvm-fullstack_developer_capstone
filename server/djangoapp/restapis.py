import requests
import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030"
)

sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/"
)


def get_request(endpoint, **kwargs):
    params = ""
    if kwargs:
        for key, value in kwargs.items():
            params += key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params

    print("GET from {}".format(request_url))

    try:
        response = requests.get(request_url)
        data = response.json()
        print("RESPONSE:", data)
        return data
    except Exception as e:
        print("Network exception occurred in get_request:", e)
        return []


def analyze_review_sentiments(text):
    request_url = sentiment_analyzer_url + "analyze/" + text
    print("GET from {}".format(request_url))

    try:
        response = requests.get(request_url)
        data = response.json()
        print("SENTIMENT RESPONSE:", data)
        return data
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred in analyze_review_sentiments")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    print("POST to {}".format(request_url))
    print("POST DATA:", data_dict)

    try:
        response = requests.post(request_url, json=data_dict)
        data = response.json()
        print("POST RESPONSE:", data)
        return data
    except Exception as e:
        print("Network exception occurred in post_review:", e)
        return {"status": 500, "error": str(e)}