import { X } from 'lucide-react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Términos y Condiciones de Uso</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto text-slate-300 text-sm space-y-4">
                    <h3 className="font-bold text-white">RNI - REGISTRADURIA NACIONAL DE INFIELES</h3>

                    <section>
                        <h4 className="font-bold text-white mb-1">1. Aceptación de los términos</h4>
                        <p>Al acceder y utilizar esta plataforma (“el Servicio”), el usuario acepta cumplir estos Términos y Condiciones. Si no está de acuerdo, debe abstenerse de utilizar el Servicio.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">2. Uso del Servicio bajo responsabilidad del usuario</h4>
                        <p>El usuario es el único responsable del contenido que publique. El Servicio no verifica, valida ni garantiza la veracidad, exactitud o autenticidad de ningún dato ingresado por los usuarios. Cualquier información publicada es bajo total responsabilidad del usuario que la sube.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">3. Prohibiciones</h4>
                        <p>El usuario se compromete a NO utilizar el Servicio para:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Publicar información falsa, no verificada o inventada como si fuera real.</li>
                            <li>Incurrir en difamación, amenazas, acoso o vulneración de derechos de terceros.</li>
                            <li>Subir datos personales sin consentimiento.</li>
                            <li>Realizar actividades ilegales o contrarias a la moral o buenas costumbres.</li>
                        </ul>
                        <p className="mt-1">El incumplimiento puede llevar a eliminación de contenido y/o suspensión.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">4. Exención de responsabilidad</h4>
                        <p>El Servicio y sus administradores NO se hacen responsables por:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Contenidos generados por usuarios.</li>
                            <li>Daños derivados de información falsa o imprecisa publicada por terceros.</li>
                            <li>Consecuencias legales entre usuarios o hacia terceros.</li>
                            <li>Cualquier uso indebido del Servicio.</li>
                        </ul>
                        <p className="mt-1">El Servicio actúa solo como plataforma de publicación, no como intermediario ni garante de información.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">5. Contenido ingresado por el usuario</h4>
                        <p>El usuario reconoce que:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                            <li>Los datos proporcionados pueden no ser reales, precisos o verificables.</li>
                            <li>Cualquier publicación la realiza voluntariamente y bajo su propia responsabilidad.</li>
                            <li>Puede solicitar la eliminación de su contenido en cualquier momento.</li>
                        </ul>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">6. Moderación</h4>
                        <p>El Servicio se reserva el derecho de revisar, ocultar o eliminar contenido que considere inapropiado, suspender usuarios y utilizar sistemas de moderación.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">7. Privacidad</h4>
                        <p>El Servicio puede almacenar la información ingresada por los usuarios con fines operativos internos. No se compartirá información con terceros salvo por obligación legal.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">8. Limitación de garantías</h4>
                        <p>El Servicio se proporciona “tal cual”, sin garantías de ningún tipo respecto al funcionamiento, disponibilidad o fiabilidad.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">9. Modificación de Términos</h4>
                        <p>El Servicio puede modificar estos Términos en cualquier momento. La continuidad del uso implica aceptación de los cambios.</p>
                    </section>

                    <section>
                        <h4 className="font-bold text-white mb-1">10. Legislación aplicable</h4>
                        <p>Estos términos se interpretan bajo las leyes del país donde opera la plataforma. Cualquier conflicto será resuelto por tribunales competentes según la legislación aplicable.</p>
                    </section>
                </div>

                <div className="p-4 border-t border-slate-700 flex justify-end space-x-3 bg-slate-900">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onAccept}
                        className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                        Acepto los Términos
                    </button>
                </div>
            </div>
        </div>
    );
}
