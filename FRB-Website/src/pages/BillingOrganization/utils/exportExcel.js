// src/pages/BillingOrganization/utils/exportExcel.js
// Exportação profissional para Excel usando ExcelJS
// Abas: Vidas | Total por Sub | Total por Certificado | Total por CC | Bate-conferência | Cobertura

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { groupBySub, grandTotal as calcGrand } from "./sheetParser";

// ─────────────────────────────────────────────────
// PALETA DE CORES
// ─────────────────────────────────────────────────
const C = {
  headerBg:    "FF0D2744",
  headerFg:    "FFFFFFFF",
  subHeaderBg: "FF04ADE0",
  subHeaderFg: "FFFFFFFF",
  subtotalBg:  "FF0A3A6A",
  subtotalFg:  "FF04ADE0",
  totalBg:     "FF04ADE0",
  totalFg:     "FFFFFFFF",
  evenRow:     "FFF0F7FC",
  oddRow:      "FFFFFFFF",
  valor:       "FF0D6E2C",
  credito:     "FFF97316",
  border:      "FFAED6F1",
  // bate-conferência
  adoptedBg:   "FFD6F5FD",  // ciano claro — valor adotado
  adoptedFg:   "FF04ADE0",
  conflictBg:  "FFFFE4CE",  // laranja claro — divergência
  conflictFg:  "FFF97316",
  absentFg:    "FFAAAAAA",  // cinza — ausente ("—")
  // cobertura
  coverOnlyCC:   "FFFFF3CD", // amarelo suave — só na saúde
  coverOnlyDent: "FFCCE5FF", // azul suave — só no dental
};

const MOV_COLORS = {
  TR: { bg: "FFD6F5FD", fg: "FF04ADE0" },
  TM: { bg: "FFD6F5FD", fg: "FF04ADE0" },
  CM: { bg: "FFFFE4CE", fg: "FFF97316" },
  CR: { bg: "FFFFE4CE", fg: "FFF97316" },
  RM: { bg: "FFD1FAE5", fg: "FF059669" },
  RR: { bg: "FFD1FAE5", fg: "FF059669" },
  AM: { bg: "FFFEF9C3", fg: "FFB45309" },
  AR: { bg: "FFFEF9C3", fg: "FFB45309" },
  IM: { bg: "FFEDE9FE", fg: "FF7C3AED" },
  IR: { bg: "FFEDE9FE", fg: "FF7C3AED" },
};

const fmtCurrency = "#,##0.00";

// ─────────────────────────────────────────────────
// HELPERS DE ESTILO
// ─────────────────────────────────────────────────
const headerStyle = (bgArgb, fgArgb = C.headerFg) => ({
  font:      { bold: true, color: { argb: fgArgb }, size: 10 },
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } },
  alignment: { vertical: "middle", horizontal: "center", wrapText: true },
  border:    { bottom: { style: "medium", color: { argb: C.border } } },
});

const totalStyle = (bgArgb, fgArgb) => ({
  font:      { bold: true, color: { argb: fgArgb }, size: 10 },
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } },
  alignment: { vertical: "middle", horizontal: "center" },
});

const cellStyle = (even, isValor = false) => ({
  font:      { color: { argb: isValor ? C.valor : "FF1A1A2E" }, size: 9 },
  fill:      { type: "pattern", pattern: "solid", fgColor: { argb: even ? C.evenRow : C.oddRow } },
  alignment: { vertical: "middle", horizontal: isValor ? "right" : "left" },
  border:    { bottom: { style: "thin", color: { argb: "FFD0E8F5" } } },
});

const setColWidths = (ws, widths) => {
  widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
};

