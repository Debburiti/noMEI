import { useCallback, useEffect, useState } from 'react';
import { fetchLicitacoes, type FetchLicitacoesParams } from '../services/licitacoesService';
import type { Bid } from '../types';

interface UseLicitacoesState {
    items: Bid[];
    total: number;
    pages: number;
    loading: boolean;
    error: string | null;
}

export function useLicitacoes(params: FetchLicitacoesParams = {}) {
    const [state, setState] = useState<UseLicitacoesState>({
        items: [],
        total: 0,
        pages: 0,
        loading: true,
        error: null,
    });

    const load = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }));
        try {
            const result = await fetchLicitacoes(params);
            setState({ ...result, loading: false, error: null });
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: err instanceof Error ? err.message : 'Erro desconhecido',
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(params)]);

    useEffect(() => {
        load();
    }, [load]);

    return { ...state, refresh: load };
}
