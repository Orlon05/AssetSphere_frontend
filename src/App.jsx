import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import EnrutadorApp from './routes/EnrutadorApp';
import { AuthProvider } from './routes/AuthContext'; 

const router = createBrowserRouter(EnrutadorApp);

function App() {
  return (
    <AuthProvider> 
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
