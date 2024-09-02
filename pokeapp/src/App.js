import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Home from "./components/Home";
import FoodManagement from "./components/FoodManagement";
function App() {
  return (
  // <>
  //   <BrowserRouter>
  //     <Header />
  //     <Footer />
    
  //   </BrowserRouter>
  // </>
  <FoodManagement/>
  )
}

export default App;
