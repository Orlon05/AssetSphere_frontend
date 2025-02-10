import React, { useState, useEffect } from "react";
import { MdVisibility } from "react-icons/md";
import { useParams } from "react-router-dom";
import styles from "./verStorage.module.css";

const VerStorage = () => {
    const [cod_item_configuracion, setCodItemConfiguracion] = useState("");
    const [name, setName] = useState("");
    const [application_code, setApplicationCode] = useState("");
    const [cost_center, setCostCenter] = useState("");
    const [active, setActive] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [item, setItem] = useState("");
    const [company, setCompany] = useState("");
    const [organization_responsible, setOrganizationResponsible] = useState("");
    const [host_name, setHostName] = useState("");
    const [manufacturer, setManufacturer] = useState("");
    const [status, setStatus] = useState("");
    const [owner, setOwner] = useState("");
    const [model, setModel] = useState("");
    const [serial, setSerial] = useState("");
    const [org_maintenance, setOrgMaintenance] = useState("");
    const [ip_address, setIpAddress] = useState("");
    const [disk_size, setDiskSize] = useState("");
    const [location, setLocation] = useState("");
    const [loading, setLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores

    const { storageId } = useParams();

    const application_code_ = [
        "AP0240001",
        "POWERMAX2500"
    ];

    const cost_center_ = [
        "C103500120",
    ];

    const active_ = [
        "Si",
        "No"
    ];

    const category_ = [
        "Hardware"
    ];

    const type_ = [
        "Storage"
    ];

    const item_ = [
        "NAS",
        "Storage",
        "SAN"
    ];

    const company_ = [
        "BANCOLOMBIA S.A.",
        "BANISTMO S.A."
    ];

    const organization_responsible_ = [
        "PLATAFORMAS CENTRALES TI"
    ];

    const manufacturer_ = [
        "Dell",
        "Hitachi",
        "Brocade"
    ];

    const status_ = [
        "Aplicado",
        "Eliminar",
    ];

    const owner_ = [
        "Jenifer Yolima Gonzalez Munoz",
    ];

    const model_ = [
        "Isilon H400",
        "ECS Gen3 EX300",
        "Ds-6620BDs-6620B",
        "ED-DCX6-8BED",
        "Data Domain 6900",
        "A9000R",
        "Powermax 2500",
        "Powermax 8000",
        "Unity 650F",
        "VSP E1090"
    ];

    const org_maintenance_ = [
        "TCS",
        "BANISTMO S.A."
    ];

    const location_ = [
        "EDIFICIO CENTRO COMPUTO NIQUIA BANCOLOMB",
        "EDIFICIO CENTRO COMPUTO NIQUIA BANCOLOMBIA BANISTMO"
    ];

    const token = localStorage.getItem("authenticationToken");

    useEffect(() => {
        const fetchStorageData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/storage/get_by_id/${storageId}`,
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
                    console.error("Error al obtener datos del storage:", errorData); // Logs para depuración
                    if (response.status === 404) {
                        throw new Error("Storage no encontrado");
                    } else if (response.status === 401) {
                        throw new Error("No autorizado");
                    } else {
                        throw new Error(
                            `Error HTTP ${response.status}: ${errorData.message || errorData.detail
                            }`
                        );
                    }
                }
                const data = await response.json();
                // console.log("Datos recibidos:", data);
                // Actualiza los estados con los datos recibidos
                if (data.status === "success" && data.data) {
                    setCodItemConfiguracion(data.data.cod_item_configuracion || "");
                    setName(data.data.name || "");
                    setApplicationCode(data.data.application_code || "");
                    setCostCenter(data.data.cost_center || "");
                    setActive(data.data.active || "");
                    setCategory(data.data.category || "");
                    setType(data.data.type || "");
                    setItem(data.data.item || "");
                    setCompany(data.data.company || "");
                    setOrganizationResponsible(data.data.organization_responsible || "");
                    setHostName(data.data.host_name || "");
                    setManufacturer(data.data.manufacturer || "");
                    setStatus(data.data.status || "");
                    setOwner(data.data.owner || "");
                    setModel(data.data.model || "");
                    setSerial(data.data.serial || "");
                    setOrgMaintenance(data.data.org_maintenance || "");
                    setIpAddress(data.data.ip_address || "");
                    setDiskSize(data.data.disk_size || "");
                    setLocation(data.data.location || "");
                } else {
                    console.error("Estructura de datos inesperada:", data);
                    setError("Estructura de datos inesperada del storage");
                }

                console.error("Error en fetchStorageData:", error);
            } finally {
                setLoading(false);
            }
        };

        if (storageId) {
            fetchStorageData();
        }
    }, [storageId]);

    useEffect(() => { }, [cod_item_configuracion, cod_item_configuracion]);

    // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
    if (loading) {
        return <div>Cargando datos del storage...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form className={styles.form}>
            <div className={styles.containtTit}>
                <h2 className={styles.tittle}>
                    <MdVisibility  />
                    Ver Storages
                </h2>
            </div>
            <div className={styles.container}>
                {/*INICIO DE LA COLUMNA 1*/}
                <div className={styles.columnUno}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="cod_item_configuracion"
                            name="cod_item_configuracion"
                            value={cod_item_configuracion}
                            onChange={(e) => setCodItemConfiguracion(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Cod_item_configuracion*</div>
                    </div>

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
                        <select
                            id="application_code"
                            name="application_code"
                            value={application_code}
                            onChange={(e) => setApplicationCode(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar código de aplicación</option>
                            {application_code_.map((application_code) => (
                                <option key={application_code} value={application_code}>
                                    {application_code}
                                </option>
                            ))}
                        </select>
                        
                        <div className={styles.labelSelect}>Application Code*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <select
                            id="cost_center"
                            name="cost_center"
                            value={cost_center}
                            onChange={(e) => setCostCenter(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar centro de costos</option>
                            {cost_center_.map((cost_center) => (
                                <option key={cost_center} value={cost_center}>
                                    {cost_center}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Cost Center*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="active"
                            name="active"
                            value={active}
                            onChange={(e) => setActive(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar activo</option>
                            {active_.map((active) => (
                                <option key={active} value={active}>
                                    {active}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Active*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar categoría</option>
                            {category_.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Category*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <select
                            id="type"
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar tipo</option>
                            {type_.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Type*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="item"
                            name="item"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar ítem</option>
                            {item_.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Item*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="company"
                            name="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar empresa</option>
                            {company_.map((company) => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Company*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="organization_responsible"
                            name="organization_responsible"
                            value={organization_responsible}
                            onChange={(e) => setOrganizationResponsible(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar organización responsable</option>
                            {organization_responsible_.map((organization_responsible) => (
                                <option key={organization_responsible} value={organization_responsible}>
                                    {organization_responsible}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Organization responsible*</div>
                    </div>
                  
                </div>

                {/*INICIO DE LA COLUMNA 2*/}
                <div className={styles.columnDos}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="host_name"
                            name="host_name"
                            value={host_name}
                            onChange={(e) => setHostName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Nombre del host*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="manufacturer"
                            name="manufacturer"
                            value={manufacturer}
                            onChange={(e) => setManufacturer(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar fabricante</option>
                            {manufacturer_.map((manufacturer) => (
                                <option key={manufacturer} value={manufacturer}>
                                    {manufacturer}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Manufacturer*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar estado</option>
                            {status_.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Status*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <select
                            id="owner"
                            name="owner"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar propietario</option>
                            {owner_.map((owner) => (
                                <option key={owner} value={owner}>
                                    {owner}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Owner*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="model"
                            name="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar modelo</option>
                            {model_.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Model*</div>
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
                        <select
                            id="org_maintenance"
                            name="org_maintenance"
                            value={org_maintenance}
                            onChange={(e) => setOrgMaintenance(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar organización de mantenimiento</option>
                            {org_maintenance_.map((org_maintenance) => (
                                <option key={org_maintenance} value={org_maintenance}>
                                    {org_maintenance}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Org Maintenance*</div>
                    </div>

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
                        <input
                            type="text"
                            id="disk_size"
                            name="disk_size"
                            value={disk_size}
                            onChange={(e) => setDiskSize(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Capacidad de disco en Bytes*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="location"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">Seleccionar ubicación</option>
                            {location_.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                        <div className={styles.labelSelect}>Location*</div>
                    </div>
                </div>
            </div>
        </form>

    );
};

export default VerStorage;
