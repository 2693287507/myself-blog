// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import './global.less'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    {/* <StrictMode> */}
      <App />
    {/* </StrictMode> */}
  </HashRouter>,
)
