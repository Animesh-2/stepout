import logo from "./logo.svg";
import "./App.css";
import { AuthProtect } from "./AuthProtect";
import Login from "./components/Login";
import Main from "./components/main";
import Signup from "./components/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthProtect element={<Login />} />} />

        <Route path="/signup" element={<AuthProtect element={<Signup />} />} />

        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
