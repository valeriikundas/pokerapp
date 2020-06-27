import logging
import os
import random
import time
import json

import requests

BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5000/api")


def inform_users(data):
    table_id = data["table_id"]
    logging.debug(f"talbe_Id {table_id}")

    # todo:use furl
    for _ in range(2):
        try:
            url = f"{BACKEND_URL}/inform/{table_id}"
            response = requests.post(url, json=data, timeout=10)
            if not response.ok:
                import pdb

                pdb.set_trace()
        except:
            time.sleep(5)


def request_action_from_user(table_id, username, action_space):
    try:
        # print("actionspacea", action_space)
        response = requests.post(
            f"http://{BACKEND_URL}/api/request_action/{table_id}/{username}/",
            data={"action_space": json.dumps(action_space)},
            timeout=10,
        )
        logging.info(
            f"""request_action table_id={table_id} username={username} data=
                "table_id": {table_id}
                "username": {username}
                "action_space" {action_space}"""
        )
        try:
            action = response.json()
        except Exception as e:
            action = {"status": "error"}
            logging.error(e)
    except (requests.Timeout, requests.ConnectionError):
        action = {"status": "timeout"}

    return action


def find_next_active_player_position_after(active_players, position: int):
    for i in active_players:
        if i > position:
            return i

    return active_players[0]
