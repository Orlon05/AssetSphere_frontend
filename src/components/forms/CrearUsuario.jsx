import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import styles from "./crearUsuario.module.css";
import Swal from "sweetalert2";


const CrearUsuario = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [responseMessage, setResponseMessage] = useState(null);
  const [errorMessages, setErrorMessages] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const roles = [
    { id: 1, name: "Bancolombia" },
    { id: 2, name: "TCS" },
    { id: 3, name: "Administrador" },
    { id: 4, name: "Dev" },
  ];

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRoleChange = (event) => {
    const roleValue = parseInt(event.target.value, 10);
    setSelectedRole(roleValue);
    setFormData({ ...formData, role: roleValue });
  };

   // Crea la instancia de Toast
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000, // Duración del Toast (3 segundos)
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
  
    // Función para mostrar un Toast de éxito después de crear una receta
    const showSuccessToast = (roleName) => {
      Toast.fire({
        icon: "success",
        title: `Usuario ${roleName} creado exitosamente`,
      });
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponseMessage(null);
    setErrorMessages(null);

    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.msg || "Usuario registrado exitosamente");
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          role: "",
        });
        setSelectedRole("");
        // Busca el nombre del rol seleccionado
        const selectedRoleData = roles.find(role => role.id === formData.role);
        const roleName = selectedRoleData ? selectedRoleData.name : "Desconocido";
        showSuccessToast(roleName);
      } else if (response.status === 422) {
        const errorData = await response.json();
        setErrorMessages(errorData.detail);
      } else {
        console.log(response);
        setResponseMessage(`Error al registrar usuario: ${response.status}`);
      }
    } catch (error) {
      console.error("Error al conectar al servidor", error);
      setResponseMessage("Error de red");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["login-box"]}>
        <h3 className={styles["info-text"]}>Registro de usuarios</h3>
        <form className={styles["form-container"]} onSubmit={handleSubmit}>
          <div className={styles["input-addon"]}>
            <input
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              placeholder="Nombre"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <button className={styles["input-addon-item"]} type="button">
              <FaUser />
            </button>
          </div>
          <div className={styles["input-addon"]}>
            <input
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              placeholder="Nombre Usuario"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <button className={styles["input-addon-item"]} type="button">
              <FaUser />
            </button>
          </div>
          <div className={styles["input-addon"]}>
            <input
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              placeholder="Correo"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <button className={styles["input-addon-item"]} type="button">
              <FaEnvelope />
            </button>
          </div>
          <div className={styles["input-addon"]}>
            <input
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              placeholder="contraseña"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <button className={styles["input-addon-item"]} type="button">
              <FaLock />
            </button>
          </div>
          <div className={styles["select-addon"]}>
            <select
              className={`${styles["form-select"]} ${styles["select-field"]}`}
              onChange={handleRoleChange}
              value={selectedRole}
            >
              <option className={styles["select-addon"]} value="">
                Selecciona un rol
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.button}>
            Guardar
          </button>
        </form>
        {selectedRole && <p>Seleccionaste el rol: {selectedRole}</p>}
        {responseMessage && <p>{responseMessage}</p>}
        {errorMessages && (
          <div>
            {errorMessages.map((error, index) => (
              <p key={index}>
                {error.loc.join(" > ")}: {error.msg}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearUsuario;
