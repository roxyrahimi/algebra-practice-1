
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import PracticeApp from './pages/PracticeApp.jsx';
import Stats from './pages/Stats.jsx';


function HomeWithNav() {
  const nav = useNavigate();
  return <Home onStart={() => nav('/practice')} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeWithNav />} />
        <Route path="/practice/*" element={<PracticeApp />} />
<Route path="/stats" element={<Stats />} />
      </Routes>
    </BrowserRouter>
  );
}
