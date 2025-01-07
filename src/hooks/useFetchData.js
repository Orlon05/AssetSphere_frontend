import { useState } from "react";
import Swal from "sweetalert2";
const useFetchData = (baseUrl, initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authenticationToken");

    const fetchData = async (url, options = {}) => {
      setLoading(true);
      setError(null);
      try {
          const response = await fetch(baseUrl + url, {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "application/json",
            },
            ...options,
          });
          if (!response.ok) {
            throw await response.json();
          }
          const data = await response.json();
          if(data && data.status === "success" && data.data) {
            setData(data.data);
            return data.data;
          }else{
            throw new Error("Respuesta inesperada de la API");
          }
      } catch (error) {
        setError(error);
        console.error("Error fetching data:", error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.msg || error.message || "Ha ocurrido un error.",
          });
      } finally {
        setLoading(false);
      }
    };
    return { data, loading, error, fetchData };
};
export default useFetchData;