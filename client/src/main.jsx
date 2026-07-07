import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { Toaster } from 'react-hot-toast'
import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <AppContextProvider>
          <Toaster position="top-center" />
          <App />
        </AppContextProvider>
      </BrowserRouter>
     </ClerkProvider>,
)
