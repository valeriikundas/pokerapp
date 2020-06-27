import datetime
import json
import logging
import uuid

from gameplay import utils
from gameplay.combos import combo_bigger
from gameplay.deck import Deck


class Hand:
    def __init__(self, table_info):
        """initialize hand information

        :param table_info: table info in json format https://pastebin.com/raw/iyNYqu3E
        :type table_info: dict
        """

        super().__init__()

        required_fields = ["id", "button_position", "blinds", "players"]
        for key in required_fields:
            if key not in table_info:
                raise KeyError(f"no {key} in table info {table_info}")
        required_player_fields = ["username", "position", "stack_size"]
        for player in table_info["players"]:
            for key in required_player_fields:
                if key not in player:
                    raise KeyError(f"no {key} in player {player}")

        self.table_id = table_info["id"]
        self.hand_id = f"hand_{uuid.uuid4().hex}"
        self.start_time = str(datetime.datetime.now())
        self.end_time = None

        self.players = table_info["players"]
        self.active_player_positions = sorted(
            [player["position"] for player in self.players]
        )

        # TODO:move button movement to backend maybe?
        self.button_position = utils.find_next_active_player_position_after(
            self.active_player_positions, table_info["button_position"]
        )

        self.blinds = dict()
        self.blinds["small"] = table_info["blinds"]["small"]
        self.blinds["big"] = table_info["blinds"]["big"]
        self.blinds["ante"] = table_info["blinds"]["ante"]

        self.current_pot = 0
        self.deck = Deck()

        for position in self.active_player_positions:
            player = [p for p in self.players if p["position"] == position][0]
            chips_taken = min(player["stack_size"], self.blinds["ante"])
            player["stack_size"] -= chips_taken
            self.current_pot += chips_taken

        small_blind_position = utils.find_next_active_player_position_after(
            self.active_player_positions, self.button_position
        )
        big_blind_position = utils.find_next_active_player_position_after(
            self.active_player_positions, small_blind_position
        )

        self.deal_hands()

        self.preflop_actions = []

        small_blind_player = self.get_player(small_blind_position)
        chips_taken = min(small_blind_player["stack_size"], self.blinds["small"])
        small_blind_player["stack_size"] -= chips_taken
        self.current_pot += chips_taken
        self.preflop_actions.append(
            {"position": small_blind_position, "type": "raise", "size": chips_taken}
        )

        big_blind_player = self.get_player(big_blind_position)
        chips_taken = min(big_blind_player["stack_size"], self.blinds["big"])
        big_blind_player["stack_size"] -= chips_taken
        self.current_pot += chips_taken
        self.preflop_actions.append(
            {"position": big_blind_position, "type": "raise", "size": chips_taken}
        )

        # TODO:refactor cards['turn']
        self.flop_cards = None
        self.turn_card = None
        self.river_card = None

        # TODO:refactor actions['preflop']
        self.flop_actions = None
        self.turn_actions = None
        self.river_actions = None

        self.winner_position = None

        utils.inform_users(
            {
                "event": "preflop",
                "table_id": self.table_id,
                "players": self.players,
                "active_players": self.active_player_positions,
                "button_position": self.button_position,
                "current_pot": self.current_pot,
            }
        )

    def get_player(self, position):
        for p in self.players:
            if p["position"] == position:
                return p

    def deal_hands(self):
        for position in self.active_player_positions:
            player = self.get_player(position)
            # FIXME: does not work as expected
            player["cards"] = self.deck.get_random_hand()

    def run(self):
        self.round()

        self.flop()
        self.round()

        self.turn()
        self.round()

        self.river()
        self.round()

        self.complete()

    def flop(self):
        self.flop_cards = [
            self.deck.get_random_card(),
            self.deck.get_random_card(),
            self.deck.get_random_card(),
        ]

        utils.inform_users(
            {
                "event": "flop_cards",
                "table_id": self.table_id,
                "flop_cards": [str(i) for i in self.flop_cards],
            }
        )

    def turn(self):
        self.turn_card = self.deck.get_random_card()

        utils.inform_users(
            {
                "event": "turn_card",
                "table_id": self.table_id,
                # todo:refactor #1 str to serialization
                "turn_card": str(self.turn_card),
            }
        )

    def river(self):
        self.river_card = self.deck.get_random_card()

        utils.inform_users(
            {
                "event": "river_card",
                "table_id": self.table_id,
                "river_card": str(self.river_card),
            }
        )

    def round(self):
        # TODO: NEXT:round
        """
        waiting_list=[sb,bb,utf,...,bu]  # who should act in order

        first from list acts
        after act, player removed from list
        if somebody checks,calls,folds, nothing happens
        if bet,raised than player who need to respond are added at the end

        on actiong, get_action_space is called which determines possible actions.
        this thing is sent to backend, waiting for a reply.
        after a reply, action is acted.

        focus moves to the next player in the list
        """

        actions = []

        waiting_list = []
        i = 0
        while (
            i < len(self.active_player_positions)
            and self.active_player_positions[i] <= self.button_position
        ):
            i += 1

        while i < len(self.active_player_positions):
            waiting_list.append(self.active_player_positions[i])
            i += 1

        i = 0
        while (
            i < len(self.active_player_positions)
            and self.active_player_positions[i] <= self.button_position
        ):
            waiting_list.append(self.active_player_positions[i])
            i += 1

        while waiting_list and len(self.active_player_positions) > 1:
            action_player_position = waiting_list.pop(0)
            action_space = self.get_action_space(action_player_position, actions)
            action_player = self.get_player(action_player_position)
            action_player_username = action_player["username"]

            response = utils.request_action_from_user(
                self.table_id, action_player_username, action_space
            )

            print(response)
            if response["status"] == "ok":
                action = response["action"]

                if action["type"] == "fold":
                    actions.append({"position": action_player_position, "type": "fold"})
                    self.active_player_positions.remove(action_player_position)
                elif action["type"] == "check":
                    actions.append(
                        {"position": action_player_position, "type": "check"}
                    )
                elif action["type"] == "call":
                    # TODO: not enough chips to call, make sidepots
                    self.current_pot += action["size"]
                    actions.append(
                        {
                            "position": action_player_position,
                            "type": "call",
                            "size": action["size"],
                        }
                    )
                elif action["type"] == "raise":
                    # TODO: all-in case
                    self.current_pot += action["size"]
                    actions.append(
                        {
                            "position": action_player_position,
                            "type": "raise",
                            "size": action["size"],
                        }
                    )

                    i = len(actions) - 1
                    while i >= 0 and actions[i]["position"] != action_player_position:
                        if actions[i]["type"] != "fold":
                            waiting_list.append(actions[i]["position"])
                        i -= 1

            elif response["status"] == "timeout" or response["status"] == "error":
                previous_action_types = [a["type"] for a in action_space]
                if "check" in previous_action_types:
                    actions.append(
                        {"position": action_player_position, "type": "check"}
                    )
                elif "fold" in previous_action_types:
                    actions.append({"position": action_player_position, "type": "fold"})
                    self.active_player_positions.remove(action_player_position)
                else:
                    raise KeyError
            else:
                raise KeyError
            # NEXT:

        if len(self.active_player_positions) == 1:
            self.complete()

    def complete(self):
        self.determine_winner()
        winner_player = self.get_player(self.winner_position)
        winner_player["stack_size"] += self.current_pot

        utils.inform_users(
            {
                "event": "winner",
                "table_id": self.table_id,
                "winner": self.winner_position,
                "pot": self.current_pot,
            }
        )

        utils.inform_users(
            {"event": "save", "table_id": self.table_id, "data": self.dto()}
        )

    def get_full_combo(self, position):
        player = self.get_player(position)
        return [*player["cards"], *self.flop_cards, self.turn_card, self.river_card]

    def determine_winner(self):
        if len(self.active_player_positions) == 1:
            self.winner_position = self.active_player_positions[0]
            return

        self.winner_position = self.active_player_positions[0]

        for i in self.active_player_positions:
            if combo_bigger(
                self.get_full_combo(i), self.get_full_combo(self.winner_position)
            ):
                self.winner_position = i

    def get_action_space(self, position, previous_actions=None):
        action_space = []

        action_space.append({"type": "fold"})

        if not [a for a in previous_actions if a["type"] == "raise"]:
            action_space.append({"type": "check"})

        i = len(previous_actions) - 1
        while i >= 0 and previous_actions[i]["type"] != "raise":
            i -= 1

        if i <= 0:
            min_size = self.blinds["big"]
        else:
            last_raise = previous_actions[i]["size"]

            action_space.append({"type": "call", "size": last_raise})

            i -= 1
            while i >= 0 and previous_actions[i]["type"] != "raise":
                i -= 1

            if i <= 0:
                min_size = last_raise * 2
                if min_size > self.players[position]["stack_size"]:
                    min_size = self.players[position]["stack_size"]
            else:
                second_last_raise = previous_actions[i]["size"]
                raise_ = last_raise - second_last_raise
                raise_ = max(raise_, self.blinds["big"])
                min_size = last_raise + raise_

        i = len(previous_actions) - 1
        while i >= 0 and previous_actions[i]["position"] != position:
            i -= 1
        if i < 0:
            my_bet_size = 0
        else:
            my_bet_size = previous_actions[i].get("size", 0)

        player = self.get_player(position)
        max_size = my_bet_size + player["stack_size"]

        action_space.append({"type": "raise", "min": min_size, "max": max_size})
        return action_space

    def dto(self):
        d = self.__dict__.copy()
        d.pop("deck")
        return json.dumps(d)
