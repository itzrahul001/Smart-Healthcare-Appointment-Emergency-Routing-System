import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Upload, File } from 'lucide-react';
import { toast } from 'react-toastify';

const MedicalRecords = () => {
    const { user } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [recordName, setRecordName] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile || !recordName) {
            toast.warning('Please select a file and provide a name');
            return;
        }

        // Placeholder for upload functionality
        toast.info('Upload functionality will be implemented with backend API');
        setSelectedFile(null);
        setRecordName('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-4xl font-bold gradient-text mb-2">Medical Records</h1>
                    <p className="text-muted-foreground text-lg">Upload and manage your medical documents</p>
                </div>

                {/* Upload Section */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Upload New Record
                        </CardTitle>
                        <CardDescription>
                            Upload your medical reports, prescriptions, or test results
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="recordName">Record Name</Label>
                                <Input
                                    id="recordName"
                                    placeholder="e.g. Blood Test Report - Jan 2026"
                                    value={recordName}
                                    onChange={(e) => setRecordName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="file">Select File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                {selectedFile && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                                        <File className="h-4 w-4" />
                                        {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Record
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Placeholder for records list */}
                <Card className="border-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Your Records
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No medical records uploaded yet</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MedicalRecords;
