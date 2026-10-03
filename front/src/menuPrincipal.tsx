import { useState } from 'react';
import { 
  Plus, 
  Home, 
  Folder, 
  Search, 
  LayoutTemplate, 
  MoreVertical, 
  Edit2, 
  Play 
} from 'lucide-react';

// Types pour nos projets
interface Projet {
  id: string;
  titre: string;
  dateModification: string;
  couleur: string;
}

export default function MenuPrincipal() {
  // Simuler des projets existants
  const [projets] = useState<Projet[]>([
    { id: '1', titre: 'Affiche Événement', dateModification: 'Modifié il y a 2h', couleur: 'bg-blue-200' },
    { id: '2', titre: 'Maquette Application', dateModification: 'Modifié hier', couleur: 'bg-purple-200' },
    { id: '3', titre: 'Présentation Client', dateModification: 'Modifié le 1 oct.', couleur: 'bg-emerald-200' },
    { id: '4', titre: 'Visuel Réseaux Sociaux', dateModification: 'Modifié le 28 sept.', couleur: 'bg-orange-200' },
  ]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* Barre latérale (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">MonCanevas</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 rounded-lg">
            <Home className="w-5 h-5 mr-3" />
            Accueil
          </button>
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Folder className="w-5 h-5 mr-3" />
            Mes projets
          </button>
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <LayoutTemplate className="w-5 h-5 mr-3" />
            Modèles
          </button>
        </nav>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* En-tête (Header) */}
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-gray-200">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher dans vos projets..." 
              className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm"
            />
          </div>
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold cursor-pointer shadow-sm">
            ML
          </div>
        </header>

        {/* Zone défilante */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* Bannière "Créer" */}
          <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-10 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Que voulez-vous créer aujourd'hui ?</h2>
            <p className="mb-6 opacity-90">Commencez de zéro ou choisissez un format pour démarrer.</p>
            
            <button className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
              <Plus className="w-5 h-5 mr-2" />
              Nouveau projet personnalisé
            </button>
          </section>

          {/* Grille des projets existants */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Designs récents</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {projets.map((projet) => (
                <div 
                  key={projet.id} 
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  {/* Miniature du projet */}
                  <div className={`h-40 ${projet.couleur} relative flex items-center justify-center`}>
                    {/* Bouton d'action rapide au survol (style Canva) */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-lg text-gray-800" title="Ouvrir">
                        <Play className="w-5 h-5 ml-1" />
                      </button>
                      <button className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-lg text-gray-800" title="Modifier">
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Informations du projet */}
                  <div className="p-4 flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 truncate" title={projet.titre}>
                        {projet.titre}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {projet.dateModification}
                      </p>
                    </div>
                    
                    {/* Menu contextuel (Options) */}
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}