const addBandRow = (ws, text, bgArgb, fgArgb, totalCols, opts = {}) => {
  const { height = 20, valueCol = null, value = null, fontSize = 10 } = opts;
  const rowData = Array(totalCols).fill("");
  rowData[0] = text;
  if (valueCol !== null && value !== null) rowData[valueCol - 1] = value;
  const row = ws.addRow(rowData);
  row.height = height;
  row.eachCell({ includeEmpty: true }, cell => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } };
    cell.font = { bold: true, color: { argb: fgArgb }, size: fontSize };
  });
  const mergeEnd = valueCol !== null ? valueCol - 1 : totalCols;
  if (mergeEnd > 1) ws.mergeCells(row.number, 1, row.number, mergeEnd);
  row.getCell(1).style = {
    font:      { bold: true, color: { argb: fgArgb }, size: fontSize },
    fill:      { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } },
    alignment: { vertical: "middle", horizontal: "left", wrapText: false, indent: 1 },
  };
  if (valueCol !== null && value !== null) {
    row.getCell(valueCol).style = {
      font:      { bold: true, color: { argb: fgArgb }, size: fontSize },
      fill:      { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } },
      alignment: { vertical: "middle", horizontal: "right" },
      numFmt:    fmtCurrency,
    };
  }
  return row;
};

const addStyledRow = (ws, values, even, valorIdx = []) => {
  const row = ws.addRow(values);
  row.height = 16;
  values.forEach((_, i) => {
    const cell = row.getCell(i + 1);
    const isV  = valorIdx.includes(i);
    cell.style = cellStyle(even, isV);
    if (isV && typeof values[i] === "number") cell.numFmt = fmtCurrency;
  });
  return row;
};

// ─────────────────────────────────────────────────
// ABA 1 — VIDAS
// ─────────────────────────────────────────────────
function buildVidasSheet(wb, { vidasRows }) {
  const ws = wb.addWorksheet("Vidas", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: "FF04ADE0" } },
  });

  const COLS = [
    { h: "Sub",                  w: 7  },
    { h: "Certif.",              w: 12 },
    { h: "Cert Grupo",           w: 10 },
    { h: "Nome do Beneficiário", w: 36 },
    { h: "CPF",                  w: 14 },
    { h: "Centro de Custo",      w: 26 },
    { h: "Código CC",            w: 14 },
    { h: "Nasc.",                w: 12 },
    { h: "Sexo",                 w: 7  },
    { h: "Est.Civil",            w: 9  },
    { h: "Parentesco",           w: 11 },
    { h: "Plano",                w: 8  },
    { h: "Início",               w: 12 },
    { h: "MOV",                  w: 7  },
    { h: "Lançamento",           w: 11 },
    { h: "Valor (R$)",           w: 13 },
  ];
  const VALOR_COL = 16;
  setColWidths(ws, COLS.map(c => c.w));

  const hdrRow = ws.addRow(COLS.map(c => c.h));
  hdrRow.height = 22;
  hdrRow.eachCell(cell => { cell.style = headerStyle(C.headerBg); });

  const groups = groupBySub(vidasRows);
  let even = true;

  for (const group of groups) {
    addBandRow(ws, `SUBFATURA: ${group.sub}`, C.subHeaderBg, C.subHeaderFg, COLS.length, { height: 20, fontSize: 11 });

    for (const r of group.rows) {
      const valorNum  = typeof r.valor === "number" ? r.valor : "";
      const isCredito = typeof valorNum === "number" && valorNum < 0;

      const row = ws.addRow([
        r.sub, r.certifFull, r.certGrupo, r.nome, r.cpf,
        r.centroCusto, r.codigoCC,
        r.dataNascimento, r.sexo, r.estCivil, r.parentesco,
        r.plano, r.dataInicio,
        r.tipoLancamento || "",
        r.lancamento,
        valorNum,
      ]);
      row.height = 16;

      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        const isV = colNum === VALOR_COL;
        cell.style = cellStyle(even, isV);
        if (isV && typeof valorNum === "number") {
          cell.numFmt = fmtCurrency;
          cell.font = { ...cell.font, color: { argb: isCredito ? C.credito : C.valor } };
        }
      });

      const movCell   = row.getCell(14);
      const movColors = MOV_COLORS[r.tipoLancamento];
      if (movColors && r.tipoLancamento) {
        movCell.style = {
          ...movCell.style,
          font:      { bold: true, size: 9, color: { argb: movColors.fg } },
          fill:      { type: "pattern", pattern: "solid", fgColor: { argb: movColors.bg } },
          alignment: { vertical: "middle", horizontal: "center" },
        };
      }
      even = !even;
    }

    addBandRow(ws, `Subtotal Sub ${group.sub}`, C.subtotalBg, C.subtotalFg, COLS.length, {
      height: 18, valueCol: COLS.length, value: group.subtotal,
    });
    ws.addRow([]);
  }

  const total = calcGrand(vidasRows);
  addBandRow(ws, "TOTAL GERAL", C.totalBg, C.totalFg, COLS.length, {
    height: 22, valueCol: COLS.length, value: total, fontSize: 11,
  });
}

