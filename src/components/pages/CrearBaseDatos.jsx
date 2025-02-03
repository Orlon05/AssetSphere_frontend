import React, { useState } from "react";
import styles from "./crearServidor.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BaseDatosForm = () => {
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
    const [create_date, setCreateDate] = useState("");
    const [modified_date, setModifiedDate] = useState("");
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
        },
    });

    // Función para mostrar un Toast de éxito después de crear una receta
    const showSuccessToast = () => {
        Toast.fire({
            icon: "success",
            title: "Base de datos creada exitosamente",
        });
    };

    const ciudadesCapitalesColombia = [
        "Bogotá",
        "Medellín",
        "Bello",
        "Sincelejo",
        "Ibague",
        "Valledupar",
    ];

    const ambienteServidores = [
        "Producción",
        "Certificación",
    ];

    const estadoServidores = [
        "Encendido",
        "Apagado",
        "Mantenimiento",
    ];

    const marcaServidores = [
        "Cisco",
        "HP",
        "Lenovo",
        "DELL",
    ];

    const rolServidores = [
        "NUTANIX",
        "AXIOM10",
        "OLVM",
        "CITRIX BANCOLOMBIA",
        "CITRIX",
        "WINDOWS",
        "LINUX",
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();

        const baseDatosData = {
            instance_id: instance_id,
            cost_center: cost_center,
            category: category,
            type: type,
            item: item,
            owner_contact: owner_contact,
            name: name,
            application_code: application_code,
            inactive: inactive,
            asset_life_cycle_status: asset_life_cycle_status,
            system_environment: system_environment,
            cloud: cloud,
            version_number: version_number,
            serial: serial,
            ci_tag: ci_tag,
            instance_name: instance_name,
            model: model,
            ha: ha,
            port: port,
            owner_name: owner_name,
            department: department,
            company: company,
            manufacturer_name: manufacturer_name,
            supplier_name: supplier_name,
            supported: supported,
            account_id: account_id,
            create_date: create_date,
            modified_date: modified_date,
        };

        try {
            const token = localStorage.getItem("authenticationToken");
            if (!token) {
                throw new Error("Token de autorización no encontrado.");
            }

            const response = await fetch(
                "http://localhost:8000/base_datos/add",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(baseDatosData),
                }
            );

            if (!response.ok) {
                let errorMessage = `Error HTTP ${response.status}`;
                if (response.status === 422) {
                    const errorData = await response.json();
                    errorMessage = errorData.detail.map((e) => e.msg).join(", ");
                } else if (response.status === 401 || response.status === 403) {
                    errorMessage =
                        "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
                } else {
                    try {
                        const errorData = await response.json();
                        if (errorData.message) errorMessage = errorData.message;
                    } catch (e) { }
                }
                Swal.fire({
                    icon: "error",
                    title: "Error al crear la base de datos",
                    text: errorMessage,
                });
            } else {
                showSuccessToast();
                navigate("/baseDatosf");
            }
        } catch (error) {
            console.error("Error:", error); // Registra el error en la consola para depuración
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "Ocurrió un error inesperado.",
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.tittle}>
                <IoIosAdd />
                Crear Base de Datos
            </h2>
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
                        <div className={styles.label}>instance_id*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="cost_center"
                            name="cost_center"
                            value={cost_center}
                            onChange={(e) => setCostCenter(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el centro de costos
                            </option>
                            {cost_center_.map((cost_center) => (
                                <option key={cost_center} value={cost_center}>
                                    {cost_center}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="category"
                            name="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona la categoría
                            </option>
                            {category_.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
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
                            <option value="">
                                Selecciona el tipo
                            </option>
                            {type_.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="item"
                            name="item"
                            value={item}
                            onChange={(e) => setItem(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el item
                            </option>
                            {item_.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
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
                        <div className={styles.label}>owner_contact</div>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Name*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="application_code"
                            name="application_code"
                            value={application_code}
                            onChange={(e) => setApplicationCode(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el Application Code
                            </option>
                            {application_code_.map((application_code) => (
                                <option key={application_code} value={application_code}>
                                    {application_code}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="inactive"
                            name="inactive"
                            value={inactive}
                            onChange={(e) => setInactive(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el inactive
                            </option>
                            {inactive_.map((inactive) => (
                                <option key={inactive} value={inactive}>
                                    {inactive}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <select
                            id="asset_life_cycle_status"
                            name="asset_life_cycle_status"
                            value={asset_life_cycle_status}
                            onChange={(e) => setAssetLifeCycleStatus(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el asset_life_cycle_status
                            </option>
                            {asset_life_cycle_status_.map((asset_life_cycle_status) => (
                                <option key={asset_life_cycle_status} value={asset_life_cycle_status}>
                                    {asset_life_cycle_status}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className={styles.button}>
                        Guardar
                    </button>
                </div>

                {/*INICIO DE LA COLUMNA 2*/}
                <div className={styles.columnDos}>

                <div className={styles.formGroup}>
                        <select
                            id="system_environment"
                            name="system_environment"
                            value={system_environment}
                            onChange={(e) => setSystemEnvironment(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el system_environment
                            </option>
                            {system_environment_.map((system_environment) => (
                                <option key={system_environment} value={system_environment}>
                                    {system_environment}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="cloud"
                            name="cloud"
                            value={cloud}
                            onChange={(e) => setCloud(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el cloud
                            </option>
                            {cloud_.map((cloud) => (
                                <option key={cloud} value={cloud}>
                                    {cloud}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="version_number"
                            name="version_number"
                            value={version_number}
                            onChange={(e) => setVersionNumber(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el version_number
                            </option>
                            {version_number_.map((version_number) => (
                                <option key={version_number} value={version_number}>
                                    {version_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className={styles.lines} />

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
                            type="ci_tag"
                            id="ci_tag"
                            name="ci_tag"
                            value={ci_tag}
                            onChange={(e) => setCiTag(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>ci_tag*</div>
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
                        <div className={styles.label}>instance_name*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="model"
                            name="model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el modelo
                            </option>
                            {model_.map((model) => (
                                <option key={model} value={model}>
                                    {model}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="ha"
                            id="ha"
                            name="ha"
                            value={ha}
                            onChange={(e) => setHa(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>ha*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="port"
                            id="port"
                            name="port"
                            value={port}
                            onChange={(e) => setPort(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>port*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="owner_name"
                            name="owner_name"
                            value={owner_name}
                            onChange={(e) => setOwnerName(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el owner_name
                            </option>
                            {owner_name_.map((owner_name) => (
                                <option key={owner_name} value={owner_name}>
                                    {owner_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <select
                            id="department"
                            name="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el department
                            </option>
                            {department_.map((department) => (
                                <option key={department} value={department}>
                                    {department}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="company"
                            name="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona la compañía
                            </option>
                            {company_.map((company) => (
                                <option key={company} value={company}>
                                    {company}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="manufacturer_name"
                            name="manufacturer_name"
                            value={manufacturer_name}
                            onChange={(e) => setManufacturerName(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el manufacturer_name
                            </option>
                            {manufacturer_name_.map((manufacturer_name) => (
                                <option key={manufacturer_name} value={manufacturer_name}>
                                    {manufacturer_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <hr className={styles.lines} />

                    <div className={styles.formGroup}>
                        <input
                            type="supplier_name"
                            id="supplier_name"
                            name="supplier_name"
                            value={supplier_name}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>supplier_name*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="supported"
                            name="supported"
                            value={supported}
                            onChange={(e) => setSupported(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el supported
                            </option>
                            {supported_.map((supported) => (
                                <option key={supported} value={supported}>
                                    {supported}
                                </option>
                            ))}
                        </select>
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
                        <div className={styles.label}>account_id*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="date"
                            id="create_date"
                            name="create_date"
                            value={create_date}
                            onChange={(e) => setCreateDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>create_date*</div>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="date"
                            id="modified_date"
                            name="modified_date"
                            value={modified_date}
                            onChange={(e) => setModifiedDate(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>modified_date*</div>
                    </div>

                </div>
            </div>
        </form>
    );
};

export default BaseDatosForm;
