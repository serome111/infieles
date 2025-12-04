import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Helper to clean social network URLs/handles
const cleanSocialNetwork = (input: string): string => {
    if (!input) return '';
    let cleaned = input.toLowerCase().trim();

    // Remove protocol and www
    cleaned = cleaned.replace(/https?:\/\/(www\.)?/, '');

    // Remove trailing slash
    cleaned = cleaned.replace(/\/$/, '');

    // Remove query parameters
    cleaned = cleaned.split('?')[0];

    return cleaned;
};

// Helper to sanitize input (strip HTML tags)
const sanitize = (str: string) => {
    if (!str) return '';
    return str.replace(/<[^>]*>/g, '');
};

export async function POST(request: Request) {
    try {
        // Rate Limiting
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
        const lastRequest = rateLimitMap.get(ip);

        if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_WINDOW) {
            const timeLeft = Math.ceil((RATE_LIMIT_WINDOW - (Date.now() - lastRequest)) / 1000);
            return NextResponse.json(
                { error: `Por favor espera ${timeLeft} segundos antes de enviar otro registro.` },
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

        // Normalize social networks
        let normalizedSocials = body.socialNetworks;
        if (normalizedSocials) {
            normalizedSocials = normalizedSocials
                .split(',')
                .map((s: string) => cleanSocialNetwork(sanitize(s)))
                .join(',');
        }

        // Sanitize inputs
        const sanitizedData = {
            name: sanitize(body.name).toLowerCase(),
            title: sanitize(body.title),
            description: sanitize(body.description),
            characterDescription: sanitize(body.characterDescription),
            occupation: sanitize(body.occupation),
            additionalData: sanitize(body.additionalData),
            proofLinks: body.proofLinks ? sanitize(body.proofLinks) : null,
        };

        const cheater = await prisma.cheater.create({
            data: {
                title: sanitizedData.title,
                name: sanitizedData.name,
                gender: body.gender,
                role: body.role || 'infiel', // Default to 'infiel'
                description: sanitizedData.description,
                characterDescription: sanitizedData.characterDescription,
                age: parseInt(body.age),
                occupation: sanitizedData.occupation,
                infidelityPeriod: body.infidelityPeriod,
                date: new Date(),
                locationCountry: body.locationCountry,
                locationState: body.locationState,
                locationCity: body.locationCity,
                socialNetworks: normalizedSocials,
                proofLinks: sanitizedData.proofLinks,
                additionalData: sanitizedData.additionalData,
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

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const keyword = searchParams.get('keyword');
    const socialsParam = searchParams.get('socials');

    try {
        const where: any = {
            isActive: true, // Always filter by active
        };

        if (country) where.locationCountry = country;
        if (state) where.locationState = state;
        if (city) where.locationCity = city;

        const orConditions: any[] = [];

        if (keyword) {
            orConditions.push({ name: { contains: keyword, mode: 'insensitive' } });
            orConditions.push({ socialNetworks: { contains: keyword, mode: 'insensitive' } });
        }

        if (socialsParam) {
            const socials = socialsParam.split(',').filter(Boolean);
            socials.forEach(social => {
                orConditions.push({ socialNetworks: { contains: social, mode: 'insensitive' } });
            });
        }

        if (orConditions.length > 0) {
            where.OR = orConditions;
        }

        const cheaters = await prisma.cheater.findMany({
            where,
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
