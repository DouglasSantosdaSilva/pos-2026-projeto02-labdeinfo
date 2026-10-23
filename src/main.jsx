import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// CSS do Bootstrap 5 e Ícones do Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Estilos globais/customizados do projeto
import './index.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)