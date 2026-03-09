import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Heart, Mail, Lock, User, Stethoscope, Building2 } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PATIENT');
    const [hospitalId, setHospitalId] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [state, setState] = useState('');
    const [degree, setDegree] = useState('');
    const [certificatePath, setCertificatePath] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await api.get('/hospitals');
                setHospitals(response.data);
            } catch (err) {
                console.error('Failed to fetch hospitals:', err);
            }
        };
        fetchHospitals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const payload = {
                name, email, password, role,
                ...(role === 'DOCTOR' && {
                    hospitalId: hospitalId || null,
                    specialization: specialization || null,
                    licenseNumber,
                    state,
                    degree,
                    certificatePath
                })
            };
            await register(payload);
            toast.success('Registration Successful! ' + (role === 'DOCTOR' ? 'Please wait for admin approval.' : 'Please Login.'));
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 bg-background order-2 lg:order-1">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden mb-8">
                        <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                        <h2 className="text-2xl font-bold gradient-text">Smart Healthcare</h2>
                    </div>

                    <Card className="border-2">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                            <CardDescription className="text-base">
                                Join our healthcare platform today
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            type="text"
                                            placeholder="John Doe"
                                            className="pl-10"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="role">I am a</Label>
                                    <Select
                                        id="role"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                    >
                                        <option value="PATIENT">Patient</option>
                                        <option value="DOCTOR">Doctor</option>
                                    </Select>
                                </div>

                                {role === 'DOCTOR' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="hospital">Hospital</Label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                                                <Select
                                                    id="hospital"
                                                    value={hospitalId}
                                                    onChange={(e) => setHospitalId(e.target.value)}
                                                    className="pl-10"
                                                    required
                                                >
                                                    <option value="">Select a hospital</option>
                                                    {hospitals.map((hospital) => (
                                                        <option key={hospital.id} value={hospital.id}>
                                                            {hospital.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="specialization">Specialization</Label>
                                            <div className="relative">
                                                <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="specialization"
                                                    type="text"
                                                    placeholder="e.g. Cardiologist"
                                                    className="pl-10"
                                                    value={specialization}
                                                    onChange={(e) => setSpecialization(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* New Doctor Fields */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="licenseNumber">License Number</Label>
                                                <Input
                                                    id="licenseNumber"
                                                    type="text"
                                                    placeholder="LIC12345"
                                                    value={licenseNumber}
                                                    onChange={(e) => setLicenseNumber(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    type="text"
                                                    placeholder="e.g. California"
                                                    value={state}
                                                    onChange={(e) => setState(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="degree">Degree</Label>
                                            <Input
                                                id="degree"
                                                type="text"
                                                placeholder="e.g. MBBS, MD"
                                                value={degree}
                                                onChange={(e) => setDegree(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="certificatePath">Certificate URL/Path</Label>
                                            <Input
                                                id="certificatePath"
                                                type="text"
                                                placeholder="Link to your certificate"
                                                value={certificatePath}
                                                onChange={(e) => setCertificatePath(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full text-base font-semibold"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating account...' : 'Sign Up'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary hover:underline font-semibold">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Side - Hero Section */}
            <div className="hidden lg:flex gradient-bg relative overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    <Heart className="h-20 w-20 mb-6 animate-pulse" />
                    <h1 className="text-5xl font-bold mb-4">Join Us Today</h1>
                    <p className="text-2xl font-light mb-8 text-center max-w-md">
                        Start your healthcare journey
                    </p>
                    <div className="space-y-6 max-w-lg">
                        <div className="glass p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">For Patients</h3>
                            <ul className="space-y-2 text-sm opacity-90">
                                <li>✓ Book appointments with top doctors</li>
                                <li>✓ Access medical records anytime</li>
                                <li>✓ 24/7 emergency services</li>
                            </ul>
                        </div>
                        <div className="glass p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">For Doctors</h3>
                            <ul className="space-y-2 text-sm opacity-90">
                                <li>✓ Manage your appointments</li>
                                <li>✓ Connect with patients</li>
                                <li>✓ Access patient records</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
