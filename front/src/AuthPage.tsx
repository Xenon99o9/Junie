import React, { useState } from 'react';

interface AuthPageProps {
  onLoginSuccess: () => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLoginView, setIsLoginView] = useState(true);
  
  // États pour stocker ce que l'utilisateur tape
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // État pour afficher des messages d'erreur ou de succès
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(''); // On réinitialise le message à chaque tentative

    if (isLoginView) {
      // --- LOGIQUE DE CONNEXION ---
      try {
        const response = await fetch('http://localhost:8000/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            password: password
          })
        });

        if (response.ok) {
          const data = await response.json();
          // On sauvegarde le token VIP dans le navigateur
          localStorage.setItem('access_token', data.access);
          localStorage.setItem('refresh_token', data.refresh);
          
          // On prévient App.tsx que c'est bon !
          onLoginSuccess();
        } else {
          setMessage('Identifiant ou mot de passe incorrect.');
        }
      } catch (error) {
        console.error(error);
        setMessage('Erreur de connexion au serveur.');
      }

    } else {
      // --- LOGIQUE D'INSCRIPTION ---
      try {
        const response = await fetch('http://localhost:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            email: email,
            password: password
          })
        });

        if (response.ok) {
          setMessage('Compte créé avec succès ! Vous pouvez vous connecter.');
          // On bascule automatiquement sur la vue de connexion
          setIsLoginView(true);
          // On vide le mot de passe pour qu'il le retape par sécurité
          setPassword(''); 
        } else {
          const errorData = await response.json();
          // Affiche l'erreur spécifique renvoyée par Django (ex: "Ce nom d'utilisateur existe déjà")
          setMessage(JSON.stringify(errorData)); 
        }
      } catch (error) {
        console.error(error);
        setMessage('Erreur lors de la création du compte.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isLoginView ? 'Bon retour !' : 'Créer un compte'}
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            {isLoginView ? 'Connectez-vous pour accéder à vos projets' : 'Rejoignez-nous pour commencer à créer'}
          </p>
        </div>

        {/* Affichage des messages d'erreur/succès */}
        {message && (
          <div className={`p-3 mb-4 text-sm rounded-lg ${message.includes('succès') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Champs exclusifs à l'inscription */}
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                placeholder="ex: designer_pro" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          )}

          {/* Champ Email pour Inscription / Champ Mixte (Username) pour Connexion */}
          {!isLoginView ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
              <input 
                type="email" 
                placeholder="vous@exemple.fr" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                placeholder="Votre nom d'utilisateur" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          )}

          {/* Mot de passe (commun aux deux) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4 shadow-sm"
          >
            {isLoginView ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          {isLoginView ? "Pas encore de compte ?" : "Déjà un compte ?"}
          <button 
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setMessage('');
            }}
            className="text-indigo-600 font-semibold ml-1.5 hover:underline focus:outline-none"
          >
            {isLoginView ? "S'inscrire" : "Se connecter"}
          </button>
        </div>

      </div>
    </div>
  );
}