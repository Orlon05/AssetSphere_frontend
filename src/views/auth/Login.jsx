import { useEffect, useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
//import style from "../../css/login.module";
//import PopupError from "../popups/PopupError";
// import Loader from "../layouts/Loader";
import { useAuth } from "../../routes/AuthContext";


const Login = () => {
    const user = useAuth();
    //estado para manejar el correo y la contraseña
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    //estado para mostrar el modal de error
    const [modalError, setModalError] = useState(false);

    const gradientStyle = {
        background: "linear-gradient(10deg, rgb(238, 119, 82,0.2), rgb(231, 60, 126,0.2), rgb(35, 166, 213,0.2), rgb(35, 213, 171,0.2))",
        backgroundSize: "400% 400%",
        animation: "gradient 5s ease infinite",
        height: "100vh",
      };

    // Función para logearse
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json(); // Llama a response.json() solo una vez

            if (!response.ok) {
                const errorMessage =
                    data.detail && data.detail.length > 0
                        ? data.detail[0].msg
                        : "Error de autenticación";
                throw new Error(errorMessage);
            }

            const tokenFromResponse = data.data.accessToken;

            user.login(tokenFromResponse);
            const tokenFromLocalStorage = localStorage.getItem("authenticationToken");

            localStorage.setItem("userInfo", JSON.stringify(data.data));
            navigate("/analitica");
        } catch (error) {
            setErrorMessage(error.message);
            setModalError(true);
            console.error("Error de inicio de sesión:", error);
        } finally {
            setIsLoading(false);
        }
    };

    //función para cerrar el modal de error
    const cerrarModalError = () => {
        setModalError(false);
    };

    useEffect(() => {
        if (user.token) navigate("/analitica");
    }, [user.token]);

    return (
        !user.token && (

            <div
    class="relative mx-auto w-full max-w-md bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:rounded-xl sm:px-10">
    <div class="w-full">
        <div class="text-center">
            <img src="../public/tcs_logo.png" alt="" />
            <p class="mt-2 text-gray-500">Iniciar Sesión</p>
        </div>
        <div class="mt-5">
            <form action="">
                <div class="relative mt-6">
                    <input type="email" name="email" id="email" placeholder="Email Address" class="peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" autocomplete="NA" />
                    <label for="email" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Email Address</label>
                </div>
                <div class="relative mt-6">
                    <input type="password" name="password" id="password" placeholder="Password" class="peer peer mt-1 w-full border-b-2 border-gray-300 px-0 py-1 placeholder:text-transparent focus:border-gray-500 focus:outline-none" />
                    <label for="password" class="pointer-events-none absolute top-0 left-0 origin-left -translate-y-1/2 transform text-sm text-gray-800 opacity-75 transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:pl-0 peer-focus:text-sm peer-focus:text-gray-800">Password</label>
                </div>
                <div class="my-6">
                    <button type="submit" class="w-full rounded-md bg-black px-3 py-4 text-white focus:bg-gray-600 focus:outline-none">Sign in</button>
                </div>
                <p class="text-center text-sm text-gray-500">Don&#x27;t have an account yet?
                    <a href="#!"
                        class="font-semibold text-gray-600 hover:underline focus:text-gray-800 focus:outline-none">Sign
                        up
                    </a>.
                </p>
            </form>
        </div>
    </div>
</div>
        )
    );
};

export default Login;
