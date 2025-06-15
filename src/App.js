import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './Components/Landing/Landing';
import Login from './Components/Login/Login';
import Signup from './Components/Signin/Signin';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
