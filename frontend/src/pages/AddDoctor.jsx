import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { UserPlus, Stethoscope, Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const AddDoctor = () => {
    const [name, setName] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [hospitalId, setHospitalId] = useState('');
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await api.get('/hospitals');
                setHospitals(response.data);
            } catch (err) {
                console.error(err);
                toast.error('Failed to fetch hospitals');
            }
        };
        fetchHospitals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!hospitalId) {
            setError('Please select a hospital');
            setLoading(false);
            return;
        }

        try {
            await api.post('/doctors', {
                name,
                specialization,
                hospitalId
            });
            toast.success('Doctor added successfully!');
            navigate('/doctors');
        } catch (err) {
            console.error(err);
            setError('Failed to add doctor');
            toast.error('Failed to add doctor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back Button */}
                <Button variant="ghost" onClick={() => navigate('/doctors')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Doctors
                </Button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <UserPlus className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold gradient-text">Add New Doctor</h1>
                    <p className="text-muted-foreground">Register a new doctor to the healthcare system</p>
                </div>

                {/* Form Card */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Doctor Information</CardTitle>
                        <CardDescription>
                            Fill in the details below to add a new doctor
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
                                <Label htmlFor="name">Doctor Name *</Label>
                                <div className="relative">
                                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Dr. John Doe"
                                        className="pl-10"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="specialization">Specialization *</Label>
                                <div className="relative">
                                    <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="specialization"
                                        placeholder="e.g. Cardiologist, Neurologist"
                                        className="pl-10"
                                        value={specialization}
                                        onChange={(e) => setSpecialization(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hospital">Hospital *</Label>
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

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate('/doctors')} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Adding...' : 'Add Doctor'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddDoctor;
