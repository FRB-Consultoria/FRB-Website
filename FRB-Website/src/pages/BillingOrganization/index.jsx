// src/pages/BillingOrganization/index.jsx
import { useState, useRef, useCallback, useEffect, useMemo, Fragment, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUploadCloud, FiCheckCircle, FiPlay, FiDownload,
  FiArrowLeft, FiFileText, FiGrid, FiUsers, FiBarChart2, FiLayers,
  FiShield, FiAlertCircle, FiSave, FiClock,
} from "react-icons/fi";
import {
  PageWrapper, Topbar, TopbarLogo, TopbarTitle, BackBtn,
  Content, SectionTitle, UploadGrid, UploadCard, UploadIcon,
  UploadLabel, UploadSub, UploadFileName, HiddenInput,
  ActionRow, ProcessBtn, ExportBtn, StatusText,
  Tabs, Tab, TableWrapper, Table, Thead, Th, Tbody, Tr, Td,
  SubHeaderRow, SubtotalRow, TotalRow, EmptyState,
  DisclaimerBanner, DisclaimerIcon, DisclaimerText,
  ValidationSection, ValidationTitle, ValidationGrid, ValidationRow,
  DropOverlay, MovTag,
} from "./style";
import {
  parseFaturaTecnica, parsePosicaoCadastral, parseBaseCC,
  mergeAll, groupBySub, grandTotal, fmtBRL,
  prescanSubNames, applySubGroups, applyCorrections,
} from "./utils/sheetParser";
import { exportToExcel } from "./utils/exportExcel";
import { parsePdfFaturas, buildGroupMapFromPdfs } from "./utils/parsePdfFaturas";
import { computeAnalytics } from "./utils/computeAnalytics";
import { SaveModal }   from "./components/SaveModal";
import { ReviewModal } from "./components/ReviewModal";
import FRB from "../../assets/img/logoBranca.webp";
import { notifySucess, notifyError } from "../../Toastfy";
import { api } from "../../services/api";
import { UserContext } from "../../contexts/userContext/userContext";

// ──────────────────────────────────────────────────────────────
const TABS = [
  { key: "vidas",    label: "Vidas",                    icon: <FiUsers size={13} /> },
  { key: "totalSub", label: "Total por Sub",             icon: <FiLayers size={13} /> },
  { key: "cert",     label: "Total por Certificado",     icon: <FiGrid size={13} /> },
  { key: "cc",       label: "Total por Centro de Custo", icon: <FiBarChart2 size={13} /> },
];

const VIDAS_COLS = [
  { key: "sub",              label: "Sub",             w: 60 },
  { key: "certifFull",       label: "Certif.",         w: 100 },
  { key: "certGrupo",        label: "Cert Grupo",      w: 90 },
  { key: "nome",             label: "Nome",            w: 260 },
  { key: "cpf",              label: "CPF",             w: 110 },
  { key: "centroCusto",      label: "Centro de Custo", w: 200 },
  { key: "codigoCC",         label: "Código CC",       w: 100 },
  { key: "dataNascimento",   label: "Nascimento",      w: 90 },
  { key: "sexo",             label: "Sexo",            w: 50 },
  { key: "estCivil",         label: "Est.Civil",       w: 70 },
  { key: "parentesco",       label: "Parent.",         w: 70 },
  { key: "plano",            label: "Plano",           w: 70 },
  { key: "dataInicio",       label: "Início",          w: 90 },
  { key: "tipoLancamento",   label: "MOV",             w: 55, mov: true },
  { key: "lancamento",       label: "Lançamento",      w: 90 },
  { key: "valor",            label: "Valor (R$)",      w: 100, right: true, money: true },
];

const DET_COLS = [
  { key: "sub",      label: "Sub",                 w: 60 },
  { key: "tipoLanc", label: "Tipo de Lançamento",  w: 280 },
  { key: "qtdTit",   label: "Titulares",            w: 80,  right: true },
  { key: "qtdDep",   label: "Dependentes",          w: 90,  right: true },
  { key: "qtdSeg",   label: "Segurados",            w: 80,  right: true },
  { key: "qtdLanc",  label: "Qtd Lanç.",            w: 80,  right: true },
  { key: "vlrTotal", label: "Total (R$)",           w: 110, right: true, money: true },
  { key: "vlrParte", label: "Parte Segurado (R$)",  w: 130, right: true, money: true },
];

