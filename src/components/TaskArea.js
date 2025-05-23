import React, { useState, useEffect, useRef } from "react";
import { Tooltip } from "react-tooltip";
import Swal from "sweetalert2";

function TaskArea({ userId, taskList, setTaskList }) {
  const BASE_URL = process.env.REACT_APP_BASE_URL || "http://192.168.10.16:4000";
  const [showForm, setShowForm] = useState(false);
  const [task, setTask] = useState({
    description: "",
    startDate: "",
    endDate: ""
  });
  const descriptionInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const taskRefs = useRef([]);
  const tasksPerRow = 1;

  const fetchTasks = async () => {
    if (!userId) {
      console.error("User ID is not defined. Cannot fetch tasks.");
      return;
    }
    console.log("Llamando a:", `${BASE_URL}/api/act-user/${userId}`);
    try {
      const response = await fetch(`${BASE_URL}/api/act-user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setTaskList(data);
        console.log("Tareas recibidas:", data);  
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    console.log("Entrando a useEffect en TaskArea");
    console.log("userId recibido:", userId);
    if (userId) {
      fetchTasks();
    }else {
        console.error("User ID is missing or undefined.");
      }
  }, [userId, BASE_URL]);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleCancel = () => {
    setTask({
      description: "",
      startDate: "",
      endDate: ""
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingTaskId(null);
  };

  const handleEditTask = (task) => {
    /*const toLocalDatetime = (dateString) => {
      const date = new Date(dateString);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      return localDate.toISOString().slice(0, 16);
    };*/

    const toDatetimeLocalString = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    };

    /*setTask({
      description: task.description,
      startDate: toLocalDatetime(task.start_date),
      endDate: toLocalDatetime(task.end_date)
    });*/

    setTask({
      description: task.description,
      startDate: toDatetimeLocalString(task.start_date),
      endDate: toDatetimeLocalString(task.end_date)
    });
    setEditingTaskId(task.id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleToggleTaskStatus = async (task) => {
    const isCompleting = !task.done;
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
        const response = await fetch(`${BASE_URL}/api/activities/${task.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: isCompleting }),
        });

        if (response.ok) {
          fetchTasks();
        } else {
          console.error("Error al actualizar la tarea:", response.statusText);
        }
      } catch (error) {
        console.error("Error al procesar la tarea:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      console.error("User ID is not defined.");
      return;
    }

    const newTask = {
      description: task.description,
      start_date: new Date(task.startDate).toISOString(),
      end_date: new Date(task.endDate).toISOString(),
      user_id: userId
    };

    try {
      let response;
      if (isEditing) {
        response = await fetch(`${BASE_URL}/api/activities/${editingTaskId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask)
        });
      } else {
        response = await fetch(`${BASE_URL}/api/activities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask)
        });
      }

      if (response.ok) {
        fetchTasks();
        handleCancel();
      } else {
        console.error("Failed to save task");
      }
    } catch (error) {
      console.error("Error while saving task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la tarea de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${BASE_URL}/api/activities/${taskId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchTasks();
          Swal.fire("Eliminada", "La tarea ha sido eliminada con éxito.", "success");
        } else {
          console.error("Error al eliminar la tarea");
          Swal.fire("Error", "No se pudo eliminar la tarea.", "error");
        }
      } catch (error) {
        console.error("Error en la eliminación:", error);
        Swal.fire("Error", "Error al conectar con el servidor.", "error");
      }
    }
  };

  const formatToLocal = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      dateStyle: "short",
      timeStyle: "short"
    });
  };

  //Formato fecha listado de tareas
  const formatSimpleDate = (isoString) => {
    const [datePart, timePart] = isoString.split("T");
    const [year, month, day] = datePart.split("-");
    const shortYear = year.slice(2);
    const time = timePart.slice(0, 5); // hh:mm
    //const formattedTime = `${hours}:${minutes} ${ampm}`;
    //return `${day}/${month}/${year} ${formattedTime}`;
    return `${day}/${month}/${shortYear} ${time}`;
  };

  /*const formatSimpleDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;
    const formattedTime = `${hours}:${minutes} ${ampm}`;
  
    return `${day}/${month}/${year} ${formattedTime}`;
  };*/
  /*const handleKeyNavigation = (e, index) => {
    if (e.key === "ArrowDown") {
      const next = document.querySelector(`[data-task-index="${index + 1}"]`);
      next?.focus();
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      const prev = document.querySelector(`[data-task-index="${index - 1}"]`);
      prev?.focus();
      e.preventDefault();
    }
  };*/
  
  //Activar formulario de agregar tarea con eñteclado
  
  const handleArrowNavigation = (e, index) => {
    const total = taskRefs.current.length;
    let nextIndex = index;
  
    switch (e.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % total;
        break;
      case "ArrowLeft":
        nextIndex = (index - 1 + total) % total;
        break;
      case "ArrowDown":
        nextIndex = index + tasksPerRow;
        if (nextIndex >= total) return;
        break;
      case "ArrowUp":
        nextIndex = index - tasksPerRow;
        if (nextIndex < 0) return;
        break;
      default:
        return;
    }
  
    e.preventDefault();
    taskRefs.current[nextIndex]?.focus();
  };  
  
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleToggleForm();
    }
  };

  //Borrar tarea usandola navegación con teclado
  const handleConfirmDelete = async (taskId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la tarea de manera permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
  
    if (result.isConfirmed) {
      handleDeleteTask(taskId);
    }
  };

  const handleConfirmToggleStatus = async (task) => {
    const isCompleting = !task.done;
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
      handleToggleTaskStatus(task);
    }
  };

  //Foco primer ampo de creadción de tarea
  useEffect(() => {
    if (showForm && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [showForm]);
  
  
  
  return (
    <div className="task-container">
      <div className="addbutton-and-form">
        <span 
        aria-label="Agregar nueva tarea" 
        tabIndex="0" 
        role="button"
        onKeyDown={handleKeyPress}
        className="add-task" 
        onClick={handleToggleForm}
        >
          Agregar nueva tarea +
        </span>
        <span aria-label="Agregar nueva tarea" tabIndex="0" type="button" className="material-symbols-outlined" onClick={handleToggleForm}>post_add</span>
        {showForm && <div className="overlay"></div>}
        <form role="region" aria-labelledby="form-title" className={`form-task ${showForm ? 'show' : ''}`} onSubmit={handleSubmit}>
          <h1 id="form-title"> {isEditing ? "Editar Tarea" : "Agregar Tarea"}</h1>
          <input
            tabIndex="0"
            className="in-task"
            type="text"
            maxLength={100}
            name="description"
            placeholder="¿Qué vas a agendar?"
            value={task.description}
            onChange={handleInputChange}
            ref={descriptionInputRef}
            required
          />
          <label htmlFor="startDate">
            Inicia:
            <input
              tabIndex="0"
              id="startDate"
              className="sh-date"
              type="datetime-local"
              name="startDate"
              value={task.startDate}
              onChange={handleInputChange}
              required
            />
          </label>
          <label htmlFor="endDate">
            Termina:
            <input
              id="endDate"
              tabIndex="0"
              className="sh-date"
              type="datetime-local"
              name="endDate"
              value={task.endDate}
              onChange={handleInputChange}
              required
            />
          </label>
          <button tabIndex="0" className="add-button" type="submit">
            {isEditing ? "Actualizar" : "Agregar"}
          </button>
          <button aria-label="Cancelar formulario" tabIndex="0" type="button" className="cancel" onClick={handleCancel}>
            Cancelar
          </button>
        </form>
      </div>

      <div 
        tabIndex="0" 
        className="task-list"
        aria-label="Listado de tareas"
      >
        {taskList.length > 0 ? (
          taskList.map((task, index) => (
            <div 
              key={task.id} 
              className={`task-item ${task.done ? "completed" : ""}`}
              role="region"
              aria-labelledby={`task-title-${task.id}`}
              ref={(el) => (taskRefs.current[index] = el)}
              onKeyDown={(e) => handleArrowNavigation(e, index)}
            >
              <p tabIndex="0" className="desctask">{task.description}</p>
              <p tabIndex="0" className="horafecha"><strong>Desde:</strong> {formatSimpleDate(task.start_date)}</p>
              <p tabIndex="0" className="horafecha"><strong>Hasta:</strong> {formatSimpleDate(task.end_date)}</p>
              <div className="botones">
                <span
                  tabIndex="0"
                  aria-label={task.done ? "Reabrir tarea" : "Completar tarea"}
                  className="material-symbols-outlined"
                  role="button"
                  data-tooltip-id="complete-tooltip"
                  data-tooltip-content={task.done ? "Reabrir tarea" : "Completar tarea"}
                  onClick={() => handleToggleTaskStatus(task)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConfirmToggleStatus(task);
                    }
                  }}
                >
                  {task.done ? "change_circle" : "done_all"}
                </span>
                <span
                  tabIndex="0"
                  aria-label="Editar tarea"
                  disabled={task.done}
                  aria-disabled={task.done}
                  className={`material-symbols-outlined ${task.done ? "disabled" : ""}`}
                  role="button"
                  data-tooltip-id="edit-tooltip"
                  data-tooltip-content="Editar tarea"
                  onClick={() => !task.done && handleEditTask(task)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !task.done) {
                      e.preventDefault();
                      handleEditTask(task);
                    }
                  }}
                >
                  edit_note
                </span>
                <span
                  tabIndex="0"
                  aria-label="Eliminar tarea"
                  disabled={task.done}
                  aria-disabled={task.done}
                  className={`material-symbols-outlined ${task.done ? "disabled" : ""}`}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleConfirmDelete(task.id);
                    }
                  }}
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
          <p tabIndex="0" role="status" className="no-task">No hay tareas pendientes</p>
        )}
      </div>

      <Tooltip id="complete-tooltip" />
      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
    </div>
  );
}

export default TaskArea;
