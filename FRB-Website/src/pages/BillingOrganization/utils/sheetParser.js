// src/pages/BillingOrganization/utils/sheetParser.js
// Parser preciso para o formato Bradesco (Dental PRIO)

import * as XLSX from "xlsx";

// ─────────────────────────────────────────────────────────────────
// UTILIDADES GERAIS
// ─────────────────────────────────────────────────────────────────

const readWb = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(XLSX.read(new Uint8Array(e.target.result), { type: "array", cellDates: false }));
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });

const getRows = (ws) => XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });

const parseValor = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return v;
  const s = String(v).trim().replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
};

export const fmtBRL = (v) => {
  const n = parseFloat(v);
  if (isNaN(n)) return "";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const normSub = (v) => {
  const s = String(v ?? "").trim();
  return s.startsWith("0") ? s.slice(1) : s;
};

const isSubTotal = (sub) => sub === "9999";

const normCpf = (v) => {
  if (!v && v !== 0) return "";
  const s = String(v).replace(/\D/g, "");
  if (!s || /^0+$/.test(s)) return "";
  return s.padStart(11, "0");
};

const grauLabel = (cod, ehTitular) => {
  if (ehTitular) return "TIT";
  const c = String(cod ?? "").trim();
  if (c === "0" || c === "00") return "TIT";
  if (c === "1" || c === "01") return "CONJ";
  if (c === "2" || c === "02" || c >= "3") return "FILH";
  return "DEP";
};

const sexoLabel = (cod) => {
  const c = String(cod ?? "").trim();
  if (c === "01" || c === "1") return "MAS";
  if (c === "02" || c === "2") return "FEM";
  return c;
};

const estCivilLabel = (cod) => {
  const c = String(cod ?? "").trim();
  if (c === "1") return "SOLT";
  if (c === "2") return "CAS";
  if (c === "3") return "DIV";
  if (c === "4") return "VIUV";
  return c;
};

const isTsRow = (tipoLanc) => {
  const t = String(tipoLanc ?? "").toUpperCase();
  return t.includes("(TS)") || t.includes("TOTAIS DA SUBFATURA");
};

// ─────────────────────────────────────────────────────────────────
// NORMALIZAÇÃO — CAMPOS SIMPLES
// ─────────────────────────────────────────────────────────────────

const normalizeSexo = (v) => {
  const s = String(v ?? "").trim().toUpperCase();
  if (!s) return null;
  if (["01","1","M","MAS","MASC","MASCULINO","MALE"].includes(s))   return "MAS";
  if (["02","2","F","FEM","FEMIN","FEMININO","FEMALE"].includes(s)) return "FEM";
  return null;
};

/**
 * Limpeza canônica de nome — fonte única de verdade para TODA comparação.
 * Resolve: NBSP, zero-width, acentos, NFD/NFC misto, espaços duplos.
 *   ​-‍  → removidos (zero-width space / joiner / non-joiner)
 *   ﻿         → removido (BOM / zero-width no-break space)
 *             → espaço normal (non-breaking space)
 *   NFKD           → decomposição de compatibilidade (mais ampla que NFD)
 *   ̀-ͯ  → remove diacríticos
 */
const cleanNome = (v) => {
  if (!v) return "";
  // Filtra chars invisiveis/controle por codePoint — evita regex com U+2028/2029
  // que sao separadores de linha e quebrariam o literal de regex.
  const filtered = [...String(v)].filter(c => {
    const code = c.codePointAt(0);
    return !(
      (code >= 0x200B && code <= 0x200F) || // zero-width, LRM, RLM
      (code >= 0x202A && code <= 0x202E) || // bidi
      (code >= 0x2028 && code <= 0x2029) || // line/para sep
      code === 0xFEFF || code === 0x00AD     // BOM, soft hyphen
    );
  }).join("");
  return filtered
    .replace(/ /g, " ")    // NBSP -> space
    .replace(/	/g, " ")         // tab  -> space
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")  // strip diacritics
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
};

/** Normaliza nome para comparação genérica (usada fora de comparaNomes) */
const normNome = (v) => cleanNome(v) || null;

const normData = (v) => {
  if (!v) return null;
  const s = String(v).trim();
  if (!s) return null;
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
  const d = s.replace(/\D/g, "");
  if (d.length === 8 && !/^0+$/.test(d)) {
    const dd = d.slice(0,2), mm = d.slice(2,4), yy = d.slice(4,8);
    if (+mm >= 1 && +mm <= 12 && +dd >= 1 && +dd <= 31) return `${yy}-${mm}-${dd}`;
  }
  return null;
};

const normEstCivil = (v) => {
  const s = String(v ?? "").trim().toUpperCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (!s) return null;
  if (["1","01","S","SOLT","SOLTEIRO","SOLTEIRA"].includes(s))               return "SOLT";
  if (["2","02","C","CAS","CASADO","CASADA"].includes(s))                     return "CAS";
  if (["3","03","D","DIV","DIVORCIADO","DIVORCIADA"].includes(s))             return "DIV";
  if (["4","04","V","VIUV","VIUVO","VIUVA","VIUVO(A)","VIUVA(O)"].includes(s)) return "VIUV";
  return null;
};

const normParentesco = (v) => {
  const s = String(v ?? "").trim().toUpperCase();
  if (!s) return null;
  if (s === "TIT" || s === "TITULAR" || s === "0" || s === "00") return "TIT";
  if (s === "CONJ" || s === "CONJUGE" || s === "1" || s === "01") return "CONJ";
  if (s === "FILH" || s === "FILHO" || s === "FILHA" || s === "2" || s === "02") return "FILH";
  if (/^\d+$/.test(s) && parseInt(s) >= 3) return "FILH";
  return null;
};

// ─────────────────────────────────────────────────────────────────
// COMPARAÇÃO INTELIGENTE DE NOME
// ─────────────────────────────────────────────────────────────────

const NOME_CONNECTORS = new Set(["DE","DA","DO","DAS","DOS","E"]);

/**
 * Normalização de sufixos de geração para forma canônica.
 * Trata a forma abreviada (2 letras) e a forma completa.
 *   JR / JUNIOR   → JUNIOR
 *   FO / FILHO    → FILHO
 *   NT / NETO     → NETO
 *   SO / SOBRINHO → SOBRINHO
 */
const SUFFIX_NORM = {
  "JR": "JUNIOR",
  "FO": "FILHO",
  "NT": "NETO",
  "SO": "SOBRINHO",
};

/** Levenshtein entre duas strings (Wagner-Fischer O(n)) */
const levenshtein = (a, b) => {
  if (a === b) return 0;
  const la = a.length, lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;
  const row = Array.from({ length: lb + 1 }, (_, i) => i);
  for (let i = 1; i <= la; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= lb; j++) {
      const tmp = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, row[j], row[j - 1]);
      prev = tmp;
    }
  }
  return row[lb];
};

