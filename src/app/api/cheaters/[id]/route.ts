import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: Request,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const id = params.id;

        if (!id) {
            return NextResponse.json(
                { error: 'Invalid ID' },
                { status: 400 }
            );
        }

        const cheater = await prisma.cheater.findUnique({
            where: {
                id: id,
            },
        });

        if (!cheater) {
            return NextResponse.json(
                { error: 'Cheater not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(cheater);
    } catch (error) {
        console.error('Error fetching cheater:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
