class Card:
    """represents a Card.
    internally it is shared as 'Ah'.
    two chars - first is rank, second is suit.

    :raises ValueError: [description]
    :return: [description]
    :rtype: [type]
    """

    ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"]
    suits = ["h", "d", "c", "s"]  # Hearts, Diamonds, Clubs, Spades

    def __init__(self, rank, suit):
        if rank not in self.ranks or suit not in self.suits:
            raise ValueError

        self.rank = rank
        self.suit = suit

    def __str__(self):
        return f"{self.rank}{self.suit}"

    def __repr__(self):
        return f"Card({self.rank}{self.suit})"

    def __lt__(self, other):
        self_rank_index = self.ranks.index(self.rank)
        other_rank_index = self.ranks.index(other.rank)
        return self_rank_index < other_rank_index

    def __eq__(self, other):
        return self.rank == other.rank and self.suit == other.suit
