import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Country from './pages/Country.jsx';
import City from './pages/City.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:code" element={<Country />} />
        <Route path="/city/:id" element={<City />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

