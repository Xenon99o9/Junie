import { Plus, Edit2, Play, Trash2 } from 'lucide-react';
import type { Projet } from './types';

interface PageMesProjetsProps {
  projets: Projet[];
  onOuvrirCanevas: () => void;
}

export default function PageMesProjets({ projets, onOuvrirCanevas }: PageMesProjetsProps) {
  
  // Fonctions pour gérer les actions (à connecter plus tard à votre base de données/état)
  const handleSupprimer = (id: string) => console.log("Supprimer", id);
  const handleRenommer = (id: string) => console.log("Renommer", id);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Tous mes projets</h2>
        <button 
          onClick={onOuvrirCanevas}
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {projets.map((projet) => (
          <div key={projet.id} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all flex flex-col">
            <div className={`h-40 ${projet.couleur} relative flex items-center justify-center`}>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={onOuvrirCanevas} className="p-2 bg-white rounded-full hover:bg-gray-100 shadow-lg text-gray-800">
                  <Play className="w-5 h-5 ml-1" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{projet.titre}</h4>
                <p className="text-xs text-gray-500 mt-1">{projet.dateModification}</p>
              </div>
              
              {/* CRUD */}
              <div className="flex gap-2">
                <button onClick={() => handleRenommer(projet.id)} className="text-gray-400 hover:text-indigo-600 p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleSupprimer(projet.id)} className="text-gray-400 hover:text-red-600 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}