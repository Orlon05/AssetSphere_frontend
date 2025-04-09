import React, { useState, useEffect } from "react";
import { MdVisibility } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import styles from "./verSucursal.module.css";

const VerSucursal = () => {
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [processor, setProcessor] = useState("");
    const [cpu_cores, setCpuCores] = useState("");
    const [ram, setRam] = useState("");
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
    const [warranty_start_date, setWarrantyStartDate] = useState("");
    const [warranty_end_date, setWarrantyEndDate] = useState("");
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
    const [branch_code, setBranchCode] = useState("");
    const [branch_name, setBranchName] = useState("");
    const [region, setRegion] = useState("");
    const [department, setDepartment] = useState("");
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores

    const { sucursalId } = useParams();

    const token = localStorage.getItem("authenticationToken");

    useEffect(() => {
        const fetchSucursalData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/sucursales/get_by_id/${sucursalId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("authenticationToken")}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error al obtener datos de la sucursal:", errorData);
                    if (response.status === 404) {
                        throw new Error("Sucursal no encontrada");
                    } else if (response.status === 401) {
                        throw new Error("No autorizado");
                    } else {
                        throw new Error(`Error HTTP ${response.status}: ${errorData.message || errorData.detail}`);
                    }
                }

                const data = await response.json();
                if (data && data.status === "success" && data.data) {
                    setName(data.data.name || "");
                    setBrand(data.data.brand || "");
                    setModel(data.data.model || "");
                    setProcessor(data.data.processor || "");
                    setCpuCores(data.data.cpu_cores || "");
                    setRam(data.data.ram || "");
                    setTotalDiskSize(data.data.total_disk_size || "");
                    setOsType(data.data.os_type || "");
                    setOsVersion(data.data.os_version || "");
                    setStatus(data.data.status || "");
                    setRole(data.data.role || "");
                    setEnvironment(data.data.environment || "");
                    setSerial(data.data.serial || "");
                    setRackId(data.data.rack_id || "");
                    setUnit(data.data.unit || "");
                    setIpAddress(data.data.ip_address || "");
                    setCity(data.data.city || "");
                    setLocation(data.data.location || "");
                    setAssetId(data.data.asset_id || "");
                    setServiceOwner(data.data.service_owner || "");
                    setWarrantyStartDate(data.data.warranty_start_date ? new Date(data.data.warranty_start_date).toISOString().split("T")[0] : null);
                    setWarrantyEndDate(data.data.warranty_end_date ? new Date(data.data.warranty_end_date).toISOString().split("T")[0] : null);;
                    setApplicationCode(data.data.application_code || "");
                    setResponsibleEvc(data.data.responsible_evc || "");
                    setDomain(data.data.domain || "");
                    setSubsidiary(data.data.subsidiary || "");
                    setResponsibleOrganization(data.data.responsible_organization || "");
                    setBillable(data.data.billable || "");
                    setOcProvisioning(data.data.oc_provisioning || "");
                    setOcDeletion(data.data.oc_deletion || "");
                    setOcModification(data.data.oc_modification || "");
                    setMaintenancePeriod(data.data.maintenance_period || "");
                    setMaintenanceOrganization(data.data.maintenance_organization || "");
                    setCostCenter(data.data.cost_center || "");
                    setBillingType(data.data.billing_type || "");
                    setBranchCode(data.data.branch_code || "");
                    setBranchName(data.data.branch_name || "");
                    setRegion(data.data.region || "");
                    setDepartment(data.data.department || "");
                    setComments(data.data.comments || "");
                } else {
                    console.error("Estructura de datos inesperada:", data);
                    setError("Estructura de datos inesperada de la sucursal");
                }
            } catch (error) {
                console.error("Error al obtener datos de la sucursal:", error);
                setError(error.message || "Hubo un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        if (sucursalId) {
            fetchSucursalData();
        }
    }, [sucursalId]);


    useEffect(() => { }, [name, name]);

    // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
    if (loading) {
        return <div>Cargando datos de la sucursal...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form className={styles.form}>
            <div className={styles.containtTit}>
                <h2 className={styles.tittle}>
                    <MdVisibility />
                    Ver Sucursales
                </h2>
                <Link to="/inveplus/sucursales" className={styles.botonRegresar}>
                    Regresar
                </Link>
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
                        <div className={styles.label}>Nombre*</div>
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
                            type="number"
                            id="cpu_cores"
                            name="cpu_cores"
                            value={cpu_cores}
                            onChange={(e) => setCpuCores(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Núcleos de CPU*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="number"
                            id="ram"
                            name="ram"
                            value={ram}
                            onChange={(e) => setRam(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>RAM (GB)*</div>
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
                        <div className={styles.label}>Tamaño total de disco*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text"
                            id="os_type"
                            name="os_type"
                            value={os_type}
                            onChange={(e) => setOsType(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Tipo OS*</div>
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
                        <div className={styles.label}>Versión OS*</div>
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

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="rack_id"
                            name="rack_id"
                            value={rack_id}
                            onChange={(e) => setRackId(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>ID de rack*</div>
                    </div>

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
                        <div className={styles.label}>Dirección IP*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input type="text" 
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
                        <div className={styles.label}>ID de activo*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="service_owner"
                            name="service_owner"
                            value={service_owner}
                            onChange={(e) => setServiceOwner(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Propietario del servicio*</div>
                    </div>
                </div>

                {/*INICIO DE LA COLUMNA 2*/}
                <div className={styles.columnDos}>
                    <div className={styles.formGroup}>
                        <input
                            type="date"
                            id="warranty_start_date"
                            name="warranty_start_date"
                            value={warranty_start_date}
                            onChange={(e) => setWarrantyStartDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Fecha inicio de garantía*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="date"
                            id="warranty_end_date"
                            name="warranty_end_date"
                            value={warranty_end_date}
                            onChange={(e) => setWarrantyEndDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Fecha fin de garantía*</div>
                    </div>

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
                        <div className={styles.label}>Responsable EVC*</div>
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

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="subsidiary"
                            name="subsidiary"
                            value={subsidiary}
                            onChange={(e) => setSubsidiary(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Subsidiaria*</div>
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
                        <div className={styles.label}>Organización responsable*</div>
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
                        <div className={styles.label}>OC Provisioning*</div>
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
                        <div className={styles.label}>OC Deletion*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="oc_modification"
                            name="oc_modification"
                            value={oc_modification}
                            onChange={(e) => setOcModification(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>OC Modification*</div>
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
                        <div className={styles.label}>Período de mantenimiento*</div>
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
                        <div className={styles.label}>Tipo de facturación*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="branch_code"
                            name="branch_code"
                            value={branch_code}
                            onChange={(e) => setBranchCode(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Código de sucursal*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="branch_name"
                            name="branch_name"
                            value={branch_name}
                            onChange={(e) => setBranchName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Nombre sucursal*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text"
                            id="region"
                            name="region"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Región*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="department"
                            name="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Departamento*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <textarea
                            id="comments"
                            name="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Comentarios*</div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default VerSucursal;
