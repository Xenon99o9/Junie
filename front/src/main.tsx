import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MenuPrincipal from './menuPrincipal.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuPrincipal /> 
    <App />
  </StrictMode>,
)
