export default function Footer() {
    return (
        <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm">
                    &copy; {new Date().getFullYear()} Registraduría Nacional de Infieles. Todos los derechos reservados.
                </p>
                <p className="text-xs mt-2 text-slate-600">
                    Plataforma de anécdotas ficticias. Cualquier parecido con la realidad es pura coincidencia.
                </p>
            </div>
        </footer>
    );
}
