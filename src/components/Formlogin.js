import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import FormSendEmail from "./FormSendEmail";

function Formlogin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [showFormSendEmail, setShowFormSendEmail] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";
  
   const handleCheckActiveStatus = async () => {
    if (!email) {
      console.log("No email provided");  // Debugging
      return;
    }

    try {
      console.log("Checking active status for email:", email);  // Debugging
      const response = await fetch(`${BASE_URL}/api/users/check-active`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // Enviando correctamente el email
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(data.message);
        return;
      }

      if (!data.active) {
        const result = await Swal.fire({
          title: "Su cuenta está desactivada",
          text: "¿Desea activarla nuevamente?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí",
          cancelButtonText: "No",
        });

        if (result.isConfirmed) {
          console.log("Activating account for email:", email);  // Debugging
          
          // **Solución: Asegurarte que el email esté correctamente codificado**
          const encodedEmail = encodeURIComponent(email);
          const activateResponse = await fetch(`${BASE_URL}/api/users/activate/${encodedEmail}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          });

          const activateData = await activateResponse.json();
          if (activateResponse.ok) {
            Swal.fire("Cuenta activada", "Su cuenta ha sido reactivada. Para acceder, ingrese sus credenciales", "success");
          } else {
            Swal.fire("Error", "Error al activar la cuenta.", "error");
          }
        }
      }
    } catch (error) {
      console.error("Error al verificar el estado de la cuenta:", error);
      Swal.fire("Error", "Error al verificar el estado de la cuenta.", "error");
    }
  };

  const handleShowFormSendEmail = () => {
    setShowFormSendEmail(true);
  };

  const handleCloseFormSendEmail = () => {
    setShowFormSendEmail(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${BASE_URL}/api/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Guardar el token en localStorage o context
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id); 
            localStorage.setItem("username", data.user.name);
            // Redirigir a la nueva página
            navigate("/diary");
        } else {
            if (response.status === 403) {
                const result = await Swal.fire({
                    title: "Su cuenta está desactivada",
                    text: "¿Desea activarla nuevamente?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Sí",
                    cancelButtonText: "No",
                });

                if (result.isConfirmed) {
                    console.log("Activating account for email:", email);  // Debugging

                    const encodedEmail = encodeURIComponent(email);
                    const activateResponse = await fetch(`${BASE_URL}/api/users/activate/${encodedEmail}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (activateResponse.ok) {
                        Swal.fire("Cuenta activada", "Su cuenta ha sido reactivada. Para acceder, ingrese sus credenciales", "success");
                    } else {
                        Swal.fire("Error", "Error al activar la cuenta.", "error");
                    }
                }
            } else {
                Swal.fire("Error", data.message, "error");
            }
        }
    } catch (error) {
        console.error("Error durante el login:", error);
        Swal.fire("Error", "Ocurrió un error. Por favor intente de nuevo más tarde.", "error");
    }
};

  /*const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("${BASE_URL}/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Guardar el token en localStorage o context
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id); 
            localStorage.setItem("username", data.user.name);
            // Redirigir a la nueva página
            navigate("/diary");
        } else {
            // Manejar error cuando la cuenta está desactivada
            if (response.status === 403) {
                Swal.fire("Cuenta desactivada", data.message, "warning");
            } else {
                Swal.fire("Error", data.message, "error");
            }
        }
    } catch (error) {
        console.error("Error during login:", error);
        Swal.fire("Error", "Ocurrió un error. Por favor intente de nuevo más tarde.", "error");
    }
};*/


  /*const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("${BASE_URL}/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Guardar el token en localStorage o context
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id); 
        localStorage.setItem("username", data.user.name);
        // Redirigir a la nueva página
        navigate("/diary");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };*/

  return (
    <div className="content-login">
      {showFormSendEmail ? (
        <FormSendEmail onClose={handleCloseFormSendEmail} />
      ): (
        <form className="form-login" onSubmit={handleLogin}>
          <h1 className="title"> Comienza a planificar tu día </h1>
          <p>{props.message}</p>
          <div className="input-container">
            <input 
              className="input-field" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleCheckActiveStatus} 
              required
            />
            <label className="input-label">Email de usuario</label>
          </div>
          
          <div className="input-container">
            <input 
              className="input-field" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <label className="input-label">Contraseña</label>
          </div>

          <button className="login-button" type="submit">{props.login}</button>
          <span
            onClick={handleShowFormSendEmail}
            type="button"
          >
            ¿Olvidaste tu contraseña?
          </span>
          <p className="regmes">
            {props.messageReg}
            <button 
              className="register-button" 
              type="button" 
              onClick={() => navigate("/register")}
            >
              {props.register}
            </button>
          </p>
      </form>
      )}
    </div>
  )
};

export default Formlogin;
