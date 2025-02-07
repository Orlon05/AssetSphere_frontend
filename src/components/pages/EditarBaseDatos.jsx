import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./editarBaseDatos.module.css";

const EditarBaseDatos = () => {
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
    const [loading, setLoading] = useState(true); // Estado para indicar carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const navigate = useNavigate();
    const { baseDatosId } = useParams();

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
        Toast.fire({ icon: "success", title: "Base de datos actualizada exitosamente" });
    };

    //

    const cost_center_ = [
        "C100000100", "C103500093", "C103500110", "C103500057",
        "Unallocated", "C103500121", "C103500234", "C105000230",
        "C103500107", "C103500216", "C103500180", "C103500166",
        "C103500259", "C103500271", "C103500265", "C105000211",
        "C103500342", "C103500096", "C103500094", "C103500095",
        "C103500110", "C103504000", "C103500214", "C103500268",
        "C103500092", "C103500155", "C103500350", "C102800000",
        "C104300000", "C103500130", "C103500181", "C103500169",
        "C103500100", "C103500105", "C103500255", "C103500091",
        "C103500327", "C103500099", "C103500167", "C103500108",
        "C103500102", "C103500097", "C103500098", "C103500104",
        "C103500103", "C103500101", "C103500106", "C103500109",
        "C103500201"
    ];

    const category_ = [
        "Miscellaneous"
    ];

    const type_ = [
        "Instance",
    ];

    const item_ = [
        "Database"
    ];

    const department_ = [
        "GCIA BASE DE DATOS", "LDC FC BASE DE DATOS TI", "FILIALES DEL EXTERIOR",
        "ENTORNO NEGOCIO ESPECIALIZAD TI", "LDC-FC-BASE-DE-DATOS-TI", "ADC DISEÑO Y OPERACION TELCO TI",
        "LDC FC FILIALES DEL EXTERIOR TI", "LDC FC PROCESOS DEVEXP TI", "LDC FC BASE DE DATOS TI 3",
        "LDC FC BASE DE DATOS TI 1", "SERVICIOS DE PLATAFORMAS TI", "PLATAFORMAS CENTRALES TI",
        "EVC GALATEA MODERN CANALES TI", "ADC CANALES DIGITALES NEGOCIOS TI"
    ];

    const company_ = [
        "BANCOLOMBIA S.A.",
        "NEQUI S.A.",
        "VALORES BANCOLOMBIA S.A.",
        "FIDUCIARIA BANCOLOMBIA S.A."
    ];

    const manufacturer_name_ = [
        "BANCOLOMBIA S.A.", "AMAZON WEB SERVICES", "MONGODB INC", "ORACLE", "MICROSOFT CORPORATION",
        "IBM", "POSTGRESS", "JAVA", "NEQUI S.A.", "BANCOLOMBIA", "VALORES BANCOLOMBIA S.A.", "Hana", "ON-REDIS"
    ];

    const supplier_name_ = [
        "BANCOLOMBIA S.A.",
        "ASIC",
        "KYNDRYL COLOMBIA S.A",
        "TATA",
        "IBM",
        "NEQUI S.A.",
    ];

    const supported_ = [
        "Si",
        "No"
    ];

    const ha_ = [
        "Si",
        "No"
    ];

    const model_ = [
        "Database"
    ];

    const owner_name_ = [
        "Carlos Arboleda"
    ]

    const owner_contact_ = [
        "JAIRO MANUEL RAMIREZ", "HAROLD JORGE APOLINAR CRUZ", "JUAN CAMILOVALENZUELA CARRERO",
        "HENRY ACEROS SIERRA", "CDE PLATAFORMAS Y DISPONIBILIDAD TI LDC FC BASE DE DATOS TI SOPORTE DE BASES DE DATOS", "JOSE IGNACIOPINZON VALLESTEROS",
        "BELISARIO JUNIORDE LA MATA BELEÑO", "HECTOR FABIO CABRERA NUÑEZ", "JAIRO MANUELRAMIREZ MONROY",
        "BRAHIAN ALEXISOCAMPO URIBE", "JULIAN DAVIDORTIZ IDROBO", "SERGIO ANIBALAGUDELO CORREA",
        "IVAN DARIOSANCHEZ MORENO", "SANDRA PATRICIAGRACIA CORREA", "OC BANCA DIGITAL AGILIDAD DEL NEGOCIO TI BASES DE DATOS NEQUI",
        "YIBRIN NOEAPONTE DOMINGUEZ", "Juan Camilo Valenzuela Carrero", "JOSE MAURICIO CAMACHO BRAVO",
        "BRIANBAENA MUNERA", "CAMILO ANDRES BARAJAS HERNANDEZ", "HAROLD APOLINAR CRUZ",
        "OLIVERIO ORTIZ PEDROZA", "SERGIO LEON CORREA CANO", "BELFOR FERNEY SUAREZ PEREZ",
        "GUILLERMO LEON HAAD ATUESTA", "VICTOR AUGUSTO BENJUMEA VARELA", "JORGE ANDRES GRISALES CASTRO",
        "NATALIA ANDREA OSORIO CASTAÑEDA", "Sergio Agudelo", "CARLOS ARTURO PACHECO CARDENAS",
        "DAVID GOMEZ CORTES", "JEFRY RENEE ARIAS QUINTANA", "JONATAN GOMEZ RODRIGUEZ",
        "LIBARDO ANDRES CACERES JAIME", "BRIAN BAENA MUNERA", "CARLOS ALBERTO CASTELLANOS RODRIGUEZ",
        "JUAN CARLOS VELASQUEZ ATENCIO", "RUBEN DARIO PADRON RODRIGUEZ", "JOHN CARLOS GALLEGO",
        "WILLIAM DAVID CASTRO BARBOSA", "JHAN FARLEY RESTREPO MARTINEZ", "DEIBIS ESTID OSPINA ARENAS",
        "JEISON FERLEY CUBILLOS ROJAS", "JUAN PABLO GOMEZ QUIROGA", "WILSON HUERTAS MARTIN",
        "PABLO ARTURO GOMEZ TABA", "DANIEL ESTEBAN YEPES PALACIO", "MARIA ANGELICA GRISALES MONTOYA",
        "JOSE IGNACIO PINZON VALLESTEROS", "DANIEL BUSTAMANTE OSPINA", "GERMAN MAURICIO GUTIERREZ CUBILLOS",
        "JHONATAN HARLEY REYES QUERUBIN", "ALFREDO MARTINEZ CAMPOS", "MARYORY ELIANA MORENO MARIN",
        "ALVARO JOSE OZUNA MARTINEZ", "CESAR EMILIANO PARRA ZAMORA", "ANDRES FELIPE BOLIVAR VANEGAS",
        "CLAUDIA PATRICIA CARDENO CANO", "CAMILO PIEDRAHITA MACIAS", "ANDRES ARANGO ALVAREZ",
        "DIEGO ARMANDO ARIAS HURTADO", "ABISH ANDREA JARAMILLO ARENAS", "HERNAN MAURICIO CASTRILLON CARMONA",
        "IVAN DARIO OTALVARO MARIN", "JHON JAIRO RIVERA CASADO", "JAIRO MANUEL RAMIREZ MONROY",
        "JAIME ANDRES REGINO DIAZ", "JOSE IGNACIO PINZON BALLESTEROS", "JHOHAN DAVID ARGAEZ MORENO",
        "JOSE LUIS QUINTERO CAÑIZALEZ", "MIGUEL LEONARDO ALVARADO CAMARGO", "JUAN CARLOS ROBAYO QUINTERO",
        "WILFREDO RIOS MONTILLA", "ANDRES RUGE GAMBA", "JUAN CAMILO GONZALEZ BETANCUR",
        "SANDRA PATRICIA GRACIA CORREA", "DIANA CAROLINA MONROY AMAYA", "JAVIER ALEXANDER LOPERA CARMONA",
        "JULIAN DAVID ORTIZ IDROBO", "JUAN FERNANDO MEJÍA OSPINA", "MAURICIO GALLEGO ZULETA",
        "ROSMARA CONSOLACION SANTANDER RAMIREZ", "PAOLA ANDREA PINO MALEZ", "KEVIN ANDREE VIVEROS",
        "JUAN CARLOS MANJARRES BETANCOURT", "JUAN PABLO ARDILA MATEUS", "KEVIN ANDREE VIBEROS",
        "DIDIER ROBINSON GIRALDO GIRALDO", "CESAR VILLALOBOS MONTAÑA", "ANDRES FELIPE ISAZA VERGARA",
        "BELISARIO JUNIOR DE LA MATA BELEÑO", "YONY ARLEY ESCOBAR CEBALLOS", "EDWUAR JONATHAN CLAVIJO CALLEJAS",
        "GUSTAVO ALVEIRO JARAMILLO CASTRILLON", "CINDY JOHANA CASTAÑO BLANDON", "FERNEY CAMILO ZAPATA MONTOYA",
        "ENA TERESA JUVINAO DUQUE", "ANDERSON DAVILA HERRERA", "ANA PATRICIA QUINTERO CARDENAS",
        "MARIA ISABEL GARZON ALVAREZ", "ARMANDO CARLOS PALMERA SANCHEZ", "ANGEL DAVID JIMENEZ PACHECO",
        "ELIANA LUCERO GIRALDO SALAZAR", "CARLOS ARTURO REBAGE ALDANA", "PEDRO FERNANDO BEDOYA OVIEDO",
        "TANIA LUGO GARCIA", "LEONARDO ARDILA GONZALEZ", "LUISA FERNANDA RODRIGUEZ BEDOYA",
        "YOHAN MAURICIO JUNCO ALDANA", "VICTOR ANDRES MARTINEZ VASQUEZ", "MARTIN EMILIO DURAN DIAZ",
        "ROGELIO ADOLFO DUQUE MARTINEZ", "MARTIN EMILIO DURAN RUIZ", "YEISSON ALEJANDRO ARROYAVE VALLE",
        "JUAN PABLO MARTINEZ CANOLA", "ANGEL DAVIDJIMENEZ PACHECO", "BRAHIAN ALEXIS OCAMPO URIBE",
        "MAURICIO ALBERTO CASTAÑEDA MONSALVE"
    ];

    const application_code_ = [
        "NU0394001",
        "EUC00087",
        "AW1151001",
        "NU0142001",
        "CITRIX",
        "WINDOWS",
        "LINUX",
    ];

    const inactive_ = [
        "Si",
        "No"
    ];

    const asset_life_cycle_status_ = [
        "Eliminar",
        "Aplicado"
    ];

    const system_environment_ = [
        "dev",
        "qa",
        "pdn",
        "ref",
        "pdn"
    ];

    const cloud_ = [
        "Si",
        "No"
    ];

    const version_number_ = [
        "POSTGRESQL 13",
        "POSTGRESQL 14",
        "AURORA POSTGRESQL 15",
        "Oracle 19.19",
        "MONGODB ATLAS 7.0.11 SERVERLESS",
        "AURORA POSTGRESQL 11",
        "Oracle 12.1.0.2.0",
        "SQL SERVER 2017 (RTM) STANDARD EDITION",
        "SQL SERVER 2012 (SP4) STANDARD EDITION",
        "POSTGRESQL 10",
        "POSTGRESQL 11",
        "MYSQL 5.1.51",
        "SQL SERVER 2012 (SP4) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "AURORA POSTGRESQL 13",
        "ORACLE 19.18",
        "DB2 11",
        "SQL SERVER 2012 (SP4) ENTERPRISE EDITION",
        "ORACLE 19.10.0.0.0",
        "ORACLE 19.0.0",
        "SQL SERVER 2017 (RTM) DEVELOPER EDITION",
        "SQL SERVER 2017 (RTM) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "SQL SERVER 2017 (RTM) ENTERPRISE EDITION",
        "SQL SERVER 2019 (RTM) ENTERPRISE EDITION",
        "ORACLE 19.16",
        "Oracle 19.3.0.0.0",
        "MYSQL 8.0",
        "Oracle 11.2.0.4.0",
        "AURORA POSTGRESQL 10",
        "ORACLE 19.15",
        "Oracle 19.14.0.0.0",
        "MYSQL 5.7",
        "SQL SERVER 2016 (SP2) ENTERPRISE EDITION",
        "ORACLE 19.17",
        "SQL SERVER 2019 (RTM) STANDARD EDITION",
        "SQL SERVER 2012 ENTERPRISE ENTERPRISE EDITION: CORE-BASED LICENSING",
        "AURORA POSTGRESQL 12",
        "SQL SERVER AZURE (RTM)",
        "MONGODB ATLAS 6.0.1 DEDICATED",
        "POSTGRESQL 15",
        "SQL SERVER 2016 (SP1) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "SQL SERVER 2012 (SP3) ENTERPRISE EDITION",
        "SQL SERVER 2014 (SP2) ENTERPRISE EDITION",
        "Oracle 19.25",
        "DB2 11.5",
        "MONGODB ATLAS 6.3.0 SERVERLESS",
        "AURORA POSTGRESQL 14",
        "ORACLE 19.24",
        "ORACLE 19.21",
        "19.25",
        "Oracle 8.1.6.0",
        "ORACLE 12.2.0.1.0",
        "NEO4J",
        "Aurora MySQL 5.6",
        "SQL SERVER 2016 (SP1) ENTERPRISE EDITION",
        "SQL SERVER 2016 (SP2) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "SQL SERVER 2019 (RTM) DEVELOPER EDITION",
        "SQL SERVER 2012 (SP3) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "ORACLE 19.20",
        "SQL SERVER 2012 (SP2) ENTERPRISE EDITION",
        "POSTGRESQL 12",
        "POSTGRESQL 16",
        "Oracle 19.17.0.0.0",
        "Sap-Hana.100_122_11",
        "Oracle 19.9.0.0.0",
        "SQL SERVER 2022 (RTM) ENTERPRISE EDITION",
        "ORACLE 10.2.0.5.0",
        "ORACLE 19.23",
        "11.5",
        "ORACLE 19.26",
        "Oracle 19.22",
        "AURORA POSTGRESQL 19",
        "DOCUMENTDB 4.0.0",
        "MONGODB ATLAS 6.0.5 DEDICATED",
        "DYNAMODB 2019",
        "REDIS 7.0",
        "SQL SERVER 2014 (SP3) STANDARD EDITION",
        "SQL SERVER 2022 (RTM) STANDARD EDITION",
        "AURORA MYSQL 5.7",
        "SQL SERVER 2016 (SP2) STANDARD EDITION",
        "ORACLE 19.11.0.0.0",
        "SQL SERVER 2012 (SP2) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "ORACLE 19.12.0.0.0",
        "ORACLE 10.2.0.4.0",
        "AURORA MYSQL 5.8",
        "SQL SERVER 2008 R2 (SP3) ENTERPRISE EDITION: CORE-BASED LICENSING",
        "MONGODB ATLAS 7.0.12 DEDICATED",
        "MONGODB ATLAS 7.3.2 SERVERLESS",
        "AURORA POSTGRESQL 18",
        "AURORA POSTGRESQL 17",
        "POSTGRESQL 14",
        "SQL SERVER 2000 ENTERPRISE EDITION",
        "SQL SERVER 2016 RTM DEVELOPER EDITION",
        "SQL SERVER 2019",
        "SQL SERVER 2016 RTM ENTERPRISE EDITION: CORE-BASED LICENSING",
        "SQL SERVER 2016 (SP1) DEVELOPER EDITION",
        "SQL SERVER 2016 RTM ENTERPRISE EDITION",
        "SQL SERVER 2016 (SP3) ENTERPRISE EDITION",
        "SQL SERVER 2000 (SP4) ENTERPRISE EDITION"
    ];

    //
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
                    setDeparment(data.data.department || "");
                    setCompany(data.data.company || "");
                    setManufacturerName(data.data.manufacturer_name || "");
                    setSupplierName(data.data.supplier_name || "");
                    setSupported(data.data.supported || "");
                    setAccountId(data.data.account_id || "");
                    setCreateDate(data.data.create_date || "");
                    setModifiedDate(data.data.modified_date || "");
                } else {
                    console.error("Estructura de datos inesperada:", data);
                    setError("Estructura de datos inesperada de la base de datos");
                }

                console.error("Error en fetchBaseDatosData:", error);
            } finally {
                setLoading(false);
            }
        };

        if (baseDatosId) {
            fetchBaseDatosData();
        }
    }, [baseDatosId]);

    useEffect(() => { }, [instance_id, instance_id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!instance_id || !instance_id || !name || !category) {
            Swal.fire({
                icon: "warning",
                title: "Campos obligatorios",
                text: "Por favor, completa todos los campos obligatorios.",
            });
            return;
        }

        const BaseDatosData = {
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
            modified_date: modified_date
        };

        console.log(
            "Token de autenticación:",
            localStorage.getItem("authenticationToken")
        );
        console.log("Datos a enviar:", BaseDatosData);

        try {
            const response = await fetch(
                `http://localhost:8000/base_datos/edit/${baseDatosId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(BaseDatosData),
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
                navigate("/Base-De-Datos");
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
        return <div>Cargando datos de la base de datos...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h2 className={styles.tittle}>
                <MdEdit />
                Editar Base de Datos
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

                    <hr className={styles.lines} />

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
                            id="owner_contact"
                            name="owner_contact"
                            value={owner_contact}
                            onChange={(e) => setOwnerContact(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el owner_contact
                            </option>
                            {owner_contact_.map((owner_contact) => (
                                <option key={owner_contact} value={owner_contact}>
                                    {owner_contact}
                                </option>
                            ))}
                        </select>
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

                    <hr className={styles.lines} />

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

                    <hr className={styles.lines} />

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


                    <button type="submit" className={styles.button}>
                        Guardar
                    </button>
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
                        <select
                            id="ha"
                            name="ha"
                            value={ha}
                            onChange={(e) => setHa(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el HA
                            </option>
                            {ha_.map((ha) => (
                                <option key={ha} value={ha}>
                                    {ha}
                                </option>
                            ))}
                        </select>
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

                    <hr className={styles.lines} />

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
                        <select
                            id="supplier_name"
                            name="supplier_name"
                            value={supplier_name}
                            onChange={(e) => setSupplierName(e.target.value)}
                            className={styles.selected}
                        >
                            <option value="">
                                Selecciona el supplier_name
                            </option>
                            {supplier_name_.map((supplier_name) => (
                                <option key={supplier_name} value={supplier_name}>
                                    {supplier_name}
                                </option>
                            ))}
                        </select>
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

                    <hr className={styles.lines} />

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

export default EditarBaseDatos;
