import React from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

interface LocationAutocompleteProps {
    placeholder: string;
    defaultValue?: string;
    onPlaceSelected: (place: { city: string; lat: number; lng: number }) => void;
    className?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

export default function LocationAutocomplete({ placeholder, defaultValue, onPlaceSelected, className }: LocationAutocompleteProps) {
    // Only use Google Places if API key is present
    const { ref } = usePlacesWidget({
        apiKey: GOOGLE_MAPS_API_KEY,
        options: {
            types: ['(cities)'],
            componentRestrictions: { country: 'lk' }, // Restrict to Sri Lanka for this bus app
        },
        onPlaceSelected: (place) => {
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const city = place.name || place.formatted_address || '';
                onPlaceSelected({ city, lat, lng });
            }
        },
    });

    if (!GOOGLE_MAPS_API_KEY) {
        return (
            <input
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={className}
                onChange={(e) => onPlaceSelected({ city: e.target.value, lat: 0, lng: 0 })}
            />
        );
    }

    return (
        <input
            ref={ref as any}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className={className}
        />
    );
}
