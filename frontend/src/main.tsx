import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {  RouterProvider } from 'react-router-dom'
import router from './route/index.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')!).render(
   <HelmetProvider>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
  </GoogleOAuthProvider>
   </HelmetProvider>
)
