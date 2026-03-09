import { useState } from 'react';
import api from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { AlertCircle, MapPin, Phone, Navigation, Bed, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

const Emergency = () => {
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState('');
    const [location, setLocation] = useState(null);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            toast.error('Geolocation not supported');
            return;
        }

        setLoading(true);
        setError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
                findNearestHospitals(position.coords.latitude, position.coords.longitude);
            },
            () => {
                setError('Unable to retrieve your location. Please enable location services.');
                toast.error('Location access denied');
                setLoading(false);
            }
        );
    };

    const findNearestHospitals = async (lat, lon) => {
        try {
            const response = await api.get(`/hospitals/find-nearest?lat=${lat}&lon=${lon}&radius=50`);
            setHospitals(response.data);
            if (response.data.length === 0) {
                toast.info('No hospitals found within 50km radius');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch nearby hospitals. Please try again.');
            toast.error('Failed to fetch hospitals');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-4 bg-destructive/10 rounded-full animate-pulse">
                            <AlertCircle className="h-16 w-16 text-destructive" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-destructive">Emergency Services</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Find the nearest hospital with available beds. Click the button below to locate emergency care facilities near you.
                    </p>
                </div>

                {/* Action Card */}
                <Card className="border-2 border-destructive/20">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Find Nearest Hospital</CardTitle>
                        <CardDescription>
                            We'll use your current location to find hospitals within 50km radius
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button
                            size="lg"
                            variant="destructive"
                            onClick={getLocation}
                            disabled={loading}
                            className="text-lg px-8 py-6"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Locating...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Navigation className="h-5 w-5" />
                                    Find Hospitals Near Me
                                </div>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Error Message */}
                {error && (
                    <Card className="border-2 border-destructive">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3 text-destructive">
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Results */}
                {hospitals.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Nearby Hospitals ({hospitals.length})</h2>
                            <Badge variant="secondary" className="text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                Within 50km
                            </Badge>
                        </div>

                        <div className="space-y-4">
                            {hospitals.map((hospital, index) => (
                                <Card key={hospital.id} className="border-2 hover:shadow-lg transition-all">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className="text-xs">{index + 1}</Badge>
                                                    <CardTitle className="text-xl">{hospital.name}</CardTitle>
                                                </div>
                                                <CardDescription className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4" />
                                                    {hospital.location}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-muted-foreground">Available Beds</p>
                                                <div className="flex items-center gap-2">
                                                    <Bed className="h-4 w-4 text-primary" />
                                                    <p className="text-lg font-semibold">
                                                        {hospital.availableBeds} / {hospital.totalBeds}
                                                    </p>
                                                </div>
                                                {hospital.availableBeds > 0 ? (
                                                    <Badge variant="default" className="bg-green-600">Available</Badge>
                                                ) : (
                                                    <Badge variant="destructive">Full</Badge>
                                                )}
                                            </div>

                                            {hospital.emergencyContact && (
                                                <div className="space-y-1">
                                                    <p className="text-sm text-muted-foreground">Emergency Contact</p>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-primary" />
                                                        <p className="text-lg font-semibold">{hospital.emergencyContact}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <Button className="w-full" size="lg">
                                                <Navigation className="h-4 w-4 mr-2" />
                                                Get Directions
                                                <ExternalLink className="h-4 w-4 ml-2" />
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {!loading && hospitals.length === 0 && location && !error && (
                    <Card className="border-2">
                        <CardContent className="text-center py-12">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">
                                No hospitals found within 50km radius. Please try expanding your search area.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Emergency;
