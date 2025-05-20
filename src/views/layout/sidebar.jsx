import { useState, useEffect } from "react";
import ServidoresFisicos from "../services/servidores Fisicos/servidoresF";
import BasesDeDatos from "../services/Base de datos/baseDeDatos";
import { useLocation, useNavigate } from "react-router-dom";
// import ServidoresVirtuales from "../services/servidoresV";

// import Pseries from "../services/pseries";
// import Storage from "../services/storage";
// import Sucursales from "../services/sucursales";
import { Server, Database, HardDrive, Building, Cloud } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState();

  const Menus = [
    { id: 1, title: "Servidores Fisicos", icon: Server },
    { id: 2, title: "Servidores Virtuales", icon: Cloud },
    { id: 3, title: "Bases de Datos", icon: Database },
    { id: 4, title: "Pseries", icon: Server },
    { id: 5, title: "Storage", icon: HardDrive },
    { id: 6, title: "Sucursales", icon: Building },
  ];

  const renderComponent = () => {
    // Obtenemos el parámetro directamente aquí para asegurarnos
    const params = new URLSearchParams(location.search);
    const currentModule = params.get("activeModule");

    console.log("Renderizando módulo:", currentModule);

    // Verifica explícitamente el valor exacto que viene en la URL
    if (currentModule === "base-de-datos") {
      return <BasesDeDatos />;
    } else {
      return <ServidoresFisicos />;
      // } else if (currentModule === "servidores-fisicos") {
      //   return <ServidoresFisicosComponent />;
      // } else if (currentModule === "servidores-virtuales") {
      //   return <ServidoresVirtualesComponent />;
      // } else if (currentModule === "pseries") {
      //   return <PseriesComponent />;
      // } else if (currentModule === "storage") {
      //   return <StorageComponent />;
      // } else if (currentModule === "sucursales") {
      //   return <SucursalesComponent />;
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className={`flex flex-col justify-center  ${
          open ? "w-72" : "w-20"
        } bg-gray-800 h-full p-5 pt-10 relative duration-300 border-r border-gray-700`}
      >
        <img
          src="./src/assets/chevron-left.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-700 bg-gray-800
           border-2 rounded-full ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />

        <div className="gap-x-8 items-center mb-32">
          <img
            src="./src/assets/logowhite.png"
            className={`cursor-pointer duration-500 ${open}`}
          />
        </div>
        <ul className="pt-6">
          {Menus.map((Menu) => (
            <li
              key={Menu.id}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm items-center gap-x-8 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                activeMenu === Menu.id && "bg-gray-700"
              }`}
              onClick={() => setActiveMenu(Menu.id)}
            >
              <Menu.icon size={24} className="text-blue-400" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Renderiza el componente basado en el menú activo */}
        {renderComponent()}
      </div>
    </div>
  );
}
