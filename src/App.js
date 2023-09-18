import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Fornecedores from './pages/Fornecedores';
import EnderecosFornecedor from './components/EnderecosFornecedor';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Fornecedores />} />
        <Route path='/enderecos' element={<EnderecosFornecedor />} />
      </Routes>
    </Router>
  );
}
