import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Heart, Home, Users, Calendar, FileText, AlertCircle, Building2, UserPlus, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = user ? [
        { to: '/dashboard', label: 'Dashboard', icon: Home },
        ...(user.role !== 'ROLE_DOCTOR' && user.role !== 'ROLE_ADMIN' ? [{ to: '/doctors', label: 'Doctors', icon: Users }] : []),
        ...(user.role !== 'ROLE_ADMIN' ? [
            { to: '/appointments', label: 'Appointments', icon: Calendar },
            { to: '/medical-records', label: 'Records', icon: FileText }
        ] : []),
    ] : [
        { to: '/doctors', label: 'Find Doctors', icon: Users }
    ];

    const adminLinks = user?.role === 'ROLE_ADMIN' ? [
        { to: '/add-hospital', label: 'Add Hospital', icon: Building2 },
    ] : [];

    return (
        <nav className="sticky top-0 z-50 glass border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <Heart className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold gradient-text hidden sm:block">
                            Smart Healthcare
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to}>
                                <Button variant="ghost" className="gap-2">
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        ))}

                        {adminLinks.map((link) => (
                            <Link key={link.to} to={link.to}>
                                <Button variant="ghost" className="gap-2">
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        ))}

                        {user && (
                            <Link to="/emergency">
                                <Button variant="destructive" className="gap-2 ml-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Emergency
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium">Hi, {user.name || 'User'}</p>
                                    <p className="text-xs text-muted-foreground">{user.role?.replace('ROLE_', '')}</p>
                                </div>
                                <Button variant="outline" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button>Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-white/20 glass">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        ))}

                        {adminLinks.map((link) => (
                            <Link key={link.to} to={link.to} onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <link.icon className="h-4 w-4" />
                                    {link.label}
                                </Button>
                            </Link>
                        ))}

                        {user && (
                            <Link to="/emergency" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="destructive" className="w-full justify-start gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Emergency
                                </Button>
                            </Link>
                        )}

                        <div className="border-t border-white/20 pt-2 mt-2">
                            {user ? (
                                <>
                                    <div className="px-3 py-2">
                                        <p className="text-sm font-medium">Hi, {user.name || 'User'}</p>
                                        <p className="text-xs text-muted-foreground">{user.role?.replace('ROLE_', '')}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-2">
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
