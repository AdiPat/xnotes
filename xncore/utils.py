import random

RAND_MIN = 1
RAND_MAX = 10007

def create_pKey(timeObj):
    key = str(timeObj.year) + str(timeObj.hour) + str(timeObj.minute) + str(timeObj.second) + str(timeObj.microsecond) + str(random.randint(RAND_MIN, RAND_MAX))
    return key
    