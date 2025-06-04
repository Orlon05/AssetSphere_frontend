// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// // import style from "../../css/login.module";
// //import PopupError from "../popups/PopupError";
// // import Loader from "../layouts/Loader";
// import { useAuth } from "../../routes/AuthContext";

// const gradientStyle = {
//   background:
//     "linear-gradient(45deg, rgb(133, 132, 132), rgb(184, 182, 182), rgb(124, 183, 231), rgb(86, 79, 179))",
//   backgroundSize: "400% 400%",
//   animation: "gradient 10s ease infinite",
//   height: "100vh",
// };

// const Perfil = () => {
//   const user = useAuth();
//   //estado para manejar el correo y la contraseña
//   const navigate = useNavigate();
//   const [associateName, setAssociateName] = useState("");
//   const [username, setUsername] = useState("");
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // Función para actualizar los datos del usuario
//   const handlePerfilSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setErrorMessage("");

//     try {
//       const response = await fetch(
//         "https://10.8.150.90/api/inveplus/users/edit",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         const errorMessage =
//           data.detail && data.detail.length > 0
//             ? data.detail[0].msg
//             : "Error de autenticación";
//         throw new Error(errorMessage);
//       }

//       const tokenFromResponse = data.data.accessToken;

//       user.login(tokenFromResponse);
//       const tokenFromLocalStorage = localStorage.getItem("authenticationToken");

//       localStorage.setItem("userInfo", JSON.stringify(data.data));
//       navigate("/dashboard");
//     } catch (error) {
//       // setErrorMessage(error.message);
//       // setModalError(true);
//       console.error("Error de inicio de sesión:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user.token) navigate("/inveplus/dashboard");
//   }, [user.token]);

//  {!user.token && (
//   <div style={gradientStyle}>
//     <div className="min-h-screen flex items-center justify-center p-4">
//       <div className="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
//         <div className="w-full">
//           <div className="flex justify-center mb-6">
//             <img src="/inveplus/logo.png" />
//           </div>
//           <div className="text-center">
//             <h1 className="text-2xl font-semibold text-gray-900">
//               Cambio de Contraseña
//             </h1>
//           </div>
//           <div className="mt-5">
//             <form onSubmit={handlePasswordChangeSubmit}>
//               {/* Nombre de Asociado */}
//               <div className="relative mt-6">
//                 <input
//                   type="text"
//                   value={associateName}
//                   onChange={(e) => setAssociateName(e.target.value)}
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
//                   placeholder="Nombre de Asociado"
//                   required
//                 />
//                 <label className="...">Nombre de Asociado</label>
//               </div>

//               {/* Nombre de Usuario */}
//               <div className="relative mt-6">
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
//                   placeholder="Nombre de Usuario"
//                   required
//                 />
//                 <label className="...">Nombre de Usuario</label>
//               </div>

//               {/* Contraseña Anterior */}
//               <div className="relative mt-6">
//                 <input
//                   type="password"
//                   value={oldPassword}
//                   onChange={(e) => setOldPassword(e.target.value)}
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
//                   placeholder="Contraseña anterior"
//                   required
//                 />
//                 <label className="...">Contraseña anterior</label>
//               </div>

//               {/* Contraseña Nueva */}
//               <div className="relative mt-6">
//                 <input
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
//                   placeholder="Contraseña nueva"
//                   required
//                 />
//                 <label className="...">Contraseña nueva</label>
//               </div>

//               {/* Confirmar Contraseña Nueva */}
//               <div className="relative mt-6">
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none"
//                   placeholder="Confirmar contraseña nueva"
//                   required
//                 />
//                 <label className="...">Confirmar contraseña nueva</label>
//               </div>

//               {/* Error message */}
//               {errorMessage && (
//                 <p className="mt-4 text-sm text-red-600 text-center">
//                   {errorMessage}
//                 </p>
//               )}

//               {/* Botón Guardar */}
//               <div className="my-6">
//                 <button
//                   type="submit"
//                   className="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none"
//                 >
//                   Guardar
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

// };

// export default Perfil;
