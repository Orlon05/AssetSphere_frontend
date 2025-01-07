import React from "react";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import style from "../pages/fisicos.module.css";

const DeleteButton = ({ itemId, onDelete, title, text, icon }) => {
  const handleDelete = async () => {
    Swal.fire({
      title: title || "¿Estás seguro?",
      text: text || "¿Deseas eliminar este elemento?",
      icon: icon || "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try{
           await onDelete(itemId);
          Swal.fire("Eliminado!", "El elemento ha sido eliminado.", "success");
        }catch(error){
          Swal.fire(
            "Error!",
            error.msg || error.message || "Ocurrió un error al eliminar el elemento.",
            "error"
          );
        }
      }
    });
  };
  return (
    <button className={style.btnDelete} onClick={handleDelete}>
      <MdDelete />
    </button>
  );
};

export default DeleteButton;