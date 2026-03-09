import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Calendar, Users, FileText, AlertCircle, Activity, Clock, Stethoscope, Building2, CheckCircle, XCircle, Trash2, Ban, Unlock } from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [pendingDoctors, setPendingDoctors] = useState([]);
    const [activeDoctors, setActiveDoctors] = useState([]);
    const [blockedDoctors, setBlockedDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // For Admin management view
    const isDoctor = user?.role === 'ROLE_DOCTOR';
    const isAdmin = user?.role === 'ROLE_ADMIN';

    useEffect(() => {
        if (user && user.id) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setLoading(true);
            if (isAdmin) {
                const [pendingRes, activeRes, blockedRes, hospitalsRes] = await Promise.all([
                    api.get('/admin/pending-doctors'),
                    api.get('/admin/active-doctors'),
                    api.get('/admin/blocked-doctors'),
                    api.get('/admin/hospitals')
                ]);
                setPendingDoctors(pendingRes.data);
                setActiveDoctors(activeRes.data);
                setBlockedDoctors(blockedRes.data);
                setHospitals(hospitalsRes.data);
            } else if (isDoctor) {
                const appointmentsRes = await api.get(`/appointments/doctor/${user.id}`);
                setAppointments(appointmentsRes.data);
            } else {
                const [appointmentsRes, doctorsRes] = await Promise.all([
                    api.get(`/appointments/patient/${user.id}`),
                    api.get('/doctors')
                ]);
                setAppointments(appointmentsRes.data);
                setDoctors(doctorsRes.data.slice(0, 3));
            }
        } catch (error) {
            console.error("Error fetching dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveDoctor = async (userId) => {
        try {
            await api.put(`/admin/approve-doctor/${userId}`);
            toast.success("Doctor approved successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to approve doctor");
        }
    };

    const handleRejectDoctor = async (userId) => {
        try {
            await api.put(`/admin/reject-doctor/${userId}`);
            toast.success("Doctor rejected successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to reject doctor");
        }
    };

    const handleBlockDoctor = async (userId) => {
        if (window.confirm("Are you sure you want to block this doctor?")) {
            try {
                await api.put(`/admin/block-doctor/${userId}`);
                toast.success("Doctor blocked successfully");
                fetchData();
            } catch (error) {
                toast.error("Failed to block doctor");
            }
        }
    };

    const handleUnblockDoctor = async (userId) => {
        try {
            await api.put(`/admin/unblock-doctor/${userId}`);
            toast.success("Doctor unblocked successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to unblock doctor");
        }
    };

    const handleDeleteHospital = async (hospitalId) => {
        if (window.confirm("Are you sure you want to delete this hospital?")) {
            try {
                await api.delete(`/admin/hospitals/${hospitalId}`);
                toast.success("Hospital deleted successfully");
                fetchData();
            } catch (error) {
                toast.error("Failed to delete hospital");
            }
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await api.put(`/appointments/${appointmentId}/status?status=${newStatus}`);
            toast.success(`Appointment ${newStatus.toLowerCase()}!`);
            fetchData();
        } catch (error) {
            console.error('Error updating status', error);
            toast.error("Failed to update status");
        }
    };

    const stats = isAdmin ? [
        { title: "Pending Approvals", value: pendingDoctors.length, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/20" },
        { title: "Total Hospitals", value: hospitals.length, icon: Building2, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/20" },
        { title: "Active Doctors", value: activeDoctors.length, icon: Users, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/20" }
    ] : isDoctor ? [
        { title: "Total Appointments", value: appointments.length, icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/20" },
        { title: "Pending Requests", value: appointments.filter(a => a.status === 'PENDING').length, icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-50 dark:bg-yellow-950/20" },
        { title: "Accepted Today", value: appointments.filter(a => a.status === 'ACCEPTED').length, icon: Activity, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/20" }
    ] : [
        { title: "Upcoming Appointments", value: appointments.filter(a => ['BOOKED', 'PENDING', 'ACCEPTED'].includes(a.status)).length, icon: Calendar, color: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-950/20" },
        { title: "Medical Records", value: "--", icon: FileText, color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/20" },
        { title: "Available Doctors", value: doctors.length, icon: Users, color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-950/20" }
    ];

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            Welcome back, {isAdmin ? 'Admin' : (isDoctor && !user?.name?.startsWith('Dr.')) ? 'Dr. ' + user?.name : user?.name || 'User'}!
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {isAdmin ? "System Administration & Network Management" :
                                isDoctor ? "Manage your patient requests and schedule" :
                                    "Here's your health overview for today"}
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent><div className="text-3xl font-bold">{stat.value}</div></CardContent>
                        </Card>
                    ))}
                </div>

                {isAdmin ? (
                    <div className="space-y-8">
                        {/* Quick Actions for Admin */}
                        <Card className="border-2">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Direct shortcuts for administrative tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Link to="/add-hospital" className="w-full">
                                        <Button variant="outline" className="w-full h-24 flex-col gap-2 border-2 hover:border-primary/50 transition-all">
                                            <Building2 className="h-6 w-6 text-blue-500" />
                                            <span>Add Hospital</span>
                                        </Button>
                                    </Link>
                                    <Button
                                        variant={activeTab === 'doctors' ? 'default' : 'outline'}
                                        className="w-full h-24 flex-col gap-2 border-2 transition-all"
                                        onClick={() => setActiveTab(activeTab === 'doctors' ? 'overview' : 'doctors')}
                                    >
                                        <Users className="h-6 w-6 text-purple-500" />
                                        <span>Manage Doctors</span>
                                    </Button>
                                    <Button
                                        variant={activeTab === 'hospitals' ? 'default' : 'outline'}
                                        className="w-full h-24 flex-col gap-2 border-2 transition-all"
                                        onClick={() => setActiveTab(activeTab === 'hospitals' ? 'overview' : 'hospitals')}
                                    >
                                        <Building2 className="h-6 w-6 text-orange-500" />
                                        <span>Manage Hospitals</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Toggleable Management Sections */}
                        {activeTab === 'doctors' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
                                {/* Active Doctors */}
                                <Card className="border-2 shadow-sm">
                                    <CardHeader className="bg-muted/30">
                                        <CardTitle className="flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            Active Doctors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="mt-4">
                                        {activeDoctors.length === 0 ? <p className="text-muted-foreground text-center py-4">No active doctors</p> : (
                                            <div className="space-y-4">
                                                {activeDoctors.map(doc => (
                                                    <div key={doc.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                                                        <div>
                                                            <p className="font-bold">{doc.name}</p>
                                                            <p className="text-sm text-muted-foreground">{doc.email}</p>
                                                        </div>
                                                        <Button size="sm" onClick={() => handleBlockDoctor(doc.id)} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                                                            <Ban className="h-4 w-4 mr-1" /> Block
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Blocked Doctors */}
                                <Card className="border-2 shadow-sm">
                                    <CardHeader className="bg-muted/30">
                                        <CardTitle className="flex items-center gap-2">
                                            <Ban className="h-5 w-5 text-red-500" />
                                            Blocked Doctors
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="mt-4">
                                        {blockedDoctors.length === 0 ? <p className="text-muted-foreground text-center py-4">No blocked doctors</p> : (
                                            <div className="space-y-4">
                                                {blockedDoctors.map(doc => (
                                                    <div key={doc.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                                                        <div>
                                                            <p className="font-bold">{doc.name}</p>
                                                            <p className="text-sm text-muted-foreground">{doc.email}</p>
                                                        </div>
                                                        <Button size="sm" onClick={() => handleUnblockDoctor(doc.id)} variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                                                            <Unlock className="h-4 w-4 mr-1" /> Unblock
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {activeTab === 'hospitals' && (
                            <Card className="border-2 shadow-sm animate-in slide-in-from-bottom-5 duration-500">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle className="flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-primary" />
                                        Hospital Network Management
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="mt-4">
                                    {hospitals.length === 0 ? <p className="text-muted-foreground text-center py-4">No hospitals added</p> : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {hospitals.map(hosp => (
                                                <div key={hosp.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/20 transition-colors">
                                                    <div>
                                                        <p className="font-bold">{hosp.name}</p>
                                                        <p className="text-sm text-muted-foreground">{hosp.location}</p>
                                                    </div>
                                                    <Button size="sm" onClick={() => handleDeleteHospital(hosp.id)} variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Pending Approvals (Always visible as it's critical) */}
                        <Card className="border-2 border-yellow-200/50 shadow-sm">
                            <CardHeader className="bg-yellow-50/50 dark:bg-yellow-950/10">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                    <CardTitle>Awaiting Verification</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-4">
                                {pendingDoctors.length === 0 ? <p className="text-muted-foreground text-center py-4">No pending requests</p> : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pendingDoctors.map(doc => (
                                            <div key={doc.id} className="flex justify-between items-center p-4 border rounded-lg bg-white/50 dark:bg-black/20">
                                                <div>
                                                    <p className="font-bold">{doc.name}</p>
                                                    <p className="text-sm text-muted-foreground">{doc.email}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" onClick={() => handleApproveDoctor(doc.id)} className="bg-green-600 hover:bg-green-700">Approve</Button>
                                                    <Button size="sm" onClick={() => handleRejectDoctor(doc.id)} variant="destructive">Reject</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    /* Existing Doctor/Patient Layout */
                    <div className={`grid grid-cols-1 ${isDoctor ? '' : 'lg:grid-cols-3'} gap-6`}>
                        <Card className={`${isDoctor ? '' : 'lg:col-span-2'} border-2`}>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <CardTitle>{isDoctor ? 'Patient Appointment Requests' : 'Upcoming Appointments'}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {appointments.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">No appointments found</p>
                                        {!isDoctor && <Link to="/doctors"><Button>Book Appointment</Button></Link>}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {appointments.slice(0, 5).map((apt) => (
                                            <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-primary/10 rounded-full"><Stethoscope className="h-5 w-5 text-primary" /></div>
                                                    <div>
                                                        <p className="font-semibold">{isDoctor ? apt.patientName : `Dr. ${apt.doctorName}`}</p>
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Clock className="h-3 w-3" />
                                                            <span>{apt.date} at {apt.time}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge className={apt.status === 'ACCEPTED' || apt.status === 'BOOKED' ? 'bg-green-500 text-white' : apt.status === 'PENDING' ? 'bg-yellow-500 text-white' : 'secondary'}>{apt.status}</Badge>
                                                    {isDoctor && apt.status === 'PENDING' && (
                                                        <div className="flex gap-2">
                                                            <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'ACCEPTED')} className="bg-green-600 hover:bg-green-700">Accept</Button>
                                                            <Button size="sm" onClick={() => handleStatusUpdate(apt.id, 'REJECTED')} variant="destructive">Reject</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {!isDoctor && (
                            <Card className="border-2">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-primary" />
                                        <CardTitle>Top Doctors</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {doctors.map((doctor) => (
                                            <div key={doctor.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                                                <p className="font-semibold">{doctor.name}</p>
                                                <p className="text-sm text-muted-foreground mb-2">{doctor.specialization}</p>
                                                <Link to="/doctors"><Button size="sm" variant="outline" className="w-full">Book Appointment</Button></Link>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Quick Actions (For Patients/Doctors) */}
                {!isAdmin && (
                    <Card className="border-2">
                        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {!isDoctor && <Link to="/doctors"><Button variant="outline" className="w-full h-24 flex-col gap-2"><Users className="h-6 w-6" /><span>Find Doctors</span></Button></Link>}
                                <Link to="/appointments"><Button variant="outline" className="w-full h-24 flex-col gap-2"><Calendar className="h-6 w-6" /><span>{isDoctor ? 'Manage Appointments' : 'My Appointments'}</span></Button></Link>
                                <Link to="/medical-records"><Button variant="outline" className="w-full h-24 flex-col gap-2"><FileText className="h-6 w-6" /><span>{isDoctor ? 'Patient Records' : 'Medical Records'}</span></Button></Link>
                                {!isDoctor && <Link to="/emergency"><Button variant="destructive" className="w-full h-24 flex-col gap-2"><AlertCircle className="h-6 w-6" /><span>Emergency</span></Button></Link>}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
