from enum import Enum

class TopicStatus(str, Enum):
    NOT_ATTEMPTED = "NOT_ATTEMPTED"
    WEAK = "WEAK"
    MASTERED = "MASTERED"
