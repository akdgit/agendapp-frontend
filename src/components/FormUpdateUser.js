import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/FormUpdateUser.css";
import Swal from "sweetalert2";

function UpdateUserForm({ userId, onClose }) {
    const [name, setName] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";

    // ✅ Obtener los datos del usuario
    useEffect(() => {
        console.log("userId recibido en UpdateUserForm:", userId);
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/users/${userId}`);
                const data = await response.json();

                if (response.ok && data) {
                    console.log("Datos del usuario:", data);
                    const user = Array.isArray(data) ? data[0] : data;
                    setName(user.name);
                    setFullname(user.fullname);
                    setEmail(user.email);
                } else {
                    console.error("Respuesta del backend:", response.status, data);
                    console.error("Error al obtener los datos del usuario:", data);
                    Swal.fire("Error", "No se pudo cargar la información del usuario", "error");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                Swal.fire("Error", "Error al conectar con el servidor", "error");
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    // ✅ Actualizar los datos
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updates = { name, fullname, email };
            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                await Swal.fire("Éxito", "Perfil actualizado correctamente.", "success");
                localStorage.setItem("username", name); // Actualizar nombre local
                onClose();
                navigate("/diary");
            } else {
                Swal.fire("Error", "Error al actualizar el perfil.", "error");
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire("Error", "Error al conectar con el servidor.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="overlay1">
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
                            placeholder="Correo electrónico"
                            required
                        />
                    </label>
                    <button disabled={isSubmitting} type="submit">
                        {isSubmitting ? "Actualizando..." : "Actualizar"}
                    </button>
                    <button onClick={onClose} className="cancel-button" type="button">
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateUserForm;
