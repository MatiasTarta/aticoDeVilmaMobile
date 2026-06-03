import { useEffect, useState } from 'react'
import { Screen } from '../App'
import './VistaInstrumento.css'

interface Instrumento {
  id: number
  nombre: string
  tipoSonido: string
  escala: string
  categoria: string
  imagen: string
  link: string
  carpetaSonidos: string
}

const CATEGORIA_COLOR: Record<string, string> = {
  teclado: '#4ecdc4',
  percusion: '#f9a825',
  cuerda: '#ef5350',
  viento: '#ab47bc',
  electronico: '#42a5f5',
}

const descripcionAuto = (inst: Instrumento) =>
  `${inst.nombre} es un instrumento de tipo ${inst.tipoSonido} perteneciente a la categoría ${inst.categoria}. ` +
  `${inst.escala !== 'ninguna' ? `Su escala base es ${inst.escala}.` : 'No tiene una escala fija asignada.'} ` +
  `Forma parte de la colección del Ático de Vilma.`

interface Props {
  id: number
  onNavigate: (s: Screen, id?: number) => void
}

export default function VistaInstrumento({ id, onNavigate }: Props) {
  const [inst, setInst] = useState<Instrumento | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      try {
        const res = await fetch(`/api/instrumentos/${id}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setInst(await res.json())
      } catch {
        setError('No se pudo cargar el instrumento.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  return (
    <div className="vista">
      <div className="vista-header">
        <button className="vista-back" onClick={() => onNavigate('cuadriculada')}>← Volver</button>
        <span className="vista-header-title">Instrumento</span>
      </div>

      {cargando && <div className="vista-estado">Cargando...</div>}
      {error && <div className="vista-estado vista-error">{error}</div>}

      {inst && (
        <div className="vista-body">
          {/* Imagen */}
          <div className="vista-img-wrap">
            <img
              src={inst.imagen}
              alt={inst.nombre}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/1a1a1a/4ecdc4?text=♪'
              }}
            />
          </div>

          {/* Info */}
          <div className="vista-info">
            <span
              className="vista-categoria"
              style={{ '--tag-color': CATEGORIA_COLOR[inst.categoria] ?? '#888' } as React.CSSProperties}
            >
              {inst.categoria}
            </span>
            <h1 className="vista-nombre">{inst.nombre}</h1>

            <p className="vista-descripcion">{descripcionAuto(inst)}</p>

            <div className="vista-detalles">
              <div className="vista-detalle-item">
                <span className="vista-detalle-label">Tipo de sonido</span>
                <span className="vista-detalle-valor">{inst.tipoSonido}</span>
              </div>
              <div className="vista-detalle-item">
                <span className="vista-detalle-label">Escala</span>
                <span className="vista-detalle-valor">{inst.escala}</span>
              </div>
              {inst.carpetaSonidos && (
                <div className="vista-detalle-item">
                  <span className="vista-detalle-label">Sonidos</span>
                  <span className="vista-detalle-valor">{inst.carpetaSonidos}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
