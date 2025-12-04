import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    try {
        if (country) {
            // Fetch available states for the selected country
            const locations = await prisma.cheater.groupBy({
                by: ['locationState'],
                where: {
                    isActive: true,
                    locationCountry: country,
                    locationState: {
                        not: null,
                    },
                },
                _count: {
                    locationState: true,
                },
            });

            const states = locations
                .map((loc) => loc.locationState)
                .filter((code): code is string => code !== null);

            return NextResponse.json(states);
        } else {
            // Fetch available countries with counts
            const locations = await prisma.cheater.groupBy({
                by: ['locationCountry'],
                where: {
                    isActive: true,
                    locationCountry: {
                        not: null,
                    },
                },
                _count: {
                    locationCountry: true,
                },
            });

            const countries = locations
                .filter((loc) => loc.locationCountry !== null)
                .map((loc) => ({
                    code: loc.locationCountry as string,
                    count: loc._count.locationCountry,
                }));

            return NextResponse.json(countries);
        }
    } catch (error) {
        console.error('Error fetching locations:', error);
        return NextResponse.json(
            { error: 'Error fetching locations' },
            { status: 500 }
        );
    }
}