/**
 * Tokeniza nome usando cleanNome como base — garante que os dois lados
 * de qualquer comparação passem pela mesma normalização profunda:
 *   1. cleanNome: invisible chars, NFKD, sem diacríticos, upper, espaços
 *   2. Separa por espaço
 *   3. Remove pontuação residual por token (JR. → JR)
 *   4. Remove conectores (DE, DA, DO, DAS, DOS, E)
 *   5. Normaliza sufixos de geração: JR→JUNIOR, FO→FILHO, NT→NETO, SO→SOBRINHO
 */
const tokenizeNome = (v) => {
  const s = cleanNome(v);
  if (!s) return [];
  return s
    .split(" ")
    .map(t => t.replace(/[^A-Z]/g, ""))          // strip pontuação (JR. → JR)
    .filter(t => t && !NOME_CONNECTORS.has(t))
    .map(t => SUFFIX_NORM[t] ?? t);              // JR→JUNIOR, FO→FILHO, NT→NETO, SO→SOBRINHO
};

/**
 * Casamento de token a contra token b:
 *   - iguais
 *   - token de 1 letra = inicial → casa com qualquer token do outro lado que comece por ela
 *   - prefixo/truncamento: um é prefixo do outro
 */
const tokenMatch = (a, b) => {
  if (a === b) return true;
  if (a.length === 1) return b.length > 0 && b[0] === a[0];
  if (b.length === 1) return a.length > 0 && a[0] === b[0];
  if (a.length <= b.length && b.startsWith(a)) return true;
  if (b.length  < a.length && a.startsWith(b)) return true;
  return false;
};

/**
 * Compara dois nomes e classifica a relacao:
 *   "igual"      -> mesma pessoa (abreviacao, truncamento, iniciais)
 *   "abreviacao" -> grafia leve (typo real, Lev > 0 e <= 2)
 *   "diferente"  -> pessoa diferente (conflito real)
 *
 * Regra central: grafiaFound so pode ser true se o token do lado A
 * for GENUINAMENTE diferente do token do lado B (levenshtein > 0).
 * Se levenshtein == 0, os tokens sao identicos e o match e exato,
 * nao grafia — isso fecha o falso positivo de "CAROLLINE = CAROLLINE".
 */
