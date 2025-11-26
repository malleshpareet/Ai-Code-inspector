import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

import { LoaderProvider } from './context/LoaderContext'
import GlobalLoader from './components/ui/GlobalLoader'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LoaderProvider>
        <App />
        <GlobalLoader />
      </LoaderProvider>
    </BrowserRouter>
  </StrictMode>,
)
