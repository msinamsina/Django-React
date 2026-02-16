import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import VerificationPage from './pages/VerificationPage/VerificationPage';

import Footer from './components/Footer';
import Header from './components/Header';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Login" element={<LoginPage />} />
            <Route path="/Register" element={<RegisterPage />} />
            <Route path="/verifyEmail/:token" element={<VerificationPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
