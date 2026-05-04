/**
 * @file src/navigation/navigationMap.ts
 * @description Mapa declarativo de todas as rotas do noMEI.
 *
 * Documenta: origem, destino, tipo de transição e parâmetros esperados.
 * Útil para referência rápida, geração de links e testes de navegação.
 */

export const navigationMap = {
  // ── Auth Flow ──────────────────────────────────────────────────────────────
  onboarding_to_profileSetup: {
    from: 'Onboarding',
    to: 'ProfileSetup',
    transition: 'slide_from_right',
    params: undefined,
    description: 'Usuário toca "Entrar com e-mail" → vai para configuração de perfil',
  },

  profileSetup_to_mainTabs: {
    from: 'ProfileSetup',
    to: 'MainTabs',
    transition: 'fade',
    params: undefined,
    description: 'Usuário salva perfil → entra no app principal',
  },

  // ── Main Tabs ──────────────────────────────────────────────────────────────
  home_to_detalhes: {
    from: 'Inicio',
    to: 'DetalhesLicitacao',
    transition: 'slide_from_right',
    params: { bidId: 'string', bidTitle: 'string' },
    description: 'Usuário toca em um card de licitação → abre detalhe',
  },

  disputas_to_detalhes: {
    from: 'Disputas',
    to: 'DetalhesLicitacao',
    transition: 'slide_from_right',
    params: { bidId: 'string', bidTitle: 'string' },
    description: 'Usuário toca "Ver Detalhes" em uma disputa → abre detalhe',
  },

  // ── Deep Screens ──────────────────────────────────────────────────────────
  detalhes_back: {
    from: 'DetalhesLicitacao',
    to: 'MainTabs',
    transition: 'slide_to_right',
    params: undefined,
    description: 'Usuário toca "Voltar" no detalhe → retorna às abas',
  },
} as const;

export type NavigationMapKey = keyof typeof navigationMap;
