import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Emergency from './pages/Emergency'
import Appointments from './pages/Appointments'
import Doctors from './pages/Doctors'
import MedicalRecords from './pages/MedicalRecords'
import AddHospital from './pages/AddHospital'
import { AuthProvider } from './context/AuthContext'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/emergency" element={<Emergency />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/doctors" element={<Doctors />} />
                    <Route path="/medical-records" element={<MedicalRecords />} />
                    <Route path="/add-hospital" element={<AddHospital />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
