import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Inicial from './pages/Inicial'
import Alunos from './pages/Alunos'
import Professores from './pages/Professores'
import Disciplinas from './pages/Disciplinas'
import Matricula from './pages/Matricula';
import Navbar from './components/Navbar'

function App() {

  return (
    <>
      <BrowserRouter>
        <div className="logo">
          <img src='./livros.png' />
          <h1>Aluno Online</h1>
        </div>

        <Navbar />
        <Routes>
          <Route path='/' element={<Inicial />} />
          <Route path='/alunos' element={<Alunos />} />
          <Route path='/professores' element={<Professores />} />
          <Route path='/disciplinas' element={<Disciplinas />} />
          <Route path='/matricula-aluno/:idAluno' element={<Matricula modalOpen={true} />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

