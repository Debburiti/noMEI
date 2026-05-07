import type { Bid, BidStatus } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// ─── API Response Types ───────────────────────────────────────────────────────

interface LicitacaoItem {
    id: string;
    title: string | null;
    value: number | null;
    category: string | null;
    description: string | null;
    agency: string | null;
    status: BidStatus;
    deadline: string | null;
    compatibility: number;
}

interface LicitacoesListResponse {
    total: number;
    page: number;
    pages: number;
    items: LicitacaoItem[];
}

export interface FetchLicitacoesParams {
    busca?: string;
    uf?: string;
    cnae?: string;
    modalidadeId?: number;
    valorMax?: number;
    meiCompativel?: boolean;
    page?: number;
    limit?: number;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapToBid(item: LicitacaoItem): Bid {
    return {
        id: item.id,
        title: item.title ?? 'Sem título',
        agency: item.agency ?? 'Órgão não informado',
        value: item.value ?? 0,
        status: item.status,
        deadline: item.deadline ? `Prazo: ${item.deadline}` : 'Prazo não informado',
        compatibility: item.compatibility,
        category: item.category ?? '',
        description: item.description ?? undefined,
    };
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function fetchLicitacoes(
    params: FetchLicitacoesParams = {}
): Promise<{ items: Bid[]; total: number; pages: number }> {
    const query = new URLSearchParams();

    if (params.busca) query.set('busca', params.busca);
    if (params.uf) query.set('uf', params.uf);
    if (params.cnae) query.set('cnae', params.cnae);
    if (params.modalidadeId != null) query.set('modalidadeId', String(params.modalidadeId));
    if (params.valorMax != null) query.set('valorMax', String(params.valorMax));
    if (params.meiCompativel != null) query.set('meiCompativel', String(params.meiCompativel));
    if (params.page != null) query.set('page', String(params.page));
    if (params.limit != null) query.set('limit', String(params.limit));

    const url = `${API_BASE_URL}/licitacoes/?${query.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro ao buscar licitações: ${response.status}`);
    }

    const data: LicitacoesListResponse = await response.json();

    return {
        items: data.items.map(mapToBid),
        total: data.total,
        pages: data.pages,
    };
}
