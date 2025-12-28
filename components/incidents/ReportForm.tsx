'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ReportType } from '@/types';
import { Camera, MapPin, Send, Loader2, Search, Crosshair } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import uploadOnCloudinary from '@/utils/uploadOnCloudinary';

const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
    loading: () => <div className="h-64 w-full bg-bg-secondary animate-pulse rounded-lg" />,
    ssr: false
});

export function ReportForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        type: '' as ReportType | '',
        description: '',
        phone: '',
        location: null as [number, number] | null,
        image: null as File | null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([20.2961, 85.8245]); // Default Bhubaneswar

    const incidentTypes: ReportType[] = [
        'Crime', 'Medical', 'Fire', 'Disaster', 'Infrastructure Collapse', 'Accident', 'Other', 'Emergency'
    ];

    useEffect(() => {
        // Try to get initial location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                },
                (error) => {
                    console.log("Error getting location", error);
                }
            );
        }
    }, []);

    const handleBrowserGeolocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData(prev => ({ ...prev, location: [latitude, longitude] }));
                setMapCenter([latitude, longitude]);
                setIsLocating(false);
            },
            (error) => {
                console.error("Error getting location", error);
                alert("Unable to retrieve your location");
                setIsLocating(false);
            }
        );
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 2) {
                try {
                    const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || 'pk.5d609655555555555555555555555555';
                    const response = await fetch(`https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=5`);
                    const data = await response.json();
                    if (Array.isArray(data)) {
                        setSuggestions(data);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Error fetching suggestions:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSuggestionClick = (suggestion: any) => {
        const lat = parseFloat(suggestion.lat);
        const lon = parseFloat(suggestion.lon);
        setFormData(prev => ({ ...prev, location: [lat, lon] }));
        setMapCenter([lat, lon]);
        setSearchQuery(suggestion.display_name);
        setShowSuggestions(false);
    };

    const handleAddressSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Using LocationIQ API
            const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || 'pk.5d609655555555555555555555555555'; // Replace with actual key or env var
            // Note: If you don't have a key, this will fail. 
            // Ideally: const apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY;
            
            const response = await fetch(`https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&format=json`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                setSearchResults(data);
                // Automatically select the first result
                const firstResult = data[0];
                const lat = parseFloat(firstResult.lat);
                const lon = parseFloat(firstResult.lon);
                setFormData(prev => ({ ...prev, location: [lat, lon] }));
                setMapCenter([lat, lon]);
                setSearchResults([]); // Clear results after selection or keep them to show a list
            } else {
                alert("No results found");
            }
        } catch (error) {
            console.error("Search error:", error);
            alert("Error searching for address");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.description || !formData.location) {
            alert("Please fill in all required fields (Type, Description, Location)");
            return;
        }

        // Phone validation
        if (formData.phone && formData.phone.length !== 10) {
            alert("Phone number must be 10 digits");
            return;
        }

        setIsSubmitting(true);

        try {
            let imageUrl = undefined;
            if (formData.image) {
                imageUrl = await uploadOnCloudinary(formData.image);
            }

            const sessionId = localStorage.getItem("sessionId") || "anonymous";
            
            const payload = {
                sessionId,
                userId: user?._id,
                location: {
                    lat: formData.location[0],
                    lng: formData.location[1]
                },
                type: formData.type,
                description: formData.description,
                phone: formData.phone ? parseInt(formData.phone) : undefined,
                image: imageUrl,
                severity: "low" // Default
            };

            const response = await fetch('/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                alert("Report Submitted Successfully!");
                // Reset form
                setFormData({
                    type: '' as ReportType | '',
                    description: '',
                    phone: '',
                    location: null,
                    image: null
                });
                setSearchQuery('');
            } else {
                alert(`Submission failed: ${result.message || 'Unknown error'}`);
            }

        } catch (error) {
            console.error("Error submitting report:", error);
            alert("An error occurred while submitting the report.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setFormData(prev => ({ ...prev, location: [lat, lng] }));
        // Don't necessarily move center on click, just update marker
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, image: e.target.files![0] }));
        }
    };

    return (
        <Card className="h-full border-0 md:border border-border-main shadow-none md:shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <span className="bg-primary/20 text-primary p-2 rounded-lg mr-3">
                        <Send size={20} />
                    </span>
                    New Incident Report
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Incident Type */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Incident Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {incidentTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`px-3 py-2 text-sm rounded-md border transition-all ${formData.type === type
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-bg-secondary text-text-secondary border-transparent hover:border-border-main'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">Description</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full bg-bg-secondary border border-border-main rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Describe what happened..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    {/* Location Picker */}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            Location <span className="text-text-muted font-normal">(Tap on map or search)</span>
                        </label>
                        
                        {/* Search and Geolocation Controls */}
                        <div className="flex gap-2 mb-2 relative z-20">
                            <div className="relative flex-1">
                                <input 
                                    type="text"
                                    placeholder="Search address..."
                                    className="w-full bg-bg-secondary border border-border-main rounded-lg pl-3 pr-10 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddressSearch())}
                                />
                                <button 
                                    type="button"
                                    onClick={handleAddressSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
                                    disabled={isSearching}
                                >
                                    {isSearching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                                </button>
                                
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-bg-secondary border border-border-main rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                                        {suggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                type="button"
                                                className="w-full text-left px-3 py-2 text-sm hover:bg-primary/10 text-text-primary border-b border-border-main last:border-0"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion.display_name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={handleBrowserGeolocation}
                                disabled={isLocating}
                                title="Use my current location"
                            >
                                {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
                            </Button>
                        </div>

                        <div className="h-64 rounded-lg overflow-hidden border border-border-main relative">
                            <LiveMap
                                interactive={true}
                                zoom={15}
                                center={mapCenter}
                                onLocationSelect={handleLocationSelect}
                                selectedLocation={formData.location}
                                className="h-full w-full"
                            />
                            {!formData.location && (
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/40 text-white font-medium">
                                    Tap map to pin location
                                </div>
                            )}
                        </div>
                        {formData.location && (
                            <div className="mt-2 text-xs text-primary flex items-center">
                                <MapPin size={12} className="mr-1" />
                                Selected: {formData.location[0].toFixed(4)}, {formData.location[1].toFixed(4)}
                            </div>
                        )}
                    </div>

                    {/* Image & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Phone Number"
                            placeholder="10 digits"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setFormData({ ...formData, phone: val });
                            }}
                        />
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Evidence</label>
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="evidence-upload"
                                    onChange={handleFileChange}
                                />
                                <label 
                                    htmlFor="evidence-upload" 
                                    className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium border rounded-md cursor-pointer transition-colors ${
                                        formData.image 
                                            ? 'bg-primary/10 text-primary border-primary' 
                                            : 'bg-transparent text-text-primary border-border-main hover:bg-bg-secondary'
                                    }`}
                                >
                                    <Camera size={16} className="mr-2" />
                                    {formData.image ? 'Image Selected' : 'Upload'}
                                </label>
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        size="lg"
                        isLoading={isSubmitting}
                        disabled={!formData.type || !formData.location}
                    >
                        Submit Report
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