// ─────────────────────────────────────────────────
// ABA 2 — TOTAL POR SUB
// ─────────────────────────────────────────────────
function buildDetalhesSheet(wb, { summaryBlocks }) {
  const ws = wb.addWorksheet("Total por Sub", {
    properties: { tabColor: { argb: "FF0A3A6A" } },
  });

  const COLS = [
    { h: "Subfatura",            w: 12 },
    { h: "Tipo de Lançamento",   w: 36 },
    { h: "Titulares (Qtd)",      w: 14 },
    { h: "Dependentes (Qtd)",    w: 16 },
    { h: "Segurados (Qtd)",      w: 14 },
    { h: "Lançamentos (Qtd)",    w: 16 },
    { h: "Total (R$)",           w: 14 },
    { h: "Parte Segurado (R$)",  w: 18 },
  ];
  setColWidths(ws, COLS.map(c => c.w));

  const hdrRow = ws.addRow(COLS.map(c => c.h));
  hdrRow.height = 22;
  hdrRow.eachCell(cell => { cell.style = headerStyle(C.headerBg); });

  if (!summaryBlocks || summaryBlocks.length === 0) {
    ws.addRow(["Nenhum bloco de resumo encontrado na Fatura Técnica"]);
    return;
  }

  let grandTotalValor = 0;
  let even = true;

  for (const block of summaryBlocks) {
    addBandRow(ws, `SUBFATURA: ${block.sub}`, C.subHeaderBg, C.subHeaderFg, COLS.length, { height: 20, fontSize: 11 });
    even = true;

    for (const r of (block.rows || [])) {
      addStyledRow(ws,
        [block.sub, r.tipoLanc,
         r.qtdTit ?? "", r.qtdDep ?? "", r.qtdSeg ?? "", r.qtdLanc ?? "",
         typeof r.vlrTotal === "number" ? r.vlrTotal : "",
         typeof r.vlrParte === "number" ? r.vlrParte : ""],
        even, [6, 7]);
      even = !even;
    }

    const tsVal = typeof block.tsTotal === "number" ? block.tsTotal : null;
    addBandRow(ws, `Totais da Subfatura ${block.sub}`, C.subtotalBg, C.subtotalFg, COLS.length, {
      height: 18, valueCol: tsVal !== null ? 7 : null, value: tsVal,
    });
    if (tsVal !== null) grandTotalValor += tsVal;
    ws.addRow([]);
  }

  addBandRow(ws, "TOTAL GERAL", C.totalBg, C.totalFg, COLS.length, {
    height: 22, valueCol: 7, value: grandTotalValor, fontSize: 11,
  });
}

// ─────────────────────────────────────────────────
// ABA 3 — TOTAL POR CERTIFICADO
// ─────────────────────────────────────────────────
function buildTotalCertSheet(wb, { totalCert }) {
  const ws = wb.addWorksheet("Total por Certificado", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: "FF1A7A3C" } },
  });
  setColWidths(ws, [10, 12, 16]);

  const hdrRow = ws.addRow(["Subfatura", "Certificado", "Total (R$)"]);
  hdrRow.height = 22;
  hdrRow.eachCell(cell => { cell.style = headerStyle(C.headerBg); });

  let grand = 0, even = true;
  for (const r of totalCert) {
    const row = ws.addRow([r.sub, r.certif, r.total]);
    row.height = 16;
    row.eachCell((cell, colNum) => {
      cell.style = cellStyle(even, colNum === 3);
      if (colNum === 3) cell.numFmt = fmtCurrency;
    });
    grand += r.total;
    even = !even;
  }

  const gtRow = ws.addRow(["", "TOTAL GERAL", grand]);
  gtRow.height = 22;
  gtRow.eachCell(c => { c.style = totalStyle(C.totalBg, C.totalFg); });
  gtRow.getCell(3).numFmt = fmtCurrency;
}

