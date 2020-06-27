import re

import pytest
from gameplay.deck import Deck


def test_get_some_cards():
    d = Deck()
    assert len(d.free_deck) == 52
    a = []
    for _ in range(10):
        a.append(d.get_random_card())
    assert len(d.free_deck) == 42

    a.extend(d.free_deck)
    assert len(a) == 52
