import React, { useState } from 'react';
import './App.css';
import Formlogin from './components/Formlogin';
import { Route, Routes } from "react-router-dom";
import Diary from "./pages/Diary";
import LoginForm from "./components/Formlogin";
import RegisterForm from './components/RegisterForm';
import CustomCarousel from './components/Carousel';
import logo from "../src/pages/images/portada1";

function App() {

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content">
              <div className='logotipo'>
                <h1 className='lema'>¡...Y no te olvides de nada!</h1>
                <img
                  src= { logo }
                  className='pag-logo'
                  alt='Logotpo agendapp'
                />
              </div>
              <div className='login'>
                <Formlogin  
                  message="Ingresa tus credenciales de acceso"
                  email="Correo:"
                  pass="Clave:"
                  login="Ingresar"
                  messageReg="¿No tienes cuenta?"
                  register="Registrarse" 
                />
              </div>
              <div className='sect-carousel'>
                <CustomCarousel/>
              </div>
            </div>
          }
        />
        <Route path='/diary' element={<Diary />} />
        <Route path= "/login" Component={LoginForm} />
        <Route path= "/register" element={<RegisterForm />} />
      </Routes>
    </div>
  );
}

export default App;