const comparaNomes = (nameA, nameB) => {
  // Guard 1: strings limpas identicas
  if (cleanNome(nameA) === cleanNome(nameB)) return "igual";

  const tokA = tokenizeNome(nameA);
  const tokB = tokenizeNome(nameB);
  if (!tokA.length || !tokB.length) return "diferente";

  // Guard 2: sequencias de tokens identicas apos normalizacao completa.
  // Eliminacao definitiva de falso "abreviacao" por tokenMatch-prefix ou Levenshtein=0.
  const seqA = tokA.join(" ");
  const seqB = tokB.join(" ");
  if (seqA === seqB) return "igual";

  // Primeiro token (primeiro nome) deve casar
  if (!tokenMatch(tokA[0], tokB[0])) {
    if (tokA[0].length >= 4 && tokB[0].length >= 4 && levenshtein(tokA[0], tokB[0]) <= 2)
      return "abreviacao";
    return "diferente";
  }

  // Todos os tokens do nome mais curto devem ser encontrados (em ordem) no mais longo
  const [shorter, longer] = tokA.length <= tokB.length ? [tokA, tokB] : [tokB, tokA];
  let j = 0;
  let grafiaFound = false;

  for (let i = 0; i < shorter.length; i++) {
    const tok = shorter[i];
    let found = false;

    // 1. Casamento exato / inicial / prefixo
    for (let k = j; k < longer.length; k++) {
      if (tokenMatch(tok, longer[k])) { found = true; j = k + 1; break; }
    }

    if (!found) {
      // 2. Verificacao direta de igualdade de string antes do Levenshtein
      //    (belt-and-suspenders para o caso em que tokenMatch falha por byte-diff)
      for (let k = j; k < longer.length; k++) {
        if (tok === longer[k]) { found = true; j = k + 1; break; }
      }
    }

    if (!found) {
      // 3. Grafia: Levenshtein estritamente > 0 e <= 2 em tokens longos.
      //    d == 0 significaria tokens identicos — tratado acima, nao e grafia.
      let bestD = Infinity, bestK = -1;
      for (let k = j; k < longer.length; k++) {
        if (tok.length >= 4 && longer[k].length >= 4) {
          const d = levenshtein(tok, longer[k]);
          if (d > 0 && d < bestD) { bestD = d; bestK = k; }
        }
      }
      if (bestD <= 2 && bestK >= 0) { grafiaFound = true; j = bestK + 1; }
      else return "diferente";
    }
  }

  // Guard 3: apos o loop, se as sequencias forem iguais nao e grafia
  if (seqA === seqB) return "igual";

  return grafiaFound ? "abreviacao" : "igual";
};

// ─────────────────────────────────────────────────────────────────
// 1. FATURA TÉCNICA
// ─────────────────────────────────────────────────────────────────
export async function parseFaturaTecnica(file) {
  const wb = await readWb(file);
  let sheetName = wb.SheetNames[0];
  for (const name of wb.SheetNames) {
    const r = getRows(wb.Sheets[name]);
    if (r.some(row => String(row[0]).trim() === "3")) { sheetName = name; break; }
  }

  const rows        = getRows(wb.Sheets[sheetName]);
  const benefRows   = [];
  const summaryRows = [];

  for (const row of rows) {
    const tipo = String(row[0]).trim();

    if (tipo === "3") {
      const sub = normSub(row[1]);
      if (isSubTotal(sub)) continue;

      const codLanc  = String(row[16] ?? "").trim();
      const tipoLanc = String(row[12] ?? "").trim();
      if (codLanc === "57" || codLanc === "50" || tipoLanc === "AD") continue;

      const CREDIT_CODES = new Set(["54","55","59"]);
      const valorBruto   = parseValor(row[14]);
      const valor        = (valorBruto !== null && CREDIT_CODES.has(codLanc))
        ? -valorBruto : valorBruto;

      const certif    = String(row[2] ?? "").trim().padStart(7, "0");
      const compl     = String(row[3] ?? "").trim().padStart(2, "0");
      const ehTitular = compl === "00";

      benefRows.push({
        sub,
        certif,
        complemento:    compl,
        certifFull:     `${certif}/${compl}`,
        certGrupo:      certif,
        nome:           String(row[4]  ?? "").trim(),
        dataNascimento: String(row[6]  ?? "").trim(),
        sexo:           sexoLabel(row[7]),
        estCivil:       estCivilLabel(row[8]),
        parentesco:     grauLabel(row[9], ehTitular),
        grauRaw:        String(row[9]  ?? "").trim(),
        plano:          String(row[10] ?? "").trim(),
        dataInicio:     String(row[11] ?? "").trim(),
        tipoLancamento: tipoLanc,
        lancamento:     String(row[13] ?? "").trim(),
        valor,
        parteSeguro:    parseValor(row[15]),
      });
    }

    if (tipo === "4") {
      const sub = normSub(row[1]);
      if (isSubTotal(sub)) continue;
      summaryRows.push({
        sub,
        tipoLanc:  String(row[2] ?? "").trim(),
        qtdTit:    parseValor(row[3]),
        qtdDep:    parseValor(row[4]),
        qtdSeg:    parseValor(row[5]),
        qtdLanc:   parseValor(row[6]),
        vlrTotal:  parseValor(row[7]),
        vlrParte:  parseValor(row[8]),
      });
    }
  }

  const summaryBlocks = [];
  const sbMap = {};
  for (const r of summaryRows) {
    if (!sbMap[r.sub]) {
      sbMap[r.sub] = { sub: r.sub, rows: [], tsTotal: null, tsParte: null };
      summaryBlocks.push(sbMap[r.sub]);
    }
    if (isTsRow(r.tipoLanc)) { sbMap[r.sub].tsTotal = r.vlrTotal; sbMap[r.sub].tsParte = r.vlrParte; }
    else sbMap[r.sub].rows.push(r);
  }

  return { benefRows, summaryBlocks };
}