// ─────────────────────────────────────────────────
// ABA 4 — TOTAL POR CC
// ─────────────────────────────────────────────────
function buildTotalCCSheet(wb, { totalCC }) {
  const ws = wb.addWorksheet("Total por Centro de Custo", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: "FFAD6704" } },
  });
  setColWidths(ws, [30, 14, 16]);

  const hdrRow = ws.addRow(["Centro de Custo", "Código CC", "Total (R$)"]);
  hdrRow.height = 22;
  hdrRow.eachCell(cell => { cell.style = headerStyle(C.headerBg); });

  let grand = 0, even = true;
  for (const r of totalCC) {
    const row = ws.addRow([r.centroCusto, r.codigoCC, r.total]);
    row.height = 16;
    row.eachCell((cell, colNum) => {
      cell.style = cellStyle(even, colNum === 3);
      if (colNum === 3) cell.numFmt = fmtCurrency;
    });
    grand += r.total;
    even = !even;
  }

  const gtRow = ws.addRow(["TOTAL GERAL", "", grand]);
  gtRow.height = 22;
  gtRow.eachCell(c => { c.style = totalStyle(C.totalBg, C.totalFg); });
  gtRow.getCell(3).numFmt = fmtCurrency;
}

// ─────────────────────────────────────────────────
// ABA 5 — BATE-CONFERÊNCIA
// ─────────────────────────────────────────────────
function buildBateConferenciaSheet(wb, { conflicts = [], grauIndefinido = [] }) {
  const ws = wb.addWorksheet("Bate-conferência", {
    views: [{ state: "frozen", ySplit: 1 }],
    properties: { tabColor: { argb: "FFF97316" } },
  });

  const COLS = [
    { h: "Sub",             w: 7  },
    { h: "Certif.",         w: 12 },
    { h: "Nome",            w: 34 },
    { h: "Parentesco",      w: 11 },
    { h: "Campo",           w: 14 },
    { h: "Base CC",         w: 18 },
    { h: "Fat. Técnica",    w: 18 },
    { h: "Pos. Cadastral",  w: 18 },
    { h: "PDF",             w: 12 },
    { h: "Valor Adotado",   w: 18 },
  ];
  setColWidths(ws, COLS.map(c => c.w));

  const hdrRow = ws.addRow(COLS.map(c => c.h));
  hdrRow.height = 22;
  hdrRow.eachCell(cell => { cell.style = headerStyle(C.headerBg); });

  const CAMPO_LABELS = {
    sexo: "Sexo", nome: "Nome", cpf: "CPF",
    dataNascimento: "Nascimento", estCivil: "Est.Civil",
    parentesco: "Parentesco", dataInicio: "Data Início",
    tipoLancamento: "MOV",
  };

  let even = true;
  for (const c of conflicts) {
    const values = [
      c.sub, c.certifFull, c.nome, c.parentesco,
      CAMPO_LABELS[c.campo] || c.campo,
      c.valorBaseCC, c.valorFatura, c.valorPos, c.valorPdf,
      c.valorUsado,
    ];
    const row = ws.addRow(values);
    row.height = 16;

    row.eachCell({ includeEmpty: true }, (cell, colNum) => {
      cell.style = cellStyle(even);
    });

    // Colunas de fonte (6–9): laranja se diverge, cinza se ausente
    [5, 6, 7, 8].forEach(colNum => {
      const cell = row.getCell(colNum + 1);
      const val  = values[colNum];
      if (!val || val === "—") {
        cell.font = { ...cell.font, color: { argb: C.absentFg } };
      } else if (val !== c.valorUsado) {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.conflictBg } };
        cell.font = { bold: true, size: 9, color: { argb: C.conflictFg } };
      }
    });

    // Coluna "Valor Adotado" (col 10): ciano
    const adoptedCell = row.getCell(10);
    adoptedCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: C.adoptedBg } };
    adoptedCell.font = { bold: true, size: 9, color: { argb: C.adoptedFg } };

    even = !even;
  }

  if (conflicts.length === 0) {
    const emptyRow = ws.addRow(["Nenhuma divergência encontrada."]);
    emptyRow.getCell(1).font = { italic: true, color: { argb: C.absentFg } };
  }

  // Seção de grau indefinido
  if (grauIndefinido.length > 0) {
    ws.addRow([]);
    const titleRow = ws.addRow([`GRAU DE PARENTESCO INDEFINIDO (${grauIndefinido.length} registro(s) — qualidade de dado)`]);
    titleRow.height = 20;
    ws.mergeCells(titleRow.number, 1, titleRow.number, COLS.length);
    titleRow.getCell(1).style = {
      font:      { bold: true, color: { argb: "FFB45309" }, size: 10 },
      fill:      { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEF9C3" } },
      alignment: { vertical: "middle", horizontal: "left", indent: 1 },
    };

    const subHdr = ws.addRow(["Sub", "Certif.", "Nome", "Parentesco Final", "Fatura (raw)", "Posição (raw)", "", "", "", ""]);
    subHdr.height = 18;
    subHdr.eachCell((cell, ci) => {
      if (ci <= 6) cell.style = headerStyle("FF0D2744");
    });

    let gEven = true;
    for (const g of grauIndefinido) {
      const gRow = ws.addRow([g.sub, g.certifFull, g.nome, g.parentesco, g.faturaRaw, g.posRaw]);
      gRow.height = 15;
      gRow.eachCell({ includeEmpty: true }, cell => { cell.style = cellStyle(gEven); });
      gEven = !gEven;
    }
  }
}

