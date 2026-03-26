export const safeText = (v) =>
  v === null || v === undefined || v === "" ? "-" : v;

export const digitsOnly = (v) => String(v || "").replace(/\D/g, "");

export const formatDateBR = (value) => {
  if (!value) return "-";
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(`${value}T00:00:00`);
    if (String(d) === "Invalid Date") return safeText(value);
    return d.toLocaleDateString("pt-BR");
  }
  const d = new Date(value);
  if (String(d) === "Invalid Date") return safeText(value);
  return d.toLocaleDateString("pt-BR");
};

export const formatDateTimeBR = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (String(d) === "Invalid Date") return safeText(value);
  return d.toLocaleString("pt-BR");
};

export const formatCPF = (value) => {
  const digits = digitsOnly(value).slice(0, 11);
  if (!digits) return "-";
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const formatPhoneBR = (value) => {
  const digits = digitsOnly(value).slice(0, 11);
  if (!digits) return "-";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const formatCEP = (value) => {
  const digits = digitsOnly(value).slice(0, 8);
  if (!digits) return "-";
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

export const formatBoolean = (value) => {
  if (value === true) return "Sim";
  if (value === false) return "Não";
  return safeText(value);
};

export const formatCardNumberInput = (value) =>
  String(value || "")
    .replace(/[^\dA-Za-z]/g, "")
    .slice(0, 30);

export const formatSearchInput = (value) =>
  String(value || "")
    .replace(/[^\p{L}\p{N}\s@._\-()/]/gu, "")
    .replace(/\s{2,}/g, " ")
    .slice(0, 120);

const DATE_FIELDS = ["NASCIMENTO", "ADMISSAO", "INICIO_DA_VIGENCIA", "DATA_DE_EXPEDICAO", "AVISO_PREVIO_ATE"];
const DATETIME_FIELDS = ["REGISTERED_IN_PLAN_AT", "CARD_SAVED_AT", "CREATED_AT", "UPDATED_AT"];
const BOOLEAN_FIELDS = ["ACTIVE", "NO_HEALTH_CARD", "NO_DENTAL_CARD"];

export const formatValueByKey = (key, value) => {
  if (value === null || value === undefined || value === "") return "-";
  if (key === "CPF_TIT" || key === "CPF_DEP") return formatCPF(value);
  if (key === "CELULAR") return formatPhoneBR(value);
  if (key === "CEP") return formatCEP(value);
  if (DATE_FIELDS.includes(key)) return formatDateBR(value);
  if (DATETIME_FIELDS.includes(key)) return formatDateTimeBR(value);
  if (BOOLEAN_FIELDS.includes(key)) return formatBoolean(value);
  return String(value);
};