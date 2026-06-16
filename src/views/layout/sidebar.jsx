import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../../IMG/Tcs.png";
import CibestLogo from "../../IMG/Cibest.png";
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
  const [open, setOpen] = useState(false);
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
  ];

  useEffect(() => {
    setExpanded((prev) => ({
      ...prev,
      inventario: prev.inventario || isInvPseries || isInvStorage,
      infraestructura: prev.infraestructura || isMainPseries || isMainStorage,
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
    } else {
      return <ServidoresFisicos />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0b1120] font-inter">
      {/* Sidebar Oscuro Profesional */}
      <div
        className={`flex flex-col ${
          open ? "w-72" : "w-20"
        } bg-[#111827] h-full relative transition-all duration-300 ease-in-out border-r border-slate-800 shadow-[4px_0_24px_rgba(0,0,0,0.2)] z-40`}
      >
        {/* Botón colapsar */}
        <div
          onClick={() => setOpen(!open)}
          className="absolute -right-3.5 top-8 w-7 h-7 bg-[#1e293b] border border-slate-700 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-slate-700 hover:scale-105 transition-all z-50"
        >
          <img
            src="/AssetSphere/chevron-left.png"
            className={`w-3.5 opacity-80 brightness-0 invert transition-transform duration-300 ${!open && "rotate-180"}`}
            alt="Toggle"
          />
        </div>

        {/* Logo Section (Top Title) */}
        <div className={`flex items-center ${open ? "justify-center px-6" : "justify-center"} h-24 border-b border-slate-800 mb-4 transition-all overflow-hidden`}>
          <div className="flex items-center">
            {open ? (
              <h1 className="text-2xl font-bold text-white tracking-tight whitespace-nowrap transition-opacity duration-300">
                AssetSphere
              </h1>
            ) : (
              <h1 className="text-xl font-bold text-white tracking-tight whitespace-nowrap transition-opacity duration-300">
                AS
              </h1>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2 px-4 custom-scrollbar">
          <p className={`text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-4 px-2 transition-opacity duration-300 ${!open && "opacity-0 hidden"}`}>
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
                    className={`group flex items-center py-3 px-3 cursor-pointer transition-all duration-200 rounded-xl ${
                      isActive
                        ? "bg-[#1e293b] text-blue-400 font-semibold shadow-inner"
                        : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-slate-200"
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
                    <div className={`min-w-max transition-transform duration-200 ${isActive ? "scale-105" : "group-hover:scale-105"}`}>
                      <Menu.icon
                        size={20}
                        strokeWidth={isActive ? 2.2 : 2}
                        className={isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300 transition-colors"}
                      />
                    </div>
                    <span
                      className={`ml-3 text-sm whitespace-nowrap transition-all duration-300 ${
                        !open ? "opacity-0 translate-x-4 w-0 hidden" : "opacity-100 translate-x-0"
                      }`}
                    >
                      {Menu.title}
                    </span>
                    
                    {/* Indicador de activo a la derecha */}
                    {isActive && open && (!Menu.children || Menu.children.length === 0) && (
                      <div className="ml-auto flex items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.6)]"></div>
                      </div>
                    )}

                    {/* Chevron para menús desplegables */}
                    {Menu.children && Menu.children.length > 0 && open && (
                      <div className="ml-auto flex items-center">
                        {expanded[Menu.groupKey] ? (
                          <ChevronDown size={16} className={isActive ? "text-blue-400" : "text-slate-500"} />
                        ) : (
                          <ChevronRight size={16} className={isActive ? "text-blue-400" : "text-slate-500"} />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Submenús */}
                  {Menu.children && Menu.children.length > 0 && open && expanded[Menu.groupKey] && (
                    <div className="mt-1 ml-6 pl-3 border-l border-slate-700 space-y-1">
                      {Menu.children.map((child) => {
                        const childActive = location.pathname === child.path;
                        return (
                          <div
                            key={child.id}
                            className={`rounded-lg px-3 py-2 text-sm cursor-pointer transition-all ${
                              childActive
                                ? "text-blue-400 font-semibold bg-[#1e293b]/50 relative before:absolute before:-left-[15px] before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-400 before:shadow-[0_0_6px_rgba(96,165,250,0.5)]"
                                : "text-slate-400 hover:bg-[#1e293b]/50 hover:text-slate-200"
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

        {/* Footer Logos Section */}
        <div className={`mt-auto border-t border-slate-800 p-4 transition-all duration-300 ${!open ? "flex-col items-center gap-4" : "flex flex-row justify-center items-center gap-4"}`}>
          <img
            src={Logo}
            alt="TCS Logo"
            className={`${open ? "h-6" : "h-5"} w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity`}
            title="TATA Consultancy Services"
          />
          <img
            src={CibestLogo}
            alt="Grupo Cibest Logo"
            className={`${open ? "h-8" : "h-6"} w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition-opacity ${!open && "mt-2"}`}
            title="Grupo Cibest"
          />
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 h-screen overflow-hidden flex flex-col bg-white dark:bg-[#0b1120]">
        <div className="flex-1 overflow-auto custom-scrollbar relative">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}






