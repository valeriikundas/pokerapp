import json
import logging
import os
import sys
import time

import pika
from pika.exceptions import AMQPConnectionError

# TODO:fix and remove
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if True:
    from hand import Hand


def callback(ch, method, properties, body):
    logging.info(f" [x] Start hand: {body}")
    ch.basic_ack(delivery_tag=method.delivery_tag)

    print(body)

    skip = False

    if not skip:
        data = json.loads(body)
        Hand(data).run()
    else:
        try:
            data = json.loads(body)
            Hand(data).run()
        except Exception as e:
            logging.fatal(e)

    logging.info(" [x] Hand finished")


def connect_to_rabbitmq(rabbitmq_url):
    while True:
        try:
            connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
            channel = connection.channel()
            logging.info("rabbitmq connected")
            return connection, channel
        except AMQPConnectionError:
            logging.error("waiting for RabbitMQ to become available...")
            time.sleep(3)


def setup_rabbitmq():
    RABBITMQ_URL = os.environ.get(
        "RABBITMQ_URL", "amqp://user:password@localhost:5672/%2F"
    )

    _, channel = connect_to_rabbitmq(RABBITMQ_URL)

    channel.exchange_declare(exchange="start_hand_queue", exchange_type="fanout")

    result = channel.queue_declare(queue="start_hand_queue", durable=True)
    queue_name = result.method.queue

    channel.queue_bind(queue=queue_name, exchange="start_hand_queue")

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(queue=queue_name, on_message_callback=callback)

    logging.info(" [*] Waiting for messages. To exit press CTRL+C")
    channel.start_consuming()


def main():
    logging.basicConfig()
    logging.getLogger().setLevel(logging.INFO)

    # setup_rabbitmq()
    # TODO: do we need this service really?
    # NOTE: we can just call bg task from backend server


if __name__ == "__main__":
    main()
