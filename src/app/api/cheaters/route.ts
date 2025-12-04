import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 3 * 60 * 1000; // 3 minutes

export async function POST(request: Request) {
    try {
        // Rate Limiting
        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const lastRequest = rateLimitMap.get(ip);

        if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_WINDOW) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Please wait 3 minutes.' },
                { status: 429 }
            );
        }

        rateLimitMap.set(ip, Date.now());

        const body = await request.json();

        // Basic validation
        if (!body.title || !body.name || !body.description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const cheater = await prisma.cheater.create({
            data: {
                title: body.title,
                name: body.name,
                gender: body.gender,
                description: body.description,
                characterDescription: body.characterDescription,
                age: parseInt(body.age),
                occupation: body.occupation,
                infidelityPeriod: body.infidelityPeriod,
                date: new Date(),
                locationCountry: body.locationCountry,
                locationState: body.locationState,
                locationCity: body.locationCity,
                socialNetworks: body.socialNetworks,
                proofLinks: body.proofLinks,
                additionalData: body.additionalData,
                isActive: true
            },
        });

        return NextResponse.json(cheater, { status: 201 });
    } catch (error) {
        console.error('Error saving cheater:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const cheaters = await prisma.cheater.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(cheaters);
    } catch (error) {
        console.error('Error fetching cheaters:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
