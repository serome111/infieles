'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Country, State, City } from 'country-state-city';
import SearchableSelect from '@/components/SearchableSelect';
import { Search, MapPin, User, Briefcase, Calendar, FileText, AlertTriangle, Copy, Check } from 'lucide-react';
import NotificationModal from '@/components/NotificationModal';

interface Cheater {
    id: string;
    title: string;
    name: string;
    gender: string;
    description: string;
    age: number;
    occupation: string;
    infidelityPeriod: string;
    locationCity: string;
    locationState: string;
    locationCountry: string;
    socialNetworks?: string;
    createdAt: string;
}

const SocialNetworkItem = ({ network }: { network: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(network.trim());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 group hover:border-blue-500/30 transition-all">
            <span className="text-blue-400 text-sm font-medium truncate max-w-[200px]">{network.trim()}</span>
            <button
                onClick={handleCopy}
                className="text-slate-500 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700 focus:outline-none"
                title="Copiar"
            >
                {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
        </div>
    );
};

export default function ConsultarPage() {
    const [availableCountries, setAvailableCountries] = useState<{ code: string; count: number }[]>([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<Cheater[]>([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);

    // Notification State
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        type: 'success' | 'error' | 'info';
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: '',
    });

    // Fetch available countries on mount
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/api/locations');
                if (response.ok) {
                    const data = await response.json();
                    setAvailableCountries(data);
                }
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    const [availableStates, setAvailableStates] = useState<string[]>([]);

    // Fetch available states when country changes
    useEffect(() => {
        const fetchStates = async () => {
            if (!selectedCountry) {
                setAvailableStates([]);
                return;
            }
            try {
                const response = await fetch(`/api/locations?country=${encodeURIComponent(selectedCountry)}`);
                if (response.ok) {
                    const codes = await response.json();
                    setAvailableStates(codes);
                }
            } catch (error) {
                console.error('Error fetching states:', error);
            }
        };
        fetchStates();
    }, [selectedCountry]);

    // Prepare options for Selects
    const countryOptions = Country.getAllCountries()
        .filter(c => availableCountries.some(ac => ac.code === c.isoCode || ac.code === c.name))
        .map((country) => {
            const match = availableCountries.find(ac => ac.code === country.isoCode || ac.code === country.name);
            return {
                value: country.isoCode,
                label: `${country.name} (${match?.count || 0})`,
            };
        });

    const stateOptions = selectedCountry
        ? State.getStatesOfCountry(selectedCountry)
            .filter(s => availableStates.includes(s.isoCode) || availableStates.includes(s.name)) // Smart Filter for States
            .map((state) => ({
                value: state.isoCode,
                label: state.name,
            }))
        : [];

    const cityOptions =
        selectedCountry && selectedState
            ? City.getCitiesOfState(selectedCountry, selectedState).map((city) => ({
                value: city.name,
                label: city.name,
            }))
            : [];

    const handleSearch = async () => {
        if (!selectedCountry) {
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Falta información',
                message: 'Por favor selecciona al menos un país para buscar.',
            });
            return;
        }

        setSearching(true);
        try {
            // Build query params
            const params = new URLSearchParams();
            if (selectedCountry) params.append('country', selectedCountry);
            if (selectedState) params.append('state', selectedState);
            if (selectedCity) params.append('city', selectedCity);
            if (keyword) params.append('keyword', keyword);

            const response = await fetch(`/api/cheaters?${params.toString()}`);
            if (response.ok) {
                const filtered: Cheater[] = await response.json();
                setResults(filtered);

                if (filtered.length === 0) {
                    setNotification({
                        isOpen: true,
                        type: 'info',
                        title: 'Sin resultados',
                        message: 'No encontramos infieles registrados con esos criterios. ¡Quizás es una buena señal!',
                    });
                }
            }
        } catch (error) {
            console.error('Error searching:', error);
            setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Ocurrió un error al buscar. Inténtalo de nuevo.',
            });
        } finally {
            setSearching(false);
        }
    };

    const getCountryName = (code: string) => Country.getCountryByCode(code)?.name || code;
    const getStateName = (countryCode: string, stateCode: string) => State.getStateByCodeAndCountry(stateCode, countryCode)?.name || stateCode;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/portada.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 flex-grow">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            Consultar Base de Datos
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Busca por ubicación para encontrar reportes en tu zona.
                        </p>
                    </div>

                    {/* Search Filters */}
                    <div className="bg-slate-900/50 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <SearchableSelect
                                label="País"
                                options={countryOptions}
                                value={selectedCountry}
                                onChange={(val) => {
                                    setSelectedCountry(val);
                                    setSelectedState('');
                                    setSelectedCity('');
                                }}
                                placeholder="Selecciona un país"
                                icon={<MapPin className="h-5 w-5 text-slate-400" />}
                            />
                            <SearchableSelect
                                label="Departamento / Estado"
                                options={stateOptions}
                                value={selectedState}
                                onChange={(val) => {
                                    setSelectedState(val);
                                    setSelectedCity('');
                                }}
                                placeholder="Selecciona un estado"
                                disabled={!selectedCountry}
                                icon={<MapPin className="h-5 w-5 text-slate-400" />}
                            />
                            <SearchableSelect
                                label="Ciudad"
                                options={cityOptions}
                                value={selectedCity}
                                onChange={setSelectedCity}
                                placeholder="Selecciona una ciudad"
                                disabled={!selectedState}
                                icon={<MapPin className="h-5 w-5 text-slate-400" />}
                            />
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-slate-400">Nombre o Red Social</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="Buscar..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                                    />
                                    <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleSearch}
                                disabled={searching}
                                className="flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {searching ? (
                                    <span className="animate-pulse">Buscando...</span>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-5 w-5" />
                                        Buscar Infieles
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid grid-cols-1 gap-6">
                        {results.map((cheater) => (
                            <div key={cheater.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-red-900/50 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            {cheater.title}
                                            <span className="text-sm font-normal px-2 py-1 bg-slate-800 rounded-full text-slate-400 border border-slate-700">
                                                {cheater.gender}
                                            </span>
                                        </h3>
                                        <p className="text-red-400 font-medium mt-1">{cheater.name}</p>
                                        {cheater.socialNetworks && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {cheater.socialNetworks.split(',').map((network, index) => (
                                                    <SocialNetworkItem key={index} network={network} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(cheater.createdAt).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-500" />
                                        <span>Edad: {cheater.age} años</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-slate-500" />
                                        <span>{cheater.occupation}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        <span>
                                            {cheater.locationCity}, {getStateName(cheater.locationCountry, cheater.locationState)}, {getCountryName(cheater.locationCountry)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-slate-500" />
                                        <span>{cheater.infidelityPeriod}</span>
                                    </div>
                                </div>

                                <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800/50 mb-4">
                                    <div className="flex items-start gap-2">
                                        <FileText className="h-5 w-5 text-slate-500 mt-1 flex-shrink-0" />
                                        <p className="text-slate-300 italic leading-relaxed">
                                            "{cheater.description.length > 150
                                                ? `${cheater.description.substring(0, 150)}...`
                                                : cheater.description}"
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href={`/perfil/${cheater.id}`}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Search className="h-4 w-4" />
                                    Ver Historial / Detalles
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={() => setNotification({ ...notification, isOpen: false })}
                type={notification.type}
                title={notification.title}
                message={notification.message}
            />
        </div>
    );
}
