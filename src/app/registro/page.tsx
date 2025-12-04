'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ShieldAlert, Save } from 'lucide-react';
import TermsModal from '@/components/TermsModal';
import SearchableSelect from '@/components/SearchableSelect';
import NotificationModal from '@/components/NotificationModal';
import { Country, State, City } from 'country-state-city';

export default function RegistroPage() {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info' as 'success' | 'error' | 'info'
    });

    const [formData, setFormData] = useState({
        title: '',
        name: '',
        gender: 'Hombre',
        description: '',
        characterDescription: '',
        age: '',
        occupation: '',
        infidelityPeriod: '',
        date: new Date().toISOString().split('T')[0],
        additionalData: '',
        proofLinks: '',
        socialNetworks: '',
        locationCountry: '',
        locationState: '',
        locationCity: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const countries = useMemo(() => Country.getAllCountries().map(c => ({ label: c.name, value: c.isoCode })), []);
    const states = useMemo(() => formData.locationCountry ? State.getStatesOfCountry(formData.locationCountry).map(s => ({ label: s.name, value: s.isoCode })) : [], [formData.locationCountry]);
    const cities = useMemo(() => formData.locationState ? City.getCitiesOfState(formData.locationCountry, formData.locationState).map(c => ({ label: c.name, value: c.name })) : [], [formData.locationCountry, formData.locationState]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        let { name, value } = e.target;

        // Strict numeric validation for age
        if (name === 'age') {
            value = value.replace(/[^0-9]/g, '');
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            if (name === 'locationCountry') {
                newData.locationState = '';
                newData.locationCity = '';
            } else if (name === 'locationState') {
                newData.locationCity = '';
            }
            return newData;
        });
    };

    const isGibberish = (text: string) => {
        if (!text) return false;
        const lowerText = text.toLowerCase();

        // 1. Check for keyboard rows (e.g., "asdf", "qwerty") - even for short text
        const keyboardRows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
        for (const row of keyboardRows) {
            if (text.length >= 3 && row.includes(lowerText)) return true;
        }

        // 2. Check for repeated characters (e.g., "aaaa")
        if (/(.)\1{3,}/.test(lowerText)) return true;

        // 3. Analyze word by word
        const words = lowerText.split(/\s+/).filter(w => w.length > 0);
        if (words.length === 0) return false;

        let gibberishWordCount = 0;

        for (const word of words) {
            // A. Consonant clusters (4+ consecutive consonants)
            // Regex matches 4 or more consecutive letters that are NOT vowels (including accented ones)
            if (/[bcdfghjklmnpqrstvwxyzñ]{4,}/.test(word)) {
                gibberishWordCount++;
                continue;
            }

            // B. Vowel check (words > 3 chars should usually have vowels)
            if (word.length > 3) {
                const vowels = word.match(/[aeiouáéíóúü]/g);
                if (!vowels) {
                    gibberishWordCount++; // No vowels
                    continue;
                }
                // Very low vowel ratio (e.g. "strng") - less than 15%
                if (vowels.length / word.length < 0.15) {
                    gibberishWordCount++;
                    continue;
                }
            }
        }

        // If more than 50% of the words are gibberish, flag the whole text
        // This allows "ejemplo rtfghj" to be caught (1 valid, 1 gibberish = 50% -> strict check might need > 0)
        // Let's be strict: if ANY word is clearly gibberish (like "rtfghj"), it's suspicious.
        // But to avoid false positives on typos, let's say if > 30% are gibberish.
        // For short texts (1-2 words), if 1 is gibberish, it's bad.
        if (words.length <= 2) {
            return gibberishWordCount > 0;
        }

        return (gibberishWordCount / words.length) > 0.3;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const fieldsToCheck = ['title', 'name', 'description', 'characterDescription', 'additionalData'];

        fieldsToCheck.forEach(field => {
            // @ts-ignore
            const value = formData[field];
            if (isGibberish(value)) {
                newErrors[field] = 'El texto parece inválido o generado aleatoriamente. Por favor escribe algo coherente.';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const showNotification = (title: string, message: string, type: 'success' | 'error' | 'info') => {
        setNotification({
            isOpen: true,
            title,
            message,
            type
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Rate Limiting Check
        const lastSubmission = localStorage.getItem('lastSubmission');
        if (lastSubmission) {
            const timeSince = Date.now() - parseInt(lastSubmission);
            if (timeSince < 3 * 60 * 1000) { // 3 minutes
                const minutesLeft = Math.ceil((3 * 60 * 1000 - timeSince) / 60000);
                showNotification('Espera un momento', `Por favor espera ${minutesLeft} minuto(s) antes de enviar otro registro.`, 'info');
                return;
            }
        }

        if (!validateForm()) {
            showNotification('Error de validación', 'Por favor corrige los errores en el formulario.', 'error');
            return;
        }

        if (!acceptedTerms) {
            setShowTerms(true);
            return;
        }

        setIsSubmitting(true);
        try {
            // Get full names for country and state instead of codes
            const countryName = Country.getCountryByCode(formData.locationCountry)?.name || formData.locationCountry;
            const stateName = State.getStateByCodeAndCountry(formData.locationState, formData.locationCountry)?.name || formData.locationState;

            const submissionData = {
                ...formData,
                locationCountry: countryName,
                locationState: stateName
            };

            const response = await fetch('/api/cheaters', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                localStorage.setItem('lastSubmission', Date.now().toString());
                showNotification('¡Gracias!', 'Esto ayudará para el chisme y para que el negocio de los infieles no siga creciendo. Vamos a mejorar el mundo.', 'success');
                setFormData({
                    title: '',
                    name: '',
                    gender: 'Hombre',
                    description: '',
                    characterDescription: '',
                    age: '',
                    occupation: '',
                    infidelityPeriod: '',
                    date: new Date().toISOString().split('T')[0],
                    additionalData: '',
                    proofLinks: '',
                    socialNetworks: '',
                    locationCountry: '',
                    locationState: '',
                    locationCity: ''
                });
                setAcceptedTerms(false);
            } else if (response.status === 429) {
                showNotification('Límite Excedido', 'Has excedido el límite de envíos. Intenta más tarde.', 'error');
            } else {
                showNotification('Error', 'Ocurrió un error al registrar la anécdota.', 'error');
            }
        } catch (error) {
            console.error(error);
            showNotification('Error de Conexión', 'No se pudo conectar con el servidor.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isMale = formData.gender === 'Hombre';

    return (
        <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/portada.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/80" /> {/* Darker overlay for form readability */}
            </div>

            <div className="relative z-10 w-full max-w-4xl bg-slate-900/60 backdrop-blur-md rounded-lg shadow-2xl border border-slate-800 p-6 sm:p-8">
                <div className="flex items-center mb-8 border-b border-slate-800 pb-4">
                    <ShieldAlert className="h-8 w-8 text-red-500 mr-3" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">Registrar Infiel</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Título de la Anécdota *</label>
                            <input
                                type="text"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Ej: La mentira del viaje de negocios"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Género del Infiel *</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="Hombre">Hombre</option>
                                <option value="Mujer">Mujer</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                {isMale ? 'Nombre del Infiel *' : 'Nombre de la Infiel *'}
                            </label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Ocupación (pon "no sé" si no sabes) *</label>
                            <input
                                type="text"
                                name="occupation"
                                required
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Edad (pon "no sé" si no sabes) *</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                maxLength={3}
                                placeholder="Ej: 25"
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Periodo de Infidelidad (pon "no sé" si no sabes) *</label>
                            <input
                                type="text"
                                name="infidelityPeriod"
                                required
                                value={formData.infidelityPeriod}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Ej: Verano 2023"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Fecha del Suceso</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">País</label>
                            <SearchableSelect
                                options={countries}
                                value={formData.locationCountry}
                                onChange={(val) => handleSelectChange('locationCountry', val)}
                                placeholder="Seleccionar País"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Departamento/Estado</label>
                            <SearchableSelect
                                options={states}
                                value={formData.locationState}
                                onChange={(val) => handleSelectChange('locationState', val)}
                                placeholder="Seleccionar Estado"
                                disabled={!formData.locationCountry}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Ciudad</label>
                            <SearchableSelect
                                options={cities}
                                value={formData.locationCity}
                                onChange={(val) => handleSelectChange('locationCity', val)}
                                placeholder="Seleccionar Ciudad"
                                disabled={!formData.locationState}
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Descripción de la Anécdota *</label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                {isMale ? 'Descripción del personaje / Comentarios a la mujer que se quiera meter con él' : 'Descripción del personaje / Comentarios al hombre que se quiera meter con ella'}
                            </label>
                            <textarea
                                name="characterDescription"
                                rows={3}
                                value={formData.characterDescription}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Describe cómo es esta persona o deja una advertencia..."
                            />
                            {errors.characterDescription && <p className="text-red-500 text-xs mt-1">{errors.characterDescription}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Datos Adicionales (pon "no sé" si no sabes)</label>
                            <textarea
                                name="additionalData"
                                rows={2}
                                value={formData.additionalData}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            {errors.additionalData && <p className="text-red-500 text-xs mt-1">{errors.additionalData}</p>}
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Pruebas</label>
                            <input
                                type="text"
                                name="proofLinks"
                                value={formData.proofLinks}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Redes Sociales (separadas por coma)</label>
                            <input
                                type="text"
                                name="socialNetworks"
                                value={formData.socialNetworks}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="@usuario, https://twitter.com/usuario..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="terms" className="text-sm text-slate-400">
                            He leído y acepto los <button type="button" onClick={() => setShowTerms(true)} className="text-red-500 hover:text-red-400 underline">Términos y Condiciones</button>
                        </label>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-red-900/20"
                        >
                            <Save className="mr-2 h-5 w-5" />
                            {isSubmitting ? 'Registrando...' : 'Registrar Anécdota'}
                        </button>
                    </div>
                </form>
            </div>

            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={() => {
                    setAcceptedTerms(true);
                    setShowTerms(false);
                }}
            />

            <NotificationModal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
            />
        </div>
    );
}
