import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockInstruments, Instrument } from '../data/mockInstruments';
import { Plus } from 'lucide-react';

export function Cuadriculada() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Pagination logic
  const totalItems = mockInstruments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentInstruments = mockInstruments.slice(startIndex, endIndex);

  const handleFirst = () => setCurrentPage(1);
  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handleLast = () => setCurrentPage(totalPages);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const getCategoryColor = (categoria: Instrument['categoria']) => {
    const colors = {
      teclado: 'bg-purple-500/30 text-purple-200 border-purple-400/50',
      percusión: 'bg-red-500/30 text-red-200 border-red-400/50',
      cuerda: 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50',
      viento: 'bg-blue-500/30 text-blue-200 border-blue-400/50',
      electrónico: 'bg-green-500/30 text-green-200 border-green-400/50',
    };
    return colors[categoria];
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-4 py-8 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl text-[#4ecdc4] text-center mb-2"
          style={{ fontFamily: '"Mea Culpa", cursive' }}
        >
          El Ático de Vilma
        </h1>
        <p className="text-gray-400 text-center text-sm">Colección de instrumentos vintage</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {currentInstruments.map((instrument) => (
          <div
            key={instrument.id}
            className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/10 hover:border-[#4ecdc4]/50 transition-all"
          >
            <img
              src={instrument.urlImagen}
              alt={instrument.nombre}
              className="w-full h-32 object-cover rounded-xl mb-3"
            />
            <h3 className="text-white text-sm font-medium mb-2 line-clamp-1">
              {instrument.nombre}
            </h3>
            <Badge
              className={`${getCategoryColor(instrument.categoria)} text-xs mb-2 rounded-full border`}
            >
              {instrument.categoria}
            </Badge>
            <p className="text-gray-400 text-xs line-clamp-2">
              {instrument.tipoSonido}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-4 space-y-4 border border-white/10">
        {/* Info Text */}
        <p className="text-gray-400 text-sm text-center">
          Mostrando {startIndex + 1}-{endIndex} de {totalItems}
        </p>

        {/* Navigation Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFirst}
            disabled={currentPage === 1}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30 rounded-lg"
          >
            Primera
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30 rounded-lg"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30 rounded-lg"
          >
            Siguiente
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLast}
            disabled={currentPage === totalPages}
            className="bg-white/5 border-white/20 text-white hover:bg-white/10 disabled:opacity-30 rounded-lg"
          >
            Última
          </Button>
        </div>

        {/* Items Per Page Selector */}
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-400 text-sm">Items por página:</span>
          <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
            <SelectTrigger className="w-20 bg-white/5 border-white/20 text-white rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-white/20 text-white">
              <SelectItem value="4" className="focus:bg-white/10 focus:text-white">4</SelectItem>
              <SelectItem value="6" className="focus:bg-white/10 focus:text-white">6</SelectItem>
              <SelectItem value="8" className="focus:bg-white/10 focus:text-white">8</SelectItem>
              <SelectItem value="12" className="focus:bg-white/10 focus:text-white">12</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Floating Create Button */}
      <Button
        onClick={() => navigate('/crear')}
        className="fixed bottom-6 right-6 bg-[#51cf66] hover:bg-[#42b654] text-white rounded-full w-14 h-14 shadow-2xl flex items-center justify-center"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}