// ─────────────────────────────────────────────────────────────────
// 2. POSIÇÃO CADASTRAL
// ─────────────────────────────────────────────────────────────────
export async function parsePosicaoCadastral(file) {
  const wb         = await readWb(file);
  const titulares  = new Map();
  const dependentes = new Map();

  for (const sheetName of wb.SheetNames) {
    const norm  = sheetName.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    const isTit = norm.includes("titular");
    const isDep = norm.includes("depend");
    if (!isTit && !isDep) continue;

    const rows = getRows(wb.Sheets[sheetName]);

    for (const row of rows) {
      if (String(row[0]).trim() !== "2") continue;
      const certif = String(row[2] ?? "").trim().padStart(7, "0");
      if (!certif || certif === "0000000") continue;

      if (isTit) {
        titulares.set(certif, {
          cpf:            normCpf(row[9]),
          nome:           String(row[5]  ?? "").trim(),
          dataNascimento: String(row[6]  ?? "").trim(),
          sexo:           sexoLabel(row[7]),
          estCivil:       estCivilLabel(row[8]),
          dataInicio:     String(row[10] ?? "").trim(),
        });
      } else {
        const codDep = String(row[5] ?? "").trim().padStart(2, "0");
        dependentes.set(`${certif}_${codDep}`, {
          cpf:            normCpf(row[11]),
          nome:           String(row[6]  ?? "").trim(),
          grau:           String(row[10] ?? "").trim(),
          estCivil:       estCivilLabel(row[9]),
          sexo:           sexoLabel(row[8]),
          dataNascimento: String(row[7]  ?? "").trim(),
          dataInicio:     String(row[12] ?? "").trim(),
        });
      }
    }
  }

  return { titulares, dependentes };
}

// ─────────────────────────────────────────────────────────────────
// 3. BASE CC
// ─────────────────────────────────────────────────────────────────
export async function parseBaseCC(file) {
  const wb = await readWb(file);
  const rows = getRows(wb.Sheets[wb.SheetNames[0]]);

  const bySubCertif   = new Map();
  const byCpf         = new Map();
  const certifEntries = new Map();

  for (const row of rows) {
    if (isNaN(parseInt(String(row[0]).trim().replace(/^0+/, "") || "0"))) continue;
    const certif = String(row[1] ?? "").trim().padStart(7, "0");
    if (!certif || certif === "0000000") continue;

    const sub    = normSub(String(row[0] ?? "").trim());
    if (isSubTotal(sub)) continue;

    const cpf    = normCpf(row[6]);
    const nomeCC = String(row[7] ?? "").trim();
    const codCC  = String(row[8] ?? "").trim();
    if (!nomeCC && !codCC) continue;
    if (codCC.toUpperCase() === "DESLIGADO" || nomeCC.toUpperCase().includes("DESLIGAD")) continue;

    const entry = {
      centroCusto:    nomeCC,
      codigoCC:       codCC,
      nome:           String(row[3] ?? "").trim(),
      dataNascimento: String(row[4] ?? "").trim(),
      sexo:           normalizeSexo(row[5]),
      cpf,
    };

    bySubCertif.set(`${sub}_${certif}`, entry);
    if (cpf) byCpf.set(cpf, entry);
    if (!certifEntries.has(certif)) certifEntries.set(certif, entry);
  }

  return { bySubCertif, byCpf, certifEntries };
}

