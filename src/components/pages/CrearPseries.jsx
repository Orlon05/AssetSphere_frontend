import React, { useState } from "react";
import styles from "./crearPseries.module.css";
import { IoIosAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const PseriesForm = () => {
    const [name, setName] = useState("");
    const [application, setApplication] = useState("");
    const [hostname, setHostName] = useState("");
    const [ip_address, setIpAddress] = useState("");
    const [environment, setEnvironment] = useState("");
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
      title: "Servidor creado exitosamente",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const pserieData = {
        name: name,
        application: application,
        hostname: hostname,
        ip_address: ip_address,
        environment: environment,
        slot: slot,
        lpar_id: lpar_id,
        status: status,
        os: os,
        version: version,
        subsidiary: subsidiary,
        min_cpu: min_cpu,
        act_cpu: act_cpu,
        max_cpu: max_cpu,
        min_v_cpu: min_v_cpu,
        act_v_cpu: act_v_cpu,
        max_v_cpu: max_v_cpu,
        min_memory: min_memory,
        act_memory: act_memory,
        max_memory: max_memory,
        expansion_factor: expansion_factor,
        memory_per_factor: memory_per_factor,
        processor_compatibility: processor_compatibility,
      };
      
    try {
      const token = localStorage.getItem("authenticationToken");
      if (!token) {
        throw new Error("Token de autorización no encontrado.");
      }

      const response = await fetch(
        "http://localhost:8000/pseries/pseries/add",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pserieData),
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
          } catch (e) {}
        }
        Swal.fire({
          icon: "error",
          title: "Error al crear el servidor",
          text: errorMessage,
        });
      } else {
        showSuccessToast();
        navigate("/pseries");
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
        <div className={styles.containtTit}>
        <h2 className={styles.tittle}>
                <IoIosAdd />
                Crear Campos
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

                    <div className={styles.formGroup}>
                        <input 
                            type="text"
                            id="os"
                            name="os"
                            value={os}
                            onChange={(e) => setOs(e.target.value)}
                            className={styles.input}
                        />                        
                        <div className={styles.label}>Sistema Operativo*</div>
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
                        <input 
                            type="text"
                            id="processor_compatibility"
                            name="processor_compatibility"
                            value={processor_compatibility}
                            onChange={(e) => setProcessorCompatibility(e.target.value)}
                            className={styles.input}
                        />
                        <div className={styles.label}>Procesador compatible*</div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PseriesForm;
