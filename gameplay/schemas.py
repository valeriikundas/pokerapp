# ATTENCION!!!: it is very wrong. do not look here for json schema samples

# TODO: update all schema and examples

action_range_schema = {
    "type": "object",
    "properties": {"type": "string", "size": "number"},
}

action_schema = {
    "type": "object",
    "properties": {"position": "integer", "type": "string", "size": "number"},
}

player_schema = {
    "type": "object",
    "required": ["position", "username", "stack_size"],
    "properties": {
        "position": {"type": "integer"},
        "username": {"type": "string"},
        "stack_size": {"type": "number"},
        "cards": {"type": "string"},
    },
}

table_info_json_example = {
    "hand_id": "123",
    "id": "sdfs",
    "start_time": "2019-10-05 02:09:41.440691",
    "button_position": 1,
    "blinds": {"small": 10, "big": 20, "ante": 2},
    "active_players": [0, 1, 2],
    "players": [
        {"position": 0, "username": "WillSmith", "stack_size": 1435},
        {"position": 1, "username": "RobertDowneyJr", "stack_size": 955},
        {"position": 2, "username": "MargotRobbie", "stack_size": 2530},
    ],
}  # TODO: add autogeneration and remove in the end


table_info_schema = {
    "type": "object",
    "required": [
        "hand_id",
        "table_id",
        "start_time",
        "players",
        "button_position",
        "blinds",
        "active_players",
    ],
    "properties": {
        "hand_id": {"type": "string"},
        "table_id": {"type": "string"},
        "start_time": {"type": "string"},
        "players": {"type": "array", "items": player_schema},
        "button_position": {"type": "integer"},
        "blinds": {
            "type": "object",
            "required": ["small", "big"],
            "properties": {
                "small": {"type": "number"},
                "big": {"type": "number"},
                "ante": {"type": "number"},
            },
        },
        "active_players": {"type": "array", "items": {"type": "integer"}},
    },
}

hand_schema = {
    # TODO:
}

finished_hand_json_example = {
    "hand_id": "591242",
    "table_id": "1531393",
    "start_time": "2019-10-04 20:42:40.940300",
    "end_time": "2019-10-04 20:44:56.799157",
    "players": [
        {
            "position": 0,
            "username": "MargotRobbie",
            "stack_size": 2530,
            "cards": "9h5s",
        },
        {"position": 1, "username": "WillSmith", "stack_size": 1435, "cards": "AjKh"},
        {
            "position": 2,
            "username": "RobertDowneyJr",
            "stack_size": 955,
            "cards": "ThTd",
        },
    ],
    "button_position": 2,
    "blinds": {"small": 10, "big": 20, "ante": 2},
    "preflop_actions": [
        {"position": 0, "action": "small_blind", "size": 10},
        {"position": 1, "action": "big_blind", "size": 20},
        {"position": 2, "action": "raise", "size": 120},
        {"position": 0, "action": "fold"},
        {"position": 1, "action": "call", "size": 100},
    ],
    "flop_cards": ["Aj", "Th", "3h"],
    "flop_actions": [
        {"position": 1, "action": "check"},
        {"position": 2, "action": "check"},
    ],
    "turn_card": "5d",
    "turn_actions": [
        {"position": 1, "action": "raise", "size": 50},
        {"position": 2, "action": "call", "size": 50},
    ],
    "river_card": "8s",
    "river_actions": [
        {"position": 1, "action": "check"},
        {"position": 2, "action": "raise", "size": 120},
        {"position": 1, "action": "call", "size": 120},
    ],
    "winner": 2,
    "current_pot": 150,
    "active_players": [1, 2],
}
