import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Lat and Lon are required' }, { status: 400 });
    }

    try {
        // MET Norway API requires a unique User-Agent
        const response = await axios.get('https://api.met.no/weatherapi/locationforecast/2.0/compact', {
            params: { lat, lon },
            headers: {
                'User-Agent': 'Bus.lk/1.0 (contact@bus.lk)',
                'Accept': 'application/json',
            },
        });

        return NextResponse.json(response.data);
    } catch (error: any) {
        console.error('Weather API Error:', error.response?.status, error.message);
        return NextResponse.json(
            { error: 'Failed to fetch weather data' },
            { status: error.response?.status || 500 }
        );
    }
}
