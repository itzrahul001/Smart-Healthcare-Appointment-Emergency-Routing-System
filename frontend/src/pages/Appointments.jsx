import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, User } from 'lucide-react';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.id) {
            fetchAppointments();
        }
    }, [user]);

    const fetchAppointments = async () => {
        try {
            let endpoint = '';
            if (user.role === 'ROLE_DOCTOR') {
                endpoint = `/appointments/doctor/${user.id}`;
            } else if (user.role === 'ROLE_PATIENT') {
                endpoint = `/appointments/patient/${user.id}`;
            } else {
                setLoading(false);
                return;
            }

            const response = await api.get(endpoint);
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        try {
            await api.put(`/appointments/${appointmentId}/status?status=${newStatus}`);
            fetchAppointments();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-500 text-white hover:bg-green-600';
            case 'REJECTED': return 'bg-red-500 text-white hover:bg-red-600';
            case 'PENDING': return 'bg-yellow-500 text-white hover:bg-yellow-600';
            case 'CANCELLED': return 'bg-gray-500 text-white hover:bg-gray-600';
            case 'COMPLETED': return 'bg-blue-500 text-white hover:bg-blue-600';
            default: return 'bg-primary text-primary-foreground';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text mb-2">
                            {user?.role === 'ROLE_DOCTOR' ? 'Doctor Appointments' : 'My Appointments'}
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            {user?.role === 'ROLE_DOCTOR'
                                ? 'Manage and update your patient appointments'
                                : 'View and manage your upcoming appointments'}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                    </div>
                ) : appointments.length === 0 ? (
                    <Card className="border-2">
                        <CardContent className="text-center py-12">
                            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-xl text-muted-foreground">No appointments found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((appointment) => (
                            <Card key={appointment.id} className="border-2 hover:shadow-lg transition-all">
                                <CardHeader>
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                        <div className="space-y-2">
                                            <CardTitle className="flex items-center gap-2">
                                                <User className="h-5 w-5" />
                                                {user?.role === 'ROLE_DOCTOR'
                                                    ? `Patient: ${appointment.patientName}`
                                                    : `Dr. ${appointment.doctorName}`}
                                            </CardTitle>
                                            <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    {appointment.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-4 w-4" />
                                                    {appointment.time}
                                                </span>
                                            </CardDescription>
                                        </div>
                                        <div className="flex flex-col items-end gap-3">
                                            <Badge className={`${getStatusColor(appointment.status)}`}>
                                                {appointment.status}
                                            </Badge>

                                            {user?.role === 'ROLE_DOCTOR' && appointment.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 h-8"
                                                        onClick={() => handleStatusUpdate(appointment.id, 'ACCEPTED')}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="h-8"
                                                        onClick={() => handleStatusUpdate(appointment.id, 'REJECTED')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Appointments;
