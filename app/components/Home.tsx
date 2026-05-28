import { useNavigate } from 'react-router';
import { Button } from './ui/button';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-[430px] w-full">
        <h1 
          className="text-5xl md:text-6xl text-[#4ecdc4] mb-4"
          style={{ fontFamily: '"Mea Culpa", cursive' }}
        >
          Bienvenidos al Ático de Vilma
        </h1>
        
        <Button
          onClick={() => navigate('/instrumentos')}
          className="bg-[#4ecdc4] hover:bg-[#3db8b0] text-[#0d0d0d] px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          Ver Instrumentos
        </Button>
      </div>
    </div>
  );
}
