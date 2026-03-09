import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Search, Stethoscope, Hospital, X, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [filterHospital, setFilterHospital] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);

    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterData();
    }, [searchTerm, filterSpecialization, filterHospital, doctors]);

    const fetchData = async () => {
        try {
            const [doctorsRes, hospitalsRes] = await Promise.all([
                api.get('/doctors'),
                api.get('/hospitals')
            ]);
            setDoctors(doctorsRes.data);
            setHospitals(hospitalsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load doctors");
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let result = doctors;

        if (searchTerm) {
            result = result.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterSpecialization) {
            result = result.filter(d => d.specialization === filterSpecialization);
        }
        if (filterHospital) {
            result = result.filter(d => d.hospitalId && d.hospitalId === parseInt(filterHospital));
        }

        setFilteredDoctors(result);
    };

    const handleBook = (doctor) => {
        if (!user || !user.id) {
            toast.warn("Please login to book an appointment");
            navigate('/login');
            return;
        }
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDoctor(null);
        setAppointmentDate('');
        setAppointmentTime('');
    };

    const confirmBooking = async () => {
        if (!appointmentDate || !appointmentTime) {
            toast.warning("Please select date and time");
            return;
        }
        setBookingLoading(true);
        try {
            await api.post('/appointments', {
                patientId: user.id,
                doctorId: selectedDoctor.id,
                date: appointmentDate,
                time: appointmentTime
            });
            toast.success('Appointment Booked Successfully!');
            handleCloseModal();
        } catch (error) {
            toast.error('Booking Failed');
            console.error(error);
        } finally {
            setBookingLoading(false);
        }
    };

    const resetFilters = () => {
        setSearchTerm('');
        setFilterSpecialization('');
        setFilterHospital('');
    };

    const specializations = [...new Set(doctors.map(d => d.specialization))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Find Your Doctor</h1>
                    <p className="text-muted-foreground text-lg">Search and book appointments with top healthcare professionals</p>
                </div>

                {/* Filters */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Search className="h-5 w-5" />
                            Search & Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="search">Search by Name</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="search"
                                        placeholder="Doctor name..."
                                        className="pl-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization</Label>
                                <Select
                                    id="specialization"
                                    value={filterSpecialization}
                                    onChange={(e) => setFilterSpecialization(e.target.value)}
                                >
                                    <option value="">All Specializations</option>
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hospital">Hospital</Label>
                                <Select
                                    id="hospital"
                                    value={filterHospital}
                                    onChange={(e) => setFilterHospital(e.target.value)}
                                >
                                    <option value="">All Hospitals</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button variant="outline" onClick={resetFilters} className="w-full">
                                    <X className="h-4 w-4 mr-2" />
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading doctors...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                            <Card key={doctor.id} className="hover:shadow-lg transition-all hover:scale-105 border-2">
                                <CardHeader className="text-center">
                                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                        <Stethoscope className="h-10 w-10 text-white" />
                                    </div>
                                    <CardTitle>{doctor.name}</CardTitle>
                                    <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                                        <Badge variant="secondary">{doctor.specialization}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Hospital className="h-4 w-4" />
                                        <span>{hospitals.find(h => h.id === doctor.hospitalId)?.name || 'Hospital'}</span>
                                    </div>
                                    {user?.role !== 'ROLE_DOCTOR' && (
                                        <Button onClick={() => handleBook(doctor)} className="w-full">
                                            Book Appointment
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <Stethoscope className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-xl text-muted-foreground">No doctors found matching your criteria</p>
                                <Button onClick={resetFilters} className="mt-4">Reset Filters</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md border-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Book Appointment</CardTitle>
                                <Button variant="ghost" size="icon" onClick={handleCloseModal}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardDescription>
                                Dr. {selectedDoctor?.name} - {selectedDoctor?.specialization}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Appointment Date</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="date"
                                        type="date"
                                        className="pl-10"
                                        value={appointmentDate}
                                        onChange={(e) => setAppointmentDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Appointment Time</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="time"
                                        type="time"
                                        className="pl-10"
                                        value={appointmentTime}
                                        onChange={(e) => setAppointmentTime(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="outline" onClick={handleCloseModal} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={confirmBooking} disabled={bookingLoading} className="flex-1">
                                    {bookingLoading ? 'Booking...' : 'Confirm'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Doctors;
