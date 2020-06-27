from collections import Counter
from enum import Enum

from .card import Card


class HandRankings(Enum):
    ROYAL_FLUSH = 1
    STRAIGHT_FLUSH = 2
    FOUR_OF_A_KIND = 3
    FULL_HOUSE = 4
    FLUSH = 5
    STRAIGHT = 6
    THREE_OF_A_KIND = 7
    TWO_PAIR = 8
    ONE_PAIR = 9
    HIGH_CARD = 10

    def __gt__(self, other):
        return self.value > other.value


def rank_cmp(a):
    s = "23456789TJQKA"
    return s.index(a)


def combo_bigger(cards_1, cards_2):
    # TODO: better combo comparison
    # hand_ranking1, combo1 = get_hand_ranking(cards1)
    # hand_ranking2, combo2 = get_hand_ranking(cards2)
    cards_1 = [Card(i[0], i[1]) for i in cards_1]
    cards_2 = [Card(i[0], i[1]) for i in cards_2]
    hand_ranking_1 = get_hand_ranking(cards_1)
    hand_ranking_2 = get_hand_ranking(cards_2)
    return hand_ranking_1 > hand_ranking_2


def get_hand_ranking(cards):
    # TODO: add 5 card combination determination
    if is_royal_flush(cards):
        return HandRankings.ROYAL_FLUSH
    if is_straight_flush(cards):
        return HandRankings.STRAIGHT_FLUSH
    if is_four_of_a_kind(cards):
        return HandRankings.FOUR_OF_A_KIND
    if is_full_house(cards):
        return HandRankings.FULL_HOUSE
    if is_flush(cards):
        return HandRankings.FLUSH
    if is_straight(cards):
        return HandRankings.STRAIGHT
    if is_three_of_a_kind(cards):
        return HandRankings.THREE_OF_A_KIND
    if is_two_pair(cards):
        return HandRankings.TWO_PAIR
    if is_one_pair(cards):
        return HandRankings.ONE_PAIR
    return HandRankings.HIGH_CARD


def is_royal_flush(cards):
    suit_counts = Counter([i.suit for i in cards])
    suit, count = suit_counts.most_common(1)[0]
    if count < 5:
        return False
    ranks = [i.rank for i in cards if i.suit == suit]

    for i in "TJKQA":
        if i not in ranks:
            return False
    return True


def is_straight_flush(cards):
    suit_counts = Counter([i.suit for i in cards])
    suit, count = suit_counts.most_common(1)[0]
    if count < 5:
        return False
    ranks = [i.rank for i in cards if i.suit == suit]
    ranks = sorted(ranks, key=rank_cmp)

    i = 0
    while i < len(ranks):
        cnt = 1
        j = i + 1
        while j < len(ranks) and rank_cmp(ranks[j - 1]) + 1 == rank_cmp(ranks[j]):
            j += 1
            cnt += 1
        i = j
        if cnt >= 5:
            return True


def is_four_of_a_kind(cards):
    ranks = [i.rank for i in cards]
    ranks_counter = Counter(ranks)
    most_common = ranks_counter.most_common(1)
    most_common_rank = most_common[0][1]
    return most_common_rank == 4


def is_full_house(cards):
    ranks = [i.rank for i in cards]
    counter = Counter(ranks)
    most_common = counter.most_common(2)
    return most_common[0][1] == 3 and most_common[1][1] == 2


def is_flush(cards):
    suits = [i.suit for i in cards]
    counter = Counter(suits)
    return counter.most_common(1)[0][1] >= 5


def is_straight(cards):
    ranks = [i.rank for i in cards]
    ranks = sorted(ranks, key=rank_cmp)

    i = 0
    while i < len(ranks):
        cnt = 1
        j = i + 1
        while j < len(ranks) and rank_cmp(ranks[j - 1]) + 1 == rank_cmp(ranks[j]):
            j += 1
            cnt += 1
        i = j
        if cnt >= 5:
            return True


def is_three_of_a_kind(cards):
    ranks = [i.rank for i in cards]
    counter = Counter(ranks)
    return counter.most_common(1)[0][1] == 3


def is_two_pair(cards):
    ranks = [i.rank for i in cards]
    counter = Counter(ranks)
    most_common = counter.most_common(2)
    return most_common[0][1] == 2 and most_common[1][1] == 2


def is_one_pair(cards):
    ranks = [i.rank for i in cards]
    counter = Counter(ranks)
    return counter.most_common(1)[0][1] == 2
