import React, { createContext, useContext, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileContextValue {
  /** IDs das áreas de interesse selecionadas pelo usuário */
  selectedAreaIds: string[];
  /** Categorias (modalidadeNome) correspondentes às áreas selecionadas */
  selectedCategories: string[];
  /** Labels das áreas selecionadas para match de texto no título da licitação */
  selectedLabels: string[];
  setSelectedAreas: (areaIds: string[], categories: string[], labels: string[]) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProfileContext = createContext<ProfileContextValue>({
  selectedAreaIds: [],
  selectedCategories: [],
  selectedLabels: [],
  setSelectedAreas: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ProfileProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  function setSelectedAreas(areaIds: string[], categories: string[], labels: string[]): void {
    setSelectedAreaIds(areaIds);
    setSelectedCategories(categories);
    setSelectedLabels(labels);
  }

  return (
    <ProfileContext.Provider value={{ selectedAreaIds, selectedCategories, selectedLabels, setSelectedAreas }}>
      {children}
    </ProfileContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}
