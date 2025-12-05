'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, Calendar, Briefcase, AlertTriangle, FileText, Search, Share2 } from 'lucide-react';

interface Cheater {
    id: string;
    title: string;
    name: string;
    gender: string;
    role: string;
    description: string;
    characterDescription: string;
    age: number;
    occupation: string;
    infidelityPeriod: string;
    date: string;
    locationCountry: string;
    locationState: string;
    locationCity: string;
    socialNetworks?: string;
    proofLinks?: string;
    additionalData?: string;
    createdAt: string;
}

export default function ProfilePage() {
    const params = useParams();
    const [cheater, setCheater] = useState<Cheater | null>(null);
    const [related, setRelated] = useState<Cheater[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const id = Array.isArray(params.id) ? params.id[0] : params.id;
            if (!id) return;

            setLoading(true);
            try {
                // 1. Fetch main profile
                const res = await fetch(`/api/cheaters/${id}`);
                if (!res.ok) throw new Error('Failed to fetch profile');
                const data: Cheater = await res.json();
                setCheater(data);

                // 2. Fetch related reports
                const searchParams = new URLSearchParams();
                searchParams.append('keyword', data.name);

                if (data.socialNetworks) {
                    const cleanSocials = data.socialNetworks
                        .split(',')
                        .map(s => {
                            let cleaned = s.trim().toLowerCase();
                            cleaned = cleaned.replace(/https?:\/\/(www\.)?/, '');
                            const domains = ['instagram.com/', 'facebook.com/', 'x.com/', 'twitter.com/', 'tiktok.com/'];
                            for (const domain of domains) {
                                if (cleaned.startsWith(domain)) {
                                    cleaned = cleaned.substring(domain.length);
                                    break;
                                }
                            }
                            return cleaned.replace(/\/$/, '').replace(/^@/, '').split('?')[0];
                        })
                        .filter(Boolean)
                        .join(',');

                    if (cleanSocials) {
                        searchParams.append('socials', cleanSocials);
                    }
                }

                const relatedRes = await fetch(`/api/cheaters?${searchParams.toString()}`);
                if (relatedRes.ok) {
                    const relatedData: Cheater[] = await relatedRes.json();
                    setRelated(relatedData.filter(item => item.id !== data.id));
                }

            } catch (error) {
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/portada.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/80" />
                </div>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 relative z-10"></div>
            </div>
        );
    }

    if (!cheater) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/portada.png"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/80" />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                    <h1 className="text-2xl font-bold mb-4">Perfil no encontrado</h1>
                    <Link href="/consultar" className="text-red-500 hover:underline">Volver a buscar</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-red-500/30 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/portada.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-black/80" />
            </div>

            {/* Header / Nav */}
            <div className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/consultar" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                        <span>Volver</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-red-500 font-bold tracking-wider text-sm">RNI</span>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 relative z-10">
                {/* Main Profile Header */}
                <div className="mb-12 text-center">
                    <div className="inline-block p-4 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                        <AlertTriangle className="h-12 w-12 text-red-500" />
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <h1 className="text-4xl md:text-5xl font-bold text-white capitalize break-words">{cheater.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${cheater.role === 'migajero' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-red-500/20 text-red-500 border-red-500/30'}`}>
                            {cheater.role === 'migajero' ? 'Migajero' : 'Infiel'}
                        </span>
                    </div>
                    <p className="text-slate-400 flex items-center justify-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {cheater.locationCity}, {cheater.locationState}, {cheater.locationCountry}
                    </p>
                </div>

                {/* Stats / Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center backdrop-blur-sm">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Edad</div>
                        <div className="text-xl font-bold text-white">{cheater.age} años</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center backdrop-blur-sm">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Género</div>
                        <div className="text-xl font-bold text-white capitalize">{cheater.gender === 'male' ? 'Hombre' : cheater.gender === 'female' ? 'Mujer' : 'Otro'}</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center backdrop-blur-sm col-span-2 md:col-span-1">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Ocupación</div>
                        <div className="text-lg font-bold text-white break-words leading-tight">{cheater.occupation}</div>
                    </div>
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center backdrop-blur-sm">
                        <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Reportes</div>
                        <div className="text-xl font-bold text-red-500">{related.length}</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Infidelity Period */}
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-red-500" />
                                Tiempo de Infidelidad
                            </h3>
                            <p className="text-slate-300">{cheater.infidelityPeriod}</p>
                        </div>

                        {/* Event Date */}
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-red-500" />
                                Fecha del Suceso
                            </h3>
                            <p className="text-slate-300">{new Date(cheater.date).toLocaleDateString()}</p>
                        </div>

                        {/* Social Networks */}
                        {cheater.socialNetworks && (
                            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Share2 className="h-5 w-5 text-red-500" />
                                    Redes Sociales
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {cheater.socialNetworks.split(',').map((network, i) => (
                                        <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700 break-all">
                                            {network.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Story & Description */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Character Description */}
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Search className="h-6 w-6 text-red-500" />
                                Descripción del Personaje
                            </h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {cheater.characterDescription}
                            </p>
                        </div>

                        {/* Main Story */}
                        <div className="bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-red-500" />
                                Historia Principal
                            </h3>
                            <h2 className="text-2xl font-bold text-white mb-6">{cheater.title}</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {cheater.description}
                                </p>
                            </div>

                            {/* Additional Data */}
                            {cheater.additionalData && (
                                <div className="mt-6 pt-6 border-t border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Datos Adicionales</h4>
                                    <p className="text-slate-300 text-sm">{cheater.additionalData}</p>
                                </div>
                            )}

                            {/* Proof Links */}
                            {cheater.proofLinks && (
                                <div className="mt-6 pt-6 border-t border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Pruebas</h4>
                                    <p className="text-slate-300 text-sm break-all">{cheater.proofLinks}</p>
                                </div>
                            )}
                        </div>

                        {/* Related Reports Timeline */}
                        {related.length > 0 && (
                            <div className="relative pl-8 border-l-2 border-slate-800 space-y-12">
                                {related.map((report, index) => (
                                    <div key={report.id} className="relative">
                                        <div className="absolute -left-[41px] top-0 h-5 w-5 rounded-full bg-red-500 border-4 border-slate-950"></div>
                                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-bold text-white text-lg">{report.title}</h4>
                                                <span className="text-xs text-slate-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-slate-300 mb-4 whitespace-pre-wrap">{report.description}</p>
                                            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {report.locationCity}
                                                </span>
                                                <span>•</span>
                                                <span>{report.infidelityPeriod}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
