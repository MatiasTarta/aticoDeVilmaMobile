import { Screen } from '../App'
import './Home.css'

interface Props { onNavigate: (s: Screen) => void }

export default function Home({ onNavigate }: Props) {
  return (
    <div className="home">
      <div className="home-noise" />
      <div className="home-glow" />

      <div className="home-content">
        <div className="home-eyebrow">✦ colección de instrumentos ✦</div>
        <h1 className="home-title">El Ático<br />de Vilma</h1>
        <p className="home-sub">
          Un lugar donde cada instrumento<br />guarda su propia historia
        </p>
        <button className="home-btn" onClick={() => onNavigate('cuadriculada')}>
          Ver Instrumentos
          <span className="home-btn-arrow">→</span>
        </button>
      </div>

      <div className="home-footer">Est. 2025 · Laboratorio de Interfaces</div>
    </div>
  )
}
