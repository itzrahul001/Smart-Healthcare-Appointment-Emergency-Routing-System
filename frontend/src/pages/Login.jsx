import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Heart, Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login Successful!');
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
            toast.error('Login Failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Hero Section */}
            <div className="hidden lg:flex gradient-bg relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    <Heart className="h-20 w-20 mb-6 animate-pulse" />
                    <h1 className="text-5xl font-bold mb-4">Smart Healthcare</h1>
                    <p className="text-2xl font-light mb-8 text-center max-w-md">
                        Your Health, Our Priority
                    </p>
                    <div className="space-y-4 text-center max-w-lg">
                        <p className="text-lg opacity-90">
                            Book appointments, view medical records, and find top doctors with ease.
                        </p>
                        <div className="flex gap-4 mt-8 flex-wrap justify-center">
                            <div className="glass px-6 py-4 rounded-lg">
                                <p className="text-3xl font-bold">500+</p>
                                <p className="text-sm opacity-90">Doctors</p>
                            </div>
                            <div className="glass px-6 py-4 rounded-lg">
                                <p className="text-3xl font-bold">50+</p>
                                <p className="text-sm opacity-90">Hospitals</p>
                            </div>
                            <div className="glass px-6 py-4 rounded-lg">
                                <p className="text-3xl font-bold">24/7</p>
                                <p className="text-sm opacity-90">Emergency</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center p-8 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:hidden mb-8">
                        <Heart className="h-12 w-12 text-primary mx-auto mb-2" />
                        <h2 className="text-2xl font-bold gradient-text">Smart Healthcare</h2>
                    </div>

                    <Card className="border-2">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                            <CardDescription className="text-base">
                                Sign in to access your healthcare dashboard
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <div className="bg-destructive/10 border border-destructive/50 text-destructive px-4 py-3 rounded-md mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                            autoFocus
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

                                <Button
                                    type="submit"
                                    className="w-full text-base font-semibold"
                                    size="lg"
                                    disabled={loading}
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </form>

                            <div className="mt-6 text-center space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary hover:underline font-semibold">
                                        Sign up
                                    </Link>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Or{' '}
                                    <Link to="/doctors" className="text-primary hover:underline font-semibold">
                                        browse doctors as guest
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
