import './App.css';
import CustomHeader from './components/CustomHeader';
import SideBar from './components/SideBar/SideBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Register from './components/Register';


function App() {
  return (

    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
        <div className="App">
          <CustomHeader />
          <SideBar />
        </div>} />
      </Routes>
    </Router>
  );
}

export default App;
