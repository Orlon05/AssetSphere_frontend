import React, { useState, useEffect } from "react";
import { MdVisibility } from "react-icons/md";
import { useParams } from "react-router-dom";
import styles from "./verServers.module.css";

const VerServers = () => {
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [processor, setProcessor] = useState("");
    const [cpu_cores, setCpuCores] = useState(0);
    const [ram, setRam] = useState(0);
    const [total_disk_size, setTotalDiskSize] = useState("");
    const [os_type, setOsType] = useState("");
    const [os_version, setOsVersion] = useState("");
    const [status, setStatus] = useState("");
    const [role, setRole] = useState("");
    const [environment, setEnvironment] = useState("");
    const [serial, setSerial] = useState("");
    const [rack_id, setRackId] = useState("");
    const [unit, setUnit] = useState("");
    const [ip_address, setIpAddress] = useState("");
    const [city, setCity] = useState("");
    const [location, setLocation] = useState("");
    const [asset_id, setAssetId] = useState("");
    const [service_owner, setServiceOwner] = useState("");
    const [warranty_start_date, setWarrantyStartDate] = useState(null);
    const [warranty_end_date, setWarrantyEndDate] = useState(null);
    const [application_code, setApplicationCode] = useState("");
    const [responsible_evc, setResponsibleEvc] = useState("");
    const [domain, setDomain] = useState("");
    const [subsidiary, setSubsidiary] = useState("");
    const [responsible_organization, setResponsibleOrganization] = useState("");
    const [billable, setBillable] = useState("");
    const [oc_provisioning, setOcProvisioning] = useState("");
    const [oc_deletion, setOcDeletion] = useState("");
    const [oc_modification, setOcModification] = useState("");
    const [maintenance_period, setMaintenancePeriod] = useState("");
    const [maintenance_organization, setMaintenanceOrganization] = useState("");
    const [cost_center, setCostCenter] = useState("");
    const [billing_type, setBillingType] = useState("");
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores
    
    const { serverId } = useParams();


    useEffect(() => {
        const fetchServerData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/servers/physical/${serverId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authenticationToken")}`,
                        },
                    }
                );
    
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al obtener datos del servidor:", errorData);
                    if (response.status === 404) {
                        throw new Error("Servidor no encontrado");
                    } else if (response.status === 401) {
                        throw new Error("No autorizado");
                    } else {
                        throw new Error(`Error HTTP ${response.status}: ${errorData.message || errorData.detail}`);
                    }
                }
    
                const data = await response.json();
                if (data && data.status === "success" && data.data) {
                    setName(data.data.server_info.name || "");
                    setBrand(data.data.server_info.brand || "");
                    setModel(data.data.server_info.model || "");
                    setProcessor(data.data.server_info.processor || "");
                    setCpuCores(parseInt(data.data.server_info.cpu_cores, 10) || 0); // Manejo de error para cores
                    setRam(data.data.server_info.ram || 0);
                    setTotalDiskSize(data.data.server_info.total_disk_size || "");
                    setOsType(data.data.server_info.os_type || "");
                    setOsVersion(data.data.server_info.os_version || "");
                    setStatus(data.data.server_info.status || "");
                    setRole(data.data.server_info.role || "");
                    setEnvironment(data.data.server_info.environment || "");
                    setSerial(data.data.server_info.serial || "");
                    setRackId(data.data.server_info.rack_id || "");
                    setUnit(data.data.server_info.unit || "");
                    setIpAddress(data.data.server_info.ip_address || "");
                    setCity(data.data.server_info.city || "");
                    setLocation(data.data.server_info.location || "");
                    setAssetId(data.data.server_info.asset_id || "");
                    setServiceOwner(data.data.server_info.service_owner || "");
                    setWarrantyStartDate(data.data.server_info.warranty_start_date || "");
                    setWarrantyEndDate(data.data.server_info.warranty_end_date || "");
                    setApplicationCode(data.data.server_info.application_code || "");
                    setResponsibleEvc(data.data.server_info.responsible_evc || "");
                    setDomain(data.data.server_info.domain || "");
                    setSubsidiary(data.data.server_info.subsidiary || "");
                    setResponsibleOrganization(data.data.server_info.responsible_organization || "");
                    setBillable(data.data.server_info.billable || "");
                    setOcProvisioning(data.data.server_info.oc_provisioning || "");
                    setOcDeletion(data.data.server_info.oc_deletion || "");
                    setOcModification(data.data.server_info.oc_modification || "");
                    setMaintenancePeriod(data.data.server_info.maintenance_period || "");
                    setMaintenanceOrganization(data.data.server_info.maintenance_organization || "");
                    setCostCenter(data.data.server_info.cost_center || "");
                    setBillingType(data.data.server_info.billing_type || "");
                    setComments(data.data.server_info.comments || "");
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
            fetchServerData();
        }
    }, [serverId]);
    

    useEffect(() => { }, [name, brand]);

    // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
    if (loading) {
        return <div>Cargando datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form className={styles.form}>
            <div className={styles.containtTit}>
                <h2 className={styles.tittle}>
                    <MdVisibility  />
                    Visualizar Servidores
                </h2>
            </div>
            <div className={styles.container}>
                {/*INICIO DE LA COLUMNA 1*/}
                <div className={styles.columnUno}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Nombre del servidor*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="brand"
              name="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Marca*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="model"
              name="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Modelo*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="processor"
              name="processor"
              value={processor}
              onChange={(e) => setProcessor(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Procesador*</div>
          </div>

          
          <div className={styles.formGroup}>
            <input
              type="text" 
              id="cpu_cores"
              name="cpu_cores"
              value={cpu_cores}
              onChange={(e) => setCpuCores(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Cpu Cores*</div>
          </div>

          <hr className={styles.lines} />

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
              id="total_disk_size"
              name="total_disk_size"
              value={total_disk_size}
              onChange={(e) => setTotalDiskSize(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Tamaño del disco*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="os_type"
              name="os_type"
              value={os_type}
              onChange={(e) => setOsType(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Sistema Operativo*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="os_version"
              name="os_version"
              value={os_version}
              onChange={(e) => setOsVersion(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Version sistema operativo*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Estado*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Rol*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="environment"
              name="environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Ambiente*</div>
          </div>

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

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="rack_id"
              name="rack_id"
              value={rack_id}
              onChange={(e) => setRackId(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Id del rack*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="unit"
              name="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Unidad*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="ip_address"
              name="ip_address"
              value={ip_address}
              onChange={(e) => setIpAddress(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Version sistema operativo*</div>
          </div>

          <div className={styles.formGroup}>
            <textarea
              id="comments"
              name="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
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
              id="asset_id"
              name="asset_id"
              value={asset_id}
              onChange={(e) => setAssetId(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Id del activo*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="service_owner"
              name="service_owner"
              value={service_owner}
              onChange={(e) => setServiceOwner(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Propietario*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="date"
              id="warranty_start_date"
              name="warranty_start_date"
              value={warranty_start_date}
              onChange={(e) => setWarrantyStartDate(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Fecha inicio garantía*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="date"
              id="warranty_end_date"
              name="warranty_end_date"
              value={warranty_end_date}
              onChange={(e) => setWarrantyEndDate(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Fecha fin garantía*</div>
          </div>

          <hr className={styles.lines} />

          <div className={styles.formGroup}>
            <input
              type="text"
              id="application_code"
              name="application_code"
              value={application_code}
              onChange={(e) => setApplicationCode(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Código de aplicación*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="responsible_evc"
              name="responsible_evc"
              value={responsible_evc}
              onChange={(e) => setResponsibleEvc(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>EVC responsable*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="domain"
              name="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Dominio*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="subsidiary"
              name="subsidiary"
              value={subsidiary}
              onChange={(e) => setSubsidiary(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Filial*</div>
          </div>
          

          <div className={styles.formGroup}>
            <input
              type="text"
              id="responsible_organization"
              name="responsible_organization"
              value={responsible_organization}
              onChange={(e) => setResponsibleOrganization(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Organización responsable</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="billable"
              name="billable"
              value={billable}
              onChange={(e) => setBillable(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Facturable*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="oc_provisioning"
              name="oc_provisioning"
              value={oc_provisioning}
              onChange={(e) => setOcProvisioning(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>OC de aprovisionamiento*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="oc_deletion"
              name="oc_deletion"
              value={oc_deletion}
              onChange={(e) => setOcDeletion(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>OC de eliminación*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="oc_modification"
              name="oc_modification"
              value={oc_modification}
              onChange={(e) => setOcModification(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>OC de modificación*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="maintenance_period"
              name="maintenance_period"
              value={maintenance_period}
              onChange={(e) => setMaintenancePeriod(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Periodo de mantenimiento*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="maintenance_organization"
              name="maintenance_organization"
              value={maintenance_organization}
              onChange={(e) => setMaintenanceOrganization(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Organización de mantenimiento*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="cost_center"
              name="cost_center"
              value={cost_center}
              onChange={(e) => setCostCenter(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Centro de costos*</div>
          </div>

          <div className={styles.formGroup}>
            <input
              type="text"
              id="billing_type"
              name="billing_type"
              value={billing_type}
              onChange={(e) => setBillingType(e.target.value)}
              className={styles.input}
            />
            <div className={styles.label}>Tipo de cobro*</div>
            </div>
          </div>
        </div>
    </form>
  );
};

export default VerServers;