// ─────────────────────────────────────────────────
// ABA 6 — COBERTURA
// ─────────────────────────────────────────────────
function buildCoberturaSheet(wb, { coverage = {} }) {
  const ws = wb.addWorksheet("Cobertura", {
    properties: { tabColor: { argb: "FF1A7A3C" } },
  });

  const { titSoBaseCC = [], titSoFatura = [], depSoPosicao = [], depSoFatura = [] } = coverage;

  setColWidths(ws, [12, 34, 14, 26, 14]);

  const addSectionTitle = (label, count, bgArgb) => {
    const row = ws.addRow([`${label} (${count})`]);
    row.height = 22;
    ws.mergeCells(row.number, 1, row.number, 5);
    row.getCell(1).style = {
      font:      { bold: true, color: { argb: "FF1A1A2E" }, size: 11 },
      fill:      { type: "pattern", pattern: "solid", fgColor: { argb: bgArgb } },
      alignment: { vertical: "middle", horizontal: "left", indent: 1 },
    };
  };

  // ── Titulares só na Base CC (saúde, não dental)
  addSectionTitle("Titulares só na Saúde (Base CC) — não estão no dental", titSoBaseCC.length, "FFFFFF3C");
  const hdr1 = ws.addRow(["Certificado", "Nome", "Nascimento", "Centro de Custo", "Código CC"]);
  hdr1.height = 18;
  hdr1.eachCell(cell => { cell.style = headerStyle(C.headerBg); });
  let even = true;
  for (const r of titSoBaseCC) {
    const row = ws.addRow([r.certGrupo, r.nome, r.dataNascimento, r.centroCusto, r.codigoCC]);
    row.height = 15;
    row.eachCell({ includeEmpty: true }, cell => { cell.style = cellStyle(even); });
    even = !even;
  }
  if (!titSoBaseCC.length) {
    ws.addRow(["(nenhum)"]).getCell(1).font = { italic: true, color: { argb: C.absentFg } };
  }

  ws.addRow([]);

  // ── Titulares só no dental (dental, não saúde)
  addSectionTitle("Titulares só no Dental — sem Centro de Custo na Base CC", titSoFatura.length, "FFCCE5FF");
  const hdr2 = ws.addRow(["Certificado", "Nome", "Sub", "", ""]);
  hdr2.height = 18;
  hdr2.eachCell(cell => { cell.style = headerStyle(C.headerBg); });
  even = true;
  for (const r of titSoFatura) {
    const row = ws.addRow([r.certGrupo, r.nome, r.sub]);
    row.height = 15;
    row.eachCell({ includeEmpty: true }, cell => { cell.style = cellStyle(even); });
    even = !even;
  }
  if (!titSoFatura.length) {
    ws.addRow(["(nenhum)"]).getCell(1).font = { italic: true, color: { argb: C.absentFg } };
  }

  ws.addRow([]);

  // ── Dependentes só na Posição Cadastral
  addSectionTitle("Dependentes só na Posição Cadastral — não estão na Fatura", depSoPosicao.length, "FFFFFF3C");
  const hdr3 = ws.addRow(["Certif. Completo", "Certificado", "Nome", "Nascimento", ""]);
  hdr3.height = 18;
  hdr3.eachCell(cell => { cell.style = headerStyle(C.headerBg); });
  even = true;
  for (const r of depSoPosicao) {
    const row = ws.addRow([r.certifFull, r.certGrupo, r.nome, r.dataNascimento]);
    row.height = 15;
    row.eachCell({ includeEmpty: true }, cell => { cell.style = cellStyle(even); });
    even = !even;
  }
  if (!depSoPosicao.length) {
    ws.addRow(["(nenhum)"]).getCell(1).font = { italic: true, color: { argb: C.absentFg } };
  }

  ws.addRow([]);

  // ── Dependentes só na Fatura
  addSectionTitle("Dependentes só na Fatura — sem cadastro na Posição Cadastral", depSoFatura.length, "FFCCE5FF");
  const hdr4 = ws.addRow(["Certif. Completo", "Certificado", "Nome", "Sub", ""]);
  hdr4.height = 18;
  hdr4.eachCell(cell => { cell.style = headerStyle(C.headerBg); });
  even = true;
  for (const r of depSoFatura) {
    const row = ws.addRow([r.certifFull, r.certGrupo, r.nome, r.sub]);
    row.height = 15;
    row.eachCell({ includeEmpty: true }, cell => { cell.style = cellStyle(even); });
    even = !even;
  }
  if (!depSoFatura.length) {
    ws.addRow(["(nenhum)"]).getCell(1).font = { italic: true, color: { argb: C.absentFg } };
  }
}

// ─────────────────────────────────────────────────
// EXPORTAR
// ─────────────────────────────────────────────────
/**
 * @param {object}  result
 * @param {object}  opts
 * @param {boolean} opts.includeQualityTabs — se true inclui "Bate-conferência" e
 *   "Cobertura" (só para perfis de gestão da FRB: invoicingadmin, invoicinguser,
 *   benefitsadmin). RH da empresa nunca recebe essas abas.
 */
export async function exportToExcel(result, opts = {}) {
  const { includeQualityTabs = false } = opts;

  const wb = new ExcelJS.Workbook();
  wb.creator         = "FRB Consultoria";
  wb.lastModifiedBy  = "FRB Consultoria";
  wb.created         = new Date();
  wb.modified        = new Date();

  buildVidasSheet(wb, result);
  buildDetalhesSheet(wb, result);
  buildTotalCertSheet(wb, result);
  buildTotalCCSheet(wb, result);
  if (includeQualityTabs) {
    buildBateConferenciaSheet(wb, result);
    buildCoberturaSheet(wb, result);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob   = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const today = new Date().toLocaleDateString("pt-BR").replace(/\//g, "-");
  saveAs(blob, `FRB_Faturamento_${today}.xlsx`);
}
