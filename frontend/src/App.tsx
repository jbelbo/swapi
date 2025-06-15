import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Search from './components/search/Search';
import PersonDetails from './components/details/PersonDetails';
import MovieDetails from './components/details/MovieDetails';
import './styles/variables/variables.css';
import './App.css';

function App() {
  return (
    <Router>
    <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route path="/details/people/:id" element={<PersonDetails />} />
            <Route path="/details/films/:id" element={<MovieDetails />} />
          </Routes>
        </main>
    </div>
    </Router>
  );
}

export default App;
