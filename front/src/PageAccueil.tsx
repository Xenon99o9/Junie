import { Plus } from 'lucide-react';

interface PageAccueilProps {
  onOuvrirCanevas: () => void;
}

export default function PageAccueil({ onOuvrirCanevas }: PageAccueilProps) {
  return (
    <div className="p-8">
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-10 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Que voulez-vous créer aujourd'hui ?</h2>
        <button 
          onClick={onOuvrirCanevas}
          className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold mt-6"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nouveau projet personnalisé
        </button>
      </section>
     
    </div>
  );
}