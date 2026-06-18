// src/pages/BillingOrganization/utils/parsePdfFaturas.js
// Lê os PDFs de fatura da Bradesco e extrai:
//  - Quais subfaturas estão dentro de cada fatura consolidada
//  - O total de cada subfatura (linha "TOTAIS DA SUBFATURA")
// Usado para montar o agrupamento automaticamente e validar os totais calculados.

import { pdfjs } from 'react-pdf';
// Importa o worker como asset estático via Vite (não depende de CDN / evita o fallback para URL relativa)
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Sempre define — react-pdf define um valor padrão relativo ("pdf.worker.js") que seria
// resolvido contra a URL da página (ex: /beneficios/pdf.worker.js → 404).
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────

/** Converte "14.755,04" → 14755.04 */
function parseBRL(str) {
  if (!str) return 0;
  const n = parseFloat(str.replace(/\./g, '').replace(',', '.'));
  return isNaN(n) ? 0 : n;
}

/** Extrai o número consolidado do nome do arquivo.
 *  "FATURA DENTAL SUB 002.pdf" → "002"
 *  "FATURA DENTAL SUB 120.pdf" → "120"
 */
function consolidadoDoNome(filename) {
  const m = filename.match(/SUB\s+0*(\d+)/i);
  if (!m) return null;
  return String(parseInt(m[1], 10)).padStart(3, '0');
}

/**
 * Lê todas as páginas de um PDF e retorna:
 *   texto:  texto concatenado por página (para parsearTextoPdf)
 *   items:  todos os itens com posição (x, y, page) (para buildMovMapFromItems)
 */
async function extrairPdfData(file) {
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const paginas  = [];
  const allItems = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const pg      = await pdf.getPage(i);
    const content = await pg.getTextContent();
    paginas.push(content.items.map(item => item.str).join(' '));
    for (const item of content.items) {
      if (!item.str || !item.str.trim()) continue;
      allItems.push({
        str:  item.str.trim(),
        x:    item.transform[4],   // posição horizontal
        y:    item.transform[5],   // posição vertical (0 = rodapé, cresce para cima)
        page: i,
      });
    }
  }

  return { texto: paginas.join('\n'), items: allItems };
}

// ─────────────────────────────────────────────────
// MOV MAP
// ─────────────────────────────────────────────────

/**
 * A partir dos items com posição do PDF, monta um mapa:
 *   { "0005525/00|05/2026": "TR", "0008834/00|05/2026": "CM", ... }
 *
 * Estratégia:
 *   1. Ordena por página ↑, y ↓ (PDF conta do rodapé), x ↑
 *   2. Agrupa items em linhas (mesma página, diferença de y ≤ tolerância ~3px)
 *   3. Para cada linha, procura padrões de:
 *      • Certificado/complemento: \d{4,7} / \d{2}  (com ou sem espaços ao redor do /)
 *      • MOV: TR | TM | CM | CR | IM | IR | RM | RR | AM | AR
 *      • Lançamento: MM/YYYY  (ex: "05/2026")
 *   4. Se os 3 estão presentes, adiciona ao mapa.
 */
