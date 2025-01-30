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
  const [error, setError] = useState(null); // Estado para manejar errores

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

  const ciudadesCapitalesColombia = [
    "Bogotá",
    "Medellín",
    "Bello",
    "Sincelejo",
    "Ibague",
    "Valledupar",
  ];

  const ambienteServidores = ["Producción", "Certificación"];

  const estadoServidores = ["Encendido", "Apagado", "Mantenimiento"];

  const marcaServidores = ["Cisco", "HP", "Lenovo", "DELL"];

  const rolServidores = [
    "NUTANIX",
    "AXIOM10",
    "OLVM",
    "CITRIX BANCOLOMBIA",
    "CITRIX",
    "WINDOWS",
    "LINUX",
  ];

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    const fetchServerData = async () => {
      setLoading(true);
      setError(null);
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
          const errorData = await response.json(); // Intenta leer la respuesta en caso de error
          console.error("Error al obtener datos del servidor:", errorData); // Logs para depuración
          if (response.status === 404) {
            throw new Error("Servidor no encontrado");
          } else if (response.status === 401) {
            throw new Error("No autorizado");
          } else {
            throw new Error(
              `Error HTTP ${response.status}: ${
                errorData.message || errorData.detail
              }`
            );
          }
        }
        const data = await response.json();
        // console.log("Datos recibidos:", data);
        // Actualiza los estados con los datos recibidos
        if (data.status === "success" && data.data && data.data.server_info) {
          setSerial(data.data.server_info.serial || "");
          setNombreServidor(data.data.server_info.name || "");
          setPropietario(data.data.server_info.owner || "");
          setChasis(data.data.server_info.chassis || "");
          setEstado(data.data.server_info.status || "");
          setMarca(data.data.server_info.brand || "");
          setRack(data.data.server_info.rack_id || "");
          setUnidad(data.data.server_info.unit || "");
          setIp(data.data.server_info.ip_address || "");
          setRol(data.data.server_info.role || "");
          setSo(data.data.server_info.os || "");
          setTipoActivoRack(data.data.server_info.rack_asset_type || "");
          setModelo(data.data.server_info.model || "");
          setAmbiente(data.data.server_info.environment || "");
          setProcesador(data.data.server_info.processor || "");
          setCores(data.data.server_info.cpu_cores || "");
          setDiscos(data.data.server_info.total_disk_size || "");
          setObservaciones(data.data.server_info.comments || "");
          setRam(data.data.server_info.ram || "");
          setCity(data.data.server_info.city || "");
          setLocation(data.data.server_info.location || "");
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
        console.error("Error en fetchServerData:", error);
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId]);

  useEffect(() => {}, [serial, nombreServidor]);

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
      ram: ram,
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
    };

    console.log(
      "Token de autenticación:",
      localStorage.getItem("authenticationToken")
    );
    console.log("Datos a enviar:", serverData);

    try {
      const response = await fetch(
        `http://localhost:8000/servers/physical/${serverId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serverData),
        }
      );

      console.log("Respuesta del servidor:", response);

      if (!response.ok) {
        let errorMessage = `Error HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          console.error("Detalles del error (JSON):", errorData);
          if (errorData && Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map((e) => e.msg).join(", ");
          } else if (errorData && errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData) {
            errorMessage = JSON.stringify(errorData);
          }
          Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        } catch (jsonError) {
          console.error("Error al parsear JSON:", jsonError);
          Swal.fire({ icon: "error", title: "Error", text: errorMessage });
        }
      } else {
        showSuccessToast();
        navigate("/servidoresf");
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado.",
      });
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
            <select
              id="rol"
              name="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              className={styles.selected}
            >
              <option value="" disabled>Selecciona el rol</option>
              {rolServidores.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <select
              id="ambiente"
              name="ambiente"
              value={ambiente}
              onChange={(e) => setAmbiente(e.target.value)}
              className={styles.selected}
            >
              <option value=""disabled>Selecciona el Ambiente</option>
              {ambienteServidores.map((ambiente) => (
                <option key={ambiente} value={ambiente}>
                  {ambiente}
                </option>
              ))}
            </select>
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
            <select
              id="city"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.selected}
            >
              <option value=""disabled>Selecciona una ciudad</option>
              {ciudadesCapitalesColombia.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
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
            Guardar
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
            <select
              id="estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className={styles.selected}
            >
              <option value=""disabled>Selecciona un estado</option>
              {estadoServidores.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <select
              id="marca"
              name="marca"
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              className={styles.selected}
            >
              <option value=""disabled>Selecciona una marca</option>
              {marcaServidores.map((marca) => (
                <option key={marca} value={marca}>
                  {marca}
                </option>
              ))}
            </select>
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
