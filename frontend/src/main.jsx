import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from './Context/TheamContext.jsx';

createRoot(document.getElementById('root')).render(
 
  <BrowserRouter>
  <ThemeProvider>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light" // change to "dark" if needed
      />
    <App/>
  </ThemeProvider>
  </BrowserRouter>
)
