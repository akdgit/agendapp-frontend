import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./styles/FormRecoveryPassword.css";
import { useNavigate } from "react-router-dom";

function RecuperarContraseña({ email, onClose, recoveryCode }) {
    const [enteredCode, setEnteredCode] = useState("");
    const [isCodeCorrect, setIsCodeCorrect] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [resendCode, setResendCode] = useState("");
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";

    const handleResendCode = async () => {
        try {
            // Verificar si el correo existe en la base de datos
            const response = await fetch(`${BASE_URL}/api/users/check-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                if (data.exists) {
                    // Si el correo existe, enviar el código de recuperación
                    const sendCodeResponse = await fetch(`${BASE_URL}/api/users/send-recovery-code`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                    });

                    const sendCodeData = await sendCodeResponse.json();
                    if (sendCodeResponse.ok) {
                        Swal.fire("Correo Enviado", "Revisa tu correo para el código de recuperación.", "success");
                        setResendCode(sendCodeData.code); // Suponiendo que el código se devuelve en la respuesta
                        //setShowRecuperarContraseña(true);
                    } else {
                        Swal.fire("Error", "No se pudo enviar el correo. Intenta nuevamente.", "error");
                    }
                } else {
                    Swal.fire("Error", "El correo no está registrado.", "error");
                }
            } else {
                Swal.fire("Error", "Error al verificar el correo.", "error");
            }
        } catch (error) {
            console.error("Error al verificar el correo:", error);
            Swal.fire("Error", "No se pudo verificar el correo. Intenta nuevamente.", "error");
        }
    };

    useEffect(() => {
        if (enteredCode.length === 4) {
            console.log("Código generado:", recoveryCode); // Imprime el código generado
            console.log("Código ingresado por el usuario:", enteredCode); // Imprime el código ingresado por el usuario
            console.log("El codigo reenviado es:", resendCode);
            if (enteredCode === recoveryCode || enteredCode === resendCode ) {
                setIsCodeCorrect(true);
                Swal.fire("Éxito", "Código correcto. Ahora puedes ingresar tu nueva contraseña.", "success");
            } else {
                setIsCodeCorrect(false);
                Swal.fire("Error", "Código incorrecto. Intenta de nuevo.", "error");
            }
        }
    }, [enteredCode, recoveryCode]);

    const handleCodeChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setEnteredCode(value);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
    
        // Validar que ambas contraseñas coincidan
        if (password !== confirmPassword) {
            Swal.fire("Error", "Las contraseñas no coinciden. Intenta nuevamente.", "error");
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/api/users/resetkey/${encodeURIComponent(email)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
    
            if (response.ok) {
                await Swal.fire("Éxito", "Tu contraseña ha sido actualizada. Ingresa tus credenciales para iniciar sesiòn.", "success");
                onClose(); // Redirige al login después de mostrar el mensaje
            } else {
                Swal.fire("Error", "No se pudo actualizar la contraseña. Intenta nuevamente.", "error");
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire("Error", "Error al conectar con el servidor. Intenta nuevamente.", "error");
        }
    };    

    /*const handlePasswordReset = async (e) => {
        e.preventDefault();

        // Validar que ambas contraseñas coincidan
        if (password !== confirmPassword) {
            Swal.fire("Error", "Las contraseñas no coinciden. Intenta nuevamente.", "error");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users/resetkey/${encodeURIComponent(email)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                navigate("/"); // Redirige al inicio de sesión
                await Swal.fire("Éxito", "Tu contraseña ha sido actualizada correctamente.", "success");
            } else {
                Swal.fire("Error", "No se pudo actualizar la contraseña. Intenta nuevamente.", "error");
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire("Error", "Error al conectar con el servidor. Intenta nuevamente.", "error");
        }
    };*/

    return (
        <div className="recovery">
            <form className="form-recovery" onSubmit={handlePasswordReset}>
                <h1>Recuperar Contraseña</h1>
                <p>Ingresa el código recibido</p>
                <input
                    type="number"
                    pattern="[0-9]{0,4}"
                    value={enteredCode}
                    onChange={handleCodeChange}
                    maxLength={4}
                    className="code"
                    disabled={isCodeCorrect} // Desactiva el input si el código es correcto
                />
                <p>¿No has recibido tu código? Inténtalo de nuevo.</p>
                <button type="button" 
                onClick={handleResendCode} 
                className="reenviar"
                disabled={isCodeCorrect} // Desactiva el botòn si el código es correcto
                > 
                    Reenviar código 
                </button>
                {isCodeCorrect && (
                    <>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva Contraseña"
                            className="pass"
                            required
                        />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmar Contraseña"
                            className="pass"
                            required
                        />
                        <button type="submit" >Cambiar Contraseña</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </>
                )}
            </form>
        </div>
    );
}

export default RecuperarContraseña;
