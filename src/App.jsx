import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {EnrutadorApp} from './components/routes/EnrutadorApp';

let router = createBrowserRouter(EnrutadorApp); //aplicamos como contenido principal la ruta para que acceda dependiendo de la Auth//

function App() {

  return <RouterProvider router={router} />;

}  
export default App;
