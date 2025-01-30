import React, { useState } from "react";
import styles from "./crearBaseDatos.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BaseDatosForm = () => {
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

        const Base_Datos_Data = {
            name: nombreServidor,
            brand: marca,
            model: modelo,
            processor: procesador,
            ram: ram,
            cpu_cores: parseInt(cores, 10) || 0, //Manejo de error para cores
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
                    body: JSON.stringify(Base_Datos_Data),
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
                navigate("/servidoresf");
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
                Crear Bases de datos
            </h2>
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
                            <option value="">
                                Selecciona el rol
                            </option>
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
                            <option value="">
                                Selecciona el Ambiente
                            </option>
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
                            <option value="">
                                Selecciona una ciudad
                            </option>
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
                            <option value="">
                                Selecciona un estado
                            </option>
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
                            <option value="">
                                Selecciona una marca
                            </option>
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

export default BaseDatosForm;