// ─────────────────────────────────────────────────────────────────
// 4. MERGE
// ─────────────────────────────────────────────────────────────────
export function mergeAll(faturaData, posData, ccData, movMap = {}) {
  const { benefRows, summaryBlocks }      = faturaData;
  const { titulares, dependentes }        = posData;
  const { bySubCertif, byCpf, certifEntries } = ccData;

  const conflicts        = [];
  const nomeGrafia       = [];
  const grauIndefinido   = [];
  const reportedCfg      = new Map(); // certifFull → Set<campo>
  const reportedMov      = new Set();
  const reportedGrau     = new Set();
  const reportedGrafia   = new Set();

  const addConflict = (certifFull, campo, record) => {
    if (!reportedCfg.has(certifFull)) reportedCfg.set(certifFull, new Set());
    const seen = reportedCfg.get(certifFull);
    if (seen.has(campo)) return;
    seen.add(campo);
    conflicts.push(record);
  };

  const detectConflict = (certifFull, campo, normValues, record) => {
    const known = normValues.filter(Boolean);
    if (known.length < 2) return;
    if (new Set(known).size < 2) return;
    addConflict(certifFull, campo, record);
  };

  const vidasRows = benefRows.map((row) => {
    const ehTitular = row.complemento === "00";

    // ── Posição Cadastral ─────────────────────────────────────────
    const posEntry = ehTitular
      ? titulares.get(row.certif)
      : dependentes.get(`${row.certif}_${row.complemento}`);

    const cpf = posEntry?.cpf || "";

    // ── Centro de Custo ───────────────────────────────────────────
    let ccEntry = bySubCertif.get(`${row.sub}_${row.certif}`);
    if (!ccEntry && cpf) ccEntry = byCpf.get(cpf);
    if (!ccEntry && !ehTitular) {
      const titEntry = titulares.get(row.certif);
      if (titEntry?.cpf) ccEntry = byCpf.get(titEntry.cpf);
      if (!ccEntry) ccEntry = bySubCertif.get(`${row.sub}_${row.certif}`);
    }
    const centroCusto = ehTitular ? (ccEntry?.centroCusto || "") : "";
    const codigoCC    = ehTitular ? (ccEntry?.codigoCC    || "") : "";

    // ── Nome: Posição Cadastral é fonte primária (decisão 1) ──────
    // fatNome = valor original da Fatura (para comparação e fallback)
    const fatNome  = row.nome;
    const nomePos  = posEntry?.nome || null;
    const nomeBase = ehTitular ? (ccEntry?.nome || null) : null;
    const nome     = nomePos || fatNome; // primário: posição, fallback: fatura

    // ── Valores originais da Fatura (antes de enriquecimento) ─────
    const fatDataNasc   = row.dataNascimento;
    const fatEstCivil   = row.estCivil;
    const fatParentesco = row.parentesco;
    const fatDataInicio = row.dataInicio;
    const fatMov        = row.tipoLancamento;

    // ── Enriquecimento com Posição Cadastral ──────────────────────
    let estCivil       = fatEstCivil;
    let dataNascimento = fatDataNasc;
    if (ehTitular) {
      if (!estCivil       && posEntry?.estCivil)       estCivil       = posEntry.estCivil;
      if (!dataNascimento && posEntry?.dataNascimento)  dataNascimento = posEntry.dataNascimento;
    } else {
      if (!estCivil       && posEntry?.estCivil)       estCivil       = posEntry.estCivil;
      if (!dataNascimento && posEntry?.dataNascimento)  dataNascimento = posEntry.dataNascimento;
      if (posEntry?.grau) row.parentesco = grauLabel(posEntry.grau, false);
    }

    // ── Sexo ─────────────────────────────────────────────────────
    const sexoFatura = normalizeSexo(row.sexo);
    const sexoPos    = posEntry   ? normalizeSexo(posEntry.sexo)  : null;
    const sexoBase   = ehTitular  ? normalizeSexo(ccEntry?.sexo)  : null;
    const sexo       = sexoBase || sexoPos || sexoFatura || "";

    // ── MOV ───────────────────────────────────────────────────────
    const movKey         = `${row.certifFull}|${row.lancamento}`;
    const tipoLancamento = movMap[movKey] ?? row.tipoLancamento;

    // ── meta usa o nome canônico ──────────────────────────────────
    const meta = {
      sub:        row.sub,
      certifFull: row.certifFull,
      certGrupo:  row.certGrupo,
      nome,
      parentesco: row.parentesco,
    };

    // ── BATE-CONFERÊNCIA ──────────────────────────────────────────

    // Sexo
    detectConflict(row.certifFull, "sexo",
      [sexoBase, sexoFatura, sexoPos],
      { ...meta, campo: "sexo",
        valorBaseCC: sexoBase   || "—",
        valorFatura: sexoFatura || "—",
        valorPos:    sexoPos    || "—",
        valorPdf:    "—",
        valorUsado:  sexo || "—",
      }
    );

    // Nome: comparação inteligente (decisão 2)
    {
      // Pares a comparar: (fatura × posição) e (fatura × base CC)
      const pares = [];
      if (fatNome && nomePos)  pares.push({ a: fatNome, b: nomePos });
      if (fatNome && nomeBase) pares.push({ a: fatNome, b: nomeBase });

      let worstResult = "igual";
      for (const { a, b } of pares) {
        const r = comparaNomes(a, b);
        if (r === "diferente") { worstResult = "diferente"; break; }
        if (r === "abreviacao") worstResult = "abreviacao";
      }

      if (worstResult === "diferente") {
        addConflict(row.certifFull, "nome", {
          ...meta, campo: "nome",
          valorBaseCC: nomeBase || "—",
          valorFatura: fatNome  || "—",
          valorPos:    nomePos  || "—",
          valorPdf:    "—",
          valorUsado:  nome,
        });
      } else if (worstResult === "abreviacao" && !reportedGrafia.has(row.certifFull)) {
        reportedGrafia.add(row.certifFull);

        // ── Grafia de referência da OPERADORA (Bradesco = Fatura + Posição) ──────
        // Se Fatura e Posição concordam → grafia oficial é a da Fatura.
        // Se divergem entre si (raro) → Fatura como fallback, operadoraDivergente:true.
        const cnFatura = fatNome ? cleanNome(fatNome) : null;
        const cnPos    = nomePos ? cleanNome(nomePos)  : null;
        const referencia           = fatNome || nomePos || "—";
        const operadoraDivergente  = !!(cnFatura && cnPos && cnFatura !== cnPos);
        const cnRef = cleanNome(referencia);
        const cnBase = nomeBase ? cleanNome(nomeBase) : null;

        const fontes = [
          {
            fonte:       "baseCC",
            label:       "Base CC (PRIO)",
            valor:       nomeBase || "—",
            diverge:     cnBase !== null ? cnBase !== cnRef : null,
            ehOperadora: false,
          },
          {
            fonte:       "fatura",
            label:       "Fatura (Bradesco)",
            valor:       fatNome || "—",
            diverge:     cnFatura !== null ? cnFatura !== cnRef : null,
            ehOperadora: true,
          },
          {
            fonte:       "pos",
            label:       "Posição (Bradesco)",
            valor:       nomePos || "—",
            diverge:     cnPos !== null ? cnPos !== cnRef : null,
            ehOperadora: true,
          },
        ];

        nomeGrafia.push({
          sub:               row.sub,
          certifFull:        row.certifFull,
          certGrupo:         row.certGrupo,
          nome,
          nomeBase:          nomeBase || "—",
          nomeFatura:        fatNome  || "—",
          nomePos:           nomePos  || "—",
          referencia,
          operadoraDivergente,
          fontes,
        });
      }
    }

    // Data de Nascimento
    const dataNascBase = ehTitular ? (ccEntry?.dataNascimento || null) : null;
    const dataNascPos  = posEntry?.dataNascimento || null;
    detectConflict(row.certifFull, "dataNascimento",
      [normData(dataNascBase), normData(fatDataNasc), normData(dataNascPos)],
      { ...meta, campo: "dataNascimento",
        valorBaseCC: dataNascBase || "—",
        valorFatura: fatDataNasc  || "—",
        valorPos:    dataNascPos  || "—",
        valorPdf:    "—",
        valorUsado:  dataNascimento || "—",
      }
    );

    // CPF
    const cpfBase = ehTitular ? (ccEntry?.cpf || null) : null;
    const cpfPos  = posEntry?.cpf || null;
    if (cpfBase && cpfPos && normCpf(cpfBase) !== normCpf(cpfPos)) {
      addConflict(row.certifFull, "cpf", {
        ...meta, campo: "cpf",
        valorBaseCC: cpfBase || "—",
        valorFatura: "—",
        valorPos:    cpfPos  || "—",
        valorPdf:    "—",
        valorUsado:  cpf || "—",
      });
    }

    // Estado Civil
    const estCivilPos = posEntry?.estCivil || null;
    detectConflict(row.certifFull, "estCivil",
      [normEstCivil(fatEstCivil), normEstCivil(estCivilPos)],
      { ...meta, campo: "estCivil",
        valorBaseCC: "—",
        valorFatura: fatEstCivil  || "—",
        valorPos:    estCivilPos  || "—",
        valorPdf:    "—",
        valorUsado:  estCivil || "—",
      }
    );

    // Parentesco
    if (!ehTitular) {
      const pFatura = normParentesco(fatParentesco);
      const pPos    = posEntry?.grau ? normParentesco(posEntry.grau) : null;
      const posLbl  = posEntry?.grau ? grauLabel(posEntry.grau, false) : null;

      if (pFatura !== null && pPos !== null && pFatura !== pPos) {
        addConflict(row.certifFull, "parentesco", {
          ...meta, campo: "parentesco",
          valorBaseCC: "—",
          valorFatura: fatParentesco || "—",
          valorPos:    posLbl        || "—",
          valorPdf:    "—",
          valorUsado:  row.parentesco,
        });
      } else if (!reportedGrau.has(row.certifFull)) {
        const temDep =
          (pFatura === null && fatParentesco && fatParentesco !== "") ||
          (pPos    === null && posEntry?.grau && posEntry.grau !== "");
        if (temDep) {
          reportedGrau.add(row.certifFull);
          grauIndefinido.push({
            sub:        row.sub,
            certifFull: row.certifFull,
            nome,
            parentesco: row.parentesco,
            faturaRaw:  fatParentesco,
            posRaw:     posLbl || "—",
          });
        }
      }
    }

    // Data Início
    const datInPos = posEntry?.dataInicio || null;
    detectConflict(row.certifFull, "dataInicio",
      [normData(fatDataInicio), normData(datInPos)],
      { ...meta, campo: "dataInicio",
        valorBaseCC: "—",
        valorFatura: fatDataInicio || "—",
        valorPos:    datInPos      || "—",
        valorPdf:    "—",
        valorUsado:  fatDataInicio || "—",
      }
    );

    // MOV
    const movPdf = movMap[movKey];
    if (movPdf && fatMov && movPdf !== fatMov && !reportedMov.has(movKey)) {
      reportedMov.add(movKey);
      conflicts.push({
        ...meta, campo: "tipoLancamento",
        valorBaseCC: "—",
        valorFatura: fatMov || "—",
        valorPos:    "—",
        valorPdf:    movPdf || "—",
        valorUsado:  tipoLancamento,
      });
    }

    return {
      sub:            row.sub,
      certifFull:     row.certifFull,
      certGrupo:      row.certGrupo,
      nome,                           // canônico: posição || fatura
      cpf,
      centroCusto,
      codigoCC,
      dataNascimento,
      sexo,
      estCivil,
      parentesco:     row.parentesco,
      plano:          row.plano,
      dataInicio:     row.dataInicio,
      tipoLancamento,
      lancamento:     row.lancamento,
      valor:          row.valor,
    };
  });

  // Erros bloqueantes: sexo, nascimento, nome-de-pessoa-diferente
  const blockingConflicts = conflicts.filter(c =>
    ["sexo", "dataNascimento", "nome"].includes(c.campo)
  );

  // sexoConflicts (retrocompatibilidade)
  const sexoConflicts = conflicts.filter(c => c.campo === "sexo");

  // ── Coverage ──────────────────────────────────────────────────
  const faturaTitMap = new Map();
  for (const r of benefRows) {
    if (r.complemento === "00" && !faturaTitMap.has(r.certif)) faturaTitMap.set(r.certif, r);
  }

  const titSoBaseCC = [], titSoFatura = [];
  certifEntries.forEach((entry, certGrupo) => {
    if (!faturaTitMap.has(certGrupo))
      titSoBaseCC.push({ certGrupo, nome: entry.nome || "", dataNascimento: entry.dataNascimento || "", centroCusto: entry.centroCusto || "", codigoCC: entry.codigoCC || "" });
  });
  faturaTitMap.forEach((r, certGrupo) => {
    if (!certifEntries.has(certGrupo))
      titSoFatura.push({ certGrupo, nome: r.nome || "", sub: r.sub || "" });
  });

  const faturaDepMap = new Map();
  for (const r of benefRows) {
    if (r.complemento !== "00") {
      const key = `${r.certif}_${r.complemento}`;
      if (!faturaDepMap.has(key)) faturaDepMap.set(key, r);
    }
  }

  const depSoPosicao = [], depSoFatura = [];
  dependentes.forEach((entry, key) => {
    if (!faturaDepMap.has(key)) {
      const [certif, codDep] = key.split("_");
      depSoPosicao.push({ certifFull: `${certif}/${codDep}`, certGrupo: certif, nome: entry.nome || "", dataNascimento: entry.dataNascimento || "" });
    }
  });
  faturaDepMap.forEach((r, key) => {
    if (!dependentes.has(key))
      depSoFatura.push({ certifFull: r.certifFull, certGrupo: r.certGrupo, nome: r.nome || "", sub: r.sub || "" });
  });

  const coverage = { titSoBaseCC, titSoFatura, depSoPosicao, depSoFatura };

  // ── Totais ────────────────────────────────────────────────────
  const certMap = {};
  for (const r of vidasRows) {
    const k = r.certGrupo;
    if (!certMap[k]) certMap[k] = { certif: r.certGrupo, sub: r.sub, total: 0 };
    certMap[k].total += r.valor ?? 0;
  }
  const totalCert = Object.values(certMap).sort((a, b) =>
    a.sub.localeCompare(b.sub) || a.certif.localeCompare(b.certif)
  );

  const ccMap = {};
  for (const r of vidasRows) {
    if (!r.centroCusto && !r.codigoCC) continue;
    const k = r.codigoCC || r.centroCusto;
    if (!ccMap[k]) ccMap[k] = { centroCusto: r.centroCusto, codigoCC: r.codigoCC, total: 0 };
    ccMap[k].total += r.valor ?? 0;
  }
  const totalCC = Object.values(ccMap).sort((a, b) =>
    (a.centroCusto || "").localeCompare(b.centroCusto || "")
  );

  return {
    vidasRows, summaryBlocks, totalCert, totalCC,
    sexoConflicts, conflicts, blockingConflicts,
    coverage, nomeGrafia, grauIndefinido,
  };
}

