import hashlib
import secrets
import string
from django.contrib.auth.hashers import BasePasswordHasher
from django.conf import settings

class CustomSHA256Hasher(BasePasswordHasher):
    # L'identifiant de l'algorithme 
    algorithm = "custom_sha256"

    # fonction pour générer le sel
    def salt(self):
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(16))

    # La fonction d'encodage principal
    def encode(self, password, salt):
        assert password is not None
        assert salt and '$' not in salt
        
        # On récupère le Poivre depuis settings.py
        # S'il n'est pas défini, on met une valeur par défaut
        pepper = getattr(settings, 'CUSTOM_PASSWORD_PEPPER', 'poivre_par_defaut')
        
        # --- LOGIQUE ---
        h = hashlib.sha256()
        texte = password + salt
        h.update(texte.encode('utf-8'))
        
        hash_intermediaire = h.hexdigest()
        hash_intermediaire = hash_intermediaire + pepper
        
        h2 = hashlib.sha256()
        h2.update(hash_intermediaire.encode('utf-8'))
        hash_final = h2.hexdigest()
        # ---------------------
        
        # Django stocke toujours les mots de passe sous le format : algorithme$sel$hash
        return f"{self.algorithm}${salt}${hash_final}"

    # La fonction qui vérifie si le mot de passe saisi à la connexion est le bon
    def verify(self, password, encoded):
        # On découpe la chaîne stockée en base de données
        algorithm, salt, hash_final = encoded.split('$', 2)
        assert algorithm == self.algorithm
        
        # On recalcule le hash avec le mot de passe que l'utilisateur vient de taper
        encoded_2 = self.encode(password, salt)
        
        # Si les deux chaînes correspondent, le mot de passe est bon !
        return encoded == encoded_2

    # Fonction utilitaire demandée par Django (pour l'affichage dans l'interface admin)
    def safe_summary(self, encoded):
        algorithm, salt, hash_final = encoded.split('$', 2)
        return {
            'algorithm': algorithm,
            'salt': salt,
            'hash': hash_final,
        }