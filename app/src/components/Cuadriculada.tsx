import { useEffect, useState } from 'react'
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

const POR_PAGINA_OPCIONES = [4, 6, 8, 12]

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
  const [pagina, setPagina]             = useState(0)
  const [porPagina, setPorPagina]       = useState(6)
  const [cargando, setCargando]         = useState(true)
  const [error, setError]               = useState('')

  const totalPaginas = Math.ceil(total / porPagina)

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      setError('')
      try {
        const from = pagina * porPagina
        const res = await fetch(`/api/instrumentos?cantidad=${porPagina}&from=${from}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ApiResponse = await res.json()
        setInstrumentos(data.datos)
        setTotal(data.total)
      } catch (e) {
        setError('No se pudo conectar al servidor. ¿Está corriendo en localhost:3000?')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [pagina, porPagina])

  const inicio = pagina * porPagina + 1
  const fin    = Math.min((pagina + 1) * porPagina, total)

  return (
    <div className="cuad">
      {/* Header */}
      <div className="cuad-header">
        <button className="cuad-back" onClick={() => onNavigate('home')}>← Inicio</button>
        <h2 className="cuad-titulo">Instrumentos</h2>
        <button className="cuad-crear-top" onClick={() => onNavigate('crear')}>＋</button>
      </div>

      {/* Grid */}
      <div className="cuad-body">
        {cargando && (
          <div className="cuad-estado">Cargando...</div>
        )}
        {error && (
          <div className="cuad-estado cuad-error">{error}</div>
        )}
        {!cargando && !error && instrumentos.length === 0 && (
          <div className="cuad-estado">No hay instrumentos.</div>
        )}
        {!cargando && !error && (
          <div className="cuad-grid">
            {instrumentos.map(inst => (
              <div className="cuad-card" key={inst.id}>
                <div className="cuad-card-img-wrap">
                  <img
                    src={inst.imagen}
                    alt={inst.nombre}
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/1a1a1a/4ecdc4?text=♪' }}
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
        )}
      </div>

      {/* Paginación */}
      {!cargando && !error && total > 0 && (
        <div className="cuad-pag">
          <div className="cuad-pag-info">
            {inicio}–{fin} de {total} · pág {pagina + 1}/{totalPaginas}
          </div>
          <div className="cuad-pag-controls">
            <button onClick={() => setPagina(0)}             disabled={pagina === 0}>«</button>
            <button onClick={() => setPagina(p => p - 1)}    disabled={pagina === 0}>‹</button>
            <button onClick={() => setPagina(p => p + 1)}    disabled={pagina >= totalPaginas - 1}>›</button>
            <button onClick={() => setPagina(totalPaginas - 1)} disabled={pagina >= totalPaginas - 1}>»</button>
          </div>
          <div className="cuad-pag-select">
            <label>Por página</label>
            <select value={porPagina} onChange={e => { setPorPagina(Number(e.target.value)); setPagina(0) }}>
              {POR_PAGINA_OPCIONES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
