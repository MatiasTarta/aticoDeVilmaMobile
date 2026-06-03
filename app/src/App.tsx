import { useState } from 'react'
import CrearInstrumento from './components/CrearInstrumento'
import Cuadriculada from './components/Cuadriculada'
import Home from './components/Home'
import VistaInstrumento from './components/VistaInstrumento'
import './styles/global.css'

export type Screen = 'home' | 'cuadriculada' | 'crear' | 'vistaInstrumento'

interface AppState {
  screen: Screen
  instrumentoId?: number
}

export default function App() {
  const [state, setState] = useState<AppState>({ screen: 'home' })

  const navegar = (screen: Screen, instrumentoId?: number) => {
    setState({ screen, instrumentoId })
  }

  return (
    <div className="app-shell">
      {state.screen === 'home' && <Home onNavigate={navegar} />}
      {state.screen === 'cuadriculada' && <Cuadriculada onNavigate={navegar} />}
      {state.screen === 'crear' && <CrearInstrumento onNavigate={navegar} />}
      {state.screen === 'vistaInstrumento' && (
        <VistaInstrumento id={state.instrumentoId!} onNavigate={navegar} />
      )}
    </div>
  )
}
