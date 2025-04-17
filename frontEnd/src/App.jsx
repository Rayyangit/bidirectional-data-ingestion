import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import ExportPage from './pages/ExportPage'
import HomePage from './pages/HomePage'
import ImportPage from './pages/ImportPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/export" element={<ExportPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  )
}

export default App