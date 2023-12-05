from gmpy2 import mpz,mpq,mpfr,mpc
import hashlib
from random import randrange, getrandbits, randint
import gmpy2
from time import time
import re


PALLIER_BIT_LENGTH = 1536 # P e Q de Pallier terão esse comprimento / 2 em bits
PRIME_COMMITMENT_BIT_LENGTH = PALLIER_BIT_LENGTH - 10 # O número primo terá esse comprimento em bits

def is_prime(n, k=128):
    """ Test if a number is prime
        Args:
            n -- int -- the number to test
            k -- int -- the number of tests to do
        return True if n is prime
    """
    # Test if n is not even.
    # But care, 2 is prime !
    if n == 2 or n == 3:
        return True
    if n <= 1 or n % 2 == 0:
        return False
    # find r and s
    s = 0
    r = n - 1
    while r & 1 == 0:
        s += 1
        r //= 2
    # do k tests
    for _ in range(k):
        a = randrange(2, n - 1)
        x = pow(a, r, n)
        if x != 1 and x != n - 1:
            j = 1
            while j < s and x != n - 1:
                x = pow(x, 2, n)
                if x == 1:
                    return False
                j += 1
            if x != n - 1:
                return False
    return True

def generate_prime_candidate(length):
    """ Generate an odd integer randomly
        Args:
            length -- int -- the length of the number to generate, in bits
        return a integer
    """
    # generate random bits
    p = getrandbits(length)
    # apply a mask to set MSB and LSB to 1
    p |= (1 << length - 1) | 1
    return p

def generate_prime_number(length=1024):
    """ Generate a prime
        Args:
            length -- int -- length of the prime to generate, in          bits
        return a prime
    """
    p = 4
    # keep generating while the primality test fail
    while not is_prime(p, 128):
        p = generate_prime_candidate(length)
    return p

def hash_function(message):
  hashobj = hashlib.sha256(message.encode('utf-8')).digest()
  return int.from_bytes(hashobj, 'big')

def commitment(alpha, beta, p, r, message):
  hash = hash_function(message)
  return pow(mpz(alpha), mpz(r), mpz(p))*pow(mpz(beta), mpz(hash), mpz(p))

def validate_result(alpha, beta, p, rs, cs, msgs):
  c_product = 1
  for c in cs:
    c_product *= c

  r_sum = 0
  for r in rs:
    r_sum += r

  c_star = pow(mpz(alpha), r_sum, p)
  for msg in msgs:
    hash = hash_function(msg)
    c_star *= pow(mpz(beta), hash, p)
  return c_product % p  == c_star % p

def gcd(a,b):
    while b > 0:
        a, b = b, a % b
    return a

def lcm(a, b):
    return a * b // gcd(a, b)


def int_time():
    return int(round(time() * 1000))

class PrivateKey(object):
    def __init__(self, p, q, n):
        self.l = (p-1) * (q-1)
        self.m = gmpy2.invert(self.l, n)  #1/fi(n)

    def __repr__(self):
        return '<PrivateKey: %s %s>' % (self.l, self.m)
    
    @classmethod
    def from_string(cls, string):
        n = re.search('<PrivateKey: (.+?) (.+?)>', string)
        if n:
            pub = PrivateKey(9, 9, 9)
            pub.l = int(n.group(1))
            pub.m = int(n.group(2))
            return pub
            

class PublicKey(object):

    @classmethod
    def from_n(cls, n):
        return cls(n)
    @classmethod
    def from_string(cls, string):
        n = re.search('<PublicKey: (.+?)>', string)
        if n:
            return PublicKey(int(n.group(1)))

    def __init__(self, n):
        self.n = n
        self.n_sq = n * n
        self.g = n + 1
    def __repr__(self):
        return '<PublicKey: %s>' % self.n

def generate_keypair(bits=PALLIER_BIT_LENGTH):
    p_equal_q = True
    while p_equal_q:
        p = generate_prime_number(bits // 2)
        q = generate_prime_number(bits // 2)
        if (p!=q):
            p_equal_q = False
    n = p * q
    return PrivateKey(p, q, n), PublicKey(n)

def encrypt(pub, plain):
    one = gmpy2.mpz(1)
    state = gmpy2.random_state(int_time())
    r = gmpy2.mpz_random(state,pub.n)
    while gmpy2.gcd(r,pub.n) != one:
        state = gmpy2.random_state(int_time())
        r = gmpy2.mpz_random(state,pub.n)
    x = gmpy2.powmod(r,pub.n,pub.n_sq)
    cipher = gmpy2.f_mod(gmpy2.mul(gmpy2.powmod(pub.g,gmpy2.mpz(plain),pub.n_sq),x),pub.n_sq)
    return cipher

def decrypt(priv, pub, cipher):
    one = gmpy2.mpz(1)
    x = gmpy2.sub(gmpy2.powmod(cipher,priv.l,pub.n_sq),one)
    plain = gmpy2.f_mod(gmpy2.mul(gmpy2.f_div(x,pub.n),priv.m),pub.n)
    if plain >= gmpy2.f_div(pub.n,2):
        plain = plain - pub.n
    return plain

def addemup(a, b):
    return gmpy2.mul(gmpy2.mpz(a),gmpy2.mpz(b))

def add(a, b):
    return gmpy2.add(gmpy2.mpz(a),gmpy2.mpz(b))

def multime(pub, a, n):
    return gmpy2.powmod(a, n, pub.n_sq)

def get_new_election_random_values():
    p = generate_prime_number(PRIME_COMMITMENT_BIT_LENGTH)
    alpha = randint(0, p-1)
    beta = randint(0, p-1)
    return (p, alpha, beta)

def validar_eleicao(eleicao, votos):
    pub = PublicKey.from_string(eleicao.chave_publica_criptografia)
    priv = PrivateKey.from_string(eleicao.chave_privada_criptografia)
    r_sum_decrypted = decrypt(priv, pub, gmpy2.mpz(eleicao.r_somatorio))
    p = mpz(eleicao.p)
    
    c_star = pow(mpz(eleicao.alpha), r_sum_decrypted, p)
    
    for voto in votos:
        hash = hash_function(voto.voto_criptografado)
        c_star *= pow(mpz(eleicao.beta), hash, p)

    c_product = mpz(eleicao.c_produtorio)

    return c_product % p  == c_star % p