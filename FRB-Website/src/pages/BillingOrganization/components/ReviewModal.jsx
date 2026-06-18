// src/pages/BillingOrganization/components/ReviewModal.jsx
// Portão de qualidade: revisão de erros bloqueantes antes de salvar.

import { useState, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

// ─────────────────────────────────────────────────────────────────
// DIFF DE CARACTERES (LCS-based)
// Compara ref contra target e retorna segmentos para renderização.
// Não usa comparação posicional — lida com inserção, remoção e
// deslocamento (ex.: MAGALHAES vs MAGALHES).
//
// Retorna: [{text, same}]
//   same=true  → caractere presente no LCS (igual à referência)
//   same=false → caractere extra no target (inserção/substituição)
// Deleções da referência não aparecem no target (são simplesmente omitidas).
// ─────────────────────────────────────────────────────────────────
function diffChars(ref, target) {
  if (!ref || !target) return [{ text: target || "", same: false }];
  if (ref === target)  return [{ text: target, same: true }];

  const m = ref.length, n = target.length;

  // Tabela LCS — O(m×n) tempo e espaço
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = ref[i - 1] === target[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  // Backtrack: percorre apenas o target (inserções = diff, matches = same)
  const chars = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ref[i - 1] === target[j - 1]) {
      chars.unshift({ char: target[j - 1], same: true });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      chars.unshift({ char: target[j - 1], same: false }); // inserção
      j--;
    } else {
      i--; // deleção da ref → não aparece no target
    }
  }

  // Mescla segmentos consecutivos do mesmo tipo
  const segs = [];
  for (const { char, same } of chars) {
    const last = segs[segs.length - 1];
    if (last && last.same === same) last.text += char;
    else segs.push({ text: char, same });
  }
  return segs;
}

// ─────────────────────────────────────────────────────────────────
// STYLED COMPONENTS
// ─────────────────────────────────────────────────────────────────
const fadeIn = keyframes`from{opacity:0;transform:scale(.97)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1300;
  background: rgba(0,0,0,.82);
  display: flex; align-items: flex-start; justify-content: center;
  padding: 20px 16px;
  backdrop-filter: blur(4px);
  overflow-y: auto;
`;

const Card = styled.div`
  background: #0d1525;
  border: 1px solid rgba(4,173,224,.25);
  border-radius: 18px;
  width: 100%; max-width: 900px;
  animation: ${fadeIn} .22s ease;
  box-shadow: 0 32px 96px rgba(0,0,0,.65), 0 0 0 1px rgba(4,173,224,.07);
  margin: auto;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid rgba(255,255,255,.08);
  position: sticky; top: 0; background: #0d1525; z-index: 2;
`;

const Title = styled.h2`
  color: #fff; font-size: 1rem; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
  svg { color: #f97316; }
  margin: 0;
`;

const Progress = styled.span`
  font-size: .78rem;
  color: ${({ $done }) => $done ? "#4cde9a" : "rgba(255,255,255,.4)"};
  font-weight: 600;
  transition: color .2s;
`;

const CloseBtn = styled.button`
  background: transparent; border: none; cursor: pointer;
  color: rgba(255,255,255,.4); padding: 4px; border-radius: 6px;
  &:hover { color: #fff; background: rgba(255,255,255,.08); }
`;

const Body = styled.div`padding: 20px 24px;`;

const FilterRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;
`;

const FilterChip = styled.button`
  background: ${({ $active }) => $active ? "rgba(4,173,224,.2)" : "rgba(255,255,255,.05)"};
  border: 1px solid ${({ $active }) => $active ? "rgba(4,173,224,.5)" : "rgba(255,255,255,.1)"};
  color: ${({ $active }) => $active ? "#04ade0" : "rgba(255,255,255,.5)"};
  border-radius: 20px; padding: 3px 12px; font-size: .71rem; font-weight: 600;
  cursor: pointer; transition: all .15s; white-space: nowrap;
  &:hover { border-color: rgba(4,173,224,.4); color: #fff; }
`;

const ConflictList = styled.div`
  display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;
`;

const ConflictCard = styled.div`
  background: ${({ $resolved }) => $resolved ? "rgba(74,222,128,.05)" : "rgba(249,115,22,.05)"};
  border: 1px solid ${({ $resolved }) => $resolved ? "rgba(74,222,128,.2)" : "rgba(249,115,22,.25)"};
  border-radius: 10px; padding: 12px 14px;
  transition: all .2s;
`;

const ConflictMeta = styled.div`
  display: flex; gap: 10px; align-items: baseline; margin-bottom: 8px; flex-wrap: wrap;
`;

const MetaChip = styled.span`
  font-size: .69rem; font-weight: 700; padding: 1px 7px; border-radius: 4px;
  background: rgba(255,255,255,.07); color: rgba(255,255,255,.6);
`;

const CampoChip = styled.span`
  font-size: .69rem; font-weight: 800; padding: 1px 8px; border-radius: 4px;
  background: rgba(4,173,224,.15); color: #04ade0; letter-spacing: .03em;
`;

const NomeText = styled.span`
  font-size: .78rem; color: rgba(255,255,255,.8); font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 280px;
`;

const ResolvedBadge = styled.span`
  margin-left: auto; font-size: .7rem; font-weight: 700;
  color: #4cde9a; display: flex; align-items: center; gap: 4px;
`;

const SourceRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
`;

const SourceBtn = styled.button`
  display: flex; flex-direction: column; gap: 2px;
  background: ${({ $selected }) => $selected ? "rgba(74,222,128,.12)" : "rgba(255,255,255,.04)"};
  border: 1px solid ${({ $selected }) => $selected ? "rgba(74,222,128,.4)" : "rgba(255,255,255,.1)"};
  border-radius: 8px; padding: 6px 12px; cursor: pointer; transition: all .15s; min-width: 90px;
  &:hover:not(:disabled) { border-color: rgba(4,173,224,.4); background: rgba(4,173,224,.06); }
  &:disabled { opacity: .35; cursor: default; }
`;

const SourceLabel = styled.span`
  font-size: .63rem; color: rgba(255,255,255,.35); text-transform: uppercase; letter-spacing: .04em;
`;

const SourceVal = styled.span`
  font-size: .78rem; font-weight: 700;
  color: ${({ $selected }) => $selected ? "#4cde9a" : "rgba(255,255,255,.8)"};
`;

const InfoSection = styled.div`
  margin-top: 18px;
  background: rgba(255,255,255,.02);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 10px; padding: 12px 14px;
`;

const InfoTitle = styled.div`
  font-size: .75rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .05em; margin-bottom: 8px;
  display: flex; align-items: center; gap: 6px;
  color: ${({ $color }) => $color || "rgba(255,255,255,.45)"};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: ${({ $cols }) => $cols || "95px 1fr 80px 80px"};
  gap: 3px 8px; font-size: .73rem;
  max-height: 150px; overflow-y: auto;

  & > span {
    font-size: .65rem; font-weight: 700; color: rgba(255,255,255,.25);
    text-transform: uppercase; letter-spacing: .04em;
    padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,.06);
  }
`;

const InfoRow = styled.div`
  display: contents;
  & > * {
    display: flex; align-items: center; padding: 3px 2px;
    border-bottom: 1px solid rgba(255,255,255,.03);
    color: rgba(255,255,255,.65); overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap;
    font-size: .72rem;
  }
`;

const Footer = styled.div`
  padding: 14px 24px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  border-top: 1px solid rgba(255,255,255,.08);
  position: sticky; bottom: 0; background: #0d1525; z-index: 2;
  flex-wrap: wrap;
`;

const FooterNote = styled.span`
  font-size: .75rem; color: rgba(255,255,255,.35); flex: 1;
`;

const BtnSecondary = styled.button`
  padding: 10px 20px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,.14); background: transparent;
  color: rgba(255,255,255,.55); cursor: pointer; font-size: .85rem; font-weight: 600;
  transition: all .15s;
  &:hover { background: rgba(255,255,255,.06); color: #fff; }
`;

const BtnConfirm = styled.button`
  padding: 10px 28px; border-radius: 10px;
  background: ${({ disabled }) => disabled ? "rgba(74,222,128,.1)" : "linear-gradient(135deg,#4cde9a,#22c55e)"};
  border: 1px solid ${({ disabled }) => disabled ? "rgba(74,222,128,.2)" : "transparent"};
  color: ${({ disabled }) => disabled ? "rgba(74,222,128,.4)" : "#fff"};
  cursor: ${({ disabled }) => disabled ? "default" : "pointer"};
  font-size: .88rem; font-weight: 700;
  display: flex; align-items: center; gap: 7px;
  transition: all .15s;
  &:hover:not(:disabled) { filter: brightness(1.08); }
`;

// ── Grafia de Nome — novos componentes ────────────────────────────

const GrafiaNote = styled.p`
  font-size: .71rem; color: rgba(255,255,255,.32);
  margin: 0 0 10px; line-height: 1.5;
`;

const GrafiaList = styled.div`
  display: flex; flex-direction: column; gap: 10px;
  max-height: 320px; overflow-y: auto;
  padding-right: 2px;
`;

const GrafiaCard = styled.div`
  background: rgba(167,139,250,.04);
  border: 1px solid rgba(167,139,250,.12);
  border-radius: 8px;
  padding: 9px 12px;
`;

const GrafiaMeta = styled.div`
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
`;

const GrafiaCertif = styled.span`
  font-family: monospace; font-size: .69rem; color: rgba(255,255,255,.35);
  flex-shrink: 0;
`;

const GrafiaNome = styled.span`
  font-size: .76rem; font-weight: 600; color: rgba(255,255,255,.65);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  flex: 1;
`;

const OperadoraDivBadge = styled.span`
  font-size: .62rem; font-weight: 700; padding: 1px 6px; border-radius: 3px;
  background: rgba(249,115,22,.15); color: #f97316;
  border: 1px solid rgba(249,115,22,.25);
  flex-shrink: 0;
`;

/* Linha de uma fonte dentro do GrafiaCard */
const GrafiaSourceRow = styled.div`
  display: flex; align-items: center; gap: 10px;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,.04);
  &:last-child { border-bottom: none; }
`;

const GrafiaSourceLabel = styled.div`
  display: flex; align-items: center; gap: 5px;
  min-width: 145px; flex-shrink: 0;
  font-size: .68rem; color: rgba(255,255,255,.38);
`;

const OperadoraBadge = styled.span`
  font-size: .59rem; font-weight: 800; letter-spacing: .03em;
  padding: 0px 5px; border-radius: 3px;
  background: rgba(4,173,224,.15); color: #04ade0;
  border: 1px solid rgba(4,173,224,.28);
  flex-shrink: 0;
`;

/**
 * Valor de uma fonte na linha de grafia.
 * $kind: "referencia" → verde; "divergente" → neutro (chars individuais coloridos);
 *        "ausente"    → cinza
 */
const GrafiaValue = styled.div`
  font-size: .78rem; font-weight: 600; font-family: monospace;
  flex: 1; line-height: 1.6;
  color: ${({ $kind }) =>
    $kind === "referencia" ? "#34d399" :
    $kind === "ausente"    ? "rgba(255,255,255,.2)" :
    "rgba(255,255,255,.75)"};
`;

/** Span individual de um caractere no diff: same ou diff */
const DiffChar = styled.span`
  background: ${({ $same }) => $same ? "transparent" : "rgba(248,113,113,.16)"};
  color:       ${({ $same }) => $same ? "inherit"     : "#f87171"};
  border-radius: 2px;
  padding: ${({ $same }) => $same ? "0" : "0 1px"};
`;

// ─────────────────────────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────────────────────────
const CAMPO_LABELS = {
  sexo:           "Sexo",
  nome:           "Nome",
  cpf:            "CPF",
  dataNascimento: "Nascimento",
  estCivil:       "Est. Civil",
  parentesco:     "Parentesco",
  dataInicio:     "Data Início",
  tipoLancamento: "MOV",
};

const BLOCKING_FIELDS = [
  { key: null,              label: "Todos" },
  { key: "sexo",            label: "Sexo" },
  { key: "dataNascimento",  label: "Nascimento" },
  { key: "nome",            label: "Nome" },
];

const SOURCE_NAMES = {
  valorBaseCC: "Base CC",
  valorFatura: "Fat. Técnica",
  valorPos:    "Pos. Cadastral",
  valorPdf:    "PDF",
};

// ─────────────────────────────────────────────────────────────────
// HELPERS DE RENDERIZAÇÃO
// ─────────────────────────────────────────────────────────────────

/** Renderiza uma string com os chars divergentes em vermelho (via LCS diff). */
function DiffText({ refStr, target }) {
  if (!refStr || !target || target === "—") {
    return <span style={{ color: "rgba(255,255,255,.2)" }}>{target || "—"}</span>;
  }
  const segs = diffChars(refStr, target);
  return (
    <>
      {segs.map((seg, i) => (
        <DiffChar key={i} $same={seg.same}>{seg.text}</DiffChar>
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────

/**
 * Props:
 *   result    — resultado do mergeAll/applySubGroups
 *   onResolve — (corrections) => void
 *   onClose   — () => void
 */
export const ReviewModal = ({ result, onResolve, onClose }) => {
  const {
    blockingConflicts = [],
    coverage          = {},
    nomeGrafia        = [],
    grauIndefinido    = [],
  } = result;

  const [choices,     setChoices]     = useState({});
  const [fieldFilter, setFieldFilter] = useState(null);

  const choose = (certifFull, campo, val) =>
    setChoices(prev => ({ ...prev, [`${certifFull}|${campo}`]: val }));

  const filteredConflicts = fieldFilter
    ? blockingConflicts.filter(c => c.campo === fieldFilter)
    : blockingConflicts;

  const resolvedCount = blockingConflicts.filter(
    c => choices[`${c.certifFull}|${c.campo}`] !== undefined
  ).length;
  const allDone = resolvedCount === blockingConflicts.length;

  const corrections = useMemo(
    () => Object.entries(choices).map(([key, valorEscolhido]) => {
      const [certifFull, campo] = key.split("|");
      return { certifFull, campo, valorEscolhido };
    }),
    [choices]
  );

  const totalCoverage =
    (coverage.titSoBaseCC?.length  ?? 0) +
    (coverage.titSoFatura?.length  ?? 0) +
    (coverage.depSoPosicao?.length ?? 0) +
    (coverage.depSoFatura?.length  ?? 0);

  return (
    <Overlay onClick={e => e.target === e.currentTarget && allDone && onClose()}>
      <Card>
        {/* ── Header ── */}
        <Header>
          <Title>
            <FiAlertCircle size={16} />
            Revisão de Qualidade
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Progress $done={allDone}>
              {allDone
                ? "✓ Todos os erros resolvidos"
                : `${resolvedCount} de ${blockingConflicts.length} erros resolvidos`}
            </Progress>
            {allDone && <CloseBtn onClick={onClose}><FiX size={16} /></CloseBtn>}
          </div>
        </Header>

        <Body>
          {/* ── Erros bloqueantes ── */}
          <div style={{ marginBottom: 6 }}>
            <InfoTitle $color="#f97316">
              <FiAlertCircle size={13} />
              Erros a resolver ({blockingConflicts.length}) — obrigatório antes de salvar
            </InfoTitle>
          </div>

          {/* Filtro */}
          <FilterRow>
            {BLOCKING_FIELDS.map(f => {
              const count = f.key === null
                ? blockingConflicts.length
                : blockingConflicts.filter(c => c.campo === f.key).length;
              return (
                <FilterChip
                  key={String(f.key)}
                  $active={fieldFilter === f.key}
                  onClick={() => setFieldFilter(f.key)}
                >
                  {f.label} {count > 0 && `(${count})`}
                </FilterChip>
              );
            })}
          </FilterRow>

          {/* Lista de conflitos */}
          <ConflictList>
            {filteredConflicts.map((c, i) => {
              const key      = `${c.certifFull}|${c.campo}`;
              const resolved = choices[key] !== undefined;
              const chosen   = choices[key];

              const sources = Object.entries(SOURCE_NAMES)
                .map(([srcKey, srcLabel]) => ({ srcKey, srcLabel, val: c[srcKey] }))
                .filter(({ val }) => val && val !== "—");

              return (
                <ConflictCard key={`${c.certifFull}-${c.campo}-${i}`} $resolved={resolved}>
                  <ConflictMeta>
                    <MetaChip>Sub {c.sub}</MetaChip>
                    <MetaChip style={{ fontFamily: "monospace" }}>{c.certifFull}</MetaChip>
                    <NomeText title={c.nome}>{c.nome}</NomeText>
                    <CampoChip>{CAMPO_LABELS[c.campo] || c.campo}</CampoChip>
                    {resolved && (
                      <ResolvedBadge><FiCheckCircle size={11} /> Resolvido</ResolvedBadge>
                    )}
                  </ConflictMeta>
                  <SourceRow>
                    {sources.length === 0 ? (
                      <span style={{ fontSize: ".73rem", color: "rgba(255,255,255,.3)" }}>
                        Nenhuma fonte com valor disponível
                      </span>
                    ) : (
                      sources.map(({ srcKey, srcLabel, val }) => (
                        <SourceBtn
                          key={srcKey}
                          $selected={chosen === val}
                          onClick={() => choose(c.certifFull, c.campo, val)}
                        >
                          <SourceLabel>{srcLabel}</SourceLabel>
                          <SourceVal $selected={chosen === val}>{val}</SourceVal>
                        </SourceBtn>
                      ))
                    )}
                  </SourceRow>
                </ConflictCard>
              );
            })}

            {filteredConflicts.length === 0 && (
              <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,.3)", fontSize: ".85rem" }}>
                Nenhum erro neste campo.
              </div>
            )}
          </ConflictList>

          {/* ── COBERTURA ── */}
          {totalCoverage > 0 && (
            <InfoSection>
              <InfoTitle $color="#facc15">
                <FiInfo size={12} />
                Cobertura — aviso informativo ({totalCoverage} registros)
              </InfoTitle>

              {coverage.titSoBaseCC?.length > 0 && (
                <>
                  <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.35)", marginBottom: 4 }}>
                    Titulares só na Saúde (Base CC) — {coverage.titSoBaseCC.length}
                  </div>
                  <InfoGrid $cols="90px 1fr 120px 90px">
                    <span>Certif.</span><span>Nome</span><span>CC</span><span>Nasc.</span>
                    {coverage.titSoBaseCC.slice(0, 30).map((r, i) => (
                      <InfoRow key={`tbc-${i}`}>
                        <div style={{ fontFamily: "monospace", fontSize: ".69rem" }}>{r.certGrupo}</div>
                        <div title={r.nome}>{r.nome}</div>
                        <div>{r.centroCusto}</div>
                        <div>{r.dataNascimento}</div>
                      </InfoRow>
                    ))}
                  </InfoGrid>
                  {coverage.titSoBaseCC.length > 30 && (
                    <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.25)", marginTop: 4 }}>
                      + {coverage.titSoBaseCC.length - 30} mais — veja aba "Cobertura" no Excel exportado
                    </div>
                  )}
                </>
              )}

              {coverage.titSoFatura?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.35)", marginBottom: 4 }}>
                    Titulares só no Dental — sem Base CC ({coverage.titSoFatura.length})
                  </div>
                  <InfoGrid $cols="90px 1fr 60px 60px">
                    <span>Certif.</span><span>Nome</span><span>Sub</span><span></span>
                    {coverage.titSoFatura.slice(0, 20).map((r, i) => (
                      <InfoRow key={`tf-${i}`}>
                        <div style={{ fontFamily: "monospace", fontSize: ".69rem" }}>{r.certGrupo}</div>
                        <div title={r.nome}>{r.nome}</div>
                        <div>{r.sub}</div>
                        <div />
                      </InfoRow>
                    ))}
                  </InfoGrid>
                </div>
              )}

              {(coverage.depSoPosicao?.length > 0 || coverage.depSoFatura?.length > 0) && (
                <div style={{ marginTop: 10, fontSize: ".7rem", color: "rgba(255,255,255,.35)" }}>
                  Dependentes só na Posição: {coverage.depSoPosicao?.length ?? 0}&nbsp;|&nbsp;
                  Dependentes só na Fatura: {coverage.depSoFatura?.length ?? 0}
                  {" "}— detalhes no Excel exportado.
                </div>
              )}
            </InfoSection>
          )}

          {/* ── GRAFIA DE NOME ── */}
          {nomeGrafia.length > 0 && (
            <InfoSection>
              <InfoTitle $color="#a78bfa">
                <FiInfo size={12} />
                Grafia de Nome — aviso informativo ({nomeGrafia.length} registro(s))
              </InfoTitle>
              <GrafiaNote>
                Mesma pessoa com pequena diferença de digitação entre fontes.
                A operadora (Bradesco) é a grafia de referência{" "}
                <span style={{ color: "#34d399", fontWeight: 700 }}>verde</span>.
                {" "}A fonte divergente fica com os caracteres diferentes em{" "}
                <span style={{ color: "#f87171", fontWeight: 700 }}>vermelho</span>.
                Não bloqueia o salvamento corrija na Base CC (PRIO) quando possível.
              </GrafiaNote>

              <GrafiaList>
                {nomeGrafia.slice(0, 20).map((r, idx) => {
                  // Suporte a entradas antigas (sem campo fontes)
                  const fontes = r.fontes ?? [
                    { fonte: "baseCC", label: "Base CC (PRIO)",    valor: r.nomeBase,   diverge: null, ehOperadora: false },
                    { fonte: "fatura", label: "Fatura (Bradesco)",  valor: r.nomeFatura, diverge: null, ehOperadora: true  },
                    { fonte: "pos",    label: "Posição (Bradesco)", valor: r.nomePos,    diverge: null, ehOperadora: true  },
                  ];
                  const referencia = r.referencia ?? r.nomeFatura ?? "—";

                  return (
                    <GrafiaCard key={`ng-${idx}`}>
                      <GrafiaMeta>
                        <GrafiaCertif>{r.certifFull}</GrafiaCertif>
                        <GrafiaNome title={r.nome}>{r.nome}</GrafiaNome>
                        {r.operadoraDivergente && (
                          <OperadoraDivBadge>⚠ Fatura ≠ Posição</OperadoraDivBadge>
                        )}
                      </GrafiaMeta>

                      {fontes.map(fonte => {
                        const ausente = !fonte.valor || fonte.valor === "—";
                        const kind    = ausente          ? "ausente"
                          : fonte.diverge === false      ? "referencia"
                          : fonte.diverge === true       ? "divergente"
                          : fonte.ehOperadora            ? "referencia"  // fallback se diverge=null e operadora
                          : "neutro";

                        return (
                          <GrafiaSourceRow key={fonte.fonte}>
                            <GrafiaSourceLabel>
                              {fonte.label}
                              {fonte.ehOperadora && (
                                <OperadoraBadge>Operadora</OperadoraBadge>
                              )}
                            </GrafiaSourceLabel>

                            <GrafiaValue $kind={kind === "divergente" ? "divergente" : kind}>
                              {ausente ? (
                                "—"
                              ) : kind === "divergente" ? (
                                <DiffText refStr={referencia} target={fonte.valor} />
                              ) : (
                                fonte.valor
                              )}
                            </GrafiaValue>
                          </GrafiaSourceRow>
                        );
                      })}
                    </GrafiaCard>
                  );
                })}
              </GrafiaList>

              {nomeGrafia.length > 20 && (
                <div style={{ fontSize: ".68rem", color: "rgba(255,255,255,.25)", marginTop: 8 }}>
                  Exibindo 20 de {nomeGrafia.length} — os demais aparecem no Excel exportado.
                </div>
              )}
            </InfoSection>
          )}

          {/* ── GRAU INDEFINIDO ── */}
          {grauIndefinido.length > 0 && (
            <InfoSection>
              <InfoTitle $color="#facc15">
                <FiInfo size={12} />
                Grau de Parentesco Indefinido ({grauIndefinido.length}) — qualidade de dado
              </InfoTitle>
              <InfoGrid $cols="90px 1fr 70px 70px">
                <span>Certif.</span><span>Nome</span><span>Fatura</span><span>Posição</span>
                {grauIndefinido.slice(0, 20).map((r, i) => (
                  <InfoRow key={`gi-${i}`}>
                    <div style={{ fontFamily: "monospace", fontSize: ".69rem" }}>{r.certifFull}</div>
                    <div title={r.nome}>{r.nome}</div>
                    <div>{r.faturaRaw}</div>
                    <div>{r.posRaw}</div>
                  </InfoRow>
                ))}
              </InfoGrid>
            </InfoSection>
          )}
        </Body>

        {/* ── Footer ── */}
        <Footer>
          <FooterNote>
            {allDone
              ? "Todos os erros foram resolvidos. Clique em Confirmar para continuar."
              : `Resolva todos os ${blockingConflicts.length} erros para liberar o salvamento.`}
          </FooterNote>
          <BtnSecondary
            onClick={onClose}
            disabled={!allDone}
            style={{ opacity: allDone ? 1 : 0.4, cursor: allDone ? "pointer" : "default" }}
          >
            Cancelar
          </BtnSecondary>
          <BtnConfirm disabled={!allDone} onClick={() => allDone && onResolve(corrections)}>
            <FiCheckCircle size={14} />
            Confirmar e continuar
          </BtnConfirm>
        </Footer>
      </Card>
    </Overlay>
  );
};