// ─────────────────────────────────────────────────────────────────
// 4b. APLICAR CORREÇÕES (escolhas do usuário no ReviewModal)
//
//  corrections: [{ certifFull, campo, valorEscolhido }]
//  - Aplica para TODAS as linhas com aquele certifFull (decisão A).
//  - Recalcula totalCert e totalCC.
//  - Não modifica result no state — chamado on-the-fly no export/save.
// ─────────────────────────────────────────────────────────────────
export function applyCorrections(result, corrections) {
  if (!corrections?.length) return result;

  // Map "certifFull|campo" → valorEscolhido
  const corrMap = new Map(
    corrections.map(c => [`${c.certifFull}|${c.campo}`, c.valorEscolhido])
  );
  if (corrMap.size === 0) return result;

  const CORRIGIBLE = ["sexo", "nome", "dataNascimento"];

  const vidasRows = result.vidasRows.map(r => {
    const patches = {};
    for (const campo of CORRIGIBLE) {
      const val = corrMap.get(`${r.certifFull}|${campo}`);
      if (val !== undefined) patches[campo] = val;
    }
    return Object.keys(patches).length ? { ...r, ...patches } : r;
  });

  const certMap = {};
  for (const r of vidasRows) {
    const k = r.certGrupo;
    if (!certMap[k]) certMap[k] = { certif: r.certGrupo, sub: r.sub, total: 0 };
    certMap[k].total += r.valor ?? 0;
  }
  const totalCert = Object.values(certMap).sort((a, b) =>
    a.sub.localeCompare(b.sub) || a.certif.localeCompare(b.certif)
  );

  const ccMap = {};
  for (const r of vidasRows) {
    if (!r.centroCusto && !r.codigoCC) continue;
    const k = r.codigoCC || r.centroCusto;
    if (!ccMap[k]) ccMap[k] = { centroCusto: r.centroCusto, codigoCC: r.codigoCC, total: 0 };
    ccMap[k].total += r.valor ?? 0;
  }
  const totalCC = Object.values(ccMap).sort((a, b) =>
    (a.centroCusto || "").localeCompare(b.centroCusto || "")
  );

  return { ...result, vidasRows, totalCert, totalCC };
}

