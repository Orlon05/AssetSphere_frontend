import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./editarSucursal.module.css";

const EditarSucursal = () => {
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

    const navigate = useNavigate();
    const { sucursalId } = useParams();

    // Crea la instancia de Toast
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    const showSuccessToast = () => {
        Toast.fire({ icon: "success", title: "Sucursal actualizado exitosamente" });
    };

    // Datos de ejemplo, colocar los reales
    const billing_type_ = [
        "Factura Electrónica",
        "Recibo de Caja",
        "Nota de Crédito",
        "Nota de Débito",
        "Factura de Exportación",
        "Factura de Anticipo",
        "Factura POS",
        "Factura de Venta",
        "Autofactura",
        "Recibo Provisional",
        "Factura de Compra",
        "Tiquete POS"
    ];

    // Datos de ejemplo, colocar los reales
    const os_type_ = [
        "Windows",
        "macOS",
        "Linux",
        "Android",
        "iOS",
        "Ubuntu",
        "Debian",
        "Fedora",
        "Red Hat",
        "CentOS",
        "Arch Linux",
        "Chrome OS",
        "FreeBSD",
        "OpenBSD",
        "Solaris"
    ];


    // Datos de ejemplo, colocar los reales
    const application_code_ = [
        "AP0240001",
        "POWERMAX2500"
    ];

    const billable_ = [
        "si",
        "No"
    ];

    const os_version_ = [
        "Microsoft® Windows Server® 2019 Standar",
        "Microsoft® Windows Server® 2016 Standar",
        "Microsoft® Windows Server® 2022 Standar"
    ];

    const city_ = [
        "Medellin", "Bogota", "Itagui", "Sabaneta", "Envigado",
        "Bucaramanga", "La Ceja", "Rionegro", "Paipa", "Piedecuesta",
        "Villavicencio", "Manizales", "Cali", "El Bordo", "Palmira",
        "Ibague", "Armenia", "Pereira", "Pasto", "Neiva",
        "Barranquilla", "Sincelejo", "Cartagena", "Cucuta", "Monteria",
        "Sahagun", "Maicao", "Lorica", "Corozal", "Sabanalarga",
        "Mosquera", "Funza", "Guarne", "San Pedro", "Puerto Berrio",
        "Quimbaya", "Sandona", "La Union", "Valledupar", "Sabana de Torres",
        "Soacha", "Guasca", "Santafe de Antioquia", "La Estrella", "La Calera",
        "Bello", "Puerto Boyaca", "Tunja", "Popayan", "Duitama",
        "Fusagasuga", "Tenjo", "Garzon", "Puerto Gaitan", "Socorro",
        "Aguachica", "Villanueva", "Barrancabermeja", "Malaga", "Arauca",
        "Ocana", "San Gil", "El Santuario", "Velez", "Malambo",
        "Zipaquira", "El Penol", "Cajica", "Sesquile", "Chia",
        "Tocancipa", "Pacho", "Tabio", "Subachoque", "San Andres",
        "Chiquinquira", "Ubate", "Simijaca", "Guacheta", "Sogamoso",
        "Covenas", "Yopal", "Aguazul", "Granada", "Caldas",
        "Tauramena", "Caucasia", "Facatativa", "Fredonia", "Madrid",
        "Anapoima", "Villeta", "Mariquita", "La Dorada", "Chinu",
        "Girardota", "Santa Barbara", "Jardin", "Guamo", "Espinal",
        "Melgar", "El Retiro", "Chaparral", "Honda", "Purificacion",
        "Saldana", "Andes", "Cajamarca", "Concordia", "Libano",
        "Puerto Asis", "Pitalito", "Campoalegre", "Florencia", "San Vicente del Caguan",
        "Pamplona", "Soledad", "Cienaga", "Magangue", "Garagoa",
        "Villa De Leyva", "Yarumal", "Tolu", "Arjona", "Plato",
        "El Dificil", "Santa Marta", "Amaga", "Puerto Carreno", "Riohacha",
        "San Marcos", "Galapa", "Quibdo", "Entrerrios", "Villapinzon",
        "Apartado", "Copacabana", "Barbosa", "El Carmen de Viboral", "Riosucio",
        "Chigorodo", "Samaca", "Baranoa", "Socha", "Yumbo",
        "Uribia", "Ciudad Bolivar", "Santa Rosa De Osos", "Aguadas", "Marinilla",
        "Girardot", "Sonson", "Cerete", "Planeta Rica", "La Loma",
        "El Bagre", "Chinchina", "Mani", "Anserma", "Abrego",
        "Palermo", "Belen De Umbria", "Fonseca", "Dosquebradas", "Cartago",
        "La Mesa", "Roldanillo", "Necocli", "Santa Rosa De Cabal", "Mompox",
        "Montenegro", "Tulua", "Inirida", "Jamundi", "Becerral",
        "Caicedonia", "Lebrija", "Calarca", "Sevilla", "Florida Blanca",
        "Giron", "Floridablanca", "Puerto Lopez", "Miranda", "Cota",
        "San Jose Del Guaviare", "Carepa", "Santander De Quilichao", "Paz de Ariporo", "Buenaventura",
        "La Plata", "Cumaral", "Buga", "Bugalagrande", "El Cerrito",
        "Albania", "Los Patios", "Pradera", "Florida", "Puerto Colombia",
        "Salgar", "San Martin", "Tuquerres", "Ipiales", "Acacias",
        "La Vega", "Sopo", "Tumaco", "Fresno", "El Rosal",
        "Don Matias", "Mocoa", "Leticia", "Sibate", "Bosconia",
        "Turbo", "Montelibano", "Guachene", "Urrao"
    ];

    const branch_name_ = [
        "CARABOBO", "CENTRO COLTEJER", "LAURELES", "AVENIDA EL POBLADO", "AVENIDA JUNIN", "LOS MOLINOS", "LA PLAYA", "CALASANZ",
        "GUAYAQUIL", "Quinta Camacho", "CALLE NUEVA", "ITAGUI", "AEROPUERTO OLAYA", "SABANETA", "ENVIGADO", "BUCARAMANGA",
        "ALMACENTRO", "LA CEJA", "RIONEGRO", "OVIEDO", "Carrera Octava", "Centro Internacional", "Antiguo Country", "Polo Club",
        "Barrio 7 De Agosto", "Calle Once", "PAIPA", "Centro 93", "Plaza España", "Puente Largo", "Puente Aranda", "PIEDECUESTA",
        "Ciudad Kennedy", "Avenida Chile", "Las Ferias", "Calle 140", "Carrera Decima", "Carrera 15 Bogotá", "TRANSACCIONAL SAN MARTIN", "VILLAVICENCIO",
        "AVENIDA SANTANDER", "CALI", "CARRERA PRIMERA", "SAN NICOLAS CALI", "VIPASA", "EL BORDO CAUCA", "PALMIRA", "IBAGUE",
        "ARMENIA CENTRO", "MANIZALES", "PEREIRA", "PASTO", "NEIVA", "TEQUENDAMA", "EL CACIQUE", "LA QUINTA",
        "AVENIDA KENNEDY", "LAS PEÑITAS", "MIRAMAR", "Niza", "CARTAGENA", "BOCAGRANDE", "CUCUTA", "MEGAMALL",
        "MONTERIA", "SAHAGUN", "Altavist Usme", "MAICAO", "MALL PLAZA DEL CASTILLO", "Bosa", "Nova- Multiplaza Drive", "LORICA",
        "Plaza De Las Americas", "COROZAL SUCRE", "CIRCUNVALAR PEREIRA", "SABANALARGA", "CP RIONEGRO", "BANCA COLOMBIA PARQUE SURA", "BANCA ESPECIALIZADA BOGOTA", "Avenida Sexta Bogota",
        "Mosquera", "Mercantil", "EXITO IBAGUE", "Éxito Villa Mayor", "BANCA COLOMBIA RESERVA DEL CHICO", "Unicentro Cfr", "Funza - Cundinamarca", "GUARNE",
        "SAN PEDRO", "PUERTO BERRIO", "ALAMEDAS DEL SINU", "Avenida 82", "Toberin", "Salitre", "Teleport", "Chapinero",
        "CARIBE PLAZA", "Calle 57", "Centro Financiero", "Unicentro Bogota", "Quirigua", "LLANOGRANDE PALMIRA", "Galerias", "QUIMBAYA",
        "El Can", "SANDONA", "Avenida 19", "La Soledad Bogota", "Calle 87", "LA UNION NARIÑO", "GUATAPURI", "Suba",
        "Santa Barbara", "Avenida Pepe Sierra", "Marly", "VILLACOLOMBIA", "BANCA COLOMBIA CARTAGENA", "Centro Industrial", "TINTAL MILENIO", "Corabastos",
        "Sabana de Torres", "Occidente (Montevideo)", "EXITO POBLADO", "Centro Distrital", "Soacha", "Fontibon", "CC CALIMA", "Éxito Country",
        "PASEO VILLA DEL RIO", "EXITO ENVIGADO", "Barrio Ricaute", "Guasca", "Barrio Restrepo", "EXITO COLOMBIA", "Avenida El Dorado", "HOSPITAL PABLO TOBON URIBE",
        "SANTAFE DE ANTIOQUIA", "Avenida De Las Americas", "LA ESTRELLA", "Trinidad Galan", "PUERTA DEL RIO", "Barrio Santander", "La Calera", "Modelia",
        "EXITO BELLO", "PUERTO BOYACA", "PREMIUM PLAZA", "TUNJA", "SAN LUCAS PLAZA", "CAMPANARIO POPAYAN", "DUITAMA", "FUSAGASUGA",
        "VALLE DE LILI", "VISITACION", "UNICENTRO PEREIRA", "CARRERA 70", "Siberia", "BOULEVAR ENVIGADO", "CENTRO COMERCIAL MAYORCA", "ITAGUI PARQUE"
    ];

    const region_ = [
        "ANTIOQUIA", "BOGOTA", "CENTRO", "SUR", "CARIBE", "SABANA"
    ];

    const model_ = [
        "DELL T430",
        "OptiPlex 7040"
    ];

    // Datos de ejemplo, colocar los reales
    const cost_center_ = [
        "C103500120",
    ];

    const department_ = [
        "Amazonas", "Antioquia", "Arauca", "Atlántico", "Bolívar",
        "Boyacá", "Caldas", "Caquetá", "Casanare", "Cauca",
        "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía",
        "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta",
        "Nariño", "Norte de Santander", "Putumayo", "Quindío", "Risaralda",
        "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca",
        "Vaupés", "Vichada"
    ];

    // Datos de ejemplo, colocar los reales
    const status_ = [
        "Aplicado",
        "Eliminar",
    ];

    // Datos de ejemplo, colocar los reales
    const location_ = [
        "EDIFICIO CENTRO COMPUTO NIQUIA BANCOLOMB",
        "EDIFICIO CENTRO COMPUTO NIQUIA BANCOLOMBIA BANISTMO"
    ];

    const environment_ = [
        "Producción"
    ];

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
                    setWarrantyEndDate(data.data.warranty_end_date ? new Date(data.data.warranty_end_date).toISOString().split("T")[0] : null);
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const requiredFields = [
            name, brand, model, processor, cpu_cores, ram, total_disk_size, os_type,
            os_version, status, role, environment, serial, rack_id, unit, ip_address,
            city, location, asset_id, service_owner, warranty_start_date, warranty_end_date,
            application_code, responsible_evc, domain, subsidiary, responsible_organization,
            billable, oc_provisioning, oc_deletion, oc_modification, maintenance_period,
            maintenance_organization, cost_center, billing_type, branch_code, branch_name,
            region, department, comments
        ];

        if (requiredFields.some(field => !field)) {
            Swal.fire({
                icon: "warning",
                title: "Campos obligatorios",
                text: "Por favor, completa todos los campos obligatorios.",
            });
            return;
        }


        const sucursalData = {
            name: name,
            brand: brand,
            model: model,
            processor: processor,
            cpu_cores: cpu_cores,
            ram: ram,
            total_disk_size: total_disk_size,
            os_type: os_type,
            os_version: os_version,
            status: status,
            role: role,
            environment: environment,
            serial: serial,
            rack_id: rack_id,
            unit: unit,
            ip_address: ip_address,
            city: city,
            location: location,
            asset_id: asset_id,
            service_owner: service_owner,
            warranty_start_date: warranty_start_date,
            warranty_end_date: warranty_end_date,
            application_code: application_code,
            responsible_evc: responsible_evc,
            domain: domain,
            subsidiary: subsidiary,
            responsible_organization: responsible_organization,
            billable: billable,
            oc_provisioning: oc_provisioning,
            oc_deletion: oc_deletion,
            oc_modification: oc_modification,
            maintenance_period: maintenance_period,
            maintenance_organization: maintenance_organization,
            cost_center: cost_center,
            billing_type: billing_type,
            branch_code: branch_code,
            branch_name: branch_name,
            region: region,
            department: department,
            comments: comments,
        };

        console.log(
            "Token de autenticación:",
            localStorage.getItem("authenticationToken")
        );
        console.log("Datos a enviar:", sucursalData);

        try {
            const response = await fetch(
                `http://localhost:8000/sucursales/edit/${sucursalId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(sucursalData),
                }
            );

            console.log("Respuesta del servidor:", response);

            if (!response.ok) {
                let errorMessage = `Error HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error("Detalles del error (JSON):", errorData);
                    if (errorData && Array.isArray(errorData.detail)) {
                        errorMessage = errorData.detail.map((e) => e.msg).join(", ");
                    } else if (errorData && errorData.message) {
                        errorMessage = errorData.message;
                    } else if (errorData) {
                        errorMessage = JSON.stringify(errorData);
                    }
                    Swal.fire({ icon: "error", title: "Error", text: errorMessage });
                } catch (jsonError) {
                    console.error("Error al parsear JSON:", jsonError);
                    Swal.fire({ icon: "error", title: "Error", text: errorMessage });
                }
            } else {
                showSuccessToast();
                navigate("/sucursales");
            }
        } catch (error) {
            console.error("Error inesperado:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error inesperado.",
            });
        }
    };

    // Renderizado condicional: muestra un mensaje de carga o de error si es necesario
    if (loading) {
        return <div>Cargando datos de la sucursal...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.containtTit}>
                <h2 className={styles.tittle}>
                    <MdEdit />
                    Editar sucursales
                </h2>
                <Link to="/sucursales" className={styles.botonRegresar}>
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
                    <button type="submit" className={styles.button}>
                        Guardar
                    </button>
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

export default EditarSucursal;
