import React, { useState, useEffect } from "react";
import { MdVisibility } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import styles from "./verBaseDatos.module.css";


const VerBaseDatos = () => {
    const [instance_id, setInstanceId] = useState("");
    const [cost_center, setCostCenter] = useState("");
    const [category, setCategory] = useState("");
    const [type, setType] = useState("");
    const [item, setItem] = useState("");
    const [owner_contact, setOwnerContact] = useState("");
    const [name, setName] = useState("");
    const [application_code, setApplicationCode] = useState("");
    const [inactive, setInactive] = useState("");
    const [asset_life_cycle_status, setAssetLifeCycleStatus] = useState("");
    const [system_environment, setSystemEnvironment] = useState("");
    const [cloud, setCloud] = useState("");
    const [version_number, setVersionNumber] = useState("");
    const [serial, setSerial] = useState("");
    const [ci_tag, setCiTag] = useState("");
    const [instance_name, setInstanceName] = useState("");
    const [model, setModel] = useState("");
    const [ha, setHa] = useState("");
    const [port, setPort] = useState("");
    const [owner_name, setOwnerName] = useState("");
    const [department, setDepartment] = useState("");
    const [company, setCompany] = useState("");
    const [manufacturer_name, setManufacturerName] = useState("");
    const [supplier_name, setSupplierName] = useState("");
    const [supported, setSupported] = useState("");
    const [account_id, setAccountId] = useState("");
    const [create_date, setCreateDate] = useState(null);
    const [modified_date, setModifiedDate] = useState(null);
    const [loading, setLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const { baseDatosId } = useParams();

    const token = localStorage.getItem("authenticationToken");

    useEffect(() => {
        const fetchBaseDatosData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/base_datos/get_by_id/${baseDatosId}`,
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
                    console.error("Error al obtener datos de la base de datos:", errorData); // Logs para depuración
                    if (response.status === 404) {
                        throw new Error("Base de datos no encontrada");
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
                    setInstanceId(data.data.instance_id || "");
                    setCostCenter(data.data.cost_center || "");
                    setCategory(data.data.category || "");
                    setType(data.data.type || "");
                    setItem(data.data.item || "");
                    setOwnerContact(data.data.owner_contact || "");
                    setName(data.data.name || "");
                    setApplicationCode(data.data.application_code || "");
                    setInactive(data.data.inactive || "");
                    setAssetLifeCycleStatus(data.data.asset_life_cycle_status || "");
                    setSystemEnvironment(data.data.system_environment || "");
                    setCloud(data.data.cloud || "");
                    setVersionNumber(data.data.version_number || "");
                    setSerial(data.data.serial || "");
                    setCiTag(data.data.ci_tag || "");
                    setInstanceName(data.data.instance_name || "");
                    setModel(data.data.model || "");
                    setHa(data.data.ha || "");
                    setPort(data.data.port || "");
                    setOwnerName(data.data.owner_name || "");
                    setDepartment(data.data.department || "");
                    setCompany(data.data.company || "");
                    setManufacturerName(data.data.manufacturer_name || "");
                    setSupplierName(data.data.supplier_name || "");
                    setSupported(data.data.supported || "");
                    setAccountId(data.data.account_id || "");
                    setCreateDate(data.data.create_date ? new Date(data.data.create_date).toISOString().split("T")[0] : null);
                    setModifiedDate(data.data.modified_date ? new Date(data.data.modified_date).toISOString().split("T")[0] : null);


                } else {
                    console.error("Estructura de datos inesperada:", data);
                    setError("Estructura de datos inesperada de la base de datos");
                }
            } catch (error) {
                console.error("Error al obtener datos del storage:", error);
                setError(error.message || "Hubo un error al cargar los datos.");
            } finally {
                setLoading(false);
            }
        };

        if (baseDatosId) {
            fetchBaseDatosData();
        }
    }, [baseDatosId]);

    useEffect(() => { }, [instance_id, instance_id]);

    // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
    if (loading) {
        return <div>Cargando datos de la base de datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form className={styles.form}>
            <div className={styles.containtTit}>
                <h2 className={styles.tittle}>
                    <MdVisibility />
                    Ver Base de Datos
                </h2>
                <Link to="/inveplus/Base-De-Datos" className={styles.botonRegresar}>
                    Regresar
                </Link>
            </div>
            <div className={styles.container}>
                {/*INICIO DE LA COLUMNA 1*/}
                <div className={styles.columnUno}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="instance_id"
                            name="instance_id"
                            value={instance_id}
                            onChange={(e) => setInstanceId(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>ID de instancia*</div>
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
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Categoría*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="type"
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Tipo*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="item"
                            name="item"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Ítem*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="owner_contact"
                            name="owner_contact"
                            value={owner_contact}
                            onChange={(e) => setOwnerContact(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Contacto del propietario*</div>
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

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="inactive"
                            name="inactive"
                            value={inactive}
                            onChange={(e) => setInactive(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Inactivo*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="asset_life_cycle_status"
                            name="asset_life_cycle_status"
                            value={asset_life_cycle_status}
                            onChange={(e) => setAssetLifeCycleStatus(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Estado del ciclo de vida del activo*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="system_environment"
                            name="system_environment"
                            value={system_environment}
                            onChange={(e) => setSystemEnvironment(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Entorno del sistema*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="cloud"
                            name="cloud"
                            value={cloud}
                            onChange={(e) => setCloud(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Nube*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input 
                            type="text"
                            id="version_number"
                            name="version_number"
                            value={version_number}
                            onChange={(e) => setVersionNumber(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Número de versión*</div>
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
                        <div className={styles.label}>Serie*</div>
                    </div>
                </div>

                {/*INICIO DE LA COLUMNA 2*/}
                <div className={styles.columnDos}>

                    <div className={styles.formGroup}>
                        <input
                            type="ci_tag"
                            id="ci_tag"
                            name="ci_tag"
                            value={ci_tag}
                            onChange={(e) => setCiTag(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Etiqueta CI*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="instance_name"
                            id="instance_name"
                            name="instance_name"
                            value={instance_name}
                            onChange={(e) => setInstanceName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Nombre de instancia*</div>
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
                            id="ha"
                            name="ha"
                            value={ha}
                            onChange={(e) => setHa(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>HA*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="port"
                            id="port"
                            name="port"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Puerto*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="owner_name"
                            name="owner_name"
                            value={owner_name}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Nombre del propietario*</div>
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
                        <input 
                            type="text" 
                            id="company"
                            name="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Compañía*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="manufacturer_name"
                            name="manufacturer_name"
                            value={manufacturer_name}
                            onChange={(e) => setManufacturerName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Nombre del fabricante*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="supplier_name"
                            name="supplier_name"
                            value={supplier_name}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className={styles.input}
                        />  
                        <div className={styles.label}>Nombre del proveedor*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input 
                            type="text" 
                            id="supported"
                            name="supported"
                            value={supported}
                            onChange={(e) => setSupported(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Soporte*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="account_id"
                            id="account_id"
                            name="account_id"
                            value={account_id}
                            onChange={(e) => setAccountId(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>ID de cuenta*</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="date"
                            id="create_date"
                            name="create_date"
                            value={create_date || ""}
                            onChange={(e) => setCreateDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Fecha de creación*</div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <input
                            type="date"
                            id="modified_date"
                            name="modified_date"
                            value={modified_date || ""}
                            onChange={(e) => setModifiedDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Fecha de modificación*</div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default VerBaseDatos;
