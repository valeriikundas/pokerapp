import json
import os

import pika

RABBITMQ_URL = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/%2F")

connection = pika.BlockingConnection(pika.URLParameters(RABBITMQ_URL))
channel = connection.channel()

channel.queue_declare(queue="start_hand_queue", durable=True)

message = json.dumps(
    {
        "event": "new_hand",
        "table_info": {
            "id": "table_test_id",
            "button_position": 1,  # in the last hand. gameplay will update it accordingly
            "blinds": {"small": 10, "big": 20, "ante": 2},
            "players": {
                "0": {"username": "ChloëGraceMoretz", "stack_size": 730},
                "1": {"username": "WillSmith", "stack_size": 1435, "sitout": True},
                "3": {"username": "RobertDowneyJr", "stack_size": 955},
                "5": {"username": "MargotRobbie", "stack_size": 2530},
                "7": {"username": "MattDajer", "stack_size": 440},
            },
        },
    },
    indent=4,
)

channel.exchange_declare(exchange="start_hand_queue", exchange_type="fanout")
channel.basic_publish(
    exchange="start_hand_queue",
    routing_key="start_hand_queue",
    body=message,
    properties=pika.BasicProperties(
        delivery_mode=2, content_type="application/json"
    ),  # make message persistent
)
print(f" [x] Sent {message}")

connection.close()
