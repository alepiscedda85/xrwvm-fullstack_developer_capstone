import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

import Dealers from "./components/Dealers/Dealers";
import Dealer from "./components/Dealers/Dealer";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dealers />} />
      <Route path="/dealers" element={<Dealers />} />
      <Route path="/dealer/:id" element={<Dealer />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;