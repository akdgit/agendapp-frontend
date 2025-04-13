import React, { useState, useEffect } from "react";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

function TaskArea({ taskList, setTaskList}) {
    const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";
    const [showForm, setShowForm] = useState(false);
    const [task, setTask] = useState({
        description: "",  // Cambié 'title' a 'description'
        startDate: "",
        endDate: ""
    });
    //const [taskList, setTaskList] = useState([]);  
    const [userId, setUserId] = useState(null);  // Estado para el ID del usuario autenticado
    const [isEditing, setIsEditing] = useState(false);  // Estado para indicar si estamos editando
    const [editingTaskId, setEditingTaskId] = useState(null);
    
    // Función para alternar el formulario
    /*const fetcuserId, taskList, setTaskListhTasks = async () => {
        if (!userId) {
            console.error("User ID is not defined. Cannot fetch tasks.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/act-user/${userId}`);
            const data = await response.json();
    
            if (response.ok) {
                setTaskList(data);  // Usa el prop pasado desde Diary.js
            } else {
                console.error("Failed to fetch tasks:", data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };*/
    
    /*const handleClearTasks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/activities/clear/${userId}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                await Swal.fire("Lista limpia", "Todas tus tareas se han eliminado.", "success");
                setTaskList([]); // Usa el prop pasado desde Diary.js
            } else {
                Swal.fire("Error", "Error al limpiar la lista de tareas.", "error");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire("Error", "Error al conectar con el servidor.", "error");
        }
    };*/

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    // Manejo de los cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task,
            [name]: value
        });
    };

    // Manejo del botón de cancelar
    const handleCancel = () => {
        setTask({
            description: "",
            startDate: "",
            endDate: ""
        });
        setShowForm(false);
        setIsEditing(false);  // Resetear el estado de edición
        setEditingTaskId(null);  // Limpiar el ID de la tarea en edición
    };

        //Funcion para editar tarea.
    const hanleEditTask = (task) => {
        const toLocalDatetime = (dateString) => {
            const date = new Date(dateString);
            const offset = date.getTimezoneOffset(); // Obtén la diferencia horaria en minutos
            const localDate = new Date(date.getTime() - offset * 60 * 1000); // Ajustar al horario local
            return localDate.toISOString().slice(0, 16); // Formato para datetime-local
        };
        const localStartDate = toLocalDatetime(task.start_date);
    const localEndDate = toLocalDatetime(task.end_date);
        /*const localStartDate = new Date(task.start_date).toISOString().slice(0, 16); // Formato para datetime-local
        const localEndDate = new Date(task.end_date).toISOString().slice(0, 16);*/
        setTask({
            description: task.description,
            startDate: localStartDate,  // Formatea a yyyy-MM-ddTHH:mm
            endDate: localEndDate
        });
        setEditingTaskId(task.id);  // Establecer el ID de la tarea que estamos editando
        setIsEditing(true);  // Cambiar a modo de edición
        setShowForm(true);  
        console.log("El id es: ", setEditingTaskId);
    };

    const handleToggleTaskStatus = async (task) => {
        const isCompleting = !task.done; // Determina si estamos completando o reabriendo la tarea
        const confirmationMessage = isCompleting
            ? "¿Deseas marcar esta tarea como completada?"
            : "¿Deseas reabrir esta tarea?";
        const confirmed = await Swal.fire({
            title: confirmationMessage,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí",
            cancelButtonText: "No",
        });
    
        if (confirmed.isConfirmed) {
            try {
                const updatedTask = { done: isCompleting };
                const response = await fetch(`${BASE_URL}/api/activities/${task.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedTask),
                });
    
                if (response.ok) {
                    fetchTasks(); // Actualiza la lista de tareas después del cambio
                } else {
                    console.error("Error al actualizar la tarea:", response.statusText);
                }
            } catch (error) {
                console.error("Error al procesar la tarea:", error);
            }
        }
    };

    const formatDateForDatabase = (date) => {
        const localDate = new Date(date);
        const year = localDate.getFullYear();
        const month = String(localDate.getMonth() + 1).padStart(2, "0");
        const day = String(localDate.getDate()).padStart(2, "0");
        const hours = String(localDate.getHours()).padStart(2, "0");
        const minutes = String(localDate.getMinutes()).padStart(2, "0");
        const seconds = "00"; // Asume segundos como 00
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    

    /*const handleDoneTask = async (task) => {
        const action = task.done ? "reabrir" : "completar";
        const confirmButtonText = task.done ? "Sí, reabrir" : "Sí, completar";
        const result = await Swal.fire({
            title: `¿Estás seguro que deseas ${action} la tarea?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: "No"
        });

        if (result.isConfirmed) {
            // Actualizar el campo done en la base de datos
            const updatedTask = { ...task, done: !task.done };

            try {
                const response = await fetch(`${BASE_URL}/api/activities/${task.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedTask)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(`Tarea ${action}da:`, result);
                    fetchTasks();  // Volver a cargar las tareas actualizadas
                } else {
                    console.error("Error al actualizar la tarea:", response.status);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error);
            }
        }
    };*/

    // Función para enviar la tarea (POST)
    /*const handleSubmit = async (e) => {
        e.preventDefault();  // Evita el comportamiento por defecto del formulario

        if (!userId) {
            console.error("User ID is not defined.");
            return;
        }

        const newTask = {
            description: task.description,
            start_date: task.startDate,
            end_date: task.endDate,
            user_id: userId  // Incluye el user_id del usuario logeado
        };

        try {
            let response;
            if (isEditing) {
                response = await fetch("${BASE_URL}/api/activities/${editingTaskId}", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newTask)
                });
            } else {
                response = await fetch("${BASE_URL}/api/activities", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newTask)
                });
            }

            if (response.ok) {
                const result = await response.json();
                console.log("Tarea añadida:", result);
                // Actualizar la lista de tareas después de añadir la nueva tarea
                fetchTasks();
                // Limpiar el formulario
                handleCancel();
            } else {
                console.error("Failed to add task:", response.status);
            }
        } catch (error) {
            console.error("Error while adding task:", error);
        }
    };*/

    // Función para enviar o actualizar la tarea
    const handleSubmit = async (e) => {
        e.preventDefault();  // Evita el comportamiento por defecto del formulario
    
        if (!userId) {
            console.error("User ID is not defined.");
            return;
        }
    
        const newTask = {
            description: task.description,
            start_date: new Date(task.startDate).toISOString(), // Convertir a formato ISO
            end_date: new Date(task.endDate).toISOString(),
            user_id: userId  // Incluye el user_id del usuario logeado
        };
    
        try {
            let response;
            if (isEditing) {
                console.log(`Editando tarea con ID: ${editingTaskId}`);  // Log para verificar el ID
                console.log("Datos enviados:", newTask);  // Log para verificar los datos enviados
    
                response = await fetch(`${BASE_URL}/api/activities/${editingTaskId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newTask)
                });
            } else {
                response = await fetch(`${BASE_URL}/api/activities`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newTask)
                });
            }
    
            if (response.ok) {
                const result = await response.json();
                console.log(isEditing ? "Tarea actualizada:" : "Tarea añadida:", result);
                fetchTasks();  // Actualizar la lista de tareas
                handleCancel();  // Limpiar el formulario
            } else {
                console.error(isEditing ? "Failed to update task:" : "Failed to add task:", response.status);
            }
        } catch (error) {
            console.error(isEditing ? "Error while updating task:" : "Error while adding task:", error);
        }
    };    

    const handleDeleteTask = async (taskId) => {
        // Mostrar la ventana de confirmación
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará la tarea de manera permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        // Si el usuario confirma, procedemos con la eliminación
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${BASE_URL}/api/activities/${taskId}`, {
                    method: "DELETE",
                });

                if (response.ok) {
                    // Filtra la tarea eliminada de la lista actual
                    setTaskList((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
                    Swal.fire("Eliminada", "La tarea ha sido eliminada con éxito.", "success");
                } else {
                    const errorData = await response.json();
                    console.error("Error al eliminar la tarea:", errorData);
                    Swal.fire("Error", "No se pudo eliminar la tarea. Intenta nuevamente.", "error");
                    const fetchTasks = async () => {
                        if (!userId) {
                            console.error("User ID is not defined. Cannot fetch tasks.");
                            return;
                        }
                        try {
                            const response = await fetch(`${BASE_URL}/api/act-user/${userId}`);
                            const data = await response.json();
                    
                            if (response.ok) {
                                setTaskList(data);  // Usa el prop pasado desde Diary.js
                            } else {
                                console.error("Failed to fetch tasks:", data);
                            }
                        } catch (error) {
                            console.error("Error fetching tasks:", error);
                        }
                    };
                    
                    
                     }
            } catch (error) {
                console.error("Error en la eliminación:", error);
                Swal.fire("Error", "Ocurrió un error al intentar eliminar la tarea.", "error");
            }
        } else {
            Swal.fire("Cancelado", "La tarea no ha sido eliminada.", "info");
         }
    };

    // Función para obtener las tareas del usuario autenticado
    const fetchTasks = async () => {
        if (!userId) {
            console.error("User ID is not defined. Cannot fetch tasks.");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/api/act-user/${userId}`);
            const data = await response.json();
    
            if (response.ok) {
                setTaskList(data);  // Usa el prop pasado desde Diary.js
            } else {
                console.error("Failed to fetch tasks:", data);
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    
    const handleClearTasks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/activities/clear/${userId}`, {
                method: "DELETE",
            });
    
            if (response.ok) {
                await Swal.fire("Lista limpia", "Todas tus tareas se han eliminado.", "success");
                setTaskList([]); // Usa el prop pasado desde Diary.js
            } else {
                Swal.fire("Error", "Error al limpiar la lista de tareas.", "error");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            Swal.fire("Error", "Error al conectar con el servidor.", "error");
        }
    };
    

    useEffect(() => {
        // Recuperar el userId del localStorage
        const storedUserId = localStorage.getItem("userId");
    
        // Verificar si existe el userId almacenado
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.error("No user ID found in localStorage");
        }
    }, []);
    
    useEffect(() => {
        if (userId) {
            fetchTasks();  // Llamar la función de tareas si el userId es válido
        } else {
            console.error("User ID is missing or undefined.");
        }
    }, [userId]);

    useEffect(() => {
        fetchTasks();
    }, [userId]);


    return (
        <div className="task-container">
           

            <div className="addbutton-and-form">
                <span className="add-task" onClick={handleToggleForm}>Agregar nueva tarea +</span>
                <span className="material-symbols-outlined" onClick={handleToggleForm}> post_add </span>
                {/* Overlay para bloquear la interacción con el fondo */}
                {showForm && <div className="overlay"></div>}
                <form className={`form-task ${showForm ? 'show' : ''}`} onSubmit={handleSubmit}>
                    <h1>Agregar Tarea</h1>
                    <input 
                        className="in-task"
                        type="text"
                        maxLength={100}
                        name="description"
                        placeholder="¿Qué vas a agendar?"
                        value={task.description}
                        onChange={handleInputChange}
                        required
                    />
                    <label>
                        Inicia: 
                        <input 
                            className="sh-date"
                            type="datetime-local"
                            name="startDate"
                            value={task.startDate}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <label>
                        Termina: 
                        <input 
                            className="sh-date"
                            type="datetime-local"
                            name="endDate"
                            value={task.endDate}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                    <button className="add-button" type="submit">
                        {isEditing ? "Actualizar" : "Agregar"}  {/* Cambia el texto dependiendo de si estamos editando */}
                    </button>
                    <button 
                        type="button"
                        className="cancel"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </button>
                </form>
            </div>

            <div className="task-list">
                {taskList.length > 0 ? (
                    taskList.map((task, index) => (
                        <div
                        key={index}
                        className={`task-item ${task.done ? "completed" : ""}`}
                    >
                        <p className="desctask"> {task.description}</p>
                        <p className="horafecha"><strong>Desde:</strong> {new Date(task.start_date).toLocaleString()}</p>
                        <p className="horafecha"><strong>Hasta:</strong> {new Date(task.end_date).toLocaleString()}</p>
                        <div className="botones">
                            <span
                                className="material-symbols-outlined"
                                role="button"
                                data-tooltip-id="complete-tooltip"
                                data-tooltip-content={task.done ? "Reabrir tarea" : "Completar tarea"}
                                onClick={() => handleToggleTaskStatus(task)}
                            >
                                {task.done ? "change_circle" : "done_all"}
                            </span>
                    
                            {/* Los otros botones se desactivan si la tarea está completada */}
                            <span
                                className={`material-symbols-outlined ${task.done ? "disabled" : ""}`}
                                role="button"
                                data-tooltip-id="edit-tooltip"
                                data-tooltip-content="Editar tarea"
                                onClick={() => !task.done && hanleEditTask(task)}
                            >
                                edit_note
                            </span>
                            <span
                                className={`material-symbols-outlined ${task.done ? "disabled" : ""}`}
                                role="button"
                                data-tooltip-id="delete-tooltip"
                                data-tooltip-content="Eliminar tarea"
                                onClick={() => handleDeleteTask(task.id)}
                            >
                                delete
                            </span>
                        </div>
                    </div>                    
                    ))
                ) : (
                    <p className="no-task">No hay tareas pendientes</p>
                )}
            </div>
            <Tooltip id="complete-tooltip" />
            <Tooltip id="edit-tooltip" />
            <Tooltip id="delete-tooltip" />
        </div>
    );
}

export default TaskArea;

