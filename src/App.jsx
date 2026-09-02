import Home from './pages/Home'
import { BrowserRouter, Route } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  return (
    <>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App
