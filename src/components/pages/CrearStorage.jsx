import React, { useState } from "react";
import styles from "./crearServidor.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const StorageForm = () => {
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
            title: "Storage creado exitosamente",
        });
    };

    const application_code_ = [
        "AP0240001",
        "POWERMAX2500"
    ];

    const cost_center_ = [
        "C103500120",
        "Certificación",
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const storageData = {
            cod_item_configuracion: cod_item_configuracion,
            name: name,
            application_code: application_code,
            cost_center: cost_center,
            active: active,
            category: category,
            type: type,
            item: item,
            company: company,
            organization_responsible: organization_responsible,
            host_name: host_name,
            manufacturer: manufacturer,
            status: status,
            owner: owner,
            model: model,
            serial: serial,
            org_maintenance: org_maintenance,
            ip_address: ip_address,
            disk_size: disk_size,
            location: location,
        };

        try {
            const token = localStorage.getItem("authenticationToken");
            if (!token) {
                throw new Error("Token de autorización no encontrado.");
            }

            const response = await fetch(
                "http://localhost:8000/storage/add",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(storageData),
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
                    title: "Error al crear el storage",
                    text: errorMessage,
                });
            } else {
                showSuccessToast();
                navigate("/storage");
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
                Crear Storages
            </h2>
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

                    <hr className={styles.lines} />

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
                            id="active"
                            name="active"
                            value={active}
                            onChange={(e) => setActive(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el activo
                            </option>
                            {active_.map((active) => (
                                <option key={active} value={active}>
                                    {active}
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
                            id="organization_responsible"
                            name="organization_responsible"
                            value={organization_responsible}
                            onChange={(e) => setOrganizationResponsible(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona la organización responsable
                            </option>
                            {organization_responsible_.map((organization_responsible) => (
                                <option key={organization_responsible} value={organization_responsible}>
                                    {organization_responsible}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* <div className={styles.formGroup}>
                        <textarea
                            id="observaciones"
                            name="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            className={styles.texTarea}
                        />
                        <div className={styles.labelTarea}>Observaciones</div>
                    </div> */}

                    <button type="submit" className={styles.button}>
                        Guardar
                    </button>
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
                            <option value="">
                                Selecciona el fabricante
                            </option>
                            {manufacturer_.map((manufacturer) => (
                                <option key={manufacturer} value={manufacturer}>
                                    {manufacturer}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el estado
                            </option>
                            {status_.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
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
                            <option value="">
                                Selecciona el propietario
                            </option>
                            {owner_.map((owner) => (
                                <option key={owner} value={owner}>
                                    {owner}
                                </option>
                            ))}
                        </select>
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
                            <option value="">
                                Selecciona el OrgMantenimiento
                            </option>
                            {org_maintenance_.map((org_maintenance) => (
                                <option key={org_maintenance} value={org_maintenance}>
                                    {org_maintenance}
                                </option>
                            ))}
                        </select>
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
                            <option value="">
                                Selecciona la ubicación
                            </option>
                            {location_.map((location) => (
                                <option key={location} value={location}>
                                    {location}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default StorageForm;
