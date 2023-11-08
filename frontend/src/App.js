import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Calendar from "./pages/Calendar";

import './styles.css';

function App() {
  return (
      <div>
          <Navbar />
          <Router>
              <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/my-calendar" element={<Calendar />} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
