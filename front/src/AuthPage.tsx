import React, { useState } from 'react';

// Prop pour prévenir App que la connexion est réussie
interface AuthPageProps {
  onLoginSuccess: () => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  const [isLoginView, setIsLoginView] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Plus tard, on vérifiera le mot de passe via l'API ou Zustand
    console.log(isLoginView ? "Simulation Connexion" : "Simulation Inscription");
    
    
    onLoginSuccess();
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

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Champs exclusifs à l'inscription */}
          {!isLoginView && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
              <input 
                type="text" 
                placeholder="ex: designer_pro" 
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          )}

          {/* Champ d'identifiant */}
          {isLoginView ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email ou Nom d'utilisateur</label>
              <input 
                type="text" 
                placeholder="Votre identifiant" 
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
              <input 
                type="email" 
                placeholder="vous@exemple.fr" 
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none"
              />
            </div>
          )}

          {/* Mot de passe pour les deux vues */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              {isLoginView && (
                <a href="#" className="text-xs text-indigo-600 hover:underline">Mot de passe oublié ?</a>
              )}
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              required
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
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-indigo-600 font-semibold ml-1.5 hover:underline focus:outline-none"
          >
            {isLoginView ? "S'inscrire" : "Se connecter"}
          </button>
        </div>

      </div>
    </div>
  );
}