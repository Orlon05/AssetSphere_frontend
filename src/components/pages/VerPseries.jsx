import React, { useState, useEffect } from "react";
import { MdVisibility } from "react-icons/md";
import { useParams } from "react-router-dom";
import styles from "./verPseries.module.css";

const VerPseries = () => {
    const [name, setName] = useState("");
    const [application, setApplication] = useState("");
    const [hostname, setHostName] = useState("");
    const [ip_address, setIpAddress] = useState("");
    const [environment, setEnvironment] = useState(0);
    const [slot, setSlot] = useState(0);
    const [lpar_id, setLparId] = useState("");
    const [status, setStatus] = useState("");
    const [os, setOs] = useState("");
    const [version, setVersion] = useState("");
    const [subsidiary, setSubsidiary] = useState("");
    const [min_cpu, setMinCpu] = useState("");
    const [act_cpu, setActCpu] = useState("");
    const [max_cpu, setMaxCpu] = useState("");
    const [min_v_cpu, setMinVCpu] = useState("");
    const [act_v_cpu, setActVCpu] = useState("");
    const [max_v_cpu, setMaxVCpu] = useState("");
    const [min_memory, setMinMemory] = useState("");
    const [act_memory, setActMemory] = useState("");
    const [max_memory, setMaxMemory] = useState("");
    const [expansion_factor, setExpansionFactor] = useState("");
    const [memory_per_factor, setMemoryPerFactor] = useState("");
    const [processor_compatibility, setProcessorCompatibility] = useState("");
    const [loading, setLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores

  const { pserieId } = useParams();

  const environment_ = [
    "Certificación",
    "Desarrollo",
    "Producción",
    "Pruebas",
    "VIOS-Producción"
];

const status_ = [
    "Not Activated",
    "Running",
];

const os_ = [
    "Aixlinux",
    "Vioserver"
];

const subsidiary_ = [
    "Bancolombia",
    "Banistmo",
    "Filiales OffShore",
    "Nequi"
];

const processor_compatibility_ = [
    "Defalut",
    "POWER7",
    "POWER8",
    "POWER9",
    "POWER9_base",
    "#N/D"
];

    const token = localStorage.getItem("authenticationToken");

    useEffect(() => {
        const fetchPseriesData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `http://localhost:8000/pseries/pseries/get_by_id/${pserieId}`,
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
                            `Error HTTP ${response.status}: ${errorData.message || errorData.detail
                            }`
                        );
                    }
                }
                const data = await response.json();
                // console.log("Datos recibidos:", data);
                // Actualiza los estados con los datos recibidos
                if (data.status === "success" && data.data) {
                    setName(data.data.name || "");
                    setApplication(data.data.application || "");
                    setHostName(data.data.hostname || "");
                    setIpAddress(data.data.ip_address || "");
                    setEnvironment(data.data.environment || "");
                    setSlot(data.data.slot || "");
                    setLparId(data.data.lpar_id || "");
                    setStatus(data.data.status || "");
                    setOs(data.data.os || "");
                    setVersion(data.data.version || "");
                    setSubsidiary(data.data.subsidiary || "");
                    setMinCpu(data.data.min_cpu || "");
                    setActCpu(data.data.act_cpu || "");
                    setMaxCpu(data.data.max_cpu || "");
                    setMinVCpu(data.data.min_v_cpu || "");
                    setActVCpu(data.data.act_v_cpu || "");
                    setMaxVCpu(data.data.max_cpu || "");
                    setMinMemory(data.data.min_memory || "");
                    setActMemory(data.data.act_memory || "");
                    setMaxMemory(data.data.max_memory || "");
                    setExpansionFactor(data.data.expansion_factor || "");
                    setMemoryPerFactor(data.data.memory_per_factor || "");
                    setProcessorCompatibility(data.data.processor_compatibility || "");
        
                } else {
                    console.error("Estructura de datos inesperada:", data);
                    setError("Estructura de datos inesperada del servidor");
                }

                console.error("Error en fetchPseriesData:", error);
            } finally {
                setLoading(false);
            }
        };

        if (pserieId) {
            fetchPseriesData();
        }
    }, [pserieId]);

    useEffect(() => {}, [name, application]);

    // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
    if (loading) {
        return <div>Cargando datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.containtTit}>
            <h2 className={styles.tittle}>
                    <MdVisibility  />
                    Visualizar Campos
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
                            <div className={styles.label}>Nombre Lpar en la HMC*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                
                                id="application"
                                name="application"
                                value={application}
                                onChange={(e) => setApplication(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Aplicación*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="hostname"
                                name="hostname"
                                value={hostname}
                                onChange={(e) => setHostName(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Hostname*</div>
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
                            <div className={styles.label}>Ip*</div>
                        </div>
                            
                        <div className={styles.formGroup}>
                            <select
                                id="environment"
                                name="environment"
                                value={environment}
                                onChange={(e) => setEnvironment(e.target.value)}
                                className={styles.selected}
                            >
                                <option value="">
                                    Selecciona
                                </option>
                                {environment_.map((environment) => (
                                    <option key={environment} value={environment}>
                                        {environment}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.labelSelect}>Ambiente*</div>
                        </div>
    
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="slot"
                                name="slot"
                                value={slot}
                                onChange={(e) => setSlot(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Cajón*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="lpar_id"
                                name="lpar_id"
                                value={lpar_id}
                                onChange={(e) => setLparId(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Id Lpar*</div>
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
                                    Selecciona el status
                                </option>
                                {status_.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.labelSelect}>Estado*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <select
                                id="os"
                                name="os"
                                value={os}
                                onChange={(e) => setOs(e.target.value)}
                                className={styles.selected}
                            >
                                <option value="">
                                    Selecciona
                                </option>
                                {os_.map((os) => (
                                    <option key={os} value={os}>
                                        {os}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.labelSelect}>Sistema Operativo*</div>
                        </div>
                        
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="version"
                                name="version"
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Versión*</div>
                        </div>
                                      
                        <div className={styles.formGroup}>
                            <select
                                id="subsidiary"
                                name="subsidiary"
                                value={subsidiary}
                                onChange={(e) => setSubsidiary(e.target.value)}
                                className={styles.selected}
                            >
                                <option value="">
                                    Selecciona
                                </option>
                                {subsidiary_.map((subsidiary) => (
                                    <option key={subsidiary} value={subsidiary}>
                                        {subsidiary}
                                    </option>
                                ))}
                            </select>
                            <div className={styles.labelSelect}>Filial*</div>
                        </div>
    
                    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="min_cpu"
                                name="min_cpu"
                                value={min_cpu}
                                onChange={(e) => setMinCpu(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>CPU MIN*</div>
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
                                id="act_cpu"
                                name="act_cpu"
                                value={act_cpu}
                                onChange={(e) => setActCpu(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>CPU ACT*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="max_cpu"
                                name="max_cpu"
                                value={max_cpu}
                                onChange={(e) => setMaxCpu(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>CPU MAX*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="min_v_cpu"
                                name="min_v_cpu"
                                value={min_v_cpu}
                                onChange={(e) => setMinVCpu(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>CPU V MIN*</div>
                        </div>
    
    
                        <hr className={styles.lines} />
    
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="act_v_cpu"
                                name="act_v_cpu"
                                value={act_v_cpu}
                                onChange={(e) => setActVCpu(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>CPU V MAX*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="max_v_cpu"
                                name="max_v_cpu"
                                value={max_v_cpu}
                                onChange={(e) => setMaxVCpu(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>CPU V MAX*</div>
                        </div>
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="min_memory"
                                name="min_memory"
                                value={min_memory}
                                onChange={(e) => setMinMemory(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Memoria MIN*</div>
                        </div>
    
                        <hr className={styles.lines} />
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="act_memory"
                                name="act_memory"
                                value={act_memory}
                                onChange={(e) => setActMemory(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Memoria ACT*</div>
                        </div>
    
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="max_memory"
                                name="max_memory"
                                value={max_memory}
                                onChange={(e) => setMaxMemory(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Memoria Max*</div>
                        </div>
    
    
    
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="expansion_factor"
                                name="expansion_factor"
                                value={expansion_factor}
                                onChange={(e) => setExpansionFactor(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Factor de expansión*</div>
                        </div>
    
                        
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="memory_per_factor"
                                name="memory_per_factor"
                                value={memory_per_factor}
                                onChange={(e) => setMemoryPerFactor(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.label}>Memoria por factor*</div>
                        </div>
    
                                
                        <div className={styles.formGroup}>
                            <select
                                id="processor_compatibility"
                                name="processor_compatibility"
                                value={processor_compatibility}
                                onChange={(e) => setProcessorCompatibility(e.target.value)}
                                className={styles.selected}
                            >
                                <option value="">
                                    Selecciona
                                </option>
                                {processor_compatibility_.map((processor_compatibility) => (
                                    <option key={processor_compatibility} value={processor_compatibility}>
                                        {processor_compatibility}
                                    </option>
    
                                ))}
                            </select>
                            <div className={styles.labelSelect}>Procesador compatible*</div>
                        </div>
                    </div>
                </div>
        </form>
    );
};

export default VerPseries;
