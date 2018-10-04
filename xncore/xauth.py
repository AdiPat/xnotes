import os
from passlib.hash import sha256_crypt
import base64
import random
from xnotesapp.models import Note
from xncore import utils

#
# Verifies user credentials
#

def verify_credentials(username, password):
    # get password hash for the user from db
    salt = '' # get salt from db
    pw_hash = '' # get users password hash from db
    u_hash = hash_password(password,salt)
    return pw_hash == u_hash


#
# Generates salt 
#
# The algorithm first uses os.urandom() to get a 16 # bit random string of bytes, then encode it using # base64 , randomly pick a start index and salt # string length and accordingly pull out the substring from the previously generated string.
#

def gen_salt():
    _salt = str(base64.b64encode(os.urandom(16)))
    start = random.randint(4,12)
    saltLen = random.randint(3,6)
    salt = ""
    if(start+saltLen > len(_salt)):
        salt = _salt[start:start+saltLen]
    while(start + saltLen >= len(_salt)):
        start = random.randint(0,10)
        saltLen = random.randint(3,6)
    salt = _salt[start:start+saltLen]
    return salt

#
# generates hash from password using salt
# Use 1000 rounds for now to make it faster
#

def hash_password(password, s):
    pwstr = password + s;
    _pwhash = sha256_crypt.using(rounds=1000, salt=s).encrypt(pwstr)
    pwhash = sha256_crypt.using(rounds=1000, salt=s).encrypt(_pwhash)
    return pwhash