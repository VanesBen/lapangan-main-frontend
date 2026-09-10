import Home from './pages/Home'
import { BrowserRouter, Route } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
    <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#1e1e1e',
            color: '#fff',
            border: '1px solid #2e2e2e',
            fontSize: '13px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#1e1e1e',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#1e1e1e',
            },
          },
        }}
      />
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
      </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App
