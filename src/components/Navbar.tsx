import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <ShieldAlert className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold tracking-wider">RNI</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Inicio
              </Link>
              <Link href="/llamado" className="hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Llamado
              </Link>
              <Link href="/registro" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Registrar Infiel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
