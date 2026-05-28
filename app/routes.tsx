import { createBrowserRouter } from 'react-router';
import { Home } from './components/Home';
import { Cuadriculada } from './components/Cuadriculada';
import { CrearInstrumento } from './components/CrearInstrumento';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/instrumentos',
    Component: Cuadriculada,
  },
  {
    path: '/crear',
    Component: CrearInstrumento,
  },
]);
