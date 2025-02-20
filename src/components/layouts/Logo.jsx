import React from "react";
import { MdOutlineInventory } from "react-icons/md";
import Style from './logo.module.css'; 

const Logo = () => {
    return (
        <div className={Style.logo}>
            <MdOutlineInventory className={Style.icon} />
            <p className={Style.text}>Inveplus</p>
        </div>
    );
};

export default Logo;
