import React, { useState } from "react";
import Swal from "sweetalert2";
import RecuperarContraseña from "./FormRecoveryPassword"; // Asegúrate de tener este componente
import "./styles/FormSendEmail.css";

function FormSendEmail({ onClose }) {
    const [email, setEmail] = useState("");
    const [showRecuperarContraseña, setShowRecuperarContraseña] = useState(false);
    const [recoveryCode, setRecoveryCode] = useState("");
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";
    
    const handleSendEmail = async () => {
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
                        setRecoveryCode(sendCodeData.code); // Suponiendo que el código se devuelve en la respuesta
                        setShowRecuperarContraseña(true);
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

    return (
        <div className="send">
            {!showRecuperarContraseña ? (
                <form className="formsend" onSubmit={(e) => { e.preventDefault(); handleSendEmail(); }}>
                    <h1>Enviar correo</h1>
                    <p>Se enviarà un còdigo de recuperaciòn a tu bandeja de entrada.</p>
                    <input
                        type="email"
                        placeholder="Ingresa tu correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit">Enviar</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </form>
            ) : (
                <RecuperarContraseña email={email} recoveryCode={recoveryCode} onClose={onClose} />
            )}
        </div>
    );
}

export default FormSendEmail;