function buildMovMapFromItems(items) {
  if (!items.length) return {};

  // ── 1. Ordena: página ↑, y ↓, x ↑ ──────────────────────────────
  const sorted = [...items].sort((a, b) => {
    if (a.page !== b.page)          return a.page - b.page;
    if (Math.abs(b.y - a.y) > 0.5) return b.y - a.y;   // y maior = mais para cima
    return a.x - b.x;
  });

  // ── 2. Agrupa em linhas ──────────────────────────────────────────
  const Y_TOL = 3; // tolerância de 3 unidades PDF (~1pt)
  const lines = [];
  let cur = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const item = sorted[i];
    if (item.page !== prev.page || Math.abs(item.y - prev.y) > Y_TOL) {
      lines.push(cur);
      cur = [item];
    } else {
      cur.push(item);
    }
  }
  lines.push(cur);

  // ── 3. Padrões ───────────────────────────────────────────────────
  // Certificado: 4–7 dígitos, separador (/ com espaços opcionais ou apenas espaço), 2 dígitos
  const reCert = /\b(\d{4,7})\s*(?:\/\s*|\s+)(\d{2})\b/;
  // MOV: 2 letras — tipos Bradesco conhecidos
  const reMov  = /\b(TR|TM|CM|CR|IM|IR|RM|RR|AM|AR)\b/;
  // Lançamento: MM/YYYY
  const reLanc = /\b(\d{2}\/\d{4})\b/;

  // ── 4. Extrai e monta o mapa ─────────────────────────────────────
  const movMap = {};

  for (const line of lines) {
    // Junta itens em ordem crescente de x (esquerda → direita)
    const text = line.sort((a, b) => a.x - b.x).map(it => it.str).join(' ');

    const certM = reCert.exec(text);
    const movM  = reMov.exec(text);
    const lancM = reLanc.exec(text);

    if (!certM || !movM || !lancM) continue;

    const certif     = certM[1].padStart(7, '0');
    const compl      = certM[2].padStart(2, '0');
    const certifFull = `${certif}/${compl}`;
    const key        = `${certifFull}|${lancM[1]}`;

    // Primeira ocorrência vence (mais próxima do início da página)
    if (!(key in movMap)) {
      movMap[key] = movM[1];
    }
  }

  return movMap;
}

// ─────────────────────────────────────────────────
// PARSER PRINCIPAL
// ─────────────────────────────────────────────────

/**
 * Faz o parse do texto do PDF e retorna:
 *   membros:     [{ sub:"002", name:"PETRO RIO...", total:588.31 }, ...]
 *   sub999Total: total líquido do contrato (Subfatura 999 = TOTAIS DA SUBFATURA do contrato inteiro)
 *
 * Formato Bradesco:
 *   Header:  "Subfatura N - COMPANY NAME 878 ..."
 *   Total:   "TOTAIS DA SUBFATURA  0008 0004 0012 0013 588,31 0,00"
 *   Sub 999: "Subfatura 999 - TOTAL DO CONTRATO ..." → guarda o total líquido para validação
 *
 * ATENÇÃO — Códigos de plano (A704, A706) no texto do PDF:
 *   Esses códigos indicam de qual sub o funcionário TRANSFERIU, não que a sub
 *   pertence a este contrato. Subs 704/706 têm movimentos de devolução/cobrança
 *   separados que NÃO fazem parte do contrato deste PDF. Não usar para mapeamento.
 *
 * Apenas subfaturas com cabeçalho explícito "Subfatura N - ..." são membros válidos.
 * O total certo a bater é sempre o TOTAL DO CONTRATO (sub 999) deste PDF.
 */
function parsearTextoPdf(texto) {
  // Regex para cabeçalho de subfatura (incluindo 999)
  const reHeader = /Subfatura\s+(\d+)\s+-\s+(.+?)\s+878/g;
  // Regex para linha de total (4 qtds inteiras + valor BRL + 0,00)
  const reTotal  = /TOTAIS\s+DA\s+SUBFATURA\s+\d+\s+\d+\s+\d+\s+\d+\s+([\d.,]+)\s+0,00/g;

  let m;

  // ── Cabeçalhos: separa sub 999 dos demais ──────────────────────
  const headers   = [];  // subfaturas com cabeçalho explícito (exceto 999)
  let header999   = null;
  while ((m = reHeader.exec(texto)) !== null) {
    const num = parseInt(m[1], 10);
    if (num === 999) {
      header999 = { pos: m.index };
    } else {
      headers.push({ sub: String(num).padStart(3, '0'), name: m[2].trim(), pos: m.index });
    }
  }

  // ── Totais ──────────────────────────────────────────────────────
  const totais = [];
  while ((m = reTotal.exec(texto)) !== null) {
    totais.push({ value: parseBRL(m[1]), pos: m.index });
  }

  // ── Total do contrato (sub 999) ─────────────────────────────────
  // TOTAIS DA SUBFATURA 999 = total líquido do contrato (cobrar − devolver).
  // É o número que deve bater com a soma dos TS rows das subs mapeadas no XLS.
  let sub999Total = null;
  if (header999) {
    const cands = totais.filter(t => t.pos > header999.pos);
    if (cands.length > 0) sub999Total = cands[cands.length - 1].value;
  }

  // ── Total de cada subfatura com cabeçalho explícito ─────────────
  const limPos = (i) =>
    headers[i + 1]?.pos ?? header999?.pos ?? Infinity;

  const membros = headers.map((h, i) => {
    const cands = totais.filter(t => t.pos > h.pos && t.pos < limPos(i));
    const total = cands.length > 0 ? cands[cands.length - 1].value : null;
    return { sub: h.sub, name: h.name, total };
  });

  return { membros, sub999Total };
}

