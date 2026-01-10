import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
    try {
        const response = await axios.get('https://worldtimeapi.org/api/timezone/Asia/Colombo');
        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching time:', error);
        return NextResponse.json({ error: 'Failed to fetch time' }, { status: 500 });
    }
}
