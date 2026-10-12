import React, { useState } from 'react';
import { Home, Folder, Search, LogOut } from 'lucide-react'; // Ajout de LogOut
import PageAccueil from './PageAccueil';
import PageMesProjets from './PageMesProjets';
import type { Projet } from './types';

// 1. On ajoute onLogout dans les props
interface DashboardLayoutProps {
  onOuvrirCanevas: () => void;
  onLogout: () => void;
}

export default function DashboardLayout({ onOuvrirCanevas, onLogout }: DashboardLayoutProps) {
  const [pageActive, setPageActive] = useState<'accueil' | 'projets'>('accueil');
  const [projets] = useState<Projet[]>([]); // Vos faux projets

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      
      {/* BARRE DE MENU (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">MonCanevas</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setPageActive('accueil')}
            className={`flex items-center w-full px-3 py-2 rounded-lg ${pageActive === 'accueil' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Home className="w-5 h-5 mr-3" /> Accueil
          </button>
          <button 
            onClick={() => setPageActive('projets')}
            className={`flex items-center w-full px-3 py-2 rounded-lg ${pageActive === 'projets' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-100 text-gray-700'}`}
          >
            <Folder className="w-5 h-5 mr-3" /> Mes projets
          </button>
        </nav>

        {/* 2. BOUTON DE DÉCONNEXION EN BAS */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* ZONE DE CONTENU DYNAMIQUE */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ... (Votre header et le rendu de vos pages restent identiques) */}
        <header className="h-16 flex items-center px-8 bg-white border-b border-gray-200 shrink-0">
           <span className="font-medium text-gray-600">
             {pageActive === 'accueil' ? 'Tableau de bord' : 'Gestion des projets'}
           </span>
        </header>

        <div className="flex-1 overflow-y-auto">
          {pageActive === 'accueil' ? (
            <PageAccueil onOuvrirCanevas={onOuvrirCanevas} />
          ) : (
            <PageMesProjets projets={projets} onOuvrirCanevas={onOuvrirCanevas} />
          )}
        </div>
      </main>
    </div>
  );
}