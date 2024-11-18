import React, { useState } from "react";
import styles from "./editarServidor.module.css";
import {  MdEdit } from "react-icons/md";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const EditarServer = () => {
  const [serial, setSerial] = useState("");
  const [nombreServidor, setNombreServidor] = useState("");
  const [propietario, setPropietario] = useState("");
  const [chasis, setChasis] = useState("");
  const [estado, setEstado] = useState("");
  const [marca, setMarca] = useState("");
  const [rack, setRack] = useState("");
  const [unidad, setUnidad] = useState("");
  const [ip, setIp] = useState("");
  const [rol, setRol] = useState("");
  const [so, setSo] = useState("");
  const [tipo_activo_rack, setTipoActivoRack] = useState("");
  const [modelo, setModelo] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [procesador, setProcesador] = useState("");
  const [cores, setCores] = useState("");
  const [discos, setDiscos] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [ram, setRam] = useState(""); 
  const navigate = useNavigate();

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
    }
  });

  // Función para mostrar un Toast de éxito después de crear una receta
  const showSuccessToast = () => {
    Toast.fire({
      icon: 'success',
      title: 'Servidor actualizado exitosamente'
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Formulario enviado:", {
      serial,
      nombreServidor,
      propietario,
      chasis,
      estado,
      marca,
      rack,
      unidad,
      ip,
      rol,
      so,
      tipo_activo_rack,
      modelo,
      ambiente,
      procesador,
      cores,
      discos,
      observaciones,
      ram,
    });
    navigate("/servidoresf")
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>< MdEdit />Editar Servidores</h2>
      <div className={styles.container}>
        {/*INICIO DE LA COLUMNA 1*/}
        <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="serial"
              name="serial"
              value={serial}
              onChange={(e) => setSerial(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Serial*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="propietario"
              name="propietario"
              value={propietario}
              onChange={(e) => setPropietario(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Propietario*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="nombreServidor"
              name="nombreServidor"
              value={nombreServidor}
              onChange={(e) => setNombreServidor(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Nombre del Servidor*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="unidad"
              name="unidad"
              value={unidad}
              onChange={(e) => setUnidad(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Unidad*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="rol"
              name="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Rol*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="ambiente"
              name="ambiente"
              value={ambiente}
              onChange={(e) => setAmbiente(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Ambiente*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="procesador"
              name="procesador"
              value={procesador}
              onChange={(e) => setProcesador(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Procesador*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="so"
              name="so"
              value={so}
              onChange={(e) => setSo(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Sistema Operativo*</div>
          </div>

          <div className={styles.formGroup}>
            <textarea
              id="observaciones"
              name="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className={styles.texTarea}
            />
            <div className={styles.labelTarea}>Observaciones</div>
          </div>
        </div>

        {/*INICIO DE LA COLUMNA 2*/}
        <div className={styles.columnDos}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="chasis"
              name="chasis"
              value={chasis}
              onChange={(e) => setChasis(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Chasis*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Estado*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="marca"
              name="marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Marca*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="rack"
              name="rack"
              value={rack}
              onChange={(e) => setRack(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Rack*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="ip"
              name="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Ip*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="modelo"
              name="modelo"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Modelo*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="cores"
              name="cores"
              value={cores}
              onChange={(e) => setCores(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Cores*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="ram"
              name="ram"
              value={ram}
              onChange={(e) => setRam(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Ram*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="discos"
              name="discos"
              value={discos}
              onChange={(e) => setDiscos(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Disco*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="tipo_activo_rack"
              name="tipo_activo_rack"
              value={tipo_activo_rack}
              onChange={(e) => setTipoActivoRack(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Tipo Activo*</div>
          </div>
        </div>

        <button type="submit" className={styles.button} onClick={showSuccessToast}>
          Actualizar
        </button>
      </div>
    </form>
  );
};

export default EditarServer;
