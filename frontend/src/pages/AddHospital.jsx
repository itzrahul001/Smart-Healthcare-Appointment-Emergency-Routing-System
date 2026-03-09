import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Building2, MapPin, Bed, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const AddHospital = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        latitude: '',
        longitude: '',
        totalBeds: '',
        availableBeds: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await api.post('/hospitals', {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude),
                totalBeds: parseInt(formData.totalBeds),
                availableBeds: parseInt(formData.availableBeds)
            });
            toast.success('Hospital Added Successfully!');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to add hospital.';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back Button */}
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>

                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <Building2 className="h-12 w-12 text-primary" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold gradient-text">Add New Hospital</h1>
                    <p className="text-muted-foreground">Register a new hospital facility</p>
                </div>

                {/* Form Card */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle>Hospital Information</CardTitle>
                        <CardDescription>
                            Fill in the details below to add a new hospital to the system
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
                                <Label htmlFor="name">Hospital Name *</Label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="City General Hospital"
                                        className="pl-10"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location (Address) *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        name="location"
                                        placeholder="123 Main St, City, State"
                                        className="pl-10"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="latitude">Latitude *</Label>
                                    <Input
                                        id="latitude"
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        placeholder="40.7128"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="longitude">Longitude *</Label>
                                    <Input
                                        id="longitude"
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        placeholder="-74.0060"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="totalBeds">Total Beds *</Label>
                                    <div className="relative">
                                        <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="totalBeds"
                                            name="totalBeds"
                                            type="number"
                                            placeholder="100"
                                            className="pl-10"
                                            value={formData.totalBeds}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="availableBeds">Available Beds *</Label>
                                    <div className="relative">
                                        <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="availableBeds"
                                            name="availableBeds"
                                            type="number"
                                            placeholder="80"
                                            className="pl-10"
                                            value={formData.availableBeds}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')} className="flex-1">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading} className="flex-1">
                                    {loading ? 'Adding...' : 'Add Hospital'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddHospital;
