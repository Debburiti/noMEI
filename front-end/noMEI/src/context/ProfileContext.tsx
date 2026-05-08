import React, { createContext, useContext, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileContextValue {
    /** IDs das áreas de interesse selecionadas pelo usuário */
    selectedAreaIds: string[];
    /** Categorias (modalidadeNome) correspondentes às áreas selecionadas */
    selectedCategories: string[];
    /** Labels das áreas selecionadas para match de texto no título da licitação */
    selectedLabels: string[];
    /** CNPJ do MEI logado */
    cnpj: string;
    setSelectedAreas: (areaIds: string[], categories: string[], labels: string[]) => void;
    setCnpj: (cnpj: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProfileContext = createContext<ProfileContextValue>({
    selectedAreaIds: [],
    selectedCategories: [],
    selectedLabels: [],
    cnpj: '',
    setSelectedAreas: () => { },
    setCnpj: () => { },
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProfileProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [cnpj, setCnpjState] = useState<string>('');

    function setSelectedAreas(areaIds: string[], categories: string[], labels: string[]): void {
        setSelectedAreaIds(areaIds);
        setSelectedCategories(categories);
        setSelectedLabels(labels);
    }

    function setCnpj(value: string): void {
        setCnpjState(value);
    }

    return (
        <ProfileContext.Provider value={{ selectedAreaIds, selectedCategories, selectedLabels, cnpj, setSelectedAreas, setCnpj }}>
            {children}
        </ProfileContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfile(): ProfileContextValue {
    return useContext(ProfileContext);
}
