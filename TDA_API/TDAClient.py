from dotenv import load_dotenv, find_dotenv
import os
import requests
import json


class TDAClient:
    def __init__(self):
        load_dotenv(find_dotenv())
        self.client_id = os.getenv('TDA_CLIENT_ID')
        self.refresh_token = os.getenv('TDA_REFRESH_TOKEN')

    def get_account(self, account_id):
        access_token = self.__refresh_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        url = f"https://api.tdameritrade.com/v1/accounts/{account_id}"
        response = requests.get(url, headers=headers)
        return response.json()

    def get_daily_price_history(self, symbol, start_millis, end_millis=None):
        access_token = self.__refresh_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        url = f"https://api.tdameritrade.com/v1/marketdata/{symbol}/pricehistory"
        params = {
            "startDate": start_millis,
            "periodType": "month",
            "frequencyType": "daily",
            "frequency": 1
        }

        if end_millis is not None:
            params["endDate"] = end_millis

        response = requests.get(url, headers=headers, params=params)
        return response.json()

    def get_transactions(self, account_id, transaction_type):
        access_token = self.__refresh_access_token()
        headers = {"Authorization": f"Bearer {access_token}"}
        params = {
            "type": transaction_type
        }
        url = f"https://api.tdameritrade.com/v1/accounts/{account_id}/transactions"
        response = requests.get(url, headers=headers, params=params)
        return response.json()

    def __refresh_access_token(self):
        params = {
            "client_id": self.client_id,
            "grant_type": "refresh_token",
            "refresh_token": self.refresh_token
        }
        url = "https://api.tdameritrade.com/v1/oauth2/token"
        response = requests.post(url, data=params)
        return response.json()['access_token']