import { useState } from 'react'
import { Screen } from '../App'
import './CrearInstrumento.css'

interface Props { onNavigate: (s: Screen) => void }

const CATEGORIAS = ['teclado', 'percusion', 'cuerda', 'viento', 'electronico']
const ESCALAS    = ['ninguna','DOr','DOm','RE','REm','MI','FA','SOL','LAm']

export default function CrearInstrumento({ onNavigate }: Props) {
  const [form, setForm] = useState({
    nombre: '', tipoSonido: '', categoria: '', escala: 'ninguna',
    imagen: '', link: '', carpetaSonidos: ''
  })
  const [enviando, setEnviando] = useState(false)
  const [msg, setMsg]           = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.nombre.trim() || !form.tipoSonido.trim() || !form.categoria) {
      setMsg({ tipo: 'error', texto: 'Nombre, tipo de sonido y categoría son obligatorios.' })
      return
    }
    setEnviando(true)
    setMsg(null)
    try {
      const res = await fetch('/api/instrumentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detalles?.join(', ') ?? data.error)
      setMsg({ tipo: 'ok', texto: `✓ "${data.nombre}" creado con ID ${data.id}` })
      setForm({ nombre: '', tipoSonido: '', categoria: '', escala: 'ninguna', imagen: '', link: '', carpetaSonidos: '' })
    } catch (e: any) {
      setMsg({ tipo: 'error', texto: e.message ?? 'Error al crear instrumento.' })
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="crear">
      <div className="crear-header">
        <button className="crear-back" onClick={() => onNavigate('cuadriculada')}>← Volver</button>
        <h2 className="crear-titulo">Nuevo Instrumento</h2>
      </div>

      <div className="crear-body">
        <Field label="Nombre *">
          <input value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="ej. Guitarra Española" />
        </Field>

        <Field label="Categoría *">
          <select value={form.categoria} onChange={e => set('categoria', e.target.value)}>
            <option value="">Seleccionar...</option>
            {CATEGORIAS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
        </Field>

        <Field label="Tipo de Sonido *">
          <input value={form.tipoSonido} onChange={e => set('tipoSonido', e.target.value)} placeholder="ej. acustico, rock, jazz" />
        </Field>

        <Field label="Escala">
          <select value={form.escala} onChange={e => set('escala', e.target.value)}>
            {ESCALAS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>

        <Field label="URL Imagen" hint="Ruta a la imagen del instrumento">
          <input value={form.imagen} onChange={e => set('imagen', e.target.value)} placeholder="../assets/img/miinstrumento.png" />
        </Field>

        <Field label="Página del instrumento" hint="Vista individual, dejar vacío si está en desarrollo">
          <input value={form.link} onChange={e => set('link', e.target.value)} placeholder="./individualMiInstrumento.html" />
        </Field>

        <Field label="Carpeta de sonidos" hint="Ruta donde están los archivos de audio">
          <input value={form.carpetaSonidos} onChange={e => set('carpetaSonidos', e.target.value)} placeholder="../assets/sonidos/miinstrumento/" />
        </Field>

        {msg && (
          <div className={`crear-msg ${msg.tipo}`}>{msg.texto}</div>
        )}

        <div className="crear-btns">
          <button className="btn-cancelar" onClick={() => onNavigate('cuadriculada')}>Cancelar</button>
          <button className="btn-crear" onClick={handleSubmit} disabled={enviando}>
            {enviando ? 'Creando...' : '✓ Crear'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="crear-field">
      <label>{label}</label>
      {children}
      {hint && <small>{hint}</small>}
    </div>
  )
}
