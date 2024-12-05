import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./editarServidor.module.css";

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
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true); // Estado para indicar carga
  const [error, setError] = useState(null);     // Estado para manejar errores

  const navigate = useNavigate();
  const { serverId } = useParams();

  // Crea la instancia de Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000, 
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const showSuccessToast = () => {
    Toast.fire({ icon: "success", title: "Servidor actualizado exitosamente" });
  };

  useEffect(() => {
    const fetchServerData = async () => {
      setLoading(true); // Indica que la carga ha comenzado
      setError(null);   // Limpia cualquier error previo
      try {
        const response = await fetch(
          `http://localhost:8000/servers/physical/${serverId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "authenticationToken"
              )}`,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Servidor no encontrado");
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP ${response.status}`);
          }
        }
        const data = await response.json();
        // Actualiza los estados con los datos recibidos
        setSerial(data.data.serial || "");
        setNombreServidor(data.data.name || "");
        setPropietario(data.data.owner || "");
        setChasis(data.data.chassis || "");
        setEstado(data.data.status || "");
        setMarca(data.data.brand || "");
        setRack(data.data.rack_id || "");
        setUnidad(data.data.unit || "");
        setIp(data.data.ip_address || "");
        setRol(data.data.role || "");
        setSo(data.data.os || "");
        setTipoActivoRack(data.data.rack_asset_type || "");
        setModelo(data.data.model || "");
        setAmbiente(data.data.environment || "");
        setProcesador(data.data.processor || "");
        setCores(data.data.cpu_cores || "");
        setDiscos(data.data.total_disk_size || "");
        setObservaciones(data.data.comments || "");
        setRam(data.data.ram || "");
        setCity(data.data.city || "");
        setLocation(data.data.location || "");

      } catch (error) {
        setError(error.message); // Guarda el mensaje de error
      } finally {
        setLoading(false); // Indica que la carga ha terminado
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId]);

  useEffect(() => {
    console.log("Serial recibido:", serial);
    console.log("Nombre del servidor recibido:", nombreServidor);
  }, [serial, nombreServidor]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!nombreServidor || !serial || !marca || !modelo) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, completa todos los campos obligatorios.",
      });
      return;
    }
  
    const serverData = {
      name: nombreServidor,
      brand: marca,
      model: modelo,
      processor: procesador,
      cpu_cores: parseInt(cores, 10),
      total_disk_size: discos,
      os: so,
      status: estado,
      role: rol,
      environment: ambiente,
      serial: serial,
      rack_id: rack,
      unit: unidad,
      ip_address: ip,
      city: city,
      location: location,
      chassis: chasis,
      rack_asset_type: tipo_activo_rack,
      owner: propietario,
      comments: observaciones,
      ram: ram,
    };
  
    try {
      const response = await fetch(
        `http://localhost:8000/servers/physical/${serverId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authenticationToken")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serverData),
        }
      );
  
      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData && errorData.detail) {
            errorMessage = errorData.detail.map((e) => e.msg).join(", ");
          }
        } catch {}
        Swal.fire({ icon: "error", title: "Error al actualizar", text: errorMessage });
      } else {
        showSuccessToast();
        navigate("/servidoresf");
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado." });
    }
  };

  // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
  if (loading) {
    return <div>Cargando datos del servidor...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.containtTit}>
        <h2 className={styles.tittle}>
          <MdEdit />
          Editar Servidores
        </h2>
      </div>
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
            <input
              type="text"
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Ciudad</div>
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
          <button type="submit" className={styles.button}>
            Actualizar
          </button>
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

          <div className={styles.formGroup}>
            <input
              type="text"
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Ubicación</div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditarServer;
