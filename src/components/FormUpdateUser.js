import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/FormUpdateUser.css"; // Asegúrate de agregar los estilos aquí.
import Swal from "sweetalert2";

function UpdateUserForm({ userId, onClose }) {
    const [name, setName] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    //const [password, setPassword] = useState(""); // Puede ser opcional
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";
    
    // **Obtener los datos del usuario al montar el componente**
    useEffect(() => {
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
    }, [userId]);

    // **Manejar el envío del formulario para actualizar los datos**
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        try {
            const updates = { name, fullname, email, /*password*/ };
            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
    
            if (response.ok) {
                const updatedUser = await response.json();
                onClose(); // Cierra el formulario
                await Swal.fire("Éxito", "Perfil actualizado correctamente.", "success");
                //window.location.reload();
                const nom= localStorage.setItem("username", name); // Actualizar nombre en localStorage// Redirige a la pantalla principal
                navigate("/diary");
                console.log("El nombre actualizado es: ", nom);
            } else {
                Swal.fire("Error", "Error al actualizar el perfil.", "error");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire("Error", "Error al conectar con el servidor.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    
    /*const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updates = { name, fullname, email, password };
            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                alert("Perfil actualizado exitosamente");
                //await Swal.fire("Listo", "Perfil actualizado", "success");
                const updatedUser = await response.json();
                localStorage.setItem("username", name);
                onClose(); // Cerrar el formulario
                navigate("/diary"); // Redirigir a la pantalla principal
            } else {
                console.error("Error al actualizar el perfil:", response.status);
                alert("Error al actualizar el perfil");
            }
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            alert("Error al conectar con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };*/

    return (
        <div className="overlay1"> {/* Superposición para desactivar el resto de la pantalla */}
            <div className="update-user">
                <form className="form-update-user" onSubmit={handleSubmit}>
                    <p>Actualizar perfil</p>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Nombres"
                            required
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Apellidos"
                            required
                        />
                    </label>
                    <label>
                        Correo:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Dirección de correo"
                            required
                        />
                    </label>
                    <button 
                    disabled={isSubmitting}
                    type="submit" 
                    >
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
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
