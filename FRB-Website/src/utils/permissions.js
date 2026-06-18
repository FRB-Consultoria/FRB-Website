// src/utils/permissions.js
// Sistema de permissões granulares do portal FRB.
//
// Cada chave corresponde ao campo perm_<key> no modelo User (backend) e ao
// dict perms.<key> no JWT. O admin pode ativar/desativar individualmente por
// toggle, independentemente do user_level.

export const PERM_KEYS = [
  "perm_bi",
  "perm_powerbi",
  "perm_faturamento",
  "perm_faturamento_admin",
  "perm_benefits",
  "perm_benefits_billing",
  "perm_benefits_dashboard",
  "perm_admin",
  "perm_book",
  "perm_dash_evolucao",
  "perm_dash_divergencias",
];

export const PERM_LABELS = {
  perm_bi:                "BI · FRB Consultoria",
  perm_powerbi:           "Power BI (Antigo)",
  perm_faturamento:       "Enviar Faturamento Vida",
  perm_faturamento_admin: "Admin Faturamento Vida",
  perm_benefits:           "Admin Inclusão de Beneficiários",
  perm_benefits_billing:   "Admin Bate-conferência da Fatura",
  perm_benefits_dashboard: "Dashboard Faturamento",
  perm_admin:              "Admin Sistema",
  perm_book:               "Book de Entregas",
  perm_dash_evolucao:      "Dashboard · aba Evolução",
  perm_dash_divergencias:  "Dashboard · aba Divergências",
};

export const PERM_DESCRIPTIONS = {
  perm_bi:                "Acessa /bi com os dashboards de Business Intelligence da FRB",
  perm_powerbi:           "Acessa o iframe legado do Power BI em /user",
  perm_faturamento:       "Acessa /faturamento (envio e acompanhamento de faturas)",
  perm_faturamento_admin: "Acessa /faturamento/admin (visão administrativa)",
  perm_benefits:           "Acessa /beneficios/portal (inclusão e exclusão de beneficiários)",
  perm_benefits_billing:   "Acessa /beneficios/faturamento + dashboard (bate-conferência e análise)",
  perm_benefits_dashboard: "Acessa somente o dashboard da própria empresa",
  perm_admin:              "Acessa /admin (gerenciamento de clientes e usuários)",
  perm_book:               "Acessa /beneficios/book (resumo de entregas e atividades do período)",
  perm_dash_evolucao:      "Mostra a aba Evolução no Dashboard (requer Dashboard Faturamento)",
  perm_dash_divergencias:  "Mostra a aba Divergências/Auditoria no Dashboard (requer Dashboard Faturamento)",
};

/**
 * Retorna true se o objeto user (vindo da API) tem a permissão.
 *
 * @param {object} user  - objeto do usuário (response de /api/users/:id/)
 * @param {string} key   - chave sem prefixo, ex: "bi", "powerbi", "faturamento"
 */
export const hasPermission = (user, key) => {
  if (!user) return false;
  return !!user[`perm_${key}`];
};

/**
 * Retorna true baseado no JWT decodificado (para casos em que o objeto user
 * completo ainda não foi carregado da API).
 *
 * @param {object} decoded  - resultado de jwt_decode(token)
 * @param {string} key      - chave sem prefixo, ex: "bi", "powerbi"
 */
export const hasPermissionFromToken = (decoded, key) => {
  if (!decoded?.perms) return false;
  return !!decoded.perms[key];
};
