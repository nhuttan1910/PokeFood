import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./components/Home";

function App() {
  return (
  <>
    <BrowserRouter>
      <Header />
      <Footer />
    </BrowserRouter>
  </>
  )
}

export default App;
