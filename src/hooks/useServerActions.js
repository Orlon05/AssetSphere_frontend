import { useState } from 'react';
import Swal from 'sweetalert2';

const useServerActions = (token,setServers, showSuccessToast) => {
  const [selectedServers, setSelectedServers] = useState(new Set());

  const toggleSelectAll = (servers, selectAll, setSelectAll) => {
    setSelectAll(!selectAll);
    if (selectAll) {
      setSelectedServers(new Set());
    } else {
      setSelectedServers(new Set(servers.map((server) => server.id)));
    }
  };

  const toggleSelectServer = (serverId) => {
    const newSelectedServers = new Set(selectedServers);
    if (newSelectedServers.has(serverId)) {
      newSelectedServers.delete(serverId);
    } else {
      newSelectedServers.add(serverId);
    }
    setSelectedServers(newSelectedServers);
  };

    const handleDeleteServer = async (serverId) => {
         Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseas eliminar este servidor?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(
                        `http://localhost:8000/servers/physical/${serverId}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        let errorMessage = `Error HTTP ${response.status}`;
                        if (response.status === 422) {
                            const errorData = await response.json();
                            errorMessage = errorData.detail.map((e) => e.msg).join(", ");
                        } else if (response.status === 401 || response.status === 403) {
                            errorMessage =
                                "Error de autorización. Tu sesión ha expirado o no tienes permisos.";
                        } else if (response.status === 404) {
                            errorMessage = "El servidor no existe.";
                        } else {
                            try {
                                const errorData = await response.json();
                                if (errorData.message) errorMessage = errorData.message;
                            } catch (e) {}
                        }
                        Swal.fire({
                            icon: "error",
                            title: "Error al eliminar el servidor",
                            text: errorMessage,
                        });
                    } else {

                         setServers((prevServers) =>
                            prevServers.filter((server) => server.id !== serverId)
                         );
                        showSuccessToast();
                    }
                } catch (error) {
                    console.error("Error al eliminar el servidor:", error);
                     Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error inesperado al eliminar el servidor.",
                    });
                }
            }
        });
    };



  return {
    selectedServers,
    toggleSelectAll,
    toggleSelectServer,
    handleDeleteServer,
  };
};

export default useServerActions;