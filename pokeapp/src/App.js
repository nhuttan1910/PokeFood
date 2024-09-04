import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./components/Home";
import Menu from "./components/Menu";

function App() {
  return (
  <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  </>
  )
}

export default App;
