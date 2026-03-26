// src/utils/cpf.js
export const sanitizeCPF = (value = "") => String(value).replace(/\D/g, "").slice(0, 11);

export const formatCPF = (value = "") => {
  const digits = sanitizeCPF(value);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const isValidCPF = (value = "") => {
  const cpf = sanitizeCPF(value);

  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (base) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += Number(base[i]) * (base.length + 1 - i);
    }
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const d1 = calcDigit(cpf.slice(0, 9));
  const d2 = calcDigit(cpf.slice(0, 9) + String(d1));

  return cpf === cpf.slice(0, 9) + String(d1) + String(d2);
};

export const CPF_REGEX_FORMATTED = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
export const CPF_REGEX_DIGITS = /^\d{11}$/;