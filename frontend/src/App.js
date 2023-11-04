import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Navbar from "./components/Navbar";

import Hone from "./pages/Home";

import './styles.css';

function App() {
  return (
      <div>
          <Navbar />
          <Router>
              <Routes>
                  <Route path="/" element={<Hone />} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
