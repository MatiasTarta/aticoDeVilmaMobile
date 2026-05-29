import { useEffect, useRef, useState, useCallback } from 'react'
import { Screen } from '../App'
import './Cuadriculada.css'

interface Instrumento {
  id: number
  nombre: string
  tipoSonido: string
  escala: string
  categoria: string
  imagen: string
  link: string
}

interface ApiResponse {
  total: number
  cantidad: number
  from: number
  datos: Instrumento[]
}

const POR_PAGINA = 6

const CATEGORIA_COLOR: Record<string, string> = {
  teclado:     '#4ecdc4',
  percusion:   '#f9a825',
  cuerda:      '#ef5350',
  viento:      '#ab47bc',
  electronico: '#42a5f5',
}

interface Props { onNavigate: (s: Screen) => void }

export default function Cuadriculada({ onNavigate }: Props) {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [total, setTotal]               = useState(0)
  const [cargando, setCargando]         = useState(false)
  const [error, setError]               = useState('')
  const [hayMas, setHayMas]             = useState(true)

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const cargandoRef = useRef(false)
  const fromRef     = useRef(0)
  const hayMasRef   = useRef(true)

  const cargarMas = useCallback(async (offset: number) => {
    if (cargandoRef.current) return
    cargandoRef.current = true
    setCargando(true)
    setError('')
    try {
      const res = await fetch(`/api/instrumentos?cantidad=${POR_PAGINA}&from=${offset}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: ApiResponse = await res.json()
      setInstrumentos(prev => offset === 0 ? data.datos : [...prev, ...data.datos])
      setTotal(data.total)
      const nuevoFrom = offset + data.datos.length
      fromRef.current = nuevoFrom
      const mas = nuevoFrom < data.total
      hayMasRef.current = mas
      setHayMas(mas)
    } catch {
      setError('No se pudo conectar al servidor. ¿Está corriendo en localhost:3000?')
    } finally {
      cargandoRef.current = false
      setCargando(false)
    }
  }, [])

  // carga inicial
  useEffect(() => { cargarMas(0) }, [])

  // IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hayMasRef.current && !cargandoRef.current) {
        cargarMas(fromRef.current)
      }
    }, { threshold: 0.1 })

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="cuad">
      <div className="cuad-header">
        <button className="cuad-back" onClick={() => onNavigate('home')}>← Inicio</button>
        <h2 className="cuad-titulo">Instrumentos</h2>
        <button className="cuad-crear-top" onClick={() => onNavigate('crear')}>＋</button>
      </div>

      {total > 0 && (
        <div className="cuad-counter">{instrumentos.length} de {total} instrumentos</div>
      )}

      <div className="cuad-body">
        {error && <div className="cuad-estado cuad-error">{error}</div>}
        {!error && instrumentos.length === 0 && !cargando && (
          <div className="cuad-estado">No hay instrumentos.</div>
        )}

        <div className="cuad-grid">
          {instrumentos.map(inst => (
            <div className="cuad-card" key={inst.id}>
              <div className="cuad-card-img-wrap">
                <img
                  src={inst.imagen}
                  alt={inst.nombre}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/1a1a1a/4ecdc4?text=♪'
                  }}
                />
              </div>
              <div className="cuad-card-info">
                <p className="cuad-card-nombre">{inst.nombre}</p>
                <div className="cuad-card-tags">
                  <span
                    className="cuad-tag"
                    style={{ '--tag-color': CATEGORIA_COLOR[inst.categoria] ?? '#888' } as React.CSSProperties}
                  >
                    {inst.categoria}
                  </span>
                  <span className="cuad-tag-tipo">{inst.tipoSonido}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div ref={sentinelRef} className="cuad-sentinel">
          {cargando && <div className="cuad-spinner">Cargando...</div>}
          {!hayMas && instrumentos.length > 0 && (
            <div className="cuad-fin">✦ fin de la colección ✦</div>
          )}
        </div>
      </div>
    </div>
  )
}
