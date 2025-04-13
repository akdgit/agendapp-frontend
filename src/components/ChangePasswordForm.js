import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/FormUpdateUser.css"; // Asegúrate de agregar los estilos aquí.
import Swal from "sweetalert2";
import { SiEditorconfig } from "react-icons/si";

function UpdateUserForm({ userId, onClose }) {
    const [password, setPassword] = useState(""); // Puede ser opcional
    const [confirmPassword, setConfirmPassword] = useState("");
    //const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [passwordError, setPasswordError] = useState("");
    const [blocked, setBlocked] = useState(false);
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";
    
    // **Obtener los datos del usuario al montar el componente**
    /*useEffe
                            onBlur={handleEnterPassword}ct(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/users/${userId}`);
                const data = await response.json();
                if (response.ok && data.length > 0) {
                    setName(data[0].name);
                    setFullname(data[0].fullname);
                    setEmail(data[0].email);
                    //setPassword(data[0].password);
                } else {
                    console.error("Error al obtener los datos del usuario:", data);
                    alert("No se pudo cargar la información del usuario");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("Error al conectar con el servidor");
            }
        };

        if (userId) fetchUserData(); // Solo obtener los datos si hay un userId válido
    }, [userId]);*/
    
    /*const handleEnterPassword = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");
            Swal.fire("Error", "No coinciden las contraseñas ingresadas.", "error");
            return;
        }
        handleSubmit(new Event("submit")); // Pasa un evento simulado
    };*/

    const handleEnterPassword = () => {
        if (password !== confirmPassword) {
            setPasswordError("Los valores no coinciden"); // Muestra el mensaje de error
            setBlocked(true);
            return;
        } else {
            setBlocked(false)
            setPasswordError(""); // Limpia el mensaje si coinciden
        }
    };

    // **Manejar el envío del formulario para actualizar los datos**
    const handleSubmit = async (e) => {
        e.preventDefault();
        //setIsSubmitting(true);
        
        try {
            const updates = { password };
            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                onClose(); // Cierra el formulario
                await Swal.fire("Éxito", "Contraseña actualizada correctamente.", "success");
                navigate("/diary");
            } else {
                Swal.fire("Error", "Error al actualizar el perfil.", "error");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire("Error", "Error al conectar con el servidor.", "error");
        } /*finally {
            setIsSubmitting(false);
        }*/
    };
    
    return (
        <div className="overlay1"> {/* Superposición para desactivar el resto de la pantalla */}
            <div className="update-user">
                <form className="form-update-user" onSubmit={handleSubmit}>
                    <p>Actualizar Contraseña</p>
                    <label>
                        Nueva contraseña:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nueva contraseña"
                            required
                        />
                    </label>
                    <label>
                        Confirmar contraseña:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Vuelva a ingresar su contraseña" 
                            onBlur={handleEnterPassword}
                            required
                        />
                         {passwordError && <p style={{ color: "red", fontSize: "16px", marginTop: "5px" }}>{passwordError}</p>}
                    </label>
                    <button 
                        type="submit" disabled={blocked}
                    >
                        Cambiar contraseña
                    </button>
                    <button
                        onClick={onClose}
                        className="cancel-button"
                        type="button"
                    >
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUserForm;
