from gameplay.card import Card
from gameplay.combos import HandRankings, get_hand_ranking


def test_is_high_card():
    cards = [
        Card("5", "c"),
        Card("7", "s"),
        Card("8", "d"),
        Card("K", "c"),
        Card("J", "d"),
        Card("2", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.HIGH_CARD


def test_is_one_pair():
    cards = [
        Card("5", "c"),
        Card("8", "d"),
        Card("J", "c"),
        Card("6", "d"),
        Card("5", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.ONE_PAIR


def test_is_two_pair():
    cards = [
        Card("5", "c"),
        Card("2", "s"),
        Card("8", "h"),
        Card("J", "c"),
        Card("8", "d"),
        Card("5", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.TWO_PAIR


def test_is_two_pair_when_three_pairs_possible():
    cards = [
        Card("5", "c"),
        Card("5", "s"),
        Card("8", "d"),
        Card("8", "c"),
        Card("3", "d"),
        Card("3", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.TWO_PAIR


def test_is_three_of_a_kind():
    cards = [
        Card("5", "c"),
        Card("5", "s"),
        Card("8", "d"),
        Card("J", "c"),
        Card("5", "d"),
        Card("3", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.THREE_OF_A_KIND


def test_is_straight():
    cards = [
        Card("5", "c"),
        Card("6", "s"),
        Card("8", "d"),
        Card("J", "c"),
        Card("5", "d"),
        Card("9", "h"),
        Card("7", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.STRAIGHT


def test_is_flush():
    cards = [
        Card("5", "c"),
        Card("2", "c"),
        Card("8", "c"),
        Card("J", "s"),
        Card("J", "c"),
        Card("5", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.FLUSH


def test_is_full_house():
    cards = [
        Card("5", "c"),
        Card("5", "s"),
        Card("8", "d"),
        Card("J", "c"),
        Card("8", "c"),
        Card("8", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.FULL_HOUSE


def test_is_four_of_a_kind():
    cards = [
        Card("5", "c"),
        Card("5", "s"),
        Card("8", "d"),
        Card("J", "c"),
        Card("5", "d"),
        Card("5", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.FOUR_OF_A_KIND


def test_is_straight_flush():
    cards = [
        Card("6", "s"),
        Card("5", "s"),
        Card("J", "c"),
        Card("4", "s"),
        Card("8", "s"),
        Card("A", "c"),
        Card("7", "s"),
    ]
    assert get_hand_ranking(cards) == HandRankings.STRAIGHT_FLUSH


def test_royal_flush():
    cards = [
        Card("T", "c"),
        Card("5", "s"),
        Card("Q", "c"),
        Card("J", "c"),
        Card("K", "c"),
        Card("5", "h"),
        Card("A", "c"),
    ]
    assert get_hand_ranking(cards) == HandRankings.ROYAL_FLUSH
