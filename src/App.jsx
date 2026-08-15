import Home from './pages/Home'
import { BrowserRouter, Route } from 'react-router-dom'
import AppRoutes from './AppRoutes'

function App() {

  return (
    <>
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
    </>
  )
}

export default App
