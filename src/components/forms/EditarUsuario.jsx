import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import styles from "./crearUsuario.module.css";

const CrearUsuario = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles["login-box"]}>
        <h3 className={styles["info-text"]}>Editar usuarios</h3>
        <form className={styles["form-container"]} >
          <div className={styles["input-addon"]}>
            <input
              className={`${styles["form-element"]} ${styles["input-field"]}`}
              placeholder="Nombre"
              type="text"
              name="name"
            //   value={}
            //   onChange={}
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
            //   value={}
            //   onChange={}
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
            //   value={}
            //   onChange={}
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
            //   value={}
            //   onChange={}
            />
            <button className={styles["input-addon-item"]} type="button">
              <FaLock />
            </button>
          </div>
          <div className={styles["select-addon"]}>
            <select
              className={`${styles["form-select"]} ${styles["select-field"]}`}
            //   onChange={}
            //   value={}
            >
              <option className={styles["select-addon"]} value="">
                Selecciona un rol
              </option>
            </select>
          </div>
          <button type="submit" className={styles.button}>
            Actualizar
          </button>
        </form>
          </div>
      </div>
  );
};

export default CrearUsuario;
