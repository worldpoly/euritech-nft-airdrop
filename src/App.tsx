import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Room } from "./pages/room";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="room" element={<Room />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
