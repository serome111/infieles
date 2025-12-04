'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldAlert, Search, FileText } from "lucide-react";
import ConsultManifestoModal from "@/components/ConsultManifestoModal";

export default function Home() {
  const [count, setCount] = useState(0);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);

  useEffect(() => {
    // Fetch the count of registered cheaters
    fetch('/api/cheaters')
      .then(res => res.json())
      .then(data => setCount(data.length))
      .catch(err => console.error('Error fetching count:', err));
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
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

      <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
        <div className="mb-8 flex justify-center">
          <div className="bg-red-600 p-4 rounded-full shadow-lg shadow-red-600/20 animate-pulse-slow">
            <ShieldAlert className="h-16 w-16 text-white" />
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-lg">
          RNI
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold text-slate-200 mb-8">
          Registraduría Nacional de Infieles
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-12 font-medium">
          La base de datos más completa de anécdotas de infidelidad.
          Registra tu historia o consulta nuestra base de datos.
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
            onClick={() => setIsConsultModalOpen(true)}
            className="flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-lg transition-all transform hover:scale-105 border border-slate-600 backdrop-blur-sm"
          >
            <Search className="mr-2 h-5 w-5" />
            Consultar
          </button>
        </div>
      </div>

      <div className="text-sm text-slate-400 font-mono bg-black/30 inline-block px-4 py-2 rounded-full backdrop-blur-sm border border-slate-800">
        <span className="text-red-500 font-bold">{count}</span> infieles registrados hasta el momento
      </div>

      <ConsultManifestoModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
      />
    </div>
  );
}
