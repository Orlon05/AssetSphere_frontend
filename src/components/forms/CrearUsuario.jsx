import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import styles from "./crearUsuario.module.css";

const CrearUsuario = () => {
  const [selectedRole, setSelectedRole] = useState("");

  const roles = [
    { id: 1, name: "Bancolombia" },
    { id: 2, name: "TCS" },
    { id: 3, name: "Administrador" },
    { id: 4, name: "Dev" },
  ];

  const handleRoleChange = (event) => {
    setSelectedRole(parseInt(event.target.value, 10));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles["login-box"]}>
        <h3 className={styles["info-text"]}>Registro de usuarios</h3>
        <form className={styles["form-container"]} action="">
          <div className={styles["input-addon"]}>
            <input
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              placeholder="Nombre"
              type="text"
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
            />
            <button className={styles["input-addon-item"]} type="button">
              <FaLock />
            </button>
          </div>
          <div className={styles["input-addon"]}>
            <select
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              onChange={handleRoleChange}
              value={selectedRole}
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <input
            className={`${styles["form-element"]} ${styles["is-submit"]}`}
            type="submit"
            value="Crear Usuario"
          />
        </form>
        {selectedRole && <p>The selected role ID is: {selectedRole}</p>}
      </div>
    </div>
  );
};

export default CrearUsuario;
