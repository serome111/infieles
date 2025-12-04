import Link from 'next/link';
import Image from 'next/image';
import { ShieldAlert, FileText, Search } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const count = await prisma.cheater.count();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/portada.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/70" /> {/* Dark overlay */}
      </div>

      <div className="relative z-10 animate-fade-in-up">
        <ShieldAlert className="h-24 w-24 text-red-600 mx-auto mb-6" />
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          RNI
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-200 mb-8">
          Registraduría Nacional de Infieles
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12 font-medium">
          La base de datos más completa de anécdotas de infidelidad.
          Registra tu historia o consulta nuestra base de datos (próximamente).
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/registro"
            className="flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-red-900/20"
          >
            <FileText className="mr-2 h-5 w-5" />
            Registrar Infiel
          </Link>
          <button
            disabled
            className="flex items-center justify-center px-8 py-4 bg-slate-800/80 text-slate-400 rounded-lg font-bold text-lg cursor-not-allowed border border-slate-700 backdrop-blur-sm"
          >
            <Search className="mr-2 h-5 w-5" />
            Consultar (Próximamente)
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-400 font-mono bg-black/30 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-slate-800">
        <span className="text-red-500 font-bold">{count}</span> infieles registrados hasta el momento
      </div>
    </div>

  );
}
