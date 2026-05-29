import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../IMG/Tata_Logo.png";
import ServidoresFisicos from "../services/servidores Fisicos/servidoresF";
import BasesDeDatos from "../services/Base de datos/baseDeDatos";
import Pseries from "../services/Pseries/Pseries";
import ServidoresVirtuales from "../services/servidores Virtuales/servidoresV";
import Storage from "../services/storage/Storage";
import Insumos from "../services/Insumos/Insumos";

import {
  Server,
  Database,
  Cloud,
  LayoutGrid,
  Boxes,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const isInvPseries = path.includes("pseries-inv");
  const isInvStorage = path.includes("storage-inv");
  const isMainPseries = path.includes("pseries") && !isInvPseries;
  const isMainStorage = path.includes("storage") && !isInvStorage;
  const [expanded, setExpanded] = useState({
    inventario: isInvPseries || isInvStorage,
    infraestructura: isMainPseries || isMainStorage,
  });

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
    {
      id: 5,
      title: "Inventario Infraestructura",
      icon: Boxes,
      path: "/AssetSphere/pseries-inv",
      groupKey: "inventario",
      children: [
        { id: "pseries_inv", title: "Pseries", path: "/AssetSphere/pseries-inv" },
        { id: "storage_inv", title: "Storage", path: "/AssetSphere/storage-inv" },
      ],
    },
    {
      id: 6,
      title: "Servicios Infraestructura",
      icon: Server,
      path: "/AssetSphere/pseries",
      groupKey: "infraestructura",
      children: [
        { id: "pseries", title: "Pseries", path: "/AssetSphere/pseries" },
        { id: "storage", title: "Storage", path: "/AssetSphere/storage" },
      ],
    },
    { id: 8, title: "Insumos", icon: Boxes, path: "/AssetSphere/insumos" },
    // { id: 7, title: "Sucursales", icon: Building, path: "/AssetSphere/sucursales" },
  ];

  useEffect(() => {
    setExpanded((prev) => ({
      ...prev,
      inventario:
        prev.inventario ||
        isInvPseries ||
        isInvStorage,
      infraestructura:
        prev.infraestructura ||
        isMainPseries ||
        isMainStorage,
    }));
  }, [location.pathname]);

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
    } else if (path.includes("insumos")) {
      return <Insumos />;
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
        <div className={`flex items-center ${open ? "justify-start px-6" : "justify-center"} h-24 border-b border-slate-800/30 mb-6 transition-all overflow-hidden`}>
          <div className="min-w-max flex items-center gap-4">
            <img 
              src={Logo}
              alt="AssetSphere Logo"
              className="h-12 w-12 object-contain filter drop-shadow-lg"
            />
            <h1
              className={`text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent tracking-tight whitespace-nowrap transition-opacity duration-300 ${
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
              const isLeaf = !Menu.children || Menu.children.length === 0;
              const isActive = isLeaf
                ? path.includes(Menu.path.split("/").pop())
                : Menu.children.some((c) => path.includes(c.path.split("/").pop()));
              
              return (
                <li key={Menu.id}>
                  <div
                    className={`group flex items-center rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? "bg-as-brand-600/10 text-as-brand-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`}
                    onClick={() => {
                      if (Menu.children && Menu.children.length > 0 && open) {
                        setExpanded((prev) => ({
                          ...prev,
                          [Menu.groupKey]: !prev[Menu.groupKey],
                        }));
                        return;
                      }
                      if (Menu.children && Menu.children.length > 0 && !open) {
                        navigate(Menu.children[0]?.path || Menu.path);
                        return;
                      }
                      navigate(Menu.path);
                    }}
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
                    {isActive && open && (
                      <div className="ml-auto flex items-center gap-2">
                        {Menu.children && Menu.children.length > 0 ? (
                          expanded[Menu.groupKey] ? (
                            <ChevronDown size={16} className="text-as-brand-400" />
                          ) : (
                            <ChevronRight size={16} className="text-as-brand-400" />
                          )
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-as-brand-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
                        )}
                      </div>
                    )}
                    {!isActive && Menu.children && Menu.children.length > 0 && open && (
                      <div className="ml-auto">
                        {expanded[Menu.groupKey] ? (
                          <ChevronDown size={16} className="text-slate-400" />
                        ) : (
                          <ChevronRight size={16} className="text-slate-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {Menu.children && Menu.children.length > 0 && open && expanded[Menu.groupKey] && (
                    <div className="mt-1 ml-9 space-y-1">
                      {Menu.children.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <div
                            key={child.id}
                            className={`rounded-lg px-3 py-2 text-sm cursor-pointer transition-all ${
                              childActive
                                ? "bg-as-brand-600/10 text-as-brand-300"
                                : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                            }`}
                            onClick={() => navigate(child.path)}
                          >
                            {child.title}
                          </div>
                        );
                      })}
                    </div>
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
