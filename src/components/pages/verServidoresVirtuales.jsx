import React, { useState, useEffect } from "react";
import { MdVisibility } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import styles from "./verServidoresVirtuales.module.css";

const verServidoresVirtuales = () => {
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
  const [sow, setSow] = useState("");
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

  const { serverId } = useParams();

  const token = localStorage.getItem("authenticationToken");

  useEffect(() => {
    const fetchStorageData = async () => {
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
          const errorData = await response.json();
          console.error("Error al obtener datos del storage:", errorData);
          if (response.status === 404) {
            throw new Error("Storage no encontrado");
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
        if (data && data.status === "success" && data.data) {
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
          setError("Estructura de datos inesperada del storage");
        }
      } catch (error) {
        console.error("Error al obtener datos del storage:", error);
        setError(error.message || "Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    if (serverId) {
      fetchStorageData();
    }
  }, [serverId]);

  useEffect(() => {}, [nombreServidor]);

  // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
  if (loading) {
    return <div>Cargando datos del servidor...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <form className={styles.form}>
        <div className={styles.containtTit}>
      <h2 className={styles.tittle}>
        <MdVisibility />
        Ver Servidor
      </h2>
      <Link to="/servidoresv" className={styles.botonRegresar}>
                    Regresar
                </Link>
                </div>
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
              id="sow"
              name="sow"
              value={sow}
              onChange={(e) => setPropietario(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Propietario*</div>
          </div>
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

export default verServidoresVirtuales;
