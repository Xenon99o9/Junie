import { useState } from 'react';
import { Home, Folder, } from 'lucide-react';
import PageAccueil from './PageAccueil';
import PageMesProjets from './PageMesProjets';
import type { Projet } from './types';

interface DashboardLayoutProps {
  onOuvrirCanevas: () => void;
}

export default function DashboardLayout({ onOuvrirCanevas }: DashboardLayoutProps) {

  const [pageActive, setPageActive] = useState<'accueil' | 'projets'>('accueil');

  // fake project
  const [projets] = useState<Projet[]>([
    { id: '1', titre: 'Affiche', dateModification: 'Il y a 2h', couleur: 'bg-blue-200' },
    { id: '2', titre: 'Maquette', dateModification: 'Hier', couleur: 'bg-purple-200' },
  ]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">MonCanevas</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setPageActive('accueil')}
            className={`flex items-center w-full px-3 py-2 rounded-lg ${pageActive === 'accueil' ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
          >
            <Home className="w-5 h-5 mr-3" /> Accueil
          </button>
          <button 
            onClick={() => setPageActive('projets')}
            className={`flex items-center w-full px-3 py-2 rounded-lg ${pageActive === 'projets' ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
          >
            <Folder className="w-5 h-5 mr-3" /> Mes projets
          </button>
        </nav>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center px-8 bg-white border-b border-gray-200 shrink-0">
           {/* Barre de recherche, avatar, etc. */}
           <span className="font-medium text-gray-600">
             {pageActive === 'accueil' ? 'Tableau de bord' : 'Gestion des projets'}
           </span>
        </header>

        {/* Affichage de la page demandée  */}
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