// ─────────────────────────────────────────────────────────────────
// 5. PRÉ-SCAN
// ─────────────────────────────────────────────────────────────────
export async function prescanSubNames(file) {
  const wb = await readWb(file);
  let sheetName = wb.SheetNames[0];
  for (const name of wb.SheetNames) {
    const r = getRows(wb.Sheets[name]);
    if (r.some(row => String(row[0]).trim() === "3")) { sheetName = name; break; }
  }
  const rows = getRows(wb.Sheets[sheetName]);
  const map = {};
  for (const row of rows) {
    if (String(row[0]).trim() !== "2") continue;
    const sub = normSub(String(row[2] ?? "").trim());
    if (!sub || isSubTotal(sub)) continue;
    if (!map[sub]) map[sub] = String(row[3] ?? "").trim();
  }
  return map;
}

// ─────────────────────────────────────────────────────────────────
// 6. APLICAR AGRUPAMENTO
// ─────────────────────────────────────────────────────────────────
export function applySubGroups(result, subGroupMap) {
  if (!subGroupMap || Object.keys(subGroupMap).length === 0) return result;

  const remap = (sub) => {
    if (!(sub in subGroupMap)) return sub;
    const t = subGroupMap[sub];
    return t === "" ? null : t;
  };

  const vidasRows = result.vidasRows
    .map(r => { const ns = remap(r.sub); return ns === null ? null : { ...r, sub: ns }; })
    .filter(Boolean)
    .sort((a, b) => a.sub.localeCompare(b.sub));

  const sbMap = {};
  for (const block of result.summaryBlocks) {
    const ns = remap(block.sub);
    if (ns === null) continue;
    if (!sbMap[ns]) sbMap[ns] = { sub: ns, rows: [], tsTotal: null, tsParte: null };
    sbMap[ns].rows.push(...block.rows);
    if (block.tsTotal != null) sbMap[ns].tsTotal = (sbMap[ns].tsTotal ?? 0) + block.tsTotal;
    if (block.tsParte != null) sbMap[ns].tsParte = (sbMap[ns].tsParte ?? 0) + block.tsParte;
  }
  const summaryBlocks = Object.values(sbMap);

  const certMap = {};
  for (const r of vidasRows) {
    if (!certMap[r.certGrupo]) certMap[r.certGrupo] = { certif: r.certGrupo, sub: r.sub, total: 0 };
    certMap[r.certGrupo].total += r.valor ?? 0;
  }
  const totalCert = Object.values(certMap).sort((a, b) =>
    a.sub.localeCompare(b.sub) || a.certif.localeCompare(b.certif)
  );

  const ccMap = {};
  for (const r of vidasRows) {
    if (!r.centroCusto && !r.codigoCC) continue;
    const k = r.codigoCC || r.centroCusto;
    if (!ccMap[k]) ccMap[k] = { centroCusto: r.centroCusto, codigoCC: r.codigoCC, total: 0 };
    ccMap[k].total += r.valor ?? 0;
  }
  const totalCC = Object.values(ccMap).sort((a, b) =>
    (a.centroCusto || "").localeCompare(b.centroCusto || "")
  );

  const remapArr = (arr) =>
    (arr ?? []).map(c => { const ns = remap(c.sub); return ns === null ? null : { ...c, sub: ns }; }).filter(Boolean);

  const conflicts        = remapArr(result.conflicts);
  const nomeGrafia       = remapArr(result.nomeGrafia);
  const grauIndefinido   = remapArr(result.grauIndefinido);
  const blockingConflicts = conflicts.filter(c => ["sexo","dataNascimento","nome"].includes(c.campo));
  const sexoConflicts    = conflicts.filter(c => c.campo === "sexo");

  const src = result.coverage ?? { titSoBaseCC:[], titSoFatura:[], depSoPosicao:[], depSoFatura:[] };
  const coverage = {
    titSoBaseCC:  src.titSoBaseCC,
    titSoFatura:  src.titSoFatura.map(c => { const ns = remap(c.sub); return ns === null ? null : { ...c, sub: ns }; }).filter(Boolean),
    depSoPosicao: src.depSoPosicao,
    depSoFatura:  src.depSoFatura.map(c => { const ns = remap(c.sub); return ns === null ? null : { ...c, sub: ns }; }).filter(Boolean),
  };

  return {
    vidasRows, summaryBlocks, totalCert, totalCC,
    sexoConflicts, conflicts, blockingConflicts,
    coverage, nomeGrafia, grauIndefinido,
  };
}

// ─────────────────────────────────────────────────────────────────
// HELPERS DE UI
// ─────────────────────────────────────────────────────────────────

export function groupBySub(rows) {
  const groups = [];
  let cur = null;
  for (const row of rows) {
    if (!cur || cur.sub !== row.sub) { cur = { sub: row.sub, rows: [], subtotal: 0 }; groups.push(cur); }
    cur.rows.push(row);
    cur.subtotal += row.valor ?? 0;
  }
  return groups;
}

export const grandTotal = (rows) => rows.reduce((acc, r) => acc + (r.valor ?? 0), 0);
