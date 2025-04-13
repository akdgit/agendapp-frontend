import React, { useState, useEffect } from "react";
import  "../pages/styles/Diary.css";

function ClockDate() {
    const [hora, setHora] = useState("");
    const [fecha, setFecha] = useState("");

    useEffect(() => {
        const actualizarHora = () => {
            const ahora = new Date();
            const horas = ahora.getHours().toString().padStart(2, "0"); // Horas con 2 dígitos
            const minutos = ahora.getMinutes().toString().padStart(2, "0");
            setHora(`${horas}:${minutos}`);

            // Obtener día de la semana
            const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
            const diaSemana = diasSemana[ahora.getDay()];

            // Obtener día, mes y año en formato dd-mm-yyyy
            const dia = ahora.getDate().toString().padStart(2, "0"); 
            const mes = (ahora.getMonth() + 1).toString().padStart(2, "0"); // +1 porque enero es 0
            const año = ahora.getFullYear();

            setFecha(`${diaSemana} ${dia}-${mes}-${año}`);
        };

        actualizarHora(); // Llamada inicial
        const intervalo = setInterval(actualizarHora, 1000); // Actualizar cada segundo

        return () => clearInterval(intervalo); // Limpia el intervalo al desmontar
    }, []);

    return (
        <div className="reloj-fecha">
            <p className="reloj"> {hora} <p className="fecha"> {fecha} </p> </p>         
        </div>
    );
}

export default ClockDate;
