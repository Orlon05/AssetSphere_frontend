import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServidoresFisicos from "../services/servidores Fisicos/servidoresF";
import BasesDeDatos from "../services/Base de datos/baseDeDatos";
import Pseries from "../services/Pseries/Pseries";
import ServidoresVirtuales from "../services/servidores Virtuales/servidoresV";
import Storage from "../services/storage/Storage";
import Sucursales from "../services/Sucursales/sucursales"
import {ShieldCheck} from "lucide-react";

// Importa los demás componentes que necesites
import { Server, Database, HardDrive, Building, Cloud, LayoutGrid } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const Menus = [
    {
      id: 1,
      title: "Panel Principal",
      icon: LayoutGrid,
      path: "/inveplus/dashboard",
    },
    {
      id: 2,
      title: "Servidores Fisicos",
      icon: Server,
      path: "/inveplus/servidoresf",
    },
    {
      id: 3,
      title: "Servidores Virtuales",
      icon: Cloud,
      path: "/inveplus/servidoresv",
    },
    {
      id: 4,
      title: "Bases de Datos",
      icon: Database,
      path: "/inveplus/base-de-datos",
    },
    { id: 5, title: "Pseries", icon: Server, path: "/inveplus/pseries" },
    { id: 6, title: "Storage", icon: HardDrive, path: "/inveplus/storage" },
    // {
    //   id: 6,
    //   title: "Sucursales",
    //   icon: Building,
    //   path: "/inveplus/sucursales",
    // },
  ];

  const renderComponent = () => {
    const path = location.pathname;
    if (path.includes("base-de-datos")) {
      return <BasesDeDatos />;
    } else if (path.includes("servidoresf")) {
      return <ServidoresFisicos />;
    } else if (path.includes("pseries")) {
      return <Pseries />;
    } else if (path.includes("servidoresv")) {
      return <ServidoresVirtuales />;
    } else if (path.includes("storage")) {
      return <Storage />;
    } 
    // else if (path.includes("sucursales")) {
    //   return <Sucursales />;
    // }
    // Agrega aquí los demás componentes según el path
    else {
      return <ServidoresFisicos />; // Componente por defecto
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className={`flex flex-col justify-center  ${
          open ? "w-80" : "w-20"
        } bg-zinc-800 h-full p-5 pt-10 relative duration-300 border-r border-gray-700`}
      >
        <img
          src="/inveplus/chevron-left.png"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-700 bg-gray-800 border-2 rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        />
         <div div className="gap-x-8 items-center mb-32">
          <ShieldCheck className="text-blue-600" size={40} />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-blue-400 drop-shadow-sm tracking-wide">
            Inveplus
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu) => (
            <li
              key={Menu.id}
              className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-700 text-gray-300 text-sm items-center gap-x-8 
                ${Menu.gap ? "mt-9" : "mt-2"} ${
                location.pathname.includes(Menu.path.split("/").pop()) &&
                "bg-gray-700"
              }`}
              onClick={() => navigate(Menu.path)}
            >
              <Menu.icon size={24} className="text-blue-400" />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 overflow-auto">{renderComponent()}</div>
    </div>
  );
}
