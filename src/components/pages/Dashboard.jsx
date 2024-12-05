import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import style from "./dashboard.module.css";
import Sidebar from "../layouts/Sidebar";
import Navegacion from "../layouts/Navegacion";

const Dashboard = () => {
  const [abrirMenu, cerrarMenu] = useState(false);

  const toggleSidebar = () => {
    //Esta constante es, para pasar el hook luego al crear  el menu lateral
    cerrarMenu(!abrirMenu);
  };

  return (
    <main>
      <section className={style.panelControl}>
          <Sidebar isOpen={abrirMenu} />
        <section>
          <Navegacion toggleSidebar={toggleSidebar} />
          <Outlet />
        </section>
      </section>
    </main>
  );
};

export default Dashboard;