// ─────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────

/**
 * Recebe um array de File (PDFs), faz o parse de cada um e retorna:
 * {
 *   "002": {
 *     filename: "FATURA DENTAL SUB 002.pdf",
 *     consolidado: "002",
 *     membros: [{ sub:"002", name:"PETRO...", total:588.31 }, { sub:"210", name:"PRIO S.A", total:24.87 }],
 *     totalPdf: 613.18
 *   },
 *   ...
 * }
 */
export async function parsePdfFaturas(files) {
  const resultado = {};

  for (const file of Array.from(files)) {
    const consolidado = consolidadoDoNome(file.name);
    if (!consolidado) {
      console.warn(`[PDF] Não identificou sub no nome: ${file.name}`);
      continue;
    }

    try {
      const { texto, items } = await extrairPdfData(file);
      const { membros, sub999Total } = parsearTextoPdf(texto);
      const movMap = buildMovMapFromItems(items);

      // Usa o total do contrato (sub 999) se disponível — inclui subs implícitas (704/706)
      // Fallback: soma dos totais individuais das subfaturas explícitas
      const totalPdf = sub999Total
        ?? membros.reduce((acc, mb) => acc + (mb.total ?? 0), 0);

      resultado[consolidado] = {
        filename: file.name,
        consolidado,
        membros,
        totalPdf,
        sub999Total,  // guardado para debug/informação
        movMap,       // { "certifFull|lancamento": "MOV" } ex: "0005525/00|05/2026": "TR"
      };
    } catch (err) {
      console.error(`[PDF] Erro ao processar ${file.name}:`, err);
    }
  }

  return resultado;
}

/**
 * Constrói o subGroupMap a partir dos dados dos PDFs.
 *
 * Mapeamento:
 *   - Subfaturas com cabeçalho explícito no PDF ("Subfatura N - ...") → consolidado desse PDF
 *   - Subs NÃO presentes em nenhum PDF → excluídas (valor = "")
 *     Ex.: 704, 706 (transferências/devoluções separadas), 601–607 (outra empresa)
 *
 * Regra de ouro: o total calculado deve bater com o TOTAL DO CONTRATO (sub 999) do PDF.
 *
 * subNames: { "001": "PRIO S.A", "120": "PRIO FORTE S.A", ... }  (do prescan)
 * pdfData:  resultado de parsePdfFaturas
 *
 * Retorna: { "205": "120", "210": "002", "704": "", "706": "", "601": "", ... }
 */
export function buildGroupMapFromPdfs(pdfData, subNames) {
  // Padrão: excluir tudo
  const mapa = {};
  for (const sub of Object.keys(subNames)) {
    mapa[sub] = '';
  }

  // Mapeia cada membro ao seu sub consolidado
  for (const data of Object.values(pdfData)) {
    for (const membro of data.membros) {
      if (membro.sub in mapa) {
        mapa[membro.sub] = data.consolidado;
      }
    }
  }

  return mapa;
}
