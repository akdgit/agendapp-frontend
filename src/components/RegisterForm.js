import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/Register.css";
import Swal from 'sweetalert2';
function RegisterForm() {
  const [name, setName] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          fullname,
          email,
          password
        })
      });

      if (response.status === 400) {
        setError('The email address already exists. Please enter another email address or try reactivating your account from the login screen.');
        setIsSubmitting(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        setIsSubmitting(false);
        return;
      }

      // Si el registro es exitoso, redirigir a la página del diario
      
      Swal.fire("Bienvenido", "Ingresa tus credenciales para iniciar sesiòn", "success");
      navigate('/diary');
    } catch (error) {
      setError('Error during registration: ' + error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div tabIndex="0" aria-labelledby='register-title' className="register-content">
        <h2 id='register-title'>Registro de usuario</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleRegister}>
          <div className="input-container">
            <input
              tabIndex="0"
              aria-label='Nombre'
              className='input-field'
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className='input-label' >Nombre</label>
          </div>
          <div className="input-container">
            <input
              tabIndex="0"
              aria-label='Apellido'
              className='input-field'
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
            />
            <label className='input-label' >Apellido</label>
          </div>
          <div className="input-container">
            <input
              tabIndex="0"
              aria-label='Correo Electrónico'
              className='input-field'
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className='input-label' >Correo</label>
          </div>
          <div className="input-container">
            <input
              tabIndex="0"
              aria-label='Contraseña'
              className='input-field'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label className='input-label' >Clave</label>
          </div>
          
          <button type="submit" disabled={!name || !fullname || !email || !password || isSubmitting}>
            Registrarse
          </button>
          <button
            onClick={() => navigate("/")}
            className='cancel-button'
            type='button'
          >
             Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
