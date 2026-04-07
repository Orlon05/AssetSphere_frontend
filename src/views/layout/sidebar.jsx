import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ServidoresFisicos from "../services/servidores Fisicos/servidoresF";
import BasesDeDatos from "../services/Base de datos/baseDeDatos";
import Pseries from "../services/Pseries/Pseries";
import ServidoresVirtuales from "../services/servidores Virtuales/servidoresV";
import Storage from "../services/storage/Storage";
import { ShieldCheck } from "lucide-react";

import {
  Server,
  Database,
  HardDrive,
  Cloud,
  LayoutGrid,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const Menus = [
    {
      id: 1,
      title: "Panel Principal",
      icon: LayoutGrid,
      path: "/AssetSphere/dashboard",
    },
    {
      id: 2,
      title: "Servidores Fisicos",
      icon: Server,
      path: "/AssetSphere/servidoresf",
    },
    {
      id: 3,
      title: "Servidores Virtuales",
      icon: Cloud,
      path: "/AssetSphere/servidoresv",
    },
    {
      id: 4,
      title: "Bases de Datos",
      icon: Database,
      path: "/AssetSphere/base-de-datos",
    },
    { id: 5, title: "Pseries", icon: Server, path: "/AssetSphere/pseries" },
    { id: 6, title: "Storage", icon: HardDrive, path: "/AssetSphere/storage" },
    // { id: 7, title: "Sucursales", icon: Building, path: "/AssetSphere/sucursales" },
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
    else {
      return <ServidoresFisicos />; // Componente por defecto
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-inter">
      {/* Sidebar Profesional */}
      <div
        className={`flex flex-col ${
          open ? "w-72" : "w-20"
        } bg-slate-900 h-full relative transition-all duration-300 ease-in-out border-r border-slate-800 shadow-2xl z-40`}
      >
        {/* Botón colapsar */}
        <div 
          onClick={() => setOpen(!open)}
          className="absolute -right-3.5 top-8 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:shadow hover:scale-105 transition-all z-50"
        >
          <img
            src="/AssetSphere/chevron-left.png"
            className={`w-3.5 opacity-70 transition-transform duration-300 ${!open && "rotate-180"}`}
            alt="Toggle"
          />
        </div>

        {/* Logo Section */}
        <div className={`flex items-center ${open ? "justify-start px-6" : "justify-center"} h-24 border-b border-slate-800/50 mb-4 transition-all overflow-hidden`}>
          <div className="min-w-max flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-as-brand-500 to-as-brand-600 flex items-center justify-center shadow-lg shadow-as-brand-500/20">
              <ShieldCheck className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <h1
              className={`text-xl font-bold text-white tracking-wide whitespace-nowrap transition-opacity duration-300 ${
                !open ? "opacity-0 w-0 hidden" : "opacity-100"
              }`}
            >
              AssetSphere
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
          <p className={`text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3 transition-opacity duration-300 ${!open && "opacity-0 hidden"}`}>
            Menú Principal
          </p>
          <ul className="space-y-1.5">
            {Menus.map((Menu) => {
              const isActive = location.pathname.includes(Menu.path.split("/").pop());
              
              return (
                <li
                  key={Menu.id}
                  className={`group flex items-center rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "bg-as-brand-600/10 text-as-brand-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                  onClick={() => navigate(Menu.path)}
                  title={!open ? Menu.title : ""}
                >
                  <div className={`min-w-max transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    <Menu.icon 
                      size={20} 
                      strokeWidth={isActive ? 2.5 : 2}
                      className={isActive ? "text-as-brand-400" : "text-slate-400 group-hover:text-slate-300"} 
                    />
                  </div>
                  <span 
                    className={`ml-3 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      !open ? "opacity-0 translate-x-4 w-0 hidden" : "opacity-100 translate-x-0"
                    }`}
                  >
                    {Menu.title}
                  </span>
                  
                  {/* Indicador activo sutil */}
                  {isActive && open && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-as-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* Footer Sidebar */}
        <div className={`p-4 border-t border-slate-800/50 transition-all ${!open ? "items-center flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${!open ? "justify-center" : ""}`}>
            <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center min-w-max border border-slate-700">
              <Server size={16} className="text-slate-400" />
            </div>
            {open && (
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-300 truncate">v2.4.0-stable</p>
                <p className="text-[10px] text-slate-500 truncate">Sistema Activo</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Contenido Principal */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col bg-slate-50">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}
