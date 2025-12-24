import { Link } from 'react-router-dom';

const PersonajeCard = ({ id, nombreCompleto, titulo, fotoUrl }) => {
  return (
    // CAMBIO: bg-wiki-block (gris oscuro) y border-wiki-border
    <div className="bg-wiki-block border border-wiki-border rounded-lg overflow-hidden hover:border-wiki-accent transition-all duration-300 group">
      
      {/* FOTO: La mantenemos igual */}
      <div className="h-48 w-full relative overflow-hidden">
        <img 
          src={fotoUrl} 
          alt={nombreCompleto} 
          className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0" 
        />
        {/* Gradiente para que el texto se lea si ponemos algo encima */}
        <div className="absolute inset-0 bg-gradient-to-t from-wiki-block to-transparent opacity-60"></div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-100 leading-tight mb-1 group-hover:text-wiki-accent transition-colors">
          {nombreCompleto}
        </h3>
        <p className="text-xs text-wiki-muted uppercase tracking-wide mb-4 border-l-2 border-wiki-accent pl-2">
          {titulo}
        </p>
        
        <Link 
          to={`/personaje/${id}`} 
          className="inline-block text-xs font-bold text-wiki-text bg-wiki-border px-3 py-1 rounded hover:bg-wiki-accent hover:text-white transition-colors"
        >
          ACCEDER DATOS →
        </Link>
      </div>
    </div>
  );
};

export default PersonajeCard;