// ──────────────────────────────────────────────────────────────
export const BillingOrganization = () => {
  const navigate = useNavigate();
  const { user }  = useContext(UserContext);

  useEffect(() => {
    if (user && !user.perm_benefits_billing) navigate("/");
  }, [user, navigate]);

  // Somente quem pode processar (perm_benefits_billing) é gestão FRB · vê abas de qualidade no Excel.
  const isGestao = !!user?.perm_benefits_billing;

  const [files, setFiles]             = useState({ fatura: null, baseCC: null, posicao: null });
  const [pdfFiles, setPdfFiles]       = useState([]);
  const [pdfData, setPdfData]         = useState(null);
  const [subGroupMap, setSubGroupMap] = useState({});
  const [subNames, setSubNames]       = useState(null);
  const [processing, setProcessing]   = useState(false);
  const [parsindoPdf, setParsindoPdf] = useState(false);
  const [exporting, setExporting]     = useState(false);

  // Resultado bruto (imutável após processamento)
  const [result, setResult]           = useState(null);
  // Correções escolhidas no ReviewModal
  const [corrections, setCorrections] = useState([]);
  // Controle dos modais
  const [reviewOpen, setReviewOpen]   = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [activeTab, setActiveTab]     = useState("vidas");
  const [dragOver, setDragOver]       = useState(null);

  const inputRefs = {
    fatura:  useRef(),
    baseCC:  useRef(),
    posicao: useRef(),
    pdfs:    useRef(),
  };

  // ── Resultado com correções aplicadas (on-the-fly) ──
  // É este que alimenta export, save, analytics e displays.
  const resolvedResult = useMemo(() => {
    if (!result) return null;
    return corrections.length > 0 ? applyCorrections(result, corrections) : result;
  }, [result, corrections]);

  // ── Flag de erro pendente ──
  const blockingKeys = useMemo(
    () => new Set((result?.blockingConflicts ?? []).map(c => `${c.certifFull}|${c.campo}`)),
    [result]
  );
  const resolvedKeys = useMemo(
    () => new Set(corrections.map(c => `${c.certifFull}|${c.campo}`)),
    [corrections]
  );
  const temErroPendente = result !== null && [...blockingKeys].some(k => !resolvedKeys.has(k));

  // Totais derivados do resultado corrigido
  const grand     = resolvedResult ? grandTotal(resolvedResult.vidasRows) : 0;
  const subGroups = resolvedResult ? groupBySub(resolvedResult.vidasRows) : [];

  // ── UPLOAD XLS ──
  const handleFileChange = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFiles(prev => ({ ...prev, [key]: file }));
    setResult(null);
    setCorrections([]);
    if (key === "fatura") {
      prescanSubNames(file).then(n => setSubNames(n)).catch(console.error);
    }
  };

  // ── UPLOAD PDF ──
  const handlePdfChange = useCallback(async (e) => {
    const selected = Array.from(e.target.files ?? []).filter(f => f.name.toLowerCase().endsWith(".pdf"));
    if (!selected.length) return;
    setPdfFiles(selected);
    setResult(null);
    setCorrections([]);
    setParsindoPdf(true);
    try {
      const parsed = await parsePdfFaturas(selected);
      setPdfData(parsed);
      if (subNames) setSubGroupMap(buildGroupMapFromPdfs(parsed, subNames));
      const subs = Object.values(parsed).map(d => d.consolidado).join(", ");
      notifySucess(`${selected.length} PDF(s) lidos. Subs: ${subs}`);
    } catch (err) {
      console.error(err);
      notifyError("Erro ao processar os PDFs. Verifique os arquivos.");
    } finally {
      setParsindoPdf(false);
    }
  }, [subNames]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (pdfData && subNames) setSubGroupMap(buildGroupMapFromPdfs(pdfData, subNames));
  }, [pdfData, subNames]);

  // ── DROP ──
  const handleDrop = useCallback((key, e) => {
    setDragOver(null);
    const dropped = Array.from(e.dataTransfer?.files ?? []);
    if (!dropped.length) return;
    if (key === "pdfs") {
      const pdfs = dropped.filter(f => f.name.toLowerCase().endsWith(".pdf"));
      if (pdfs.length) handlePdfChange({ target: { files: pdfs } });
      return;
    }
    const xlsExts = [".xlsx", ".xls", ".csv"];
    const file = dropped.find(f => xlsExts.some(ext => f.name.toLowerCase().endsWith(ext)));
    if (!file) return;
    setFiles(prev => ({ ...prev, [key]: file }));
    setResult(null);
    setCorrections([]);
    if (key === "fatura") prescanSubNames(file).then(n => setSubNames(n)).catch(console.error);
  }, [handlePdfChange]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── PROCESSAR ──
  const handleProcess = useCallback(async () => {
    if (!files.fatura || !files.baseCC || !files.posicao) {
      notifyError("Anexe as 3 planilhas antes de processar.");
      return;
    }
    setProcessing(true);
    setCorrections([]);
    try {
      const [faturaData, posData, ccData] = await Promise.all([
        parseFaturaTecnica(files.fatura),
        parsePosicaoCadastral(files.posicao),
        parseBaseCC(files.baseCC),
      ]);

      if (!faturaData.benefRows.length) {
        notifyError("Fatura Técnica: nenhum beneficiário encontrado. Verifique o arquivo.");
        return;
      }

      const combinedMovMap = {};
      if (pdfData) {
        for (const data of Object.values(pdfData)) {
          if (data.movMap) Object.assign(combinedMovMap, data.movMap);
        }
      }

      const merged = mergeAll(faturaData, posData, ccData, combinedMovMap);
      const finalResult = Object.keys(subGroupMap).length > 0
        ? applySubGroups(merged, subGroupMap)
        : merged;

      setResult(finalResult);
      setActiveTab("vidas");

      // Portão de qualidade: abre revisão se houver erros bloqueantes
      if (finalResult.blockingConflicts?.length > 0) {
        setReviewOpen(true);
        notifyError(`${finalResult.blockingConflicts.length} erro(s) de qualidade encontrado(s). Revise antes de salvar.`);
      } else {
        notifySucess(`${finalResult.vidasRows.length} vidas processadas · sem erros bloqueantes!`);
      }

      // Audit log
      try {
        await api.post("benefits/billing-audit/", {
          fatura_filename:  files.fatura.name,
          basecc_filename:  files.baseCC.name,
          posicao_filename: files.posicao.name,
          total_vidas:      finalResult.vidasRows.length,
        }, { skipGlobalLoader: true });
      } catch (_e) { console.warn("Audit log:", _e); }

    } catch (err) {
      console.error(err);
      notifyError("Erro ao processar as planilhas. Verifique o formato dos arquivos.");
    } finally {
      setProcessing(false);
    }
  }, [files, subGroupMap, pdfData]);

  // ── EXPORTAR (usa resolvedResult) ──
  const handleExport = async () => {
    if (!resolvedResult || temErroPendente) return;
    setExporting(true);
    try {
      await exportToExcel(resolvedResult, { includeQualityTabs: isGestao });
      notifySucess("Planilha exportada com sucesso!");
    } catch (err) {
      console.error(err);
      notifyError("Erro ao gerar o arquivo Excel.");
    } finally {
      setExporting(false);
    }
  };

  // ── SALVAR SNAPSHOT ──
  const apiSave = async (payload, overwrite = false) => {
    const url = overwrite ? "billing-snapshots/?overwrite=1" : "billing-snapshots/";
    const res = await api.post(url, payload, { skipGlobalLoader: true });
    return res.data;
  };

  // ── REVIEW: resolver erros e liberar save ──
  const handleResolve = (newCorrections) => {
    setCorrections(newCorrections);
    setReviewOpen(false);
    notifySucess("Revisão concluída · salvamento liberado.");
  };

  // Validação PDF vs calculado
  const validacoes = resolvedResult && pdfData
    ? Object.values(pdfData).map(pdf => {
        const bloco     = resolvedResult.summaryBlocks.find(b => b.sub === pdf.consolidado);
        const calculado = bloco?.tsTotal ?? 0;
        const ok        = Math.abs(calculado - pdf.totalPdf) < 0.02;
        return { sub: pdf.consolidado, calculado, pdfTotal: pdf.totalPdf, ok, filename: pdf.filename };
      })
    : [];

  return (
    <PageWrapper>
      <Topbar>
        <TopbarLogo src={FRB} alt="FRB" />
        <TopbarTitle>Organização do Faturamento</TopbarTitle>
        <BackBtn onClick={() => navigate("/user")}>
          <FiArrowLeft size={14} /> Menu de serviços
        </BackBtn>
      </Topbar>

      <Content>
        {/* ── AVISO ── */}
        <DisclaimerBanner>
          <DisclaimerIcon><FiShield size={16} /></DisclaimerIcon>
          <DisclaimerText>
            <span>Plataforma restrita · FRB Consultoria</span>
            <span>
              Uso exclusivo para faturamento interno da FRB.{" "}
              <em>Não é permitido utilizar faturas de outras empresas nesta plataforma.</em>{" "}
              Todo acesso é registrado.
            </span>
          </DisclaimerText>
        </DisclaimerBanner>

        {/* ── UPLOAD ── */}
        <SectionTitle><FiUploadCloud /> Importar Planilhas</SectionTitle>

        <UploadGrid>
          {[
            { key: "fatura",  label: "Fatura Técnica",   sub: "Relatório de beneficiários da Bradesco (.xlsx / .xls)" },
            { key: "baseCC",  label: "Base CC",           sub: "Centro de Custo por certificado (.xlsx / .xls)" },
            { key: "posicao", label: "Posição Cadastral", sub: "CPF e dados pessoais abas Titular e Dependentes (.xlsx / .xls)" },
          ].map(({ key, label, sub }) => (
            <UploadCard
              key={key}
              $hasFile={!!files[key]}
              $dragOver={dragOver === key}
              onClick={() => inputRefs[key].current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(key); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => { e.preventDefault(); handleDrop(key, e); }}
            >
              {dragOver === key && (
                <DropOverlay>
                  <FiUploadCloud size={26} className="drop-icon" />
                  <span className="drop-label">Soltar aqui</span>
                  <span className="drop-sub">{label}</span>
                </DropOverlay>
              )}
              <UploadIcon $hasFile={!!files[key]}>
                {files[key] ? <FiCheckCircle /> : <FiUploadCloud />}
              </UploadIcon>
              <UploadLabel>{label}</UploadLabel>
              {files[key]
                ? <UploadFileName title={files[key].name}>{files[key].name}</UploadFileName>
                : <UploadSub>{sub}</UploadSub>}
              <HiddenInput ref={inputRefs[key]} type="file" accept=".xlsx,.xls,.csv"
                onChange={e => handleFileChange(key, e)} />
            </UploadCard>
          ))}

          {/* PDF */}
          <UploadCard
            $hasFile={pdfFiles.length > 0}
            $dragOver={dragOver === "pdfs"}
            onClick={() => inputRefs.pdfs.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragOver("pdfs"); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => { e.preventDefault(); handleDrop("pdfs", e); }}
          >
            {dragOver === "pdfs" && (
              <DropOverlay>
                <FiFileText size={26} className="drop-icon" />
                <span className="drop-label">Soltar PDFs das Faturas</span>
                <span className="drop-sub">Vários arquivos suportados</span>
              </DropOverlay>
            )}
            <UploadIcon $hasFile={pdfFiles.length > 0}>
              {pdfFiles.length > 0 ? <FiCheckCircle /> : <FiFileText />}
            </UploadIcon>
            <UploadLabel>Faturas PDF</UploadLabel>
            {pdfFiles.length > 0
              ? <UploadFileName>{pdfFiles.length} arquivo(s) · {pdfFiles.map(f => f.name.match(/SUB\s*\d+/i)?.[0] ?? f.name).join(", ")}</UploadFileName>
              : <UploadSub>PDFs da Bradesco por subfatura (.pdf) · define o agrupamento automaticamente</UploadSub>}
            {parsindoPdf && <UploadSub style={{ color: "#04ade0" }}>Lendo PDFs...</UploadSub>}
            <HiddenInput ref={inputRefs.pdfs} type="file" accept=".pdf" multiple onChange={handlePdfChange} />
          </UploadCard>
        </UploadGrid>

        {/* ── VALIDAÇÃO PDF vs CALCULADO ── */}
        {validacoes.length > 0 && (
          <ValidationSection>
            <ValidationTitle>Validação PDF vs Calculado</ValidationTitle>
            <ValidationGrid>
              <span>Sub</span>
              <span>Arquivo PDF</span>
              <span>Total PDF</span>
              <span>Calculado</span>
              <span>Status</span>
              {validacoes.map(v => (
                <ValidationRow key={v.sub} $ok={v.ok}>
                  <div style={{ fontWeight: 700 }}>{v.sub}</div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>{v.filename}</div>
                  <div>{fmtBRL(v.pdfTotal)}</div>
                  <div>{fmtBRL(v.calculado)}</div>
                  <div>
                    {v.ok
                      ? "✓ Confere"
                      : <><FiAlertCircle size={12} style={{ marginRight: 4 }} />Divergência de {fmtBRL(Math.abs(v.calculado - v.pdfTotal))}</>}
                  </div>
                </ValidationRow>
              ))}
            </ValidationGrid>
          </ValidationSection>
        )}

        {/* ── AÇÕES ── */}
        <ActionRow>
          <ProcessBtn onClick={handleProcess} disabled={processing || !files.fatura || !files.baseCC || !files.posicao}>
            <FiPlay size={14} />
            {processing ? "Processando..." : "Processar"}
          </ProcessBtn>

          {/* Botão que reabre o ReviewModal se houver erros pendentes */}
          {result && temErroPendente && (
            <ExportBtn
              onClick={() => setReviewOpen(true)}
              style={{ background: "rgba(249,115,22,.15)", border: "1px solid rgba(249,115,22,.4)", color: "#fb923c" }}
            >
              <FiAlertCircle size={14} />
              {result.blockingConflicts.length - resolvedKeys.size} erro(s) · Revisar
            </ExportBtn>
          )}

          {resolvedResult && (
            <ExportBtn
              onClick={handleExport}
              disabled={exporting || temErroPendente}
              title={temErroPendente ? `Resolva os erros de qualidade antes de exportar` : undefined}
              style={temErroPendente ? { opacity: 0.4, cursor: "not-allowed" } : undefined}
            >
              <FiDownload size={14} />
              {exporting ? "Gerando Excel..." : "Exportar Excel"}
            </ExportBtn>
          )}

          {resolvedResult && (
            <ExportBtn
              onClick={() => {
                const analytics = computeAnalytics(resolvedResult.vidasRows, grand);
                navigate("/beneficios/faturamento/dashboard", {
                  state: { analytics, totalValue: grand, totalVidas: resolvedResult.vidasRows.length },
                });
              }}
              style={{ background: "rgba(124,92,191,.18)", border: "1px solid rgba(124,92,191,.4)", color: "#a78bfa" }}
            >
              <FiBarChart2 size={14} />
              Ver Analytics
            </ExportBtn>
          )}

          {resolvedResult && (
            <ExportBtn
              onClick={() => !temErroPendente && setShowSaveModal(true)}
              disabled={temErroPendente}
              title={temErroPendente ? `Resolva os erros de qualidade antes de salvar` : undefined}
              style={temErroPendente
                ? { opacity: 0.4, cursor: "not-allowed", background: "rgba(4,173,224,.1)", border: "1px solid rgba(4,173,224,.2)" }
                : { background: "linear-gradient(135deg,#04ade0,#0280b0)", border: "none" }}
            >
              <FiSave size={14} />
              Salvar no Histórico
            </ExportBtn>
          )}

          <ExportBtn
            onClick={() => navigate("/beneficios/faturamento/historico")}
            style={{ background: "transparent", border: "1px solid rgba(255,255,255,.15)" }}
          >
            <FiClock size={14} />
            Histórico
          </ExportBtn>

          {resolvedResult && (
            <StatusText>
              {resolvedResult.vidasRows.length} vidas · {subGroups.length} subs · Total: {fmtBRL(grand)}
              {pdfFiles.length === 0 && " · (sem PDFs · agrupamento não aplicado)"}
              {temErroPendente && (
                <span style={{ color: "#fb923c", marginLeft: 8 }}>
                  · {result.blockingConflicts.length - resolvedKeys.size} erro(s) pendente(s)
                </span>
              )}
            </StatusText>
          )}
        </ActionRow>

        {/* ── MODAIS ── */}
        {reviewOpen && result && (
          <ReviewModal
            result={result}
            onResolve={handleResolve}
            onClose={() => setReviewOpen(false)}
          />
        )}

        {showSaveModal && resolvedResult && !temErroPendente && (
          <SaveModal
            result={resolvedResult}
            totalValue={grand}
            onClose={() => setShowSaveModal(false)}
            onSaved={() => {
              notifySucess("Faturamento salvo no histórico!");
              // Limpa todos os arquivos e o resultado para forçar nova importação
              setFiles({ fatura: null, baseCC: null, posicao: null });
              setPdfFiles([]);
              setPdfData(null);
              setSubGroupMap({});
              setSubNames(null);
              setResult(null);
              setCorrections([]);
              setActiveTab("vidas");
            }}
            apiSave={apiSave}
          />
        )}

        {/* ── RESULTADO ── */}
        <SectionTitle><FiGrid /> Resultado</SectionTitle>

        {!resolvedResult ? (
          <EmptyState>
            <FiFileText />
            <span>Importe as planilhas e clique em &quot;Processar&quot; para visualizar os dados.</span>
          </EmptyState>
        ) : (
          <>
            <Tabs>
              {TABS.map(t => (
                <Tab key={t.key} $active={activeTab === t.key} onClick={() => setActiveTab(t.key)}>
                  {t.icon} {t.label}
                  {t.key === "vidas"    && ` (${resolvedResult.vidasRows.length})`}
                  {t.key === "totalSub" && ` (${resolvedResult.summaryBlocks?.length ?? 0} subs)`}
                  {t.key === "cert"     && ` (${resolvedResult.totalCert.length})`}
                  {t.key === "cc"       && ` (${resolvedResult.totalCC.length})`}
                </Tab>
              ))}
            </Tabs>

            {/* ─── ABA VIDAS ─── */}
            {activeTab === "vidas" && (
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      {VIDAS_COLS.map(c => (
                        <Th key={c.key} style={{ minWidth: c.w, textAlign: c.right ? "right" : "left" }}>
                          {c.label}
                        </Th>
                      ))}
                    </tr>
                  </Thead>
                  <Tbody>
                    {subGroups.map(group => (
                      <Fragment key={`grp-${group.sub}`}>
                        <SubHeaderRow>
                          <td colSpan={VIDAS_COLS.length}>SUBFATURA: {group.sub}</td>
                        </SubHeaderRow>
                        {group.rows.map((r, i) => {
                          const isTit = r.parentesco === "TIT";
                          return (
                            <Tr key={`${r.certifFull}-${i}`} $even={i % 2 === 0} $titular={isTit}>
                              {VIDAS_COLS.map(c => {
                                if (c.mov) return (
                                  <Td key={c.key} $titular={isTit}>
                                    <MovTag $t={r[c.key]}>{r[c.key] || "·"}</MovTag>
                                  </Td>
                                );
                                if (c.money) {
                                  const isCredit = (r[c.key] ?? 0) < 0;
                                  return (
                                    <Td key={c.key} $titular={isTit} $credit={isCredit} className="money">
                                      {fmtBRL(r[c.key])}
                                    </Td>
                                  );
                                }
                                return (
                                  <Td key={c.key} $titular={isTit} className={c.right ? "right" : ""}>
                                    {r[c.key] ?? ""}
                                  </Td>
                                );
                              })}
                            </Tr>
                          );
                        })}
                        <SubtotalRow>
                          <td colSpan={VIDAS_COLS.length - 1}>
                            Subtotal Subfatura {group.sub} · {group.rows.length} vidas
                          </td>
                          <td className="money">{fmtBRL(group.subtotal)}</td>
                        </SubtotalRow>
                      </Fragment>
                    ))}
                    <TotalRow>
                      <td colSpan={VIDAS_COLS.length - 1}>TOTAL GERAL · {resolvedResult.vidasRows.length} vidas</td>
                      <td className="money">{fmtBRL(grand)}</td>
                    </TotalRow>
                  </Tbody>
                </Table>
              </TableWrapper>
            )}

            {/* ─── ABA TOTAL POR SUB ─── */}
            {activeTab === "totalSub" && (
              <TableWrapper>
                {(!resolvedResult.summaryBlocks || resolvedResult.summaryBlocks.length === 0) ? (
                  <EmptyState style={{ padding: 40 }}>
                    <FiFileText />
                    <span>Nenhum bloco de resumo detectado na Fatura Técnica.</span>
                  </EmptyState>
                ) : (
                  <Table>
                    <Thead>
                      <tr>
                        {DET_COLS.map(c => (
                          <Th key={c.key} style={{ minWidth: c.w, textAlign: c.right ? "right" : "left" }}>
                            {c.label}
                          </Th>
                        ))}
                      </tr>
                    </Thead>
                    <Tbody>
                      {resolvedResult.summaryBlocks.map((block, bi) => (
                        <Fragment key={`blk-${bi}`}>
                          <SubHeaderRow>
                            <td colSpan={DET_COLS.length}>SUBFATURA: {block.sub}</td>
                          </SubHeaderRow>
                          {block.rows.map((r, ri) => (
                            <Tr key={`${bi}-${ri}`} $even={ri % 2 === 0}>
                              <Td>{block.sub}</Td>
                              <Td>{r.tipoLanc}</Td>
                              <Td className="right">{r.qtdTit ?? ""}</Td>
                              <Td className="right">{r.qtdDep ?? ""}</Td>
                              <Td className="right">{r.qtdSeg ?? ""}</Td>
                              <Td className="right">{r.qtdLanc ?? ""}</Td>
                              <Td className="money">{fmtBRL(r.vlrTotal)}</Td>
                              <Td className="money">{fmtBRL(r.vlrParte)}</Td>
                            </Tr>
                          ))}
                          <SubtotalRow>
                            <td colSpan={DET_COLS.length - 2}>Totais da Subfatura {block.sub}</td>
                            <td className="money">{block.tsTotal != null ? fmtBRL(block.tsTotal) : "·"}</td>
                            <td />
                          </SubtotalRow>
                        </Fragment>
                      ))}
                      <TotalRow>
                        <td colSpan={DET_COLS.length - 2}>TOTAL GERAL</td>
                        <td className="money">
                          {fmtBRL(resolvedResult.summaryBlocks.reduce((a, b) => a + (b.tsTotal ?? 0), 0))}
                        </td>
                        <td />
                      </TotalRow>
                    </Tbody>
                  </Table>
                )}
              </TableWrapper>
            )}

            {/* ─── ABA TOTAL POR CERT ─── */}
            {activeTab === "cert" && (
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th>Subfatura</Th>
                      <Th>Certificado</Th>
                      <Th style={{ textAlign: "right" }}>Total (R$)</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {resolvedResult.totalCert.map((r, i) => (
                      <Tr key={r.certif} $even={i % 2 === 0}>
                        <Td>{r.sub}</Td>
                        <Td>{r.certif}</Td>
                        <Td className="money">{fmtBRL(r.total)}</Td>
                      </Tr>
                    ))}
                    <TotalRow>
                      <td colSpan={2}>TOTAL GERAL</td>
                      <td className="money">{fmtBRL(grand)}</td>
                    </TotalRow>
                  </Tbody>
                </Table>
              </TableWrapper>
            )}

            {/* ─── ABA TOTAL POR CC ─── */}
            {activeTab === "cc" && (
              <TableWrapper>
                <Table>
                  <Thead>
                    <tr>
                      <Th>Centro de Custo</Th>
                      <Th>Código CC</Th>
                      <Th style={{ textAlign: "right" }}>Total (R$)</Th>
                    </tr>
                  </Thead>
                  <Tbody>
                    {resolvedResult.totalCC.map((r, i) => (
                      <Tr key={r.codigoCC || r.centroCusto} $even={i % 2 === 0}>
                        <Td>{r.centroCusto}</Td>
                        <Td>{r.codigoCC}</Td>
                        <Td className="money">{fmtBRL(r.total)}</Td>
                      </Tr>
                    ))}
                    <TotalRow>
                      <td colSpan={2}>TOTAL GERAL</td>
                      <td className="money">{fmtBRL(grand)}</td>
                    </TotalRow>
                  </Tbody>
                </Table>
              </TableWrapper>
            )}
          </>
        )}
      </Content>
    </PageWrapper>
  );
};
