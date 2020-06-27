from unittest import mock

import pytest
from gameplay import utils
from gameplay.hand import Hand


@pytest.fixture
def simple_table_info():
    return {
        "id": "table_testid",
        "button_position": 3,
        "blinds": {"small": 10, "big": 20, "ante": 2},
        "players": {
            0: {"username": "ChloëGraceMoretz", "stack_size": 730},
            # 1: {"username": "WillSmith", "stack_size": 1435, "sitout": True},
            3: {"username": "RobertDowneyJr", "stack_size": 955},
            5: {"username": "MargotRobbie", "stack_size": 2530},
            7: {"username": "MattDajer", "stack_size": 440},
        },
    }


@pytest.fixture
@mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
def simple_hand(simple_table_info):
    return Hand(simple_table_info)


class TestHand:
    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    def test_init_hand(self, simple_table_info):
        hand = Hand(simple_table_info)

        assert hand.table_id == "table_testid"
        assert hand.button_position == 5
        assert len(hand.players) == 5
        assert len(hand.active_players) == 4

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    def test_init_hand_with_not_enough_fields(self, simple_table_info):
        simple_table_info.pop("id")
        with pytest.raises(KeyError):
            Hand(simple_table_info)

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "fold"}}),
    )
    def test_all_players_fold_on_preflop(self, simple_table_info):
        hand = Hand(simple_table_info)
        hand.deal_hands()

        for i in hand.active_player_positions:
            assert hand.players[i].get("cards") is not None

        hand.round()

        assert len(hand.active_players) == 1

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "fold"}}),
    )
    def test_get_action_space_when_utg_to_act_on_preflophand(self, simple_hand):
        assert len(simple_hand.preflop_actions) == 2

        simple_hand.active_players = [0, 3, 5, 7]

        assert (
            len(simple_hand.get_action_space(3, simple_hand.preflop_actions)["actions"])
            == 3
        )

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "fold"}}),
    )
    def test_get_action_space_utg_plus_one_to_act_on_preflop_after_limp(
        self, simple_hand
    ):
        simple_hand.preflop_actions = [
            {"position": 7, "type": "raise", "size": 10},
            {"position": 0, "type": "raise", "size": 20},
            {"position": 3, "type": "call", "size": 20},
        ]

        assert (
            len(simple_hand.get_action_space(5, simple_hand.preflop_actions)["actions"])
            == 3
        )

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "fold"}}),
    )
    def test_get_action_space_for_last_action_on_preflop(self, simple_hand):
        simple_hand.preflop_actions = [
            {"position": 7, "type": "raise", "size": 10},
            {"position": 0, "type": "raise", "size": 20},
            {"position": 3, "type": "call", "size": 20},
            {"position": 5, "type": "fold"},
            {"position": 7, "type": "raise", "size": 100},
            # {"position": 0, "type": "call", "size": 100},
        ]

        actions = simple_hand.get_action_space(0, simple_hand.preflop_actions)[
            "actions"
        ]
        assert len(actions) == 3

        action_types = [i["type"] for i in actions]
        assert all(i in action_types for i in ["fold", "call", "raise"])
        assert actions[1]["size"] == 100
        assert actions[2]["min"] == 180 and actions[2]["max"] == 728

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "fold"}}),
    )
    def test_get_action_space_small_blind_on_preflop_with_one_limp(self, simple_hand):
        hand = simple_hand
        hand.preflop_actions = [
            {"position": 7, "type": "raise", "size": 10},
            {"position": 0, "type": "raise", "size": 20},
            {"position": 3, "type": "call", "size": 20},
            {"position": 5, "type": "fold"},
        ]

        actions = hand.get_action_space(7, hand.preflop_actions)["actions"]
        assert len(actions) == 3
        assert actions[1]["type"] == "call" and actions[1]["size"] == 20
        assert (
            actions[2]["type"] == "raise"
            and actions[2]["min"] == 40
            and actions[2]["max"] == 438
        )

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "fold"}}),
    )
    def test_get_action_space_on_preflop_with_many_raises(self, simple_hand):
        preflop_actions = [
            {"position": 7, "type": "raise", "size": 10},
            {"position": 0, "type": "raise", "size": 20},
            {"position": 3, "type": "raise", "size": 70},
            {"position": 5, "type": "call", "size": 70},
            {"position": 7, "type": "raise", "size": 250},
            {"position": 0, "type": "call", "size": 250},
        ]

        actions = simple_hand.get_action_space(3, preflop_actions)["actions"]
        assert len(actions) == 3

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "raise"}}),
    )
    def test_get_action_space_to_first_player_to_act_on_flop(self, simple_hand):
        sb = utils.find_next_active_player_position_after(
            simple_hand.active_players, simple_hand.button_position
        )
        assert sb == 7

        actions = simple_hand.get_action_space(sb, [])["actions"]
        assert len(actions) == 3
        assert actions[0]["type"] == "fold"
        assert actions[1]["type"] == "check"
        assert (
            actions[2]["type"] == "raise"
            and actions[2]["min"] == 20
            and actions[2]["max"] == 428
        )

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "raise"}}),
    )
    def test_basic_flop(self, simple_hand):
        assert simple_hand.button_position == 5

        simple_hand.flop_cards = [
            simple_hand.deck.get_random_card(),
            simple_hand.deck.get_random_card(),
            simple_hand.deck.get_random_card(),
        ]
        simple_hand.flop_actions = []

        sb = utils.find_next_active_player_position_after(
            simple_hand.active_players, simple_hand.button_position
        )
        assert sb == 7

        actions = simple_hand.get_action_space(sb, simple_hand.flop_actions)["actions"]
        assert len(actions) == 3
        assert actions[1]["type"] == "check"

        simple_hand.flop_actions.append({"position": sb, "type": "check"})

        bb = utils.find_next_active_player_position_after(
            simple_hand.active_players, sb
        )
        assert bb == 0

        actions = simple_hand.get_action_space(bb, simple_hand.flop_actions)["actions"]
        assert len(actions) == 3
        assert (
            actions[2]["type"] == "raise"
            and actions[2]["min"] == 20
            and actions[2]["max"] == 708  # big blind is taken
        )

        simple_hand.flop_actions.append({"position": bb, "type": "raise", "size": 50})

        cu = utils.find_next_active_player_position_after(
            simple_hand.active_players, bb
        )
        assert cu == 3

        actions = simple_hand.get_action_space(cu, simple_hand.flop_actions)["actions"]
        assert len(actions) == 3
        assert actions[0]["type"] == "fold"

        simple_hand.flop_actions.append({"position": cu, "type": "fold"})
        simple_hand.active_players.remove(cu)

        bu = utils.find_next_active_player_position_after(
            simple_hand.active_players, bb
        )
        assert bu == 5

        actions = simple_hand.get_action_space(bu, simple_hand.flop_actions)["actions"]
        assert len(actions) == 3
        assert actions[0]["type"] == "fold"

        simple_hand.flop_actions.append({"position": bu, "type": "fold"})
        simple_hand.active_players.remove(bu)

        sb = utils.find_next_active_player_position_after(
            simple_hand.active_players, bu
        )
        assert sb == 7

        actions = simple_hand.get_action_space(bu, simple_hand.flop_actions)["actions"]
        assert len(actions) == 3
        assert actions[1]["type"] == "call"

        simple_hand.flop_actions.append({"position": sb, "type": "fold"})
        simple_hand.active_players.remove(sb)

        assert len(simple_hand.active_players) == 1

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "raise"}}),
    )
    def test_flop_where_everyone_checks(self, simple_hand):
        flop_actions = [
            {"position": 7, "type": "check"},
            {"position": 0, "type": "check"},
            {"position": 3, "type": "check"},
            {"position": 5, "type": "check"},
        ]

        actions = simple_hand.get_action_space(7, [])["actions"]
        assert actions[1]["type"] == "check"

        simple_hand.active_players.remove(7)

        actions = simple_hand.get_action_space(0, flop_actions[:1])["actions"]
        assert actions[1]["type"] == "check"

        simple_hand.active_players.remove(0)

        actions = simple_hand.get_action_space(3, flop_actions[:2])["actions"]
        assert actions[1]["type"] == "check"

        simple_hand.active_players.remove(3)

        actions = simple_hand.get_action_space(5, flop_actions[:3])["actions"]
        assert actions[1]["type"] == "check"

        simple_hand.active_players.remove(5)

    @mock.patch.object(utils, "inform_users", mock.Mock(return_value=True))
    @mock.patch.object(
        utils,
        "request_action_from_user",
        mock.Mock(return_value={"status": "ok", "action": {"type": "raise"}}),
    )
    def test_flop_where_every_raises_then_folds(self, simple_hand):
        flop_actions = [
            {"position": 7, "type": "check"},
            {"position": 0, "type": "raise", "size": 50},
            {"position": 3, "type": "call", "size": 50},
            {"position": 5, "type": "raise", "size": 150},
            {"position": 7, "type": "call", "size": 150},
            {"position": 0, "type": "raise", "size": 350},
            {"position": 3, "type": "fold"},
            {"position": 5, "type": "raise", "size": 750},
            {"position": 7, "type": "fold"},
            {"position": 0, "type": "call"},
        ]

        position = simple_hand.button_position

        for i in range(len(flop_actions)):
            position = utils.find_next_active_player_position_after(
                simple_hand.active_players, position
            )
            actions = simple_hand.get_action_space(position, flop_actions[:i])[
                "actions"
            ]

            assert len(actions) == 3

            if flop_actions[i]["type"] == "fold":
                simple_hand.active_players.remove(position)

        assert len(simple_hand.active_players) == 2
