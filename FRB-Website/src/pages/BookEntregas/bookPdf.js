// src/pages/BookEntregas/bookPdf.js
// Gera o Book de Entregas como PDF baixável (jsPDF) · documento claro e
// profissional, baixado direto (sem diálogo de impressão), nome pela empresa.
import { jsPDF } from "jspdf";

const MONTHS_FULL = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const fmtBRL = v => (+(v ?? 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtDate = iso => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }); }
  catch { return ""; }
};

// cores (RGB)
const NAVY = [10, 31, 56], CYAN = [4, 173, 224], INK = [26, 36, 51];
const GRAY = [110, 124, 146], LIGHT = [244, 248, 252], BORDER = [220, 229, 239];

export function generateBookPdf({ data, year }) {
  const d = data || {};
  const docs = d.documents || {};
  const bill = d.billing || {};
  const company = d.client?.client_name || "Empresa";
  const genDate = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();   // 595
  const M = 40;                                  // margem
  let y = 0;

  // ── Cabeçalho ──
  doc.setFillColor(...NAVY); doc.rect(0, 0, W, 70, "F");
  doc.setFillColor(...CYAN); doc.rect(0, 70, W, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold"); doc.setFontSize(17);
  doc.text("FRB Consultoria", M, 34);
  doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  doc.setTextColor(150, 200, 230);
  doc.text("BOOK DE ENTREGAS", M, 52);
  doc.setTextColor(210, 226, 238); doc.setFontSize(10);
  doc.text(`${company}  ·  ${year}`, W - M, 44, { align: "right" });

  y = 100;
  doc.setTextColor(...INK); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
  doc.text(`Book de Entregas ${company}`, M, y);
  y += 18;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(...GRAY);
  doc.text(
    doc.splitTextToSize(
      "Registro automatico de tudo o que a FRB processou para a sua empresa no periodo: " +
      "documentos, conferencias de fatura e movimentacoes. Transparencia total do servico entregue.",
      W - 2 * M),
    M, y);
  y += 34;

  // ── KPIs (4 caixas) ──
  const kpis = [
    ["Documentos no ano", String(docs.year_total ?? 0), `${docs.total ?? 0} no historico`],
    ["Concluidos no ano", String(docs.completed_year ?? 0),
      docs.year_total > 0 ? `${Math.round((docs.completed_year / docs.year_total) * 100)}% de conclusao` : "0%"],
    ["Faturas conferidas", String(bill.year_total ?? 0), `${bill.total ?? 0} no historico`],
    ["Valor conferido", fmtBRL(bill.value_year), "somatorio do ano"],
  ];
  const gap = 12, bw = (W - 2 * M - 3 * gap) / 4, bh = 60;
  kpis.forEach((k, i) => {
    const x = M + i * (bw + gap);
    doc.setFillColor(...LIGHT); doc.setDrawColor(...BORDER);
    doc.roundedRect(x, y, bw, bh, 6, 6, "FD");
    doc.setTextColor(...GRAY); doc.setFont("helvetica", "bold"); doc.setFontSize(7);
    doc.text(doc.splitTextToSize(k[0].toUpperCase(), bw - 14), x + 8, y + 16);
    doc.setTextColor(...INK); doc.setFont("helvetica", "bold"); doc.setFontSize(14);
    doc.text(k[1], x + 8, y + 38);
    doc.setTextColor(...GRAY); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
    doc.text(doc.splitTextToSize(k[2], bw - 14), x + 8, y + 50);
  });
  y += bh + 26;

  // ── Faturas conferidas ──
  const sectionTitle = (txt) => {
    doc.setFillColor(...CYAN); doc.rect(M, y - 9, 3, 13, "F");
    doc.setTextColor(...INK); doc.setFont("helvetica", "bold"); doc.setFontSize(11.5);
    doc.text(txt, M + 10, y);
    y += 16;
  };

  sectionTitle(`Faturas conferidas em ${year}`);
  const snaps = bill.snapshots ?? [];
  if (snaps.length === 0) {
    doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(...GRAY);
    doc.text("Nenhuma fatura conferida neste ano.", M, y); y += 18;
  } else {
    // cabeçalho da tabela
    const cols = [M, M + 150, M + 250, M + 360];
    doc.setFillColor(...NAVY); doc.rect(M, y - 2, W - 2 * M, 18, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
    doc.text("COMPETENCIA", cols[0] + 6, y + 10);
    doc.text("PRODUTO", cols[1] + 6, y + 10);
    doc.text("VIDAS", cols[2] + 6, y + 10);
    doc.text("VALOR", W - M - 6, y + 10, { align: "right" });
    y += 18;
    snaps.forEach((s, i) => {
      if (i % 2 === 0) { doc.setFillColor(...LIGHT); doc.rect(M, y, W - 2 * M, 16, "F"); }
      doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(8.5);
      doc.text(`${MONTHS_FULL[s.month]}/${s.year}`, cols[0] + 6, y + 11);
      doc.text(s.product === "saude" ? "Saude" : "Dental", cols[1] + 6, y + 11);
      doc.text(String(s.total_vidas ?? 0), cols[2] + 6, y + 11);
      doc.text(fmtBRL(s.total_value), W - M - 6, y + 11, { align: "right" });
      y += 16;
    });
  }
  y += 20;

  // ── Linha do tempo ──
  if (y > 720) { doc.addPage(); y = 50; }
  sectionTitle("Atividades recentes");
  const tl = (d.timeline ?? []).slice(0, 14);
  if (tl.length === 0) {
    doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(...GRAY);
    doc.text("Nenhuma atividade registrada.", M, y); y += 16;
  } else {
    tl.forEach(e => {
      if (y > 800) { doc.addPage(); y = 50; }
      doc.setFillColor(...CYAN); doc.circle(M + 3, y - 3, 2, "F");
      doc.setTextColor(...INK); doc.setFont("helvetica", "normal"); doc.setFontSize(9);
      doc.text(e.label || "", M + 12, y);
      doc.setTextColor(...GRAY); doc.setFontSize(7.5);
      doc.text(fmtDate(e.date), W - M, y, { align: "right" });
      y += 16;
    });
  }

  // ── Rodapé ──
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...BORDER); doc.line(M, ph - 36, W - M, ph - 36);
  doc.setTextColor(...GRAY); doc.setFont("helvetica", "normal"); doc.setFontSize(7.5);
  doc.text("FRB Consultoria · Book de Entregas · Documento confidencial", M, ph - 22);
  doc.text(`Gerado em ${genDate}`, W - M, ph - 22, { align: "right" });

  const safe = company.replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "");
  doc.save(`Book_de_Entregas_${safe}_${year}.pdf`);
}
