import { useState } from 'react'
import Home from './components/Home'
import Cuadriculada from './components/Cuadriculada'
import CrearInstrumento from './components/CrearInstrumento'
import './styles/global.css'

export type Screen = 'home' | 'cuadriculada' | 'crear'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <div className="app-shell">
      {screen === 'home' && <Home onNavigate={setScreen} />}
      {screen === 'cuadriculada' && <Cuadriculada onNavigate={setScreen} />}
      {screen === 'crear' && <CrearInstrumento onNavigate={setScreen} />}
    </div>
  )
}
