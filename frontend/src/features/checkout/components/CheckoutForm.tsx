import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLoadScript, GoogleMap, Marker, Autocomplete } from '@react-google-maps/api';
import { Button } from '@/components/ui';
import { MapPin, Search } from 'lucide-react';

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  isLoading: boolean;
}

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem',
  marginTop: '1rem'
};

const defaultCenter = { lat: 0, lng: 0 };

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    latitude: '',
    longitude: ''
  });
  
  const [errors, setErrors] = useState<Partial<CheckoutFormData>>({});
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPos, setMarkerPos] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [searchInputValue, setSearchInputValue] = useState("");

  const mapRef = useRef<google.maps.Map | null>(null);
  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onLoadAutocomplete = (ac: google.maps.places.Autocomplete) => {
    setAutocomplete(ac);
  };

  const validate = () => {
    const newErrors: Partial<CheckoutFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof CheckoutFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const parseAddressComponents = (components: google.maps.GeocoderAddressComponent[]) => {
    let city = '';
    let state = '';
    let country = '';
    let postalCode = '';
    let streetNumber = '';
    let route = '';
    
    components.forEach(component => {
      const types = component.types;
      if (types.includes('street_number')) streetNumber = component.long_name;
      if (types.includes('route')) route = component.long_name;
      if (types.includes('locality')) city = component.long_name;
      if (types.includes('administrative_area_level_1')) state = component.long_name;
      if (types.includes('country')) country = component.long_name;
      if (types.includes('postal_code')) postalCode = component.long_name;
    });

    return { city, state, country, postalCode, streetNumber, route };
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        return;
      }
      
      const { city, state, country, postalCode, streetNumber, route } = parseAddressComponents(place.address_components || []);
      
      let address = `${streetNumber} ${route}`.trim();
      if (!address) {
        address = place.formatted_address?.split(',')[0] || place.name || '';
      }

      setFormData(prev => ({
        ...prev,
        address,
        city,
        state,
        country,
        postalCode,
        latitude: place.geometry!.location!.lat().toString(),
        longitude: place.geometry!.location!.lng().toString()
      }));

      setSearchInputValue(address);
      
      const latLng = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      
      setMapCenter(latLng);
      setMarkerPos(latLng);
    }
  };

  const reverseGeocode = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results && results.length > 0) {
        const result = results[0];
        const { city, state, country, postalCode, streetNumber, route } = parseAddressComponents(result.address_components);
        
        let address = `${streetNumber} ${route}`.trim();
        if (!address) {
          address = result.formatted_address.split(',')[0];
        }

        setFormData(prev => ({
          ...prev,
          address,
          city,
          state,
          country,
          postalCode,
          latitude: lat.toString(),
          longitude: lng.toString()
        }));

        setSearchInputValue(address);
      }
    });
  };

  const handleGetCurrentLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by your browser.");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapCenter({ lat, lng });
        setMarkerPos({ lat, lng });
        reverseGeocode(lat, lng);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationError("Location permission was denied. Please search for your address manually.");
      }
    );
  };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    
    setMarkerPos({ lat, lng });
    setMapCenter({ lat, lng });
    reverseGeocode(lat, lng);
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-heading-sm border-b border-[var(--border-strong)] pb-2 mb-4">Customer Information</h3>
        
        <div>
          <label htmlFor="name" className="block text-body-sm text-[var(--text-secondary)] mb-1">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.name ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-body-sm text-[var(--text-secondary)] mb-1">Email Address</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.email ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="jane@company.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-body-sm text-[var(--text-secondary)] mb-1">Phone Number</label>
            <input 
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.phone ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="+1 (555) 000-0000"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-heading-sm border-b border-[var(--border-strong)] pb-2 mb-4">Shipping Information</h3>
        
        {locationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
            {locationError}
          </div>
        )}

        {isLoaded ? (
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <Button type="button" onClick={handleGetCurrentLocation} variant="outline" className="shrink-0 flex items-center">
                <MapPin size={16} className="mr-2" />
                Use My Current Location
              </Button>
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Search size={16} className="text-[var(--text-secondary)]" />
                </div>
                <Autocomplete
                  onLoad={onLoadAutocomplete}
                  onPlaceChanged={onPlaceChanged}
                >
                  <input
                    type="text"
                    placeholder="Search for your delivery address..."
                    value={searchInputValue}
                    onChange={(e) => setSearchInputValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-strong)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                  />
                </Autocomplete>
              </div>
            </div>

            {markerPos && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={15}
                center={mapCenter}
                onLoad={onMapLoad}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                <Marker
                  position={markerPos}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                />
              </GoogleMap>
            )}
          </div>
        ) : (
          <div className="p-4 border border-[var(--border-strong)] rounded-lg text-center text-sm text-[var(--text-secondary)]">
            {loadError ? "Error loading Google Maps API" : "Loading maps..."}
          </div>
        )}

        <div>
          <label htmlFor="address" className="block text-body-sm text-[var(--text-secondary)] mb-1">Street Address</label>
          <input 
            type="text" 
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.address ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
            placeholder="123 Robotics Blvd"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-body-sm text-[var(--text-secondary)] mb-1">City</label>
            <input 
              type="text" 
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.city ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="San Francisco"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label htmlFor="state" className="block text-body-sm text-[var(--text-secondary)] mb-1">State / Province</label>
            <input 
              type="text" 
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.state ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="CA"
            />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-body-sm text-[var(--text-secondary)] mb-1">Country</label>
            <input 
              type="text" 
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.country ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="United States"
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-body-sm text-[var(--text-secondary)] mb-1">Postal / PIN Code</label>
            <input 
              type="text" 
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 rounded-lg border bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] transition-shadow ${errors.postalCode ? 'border-red-500' : 'border-[var(--border-strong)]'}`}
              placeholder="94105"
            />
            {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
          </div>
        </div>
      </div>
    </form>
  );
}
