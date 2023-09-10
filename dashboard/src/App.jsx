import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Students from "./components/Students";
import Vans from "./components/Vans";
import Employees from "./components/Employees";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/students" element={<Students />} />
            <Route path="/vans" element={<Vans />} />
            <Route path="/employees" element={<Employees />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
