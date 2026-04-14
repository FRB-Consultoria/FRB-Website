// src/pages/BenefitsPortal/utils/benefitsHelpers.js

export const getAny = (obj, keys = []) => {
  if (!obj) return undefined;
  for (const key of keys) {
    const value = obj?.[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
};

export const hasValue = (value) => !!String(value || "").trim();

export const getPlanRequirements = (person = {}) => {
  const planCode = String(person?.CODIGO_DO_PLANO || "").toUpperCase();
  const planName = String(person?.plan_name || person?.PLAN_NAME || "").toUpperCase();
  const explicitRequiresHealth = person?.REQUIRES_HEALTH;
  const explicitRequiresDental = person?.REQUIRES_DENTAL;

  if (
    typeof explicitRequiresHealth === "boolean" ||
    typeof explicitRequiresDental === "boolean"
  ) {
    return {
      requiresHealth: explicitRequiresHealth !== false,
      requiresDental: explicitRequiresDental === true,
    };
  }

  const combinedPlanText = `${planCode} ${planName}`;
  const mentionsDental =
    combinedPlanText.includes("DENTAL") ||
    combinedPlanText.includes("ODONTO") ||
    combinedPlanText.includes("ODONT");

  return { requiresHealth: true, requiresDental: mentionsDental };
};

export const getDisplayPlanRegistrationStatus = (person = {}) => {
  const rawStatus = String(person?.PLAN_REGISTRATION_STATUS || "")
    .toLowerCase()
    .trim();

  if (rawStatus === "to_register") return "to_register";
  if (rawStatus === "registered_waiting_card") return "registered_waiting_card";

  const hasHealth = hasValue(person?.CARTEIRINHA_SAUDE);
  const hasDental = hasValue(person?.CARTEIRINHA_DENTAL);
  const noHealth = Boolean(person?.NO_HEALTH_CARD);
  const noDental = Boolean(person?.NO_DENTAL_CARD);
  const healthOk = hasHealth || noHealth;
  const dentalOk = hasDental || noDental;

  if (healthOk && dentalOk) return "card_saved";
  if (healthOk || dentalOk) return "registered_waiting_card";

  return rawStatus || "to_register";
};

// ═══════════════════════════════════════════════════════════════════════════════
// Helpers internos de completude
// ═══════════════════════════════════════════════════════════════════════════════

export const isPersonComplete = (person) => {
  const hasHealth = hasValue(person?.CARTEIRINHA_SAUDE);
  const hasDental = hasValue(person?.CARTEIRINHA_DENTAL);
  const noHealth = Boolean(person?.NO_HEALTH_CARD);
  const noDental = Boolean(person?.NO_DENTAL_CARD);
  return (hasHealth || noHealth) && (hasDental || noDental);
};

const hasAnyAction = (person) => {
  const hasHealth = hasValue(person?.CARTEIRINHA_SAUDE);
  const hasDental = hasValue(person?.CARTEIRINHA_DENTAL);
  const noHealth = Boolean(person?.NO_HEALTH_CARD);
  const noDental = Boolean(person?.NO_DENTAL_CARD);
  const registered = Boolean(person?.REGISTERED_IN_PLAN_AT);
  return hasHealth || hasDental || noHealth || noDental || registered;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Pendências detalhadas por pessoa
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Retorna lista de razões pendentes para um único membro.
 * Não inclui e-mail — isso é responsabilidade do titular / família.
 */
export const getPersonPendingReasons = (person) => {
  if (!person) return [];
  const reasons = [];
  const hasHealth = hasValue(person?.CARTEIRINHA_SAUDE);
  const hasDental = hasValue(person?.CARTEIRINHA_DENTAL);
  const noHealth = Boolean(person?.NO_HEALTH_CARD);
  const noDental = Boolean(person?.NO_DENTAL_CARD);
  if (!hasHealth && !noHealth) reasons.push("Carteirinha saúde pendente");
  if (!hasDental && !noDental) reasons.push("Carteirinha dental pendente");
  return reasons;
};

/**
 * Retorna lista de razões pendentes para a família inteira.
 * Inclui pendências de carteirinha por membro + e-mail não enviado.
 */
export const getFamilyPendingReasons = (titular, dependentes = []) => {
  if (!titular) return [];
  const reasons = [];

  // Pendências do titular
  const titularReasons = getPersonPendingReasons(titular);
  titularReasons.forEach((r) => reasons.push(`Titular: ${r}`));

  // Pendências de cada dependente
  (dependentes || []).forEach((dep) => {
    if (!dep) return;
    const depReasons = getPersonPendingReasons(dep);
    if (depReasons.length > 0) {
      const firstName = String(
        dep.NOME || dep.NOME_DO_DEPENDENTE || "Dependente"
      )
        .trim()
        .split(" ")[0];
      depReasons.forEach((r) => reasons.push(`${firstName}: ${r}`));
    }
  });

  // E-mail — só verificar quando todas as carteirinhas estão preenchidas
  const allMembers = [titular, ...(dependentes || [])];
  const allComplete = allMembers.every(isPersonComplete);
  if (allComplete) {
    const emailSent = Boolean(
      getAny(titular, ["LAST_CARD_EMAIL_SENT_AT", "last_card_email_sent_at"])
    );
    if (!emailSent) reasons.push("E-mail de carteirinhas não enviado");
  }

  return reasons;
};

// ═══════════════════════════════════════════════════════════════════════════════
// Cálculo do status real da família para cores dos cards
// REGRA: Verde APENAS quando todos os membros têm carteirinhas E e-mail enviado
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calcula a cor da família (titular + dependentes).
 * - "green" : TODOS completos (carteirinhas) E e-mail enviado
 * - "yellow": alguma ação foi feita mas há pendência
 * - "red"   : nenhuma ação feita
 */
export const getFamilyColor = (titular, dependentes = []) => {
  if (!titular) return "red";

  const allMembers = [
    titular,
    ...dependentes.map((d) => (typeof d === "object" && d !== null ? d : {})),
  ];

  const allComplete = allMembers.every(isPersonComplete);

  if (allComplete) {
    // Verde SOMENTE se o e-mail de carteirinhas já foi enviado
    const emailSent = Boolean(
      getAny(titular, ["LAST_CARD_EMAIL_SENT_AT", "last_card_email_sent_at"])
    );
    if (emailSent) return "green";
    // Carteirinhas OK mas e-mail ainda não enviado → amarelo
    return "yellow";
  }

  const anyAction = allMembers.some(hasAnyAction);
  return anyAction ? "yellow" : "red";
};

/**
 * Verifica se TODA a família está pronta para envio de e-mail.
 */
export const isFamilyReadyForEmail = (titular, dependentes = []) => {
  if (!titular) return false;
  const hasEmail = Boolean(
    getAny(titular, ["EMAIL_DO_COLABORADOR", "email_do_colaborador"])
  );
  if (!hasEmail) return false;

  const allMembers = [titular, ...dependentes];
  return allMembers.every(isPersonComplete);
};

/**
 * Encontra o primeiro membro pendente para navegação/highlight.
 */
export const findFirstPendingMember = (titular, dependentes = []) => {
  const checkPerson = (person) => {
    if (!person) return null;
    const hasHealth = hasValue(person?.CARTEIRINHA_SAUDE);
    const hasDental = hasValue(person?.CARTEIRINHA_DENTAL);
    const noHealth = Boolean(person?.NO_HEALTH_CARD);
    const noDental = Boolean(person?.NO_DENTAL_CARD);

    if (!hasHealth && !noHealth)
      return {
        personId: person?.id,
        field: "health",
        personName: person?.NOME || person?.nome,
      };
    if (!hasDental && !noDental)
      return {
        personId: person?.id,
        field: "dental",
        personName: person?.NOME || person?.nome,
      };
    return null;
  };

  const titularPending = checkPerson(titular);
  if (titularPending) return titularPending;

  for (const dep of dependentes) {
    const depPending = checkPerson(dep);
    if (depPending) return depPending;
  }
  return null;
};

/**
 * Calcula dias restantes até uma data.
 */
export const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  if (isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const daysUntilText = (dateStr) => {
  const days = daysUntil(dateStr);
  if (days === null) return "";
  if (days < 0) return `${Math.abs(days)} dia(s) atrás`;
  if (days === 0) return "Hoje";
  if (days === 1) return "Amanhã";
  return `${days} dia(s)`;
};

export const daysUntilColor = (dateStr) => {
  const days = daysUntil(dateStr);
  if (days === null) return "";
  if (days <= 0) return "#B42318";
  if (days <= 7) return "#a15c00";
  return "#667085";
};

// ═══════════════════════════════════════════════════════════════════════════════

export const normalizeListItem = (item) => {
  const normalized = {
    id: getAny(item, ["id"]),
    SUB: getAny(item, ["SUB", "sub"]),
    NOME: getAny(item, ["NOME", "nome"]),
    MATRICULA: getAny(item, ["MATRICULA", "matricula"]),
    CPF_TIT: getAny(item, ["CPF_TIT", "cpf_tit"]),
    TIPO: getAny(item, ["TIPO", "tipo"]),
    CODIGO_DO_PLANO: getAny(item, ["CODIGO_DO_PLANO", "codigo_do_plano"]),
    PLAN_NAME: getAny(item, ["PLAN_NAME", "plan_name"]),
    INICIO_DA_VIGENCIA: getAny(item, ["INICIO_DA_VIGENCIA", "inicio_da_vigencia"]),
    STATUS: getAny(item, ["STATUS", "status"]),
    PLAN_REGISTRATION_STATUS: getAny(item, ["PLAN_REGISTRATION_STATUS", "plan_registration_status"]),
    CARTEIRINHA: getAny(item, ["CARTEIRINHA", "card_number"]),
    CARTEIRINHA_SAUDE: getAny(item, ["CARTEIRINHA_SAUDE", "card_number_health", "card_number"]),
    CARTEIRINHA_DENTAL: getAny(item, ["CARTEIRINHA_DENTAL", "card_number_dental"]),
    NO_HEALTH_CARD: Boolean(getAny(item, ["NO_HEALTH_CARD", "health_card_not_applicable"])),
    NO_DENTAL_CARD: Boolean(getAny(item, ["NO_DENTAL_CARD", "dental_card_not_applicable"])),
    REQUIRES_HEALTH: getAny(item, ["REQUIRES_HEALTH", "requires_health"]),
    REQUIRES_DENTAL: getAny(item, ["REQUIRES_DENTAL", "requires_dental"]),
    REGISTERED_IN_PLAN_AT: getAny(item, ["REGISTERED_IN_PLAN_AT", "registered_in_plan_at"]),
    CARD_SAVED_AT: getAny(item, ["CARD_SAVED_AT", "card_saved_at"]),
    LAST_CARD_EMAIL_SENT_AT: getAny(item, ["LAST_CARD_EMAIL_SENT_AT", "last_card_email_sent_at"]),
    UPDATED_AT: getAny(item, ["UPDATED_AT", "updated_at"]),
    CREATED_AT: getAny(item, ["CREATED_AT", "created_at"]),
    DEPENDENT_COUNT: Number(getAny(item, ["DEPENDENT_COUNT", "dependent_count"]) || 0),
  };

  return {
    ...normalized,
    PLAN_REGISTRATION_STATUS: getDisplayPlanRegistrationStatus(normalized),
  };
};

export const mapPerson = (person) => {
  const normalized = {
    id: getAny(person, ["id"]),
    SUB: getAny(person, ["SUB", "sub"]),
    NOME: getAny(person, ["NOME", "nome"]),
    CARGO_DO_TITULAR: getAny(person, ["CARGO_DO_TITULAR", "cargo_do_titular"]),
    NOME_DO_DEPENDENTE: getAny(person, ["NOME_DO_DEPENDENTE", "nome_do_dependente"]),
    VINCULO_FAMILIAR: getAny(person, ["VINCULO_FAMILIAR", "vinculo_familiar"]),
    NASCIMENTO: getAny(person, ["NASCIMENTO", "nascimento"]),
    MATRICULA: getAny(person, ["MATRICULA", "matricula"]),
    CPF_TIT: getAny(person, ["CPF_TIT", "cpf_tit"]),
    CPF_DEP: getAny(person, ["CPF_DEP", "cpf_dep"]),
    TIPO: getAny(person, ["TIPO", "tipo"]),
    NUMERO_DO_DOCUMENTO: getAny(person, ["NUMERO_DO_DOCUMENTO", "numero_do_documento"]),
    NATUREZA_DA_IDENTIFICACAO: getAny(person, ["NATUREZA_DA_IDENTIFICACAO", "natureza_da_identificacao"]),
    ORGAO_EXPEDIDOR: getAny(person, ["ORGAO_EXPEDIDOR", "orgao_expedidor"]),
    PAIS_EXPEDIDOR: getAny(person, ["PAIS_EXPEDIDOR", "pais_expedidor"]),
    DATA_DE_EXPEDICAO: getAny(person, ["DATA_DE_EXPEDICAO", "data_de_expedicao"]),
    SEXO: getAny(person, ["SEXO", "sexo"]),
    ESTADO_CIVIL: getAny(person, ["ESTADO_CIVIL", "estado_civil"]),
    ADMISSAO: getAny(person, ["ADMISSAO", "admissao"]),
    INICIO_DA_VIGENCIA: getAny(person, ["INICIO_DA_VIGENCIA", "inicio_da_vigencia"]),
    NOME_DA_MAE: getAny(person, ["NOME_DA_MAE", "nome_da_mae"]),
    CEP: getAny(person, ["CEP", "cep"]),
    ENDERECO_COMPLETO: getAny(person, ["ENDERECO_COMPLETO", "endereco_completo"]),
    BAIRRO: getAny(person, ["BAIRRO", "bairro"]),
    CIDADE: getAny(person, ["CIDADE", "cidade"]),
    UF: getAny(person, ["UF", "uf"]),
    CELULAR: getAny(person, ["CELULAR", "celular"]),
    TIPO_DE_CONTA: getAny(person, ["TIPO_DE_CONTA", "tipo_de_conta"]),
    BANCO: getAny(person, ["BANCO", "banco"]),
    AGENCIA: getAny(person, ["AGENCIA", "agencia"]),
    CONTA_COM_DIGITO: getAny(person, ["CONTA_COM_DIGITO", "conta_com_digito"]),
    CODIGO_DO_PLANO: getAny(person, ["CODIGO_DO_PLANO", "codigo_do_plano"]),
    CASAMENTO: getAny(person, ["CASAMENTO", "casamento"]),
    EMAIL_DO_COLABORADOR: getAny(person, ["EMAIL_DO_COLABORADOR", "email_do_colaborador"]),
    STATUS: getAny(person, ["STATUS", "status"]),
    AVISO_PREVIO_ATE: getAny(person, ["AVISO_PREVIO_ATE", "aviso_previo_ate"]),
    CARTEIRINHA: getAny(person, ["CARTEIRINHA", "card_number"]),
    CARTEIRINHA_SAUDE: getAny(person, ["CARTEIRINHA_SAUDE", "card_number_health", "card_number"]),
    CARTEIRINHA_DENTAL: getAny(person, ["CARTEIRINHA_DENTAL", "card_number_dental"]),
    NO_HEALTH_CARD: Boolean(getAny(person, ["NO_HEALTH_CARD", "health_card_not_applicable"])),
    NO_DENTAL_CARD: Boolean(getAny(person, ["NO_DENTAL_CARD", "dental_card_not_applicable"])),
    REQUIRES_HEALTH: getAny(person, ["REQUIRES_HEALTH", "requires_health"]),
    REQUIRES_DENTAL: getAny(person, ["REQUIRES_DENTAL", "requires_dental"]),
    PLAN_REGISTRATION_STATUS: getAny(person, ["PLAN_REGISTRATION_STATUS", "plan_registration_status"]),
    REGISTERED_IN_PLAN_AT: getAny(person, ["REGISTERED_IN_PLAN_AT", "registered_in_plan_at"]),
    CARD_SAVED_AT: getAny(person, ["CARD_SAVED_AT", "card_saved_at"]),
    LAST_CARD_EMAIL_SENT_AT: getAny(person, ["LAST_CARD_EMAIL_SENT_AT", "last_card_email_sent_at"]),
    ACTIVE: getAny(person, ["ACTIVE", "active"]),
    CREATED_AT: getAny(person, ["CREATED_AT", "created_at"]),
    UPDATED_AT: getAny(person, ["UPDATED_AT", "updated_at"]),
    EVENTOS_RECENTES: getAny(person, ["EVENTOS_RECENTES", "events"]) || [],
    DEPENDENTES: getAny(person, ["DEPENDENTES", "dependentes"]) || [],
    DEPENDENT_COUNT: Number(getAny(person, ["DEPENDENT_COUNT", "dependent_count"]) || 0),
  };

  return {
    ...normalized,
    PLAN_REGISTRATION_STATUS: getDisplayPlanRegistrationStatus(normalized),
  };
};