'use client';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ConsultManifestoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ConsultManifestoModal({ isOpen, onClose }: ConsultManifestoModalProps) {
    const router = useRouter();

    const handleContinue = () => {
        onClose();
        router.push('/consultar');
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition duration-300 data-[closed]:opacity-0" />

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <DialogPanel
                        transition
                        className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 text-left align-middle shadow-2xl transition duration-300 data-[closed]:scale-95 data-[closed]:opacity-0"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-red-900/20 p-4 rounded-full mb-6 ring-1 ring-red-500/50">
                                <ShieldAlert className="h-12 w-12 text-red-500" />
                            </div>

                            <DialogTitle
                                as="h3"
                                className="text-2xl md:text-3xl font-bold leading-tight text-white mb-8"
                            >
                                Antes de continuar...
                            </DialogTitle>

                            <div className="space-y-6 text-lg text-slate-300 font-medium leading-relaxed">
                                <p>
                                    Un mundo mejor empieza cuando dejamos de justificar la infidelidad como <span className="text-red-400 font-bold">"algo normal"</span>.
                                </p>
                                <p>
                                    No estás aquí para aguantar, estás para <span className="text-white font-bold">elegir mejor</span>.
                                </p>
                                <p className="italic text-slate-400 border-l-4 border-slate-700 pl-4 py-2 bg-slate-800/30 rounded-r-lg">
                                    "Consultar puede abrirte los ojos, pero la decisión de respetarte es tuya."
                                </p>
                            </div>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <button
                                    type="button"
                                    className="inline-flex justify-center items-center rounded-lg border border-transparent bg-red-600 px-8 py-4 text-lg font-bold text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 transition-all transform hover:scale-105 shadow-lg shadow-red-900/20"
                                    onClick={handleContinue}
                                >
                                    Continuar
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    className="inline-flex justify-center items-center rounded-lg border border-slate-700 bg-transparent px-8 py-4 text-lg font-medium text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 transition-all"
                                    onClick={onClose}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
