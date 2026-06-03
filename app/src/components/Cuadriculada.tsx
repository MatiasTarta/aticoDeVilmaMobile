import { useCallback, useEffect, useRef, useState } from 'react'
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


const CATEGORIA_COLOR: Record<string, string> = {
  teclado: '#4ecdc4',
  percusion: '#f9a825',
  cuerda: '#ef5350',
  viento: '#ab47bc',
  electronico: '#42a5f5',
}

interface Props { onNavigate: (s: Screen, id?: number) => void }

export default function Cuadriculada({ onNavigate }: Props) {
  const [instrumentos, setInstrumentos] = useState<Instrumento[]>([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const cargandoRef = useRef(false)
  const hayMasRef = useRef(true)
  const totalDataRef = useRef<number>(12)

  const cargarMas = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const res1 = await fetch(`/api/instrumentos?cantidad=1&from=0`)
      const data1: ApiResponse = await res1.json()
      const res2 = await fetch(`/api/instrumentos?cantidad=${data1.total}&from=0`)
      const data2: ApiResponse = await res2.json()
      setInstrumentos(data2.datos)
    } catch {
      setError('No se pudo conectar al servidor. ¿Está corriendo en localhost:3000?')
    } finally {
      setCargando(false)
    }
  }, [])

  // carga inicial
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const totalRes = await fetch(`/api/instrumentos?cantidad=1&from=0`)
        const totalData: ApiResponse = await totalRes.json()
        totalDataRef.current = totalData.cantidad
      } catch (error) {
        console.error('Error fetching total:', error)
      }
      cargarMas()
    }
    fetchTotal()
  }, [cargarMas])

  // IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hayMasRef.current && !cargandoRef.current) {
        cargarMas()
      }
    }, { threshold: 0.1 })

    if (sentinelRef.current) observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [cargarMas])

  return (
    <div className="cuad">
      <div className="cuad-header">
        <button className="cuad-back" onClick={() => onNavigate('home')}>← Inicio</button>
        <h2 className="cuad-titulo">Instrumentos</h2>
        <button className="cuad-crear-top" onClick={() => onNavigate('crear')}>＋</button>
      </div>



      <div className="cuad-body">
        {error && <div className="cuad-estado cuad-error">{error}</div>}
        {!error && instrumentos.length === 0 && !cargando && (
          <div className="cuad-estado">No hay instrumentos.</div>
        )}

        <div className="cuad-grid">
          {instrumentos.map(inst => (<div className="cuad-card" key={inst.id} onClick={() => onNavigate('vistaInstrumento' as Screen, inst.id)}>
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
        </div>
      </div>
    </div>
  )
}
