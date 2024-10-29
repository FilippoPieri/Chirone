from django.contrib.auth.hashers import BasePasswordHasher
from django.utils.crypto import constant_time_compare, get_random_string
from hashlib import sha3_512

class SHA3512PasswordHasher(BasePasswordHasher):
    """
    Un hasher personalizzato che utilizza SHA3-512.
    """
    algorithm = "sha3_512"

    def salt(self):
        # Genera un salt casuale di 16 caratteri
        return get_random_string(16)

    def encode(self, password, salt):
        assert password is not None
        assert salt is not None
        # Codifica la password usando sha3_512
        hash = sha3_512((salt + password).encode()).hexdigest()[:80]  # Taglia hash se necessario
        return f"{self.algorithm}${salt}${hash}"

    def verify(self, password, encoded):
        algorithm, salt, hash = encoded.split('$', 2)
        assert algorithm == self.algorithm
        encoded_2 = self.encode(password, salt)
        return constant_time_compare(encoded, encoded_2)

    def must_update(self, encoded):
        return False

    def harden_runtime(self, password, encoded):
        # Rafforza il tempo di esecuzione per prevenire attacchi
        pass

    def safe_summary(self, encoded):
            algorithm, salt, hash = encoded.split('$', 2)
            return {
                'algorithm': algorithm,
                'salt': salt,
                'hash': hash[:6] + "..."  # Mostra solo una parte dell'hash per sicurezza
            }