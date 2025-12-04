import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LlamadoPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/portada.png"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/80" /> {/* Dark overlay */}
            </div>

            <div className="relative z-10 max-w-3xl mx-auto animate-fade-in-up">
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Volver al Inicio
                    </Link>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    El Llamado
                </h1>

                <div className="bg-slate-900/50 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-slate-800 shadow-2xl">
                    <p className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic">
                        "La infidelidad no es un error romántico, es una deuda moral. Cada vez que una mujer acepta ser engañada, el mundo aprende que su dolor es negociable. RNI nace para recordar que tu amor tiene valor, tu tiempo tiene costo y tu dignidad no se rebaja. Dejar de aceptar infieles no es odio, es evolución."
                    </p>
                </div>
            </div>
        </div>
    );
}
