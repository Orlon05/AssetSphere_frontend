import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./editarServidorVirtual.module.css";

const EditarServerVirtual = () => {
  const [nombreServidor, setNombreServidor] = useState("");
  const [marca, setMarca] = useState("");
  const [cores, setCores] = useState("");
  const [ram, setRam] = useState("");
  const [discos, setDiscos] = useState("");
  const [so, setSo] = useState("");
  const [sov, setSov] = useState("");
  const [estado, setEstado] = useState("");
  const [rol, setRol] = useState("");
  const [ambiente, setAmbiente] = useState("");
  const [ip, setIp] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [propietario, setSow] = useState("");
  const [appcode, setAppcode] = useState("");
  const [resevc, setResevc] = useState("");
  const [dominio, setDominio] = useState("");
  const [sub, setSub] = useState("");
  const [resorg, setResorg] = useState("");
  const [bill, setBill] = useState("");
  const [oprovi, setOprovi] = useState("");
  const [odel, setOdel] = useState("");
  const [omodi, setOmodi] = useState("");
  const [mperiod, setMperiod] = useState("");
  const [morg, setMorg] = useState("");
  const [cost, setCost] = useState("");
  const [bulling, setBulling] = useState("");
  const [observaciones, setObservaciones] = useState("");
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

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    const fetchServerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8000/vservers/virtual/get/${serverId}`,
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
          setNombreServidor(data.data.server_info.name || "");
          setMarca(data.data.server_info.brand || "");
          setCores(data.data.server_info.cpu_cores || "");
          setRam(data.data.server_info.ram || "");
          setDiscos(data.data.server_info.total_disk_size || "");
          setSo(data.data.server_info.os_type || "");
          setSov(data.data.server_info.os_version || "");
          setEstado(data.data.server_info.status || "");
          setRol(data.data.server_info.role || "");
          setAmbiente(data.data.server_info.environment || "");
          setIp(data.data.server_info.ip_address || "");
          setCity(data.data.server_info.city || "");
          setLocation(data.data.server_info.location || "");
          setSow(data.data.server_info.service_owner || "");
          setAppcode(data.data.server_info.application_code || "");
          setResevc(data.data.server_info.responsible_evc || "");
          setDominio(data.data.server_info.domain || "");
          setSub(data.data.server_info.subsidiary || "");
          setResorg(data.data.server_info.responsible_organization || "");
          setBill(data.data.server_info.billable || "");
          setOprovi(data.data.server_info.oc_provisioning || "");
          setOdel(data.data.server_info.oc_deletion || "");
          setOmodi(data.data.server_info.oc_modification || "");
          setMperiod(data.data.server_info.maintenance_period || "");
          setMorg(data.data.server_info.maintenance_organization || "");
          setCost(data.data.server_info.cost_center || "");
          setBulling(data.data.server_info.billing_type || "");
          setObservaciones(data.data.server_info.comments || "");
        } else {
          console.error("Estructura de datos inesperada:", data);
          setError("Estructura de datos inesperada del servidor");
        }
      } catch (error) {
        console.error("Error en fetchServerData:", error);
        setError(error.message || "Error al obtener los datos del servidor");
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchServerData();
    }
  }, [serverId]);

  useEffect(() => {}, [nombreServidor]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const serverData = {
      name: nombreServidor,
      brand: marca,
      cpu_cores: cores,
      ram: ram,
      total_disk_size: discos,
      os_type: so,
      os_version: sov,
      status: estado,
      role: rol,
      environment: ambiente,
      ip_address: ip,
      city: city,
      location: location,
      service_owner: propietario,
      application_code: appcode,
      responsible_evc: resevc,
      domain: dominio,
      subsidiary: sub,
      responsible_organization: resorg,
      billable: bill,
      oc_provisioning: oprovi,
      oc_deletion: odel,
      oc_modification: omodi,
      maintenance_period: mperiod,
      maintenance_organization: morg,
      cost_center: cost,
      billing_type: bulling,
      comments: observaciones,
    };

    console.log(
      "Token de autenticación:",
      localStorage.getItem("authenticationToken")
    );
    console.log("Datos a enviar:", serverData);

    try {
      const response = await fetch(
        `http://localhost:8000/vservers/virtual/edit/${serverId}`,
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
        navigate("/servidoresv");
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

  if (loading) {
    return <div>Cargando datos del servidor...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.tittle}>
        <MdEdit />
        Editar Servidor
      </h2>
      <div className={styles.container}>
        {/*INICIO DE LA COLUMNA 1*/}
        <div className={styles.columnUno}>
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
              id="sov"
              name="sov"
              value={sov}
              onChange={(e) => setSov(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Versión SO*</div>
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

          <div className={styles.formGroup}>
            <input
              type="text"
              id="ip"
              name="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>IP*</div>
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
            <div className={styles.label}>Ciudad*</div>
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
            <div className={styles.label}>Ubicación*</div>
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
          <button type="submit" className={styles.button}>
            Guardar
          </button>
        </div>

        {/*INICIO DE LA COLUMNA 2*/}
        <div className={styles.columnDos}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="appcode"
              name="appcode"
              value={appcode}
              onChange={(e) => setAppcode(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Código de Aplicación*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="resevc"
              name="resevc"
              value={resevc}
              onChange={(e) => setResevc(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Responsable EVC*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="dominio"
              name="dominio"
              value={dominio}
              onChange={(e) => setDominio(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Dominio*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="sub"
              name="sub"
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Subsidiaria*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="resorg"
              name="resorg"
              value={resorg}
              onChange={(e) => setResorg(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Organización Responsable*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="bill"
              name="bill"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Facturable*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="oprovi"
              name="oprovi"
              value={oprovi}
              onChange={(e) => setOprovi(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Aprovisionamiento OC*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="odel"
              name="odel"
              value={odel}
              onChange={(e) => setOdel(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Eliminación OC*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="omodi"
              name="omodi"
              value={omodi}
              onChange={(e) => setOmodi(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Modificación OC*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="mperiod"
              name="mperiod"
              value={mperiod}
              onChange={(e) => setMperiod(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Periodo de Mantenimiento*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="morg"
              name="morg"
              value={morg}
              onChange={(e) => setMorg(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Organización de Mantenimiento*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="cost"
              name="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Centro de Costos*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="bulling"
              name="bulling"
              value={bulling}
              onChange={(e) => setBulling(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Tipo de Facturación*</div>
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
      </div>
    </form>
  );
};

export default EditarServerVirtual;
