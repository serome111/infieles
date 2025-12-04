'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder, disabled = false }: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-white flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-slate-600'}`}
            >
                <span className={selectedOption ? 'text-white' : 'text-slate-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-md shadow-xl max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-slate-800 sticky top-0 bg-slate-900">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-sm text-white focus:outline-none focus:border-red-500"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                        setSearch('');
                                    }}
                                    className={`px-4 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-slate-800 ${option.value === value ? 'bg-slate-800 text-red-500' : 'text-slate-300'}`}
                                >
                                    {option.label}
                                    {option.value === value && <Check className="h-4 w-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-sm text-slate-500 text-center">
                                No se encontraron resultados
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
