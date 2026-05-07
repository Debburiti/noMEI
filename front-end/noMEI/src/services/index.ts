/**
 * @file src/services/index.ts
 * @description Barrel export de services do noMEI.
 *
 * Services a implementar nas sprints seguintes:
 *  - bidsService      → GET /licitacoes, GET /licitacoes/:id
 *  - documentsService → GET/POST /documentos
 *  - alertsService    → GET /alertas
 *  - authService      → POST /auth/login, GET /auth/me
 */

export { fetchLicitacoes } from './licitacoesService';
export type { FetchLicitacoesParams } from './licitacoesService';
