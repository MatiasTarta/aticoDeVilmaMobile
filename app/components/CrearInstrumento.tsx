import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function CrearInstrumento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    tipoSonido: '',
    escala: '',
    urlImagen: '',
    urlPagina: '',
    carpetaSonidos: '',
  });

  const [errors, setErrors] = useState({
    nombre: false,
    categoria: false,
    tipoSonido: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {
      nombre: !formData.nombre.trim(),
      categoria: !formData.categoria,
      tipoSonido: !formData.tipoSonido.trim(),
    };

    setErrors(newErrors);

    // If any errors, don't submit
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    // Here you would typically save the data
    console.log('Instrumento creado:', formData);
    
    // Navigate back to grid
    navigate('/instrumentos');
  };

  const handleCancel = () => {
    navigate('/instrumentos');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] px-4 py-8 max-w-[430px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 
          className="text-4xl text-[#4ecdc4] text-center mb-2"
          style={{ fontFamily: '"Mea Culpa", cursive' }}
        >
          Crear Instrumento
        </h1>
        <p className="text-gray-400 text-center text-sm">Añade un nuevo instrumento a la colección</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/[0.08] backdrop-blur-sm rounded-2xl p-6 space-y-5 border border-white/10">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre" className="text-white">
              Nombre <span className="text-red-400">*</span>
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className={`bg-white/5 border-white/20 text-white placeholder:text-gray-500 rounded-lg ${
                errors.nombre ? 'border-red-500' : ''
              }`}
              placeholder="Ej: Piano Clásico"
            />
            {errors.nombre && (
              <p className="text-red-400 text-xs">Este campo es obligatorio</p>
            )}
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="categoria" className="text-white">
              Categoría <span className="text-red-400">*</span>
            </Label>
            <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
              <SelectTrigger 
                id="categoria"
                className={`bg-white/5 border-white/20 text-white rounded-lg ${
                  errors.categoria ? 'border-red-500' : ''
                }`}
              >
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/20 text-white">
                <SelectItem value="teclado" className="focus:bg-white/10 focus:text-white">Teclado</SelectItem>
                <SelectItem value="percusión" className="focus:bg-white/10 focus:text-white">Percusión</SelectItem>
                <SelectItem value="cuerda" className="focus:bg-white/10 focus:text-white">Cuerda</SelectItem>
                <SelectItem value="viento" className="focus:bg-white/10 focus:text-white">Viento</SelectItem>
                <SelectItem value="electrónico" className="focus:bg-white/10 focus:text-white">Electrónico</SelectItem>
              </SelectContent>
            </Select>
            {errors.categoria && (
              <p className="text-red-400 text-xs">Este campo es obligatorio</p>
            )}
          </div>

          {/* Tipo de Sonido */}
          <div className="space-y-2">
            <Label htmlFor="tipoSonido" className="text-white">
              Tipo de Sonido <span className="text-red-400">*</span>
            </Label>
            <Input
              id="tipoSonido"
              value={formData.tipoSonido}
              onChange={(e) => setFormData({ ...formData, tipoSonido: e.target.value })}
              className={`bg-white/5 border-white/20 text-white placeholder:text-gray-500 rounded-lg ${
                errors.tipoSonido ? 'border-red-500' : ''
              }`}
              placeholder="Ej: Acústico armónico"
            />
            {errors.tipoSonido && (
              <p className="text-red-400 text-xs">Este campo es obligatorio</p>
            )}
          </div>

          {/* Escala */}
          <div className="space-y-2">
            <Label htmlFor="escala" className="text-white">
              Escala
            </Label>
            <Select value={formData.escala} onValueChange={(value) => setFormData({ ...formData, escala: value })}>
              <SelectTrigger id="escala" className="bg-white/5 border-white/20 text-white rounded-lg">
                <SelectValue placeholder="Selecciona una escala (opcional)" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/20 text-white">
                <SelectItem value="ninguna" className="focus:bg-white/10 focus:text-white">Ninguna</SelectItem>
                <SelectItem value="Do Mayor" className="focus:bg-white/10 focus:text-white">Do Mayor</SelectItem>
                <SelectItem value="Do Menor" className="focus:bg-white/10 focus:text-white">Do Menor</SelectItem>
                <SelectItem value="Re Mayor" className="focus:bg-white/10 focus:text-white">Re Mayor</SelectItem>
                <SelectItem value="Re Menor" className="focus:bg-white/10 focus:text-white">Re Menor</SelectItem>
                <SelectItem value="Mi Mayor" className="focus:bg-white/10 focus:text-white">Mi Mayor</SelectItem>
                <SelectItem value="Mi Menor" className="focus:bg-white/10 focus:text-white">Mi Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* URL Imagen */}
          <div className="space-y-2">
            <Label htmlFor="urlImagen" className="text-white">
              URL Imagen
            </Label>
            <Input
              id="urlImagen"
              value={formData.urlImagen}
              onChange={(e) => setFormData({ ...formData, urlImagen: e.target.value })}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 rounded-lg"
              placeholder="https://..."
            />
          </div>

          {/* URL Página */}
          <div className="space-y-2">
            <Label htmlFor="urlPagina" className="text-white">
              URL Página
            </Label>
            <Input
              id="urlPagina"
              value={formData.urlPagina}
              onChange={(e) => setFormData({ ...formData, urlPagina: e.target.value })}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 rounded-lg"
              placeholder="https://..."
            />
          </div>

          {/* Carpeta Sonidos */}
          <div className="space-y-2">
            <Label htmlFor="carpetaSonidos" className="text-white">
              Carpeta Sonidos
            </Label>
            <Input
              id="carpetaSonidos"
              value={formData.carpetaSonidos}
              onChange={(e) => setFormData({ ...formData, carpetaSonidos: e.target.value })}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 rounded-lg"
              placeholder="/sounds/..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-xl py-6"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-[#51cf66] hover:bg-[#42b654] text-white rounded-xl py-6 shadow-lg"
          >
            Crear
          </Button>
        </div>
      </form>
    </div>
  );
}
