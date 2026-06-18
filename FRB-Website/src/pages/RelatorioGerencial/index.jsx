// src/pages/RelatorioGerencial/index.jsx
// "Kit de reajuste" / relatório gerencial em documento A4 · pronto para
// salvar como PDF (window.print). Reúne resumo, composição, evolução,
// maiores custos, auditoria de fatura e projeção de risco.
import { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft, FiPrinter, FiLoader, FiFileText,
} from "react-icons/fi";
import { UserContext } from "../../contexts/userContext/userContext";
import { api } from "../../services/api";
import { notifyError } from "../../Toastfy";
import FRB from "../../assets/img/FRB.webp";
import {
  PrintStyle, Screen, Toolbar, ToolbarTitle, ToolbarBtns, TBtn,
  Doc, DocHeader, Logo, HeadRight, DocKicker, DocTitle, DocMeta,
  Section, SecTitle, KpiRow, Kpi, KpiLbl, KpiVal, KpiSub,
  Table, Pills, Pill, DivRow, DivBox, Insight, Foot, Loading, Empty,
} from "./style";

const MONTHS_FULL = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const MONTHS_ABBR = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const fmtBRL = v => (+(v ?? 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmtN   = v => (+(v ?? 0)).toLocaleString("pt-BR");

export const RelatorioGerencial = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [params] = useSearchParams();
  const snapId = params.get("snapshot");

  const [loading, setLoading]   = useState(true);
  const [snap, setSnap]         = useState(null);
  const [series, setSeries]     = useState([]);
  const [div, setDiv]           = useState(null);

  useEffect(() => {
    if (user && !user.perm_benefits_dashboard && !user.perm_benefits_billing && !user.perm_admin) {
      navigate("/user");
    }
  }, [user, navigate]);

  const load = useCallback(async () => {
    if (!snapId) { setLoading(false); return; }
    setLoading(true);
    try {
      const detail = await api.get(`billing-snapshots/${snapId}/`, { skipGlobalLoader: true });
      const s = detail.data;
      setSnap(s);

      // Série de evolução: mesma empresa + produto
      try {
        const listRes = await api.get("billing-snapshots/", { skipGlobalLoader: true });
        const arr = listRes.data?.results ?? listRes.data ?? [];
        const ser = arr
          .filter(x => (x.company_name ?? "") === (s.company_name ?? "") && x.product === s.product)
          .sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month))
          .map(x => {
            const vidas = +(x.total_vidas ?? 0), valor = +(x.total_value ?? 0);
            return {
              id: x.id, month: x.month, year: x.year,
              full: `${MONTHS_ABBR[x.month]}/${x.year}`,
              vidas, valor, ticket: vidas > 0 ? valor / vidas : 0,
              isCurrent: x.id === s.id,
            };
          });
        setSeries(ser);
      } catch { /* lista opcional */ }

      // Divergências: opcional (pode dar 403 sem perm_dash_divergencias)
      try {
        const dRes = await api.get(`billing-snapshots/${snapId}/divergences/`, { skipGlobalLoader: true });
        setDiv(dRes.data && !dRes.data.error ? dRes.data : null);
      } catch { setDiv(null); }
    } catch {
      notifyError("Não foi possível carregar o relatório.");
      setSnap(null);
    } finally {
      setLoading(false);
    }
  }, [snapId]);

  useEffect(() => { load(); }, [load]);

  const a = snap?.analytics_data ?? {};
  const ticket = snap && snap.total_vidas > 0 ? snap.total_value / snap.total_vidas : 0;
  const comp = a.compositionTotal ?? {};
  const cc = (a.costByCC ?? []).slice(0, 8);
  const risk = a.agingRisk ?? {};
  const prodLabel = snap?.product === "saude" ? "Saúde" : snap?.product === "dental" ? "Dental" : snap?.product;
  const genDate = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  // Insight de evolução
  const first = series[0], last = series[series.length - 1];
  const evoPct = first && last && first.valor > 0 ? ((last.valor - first.valor) / first.valor) * 100 : null;

  if (loading) {
    return (
      <Screen>
        <PrintStyle />
        <Loading><FiLoader size={34} className="spin" /><span>Montando o relatório...</span></Loading>
      </Screen>
    );
  }

  if (!snap) {
    return (
      <Screen>
        <PrintStyle />
        <Toolbar>
          <ToolbarTitle><FiFileText /> Relatório Gerencial</ToolbarTitle>
          <TBtn onClick={() => navigate(-1)}><FiArrowLeft size={13} /> Voltar</TBtn>
        </Toolbar>
        <Doc><Empty>Faturamento não encontrado. Volte ao dashboard e gere o relatório a partir de um período.</Empty></Doc>
      </Screen>
    );
  }

  return (
    <Screen>
      <PrintStyle />

      <Toolbar className="no-print">
        <ToolbarTitle><FiFileText /> Relatório Gerencial</ToolbarTitle>
        <ToolbarBtns>
          <TBtn onClick={() => navigate(-1)}><FiArrowLeft size={13} /> Voltar</TBtn>
          <TBtn $primary onClick={() => window.print()}><FiPrinter size={14} /> Baixar PDF / Imprimir</TBtn>
        </ToolbarBtns>
      </Toolbar>

      <Doc>
        {/* Cabeçalho */}
        <DocHeader>
          <div>
            <Logo src={FRB} alt="FRB Consultoria" />
          </div>
          <HeadRight>
            <DocKicker>Relatório Gerencial de Benefícios</DocKicker>
            <DocTitle>{snap.company_name || "Empresa"}</DocTitle>
            <DocMeta>
              <div>Competência: <strong>{MONTHS_FULL[snap.month]}/{snap.year}</strong></div>
              <div>Produto: <strong>{prodLabel}</strong></div>
              <div>Emitido em {genDate}</div>
            </DocMeta>
          </HeadRight>
        </DocHeader>

        {/* 1. Resumo executivo */}
        <Section>
          <SecTitle>1. Resumo Executivo</SecTitle>
          <KpiRow>
            <Kpi>
              <KpiLbl>Faturamento do mês</KpiLbl>
              <KpiVal>{fmtBRL(snap.total_value)}</KpiVal>
              <KpiSub>{prodLabel} · {MONTHS_ABBR[snap.month]}/{snap.year}</KpiSub>
            </Kpi>
            <Kpi>
              <KpiLbl>Vidas</KpiLbl>
              <KpiVal>{fmtN(snap.total_vidas)}</KpiVal>
              <KpiSub>{fmtN(a.totalBeneficiarios ?? snap.total_vidas)} beneficiários</KpiSub>
            </Kpi>
            <Kpi>
              <KpiLbl>Ticket médio / vida</KpiLbl>
              <KpiVal>{fmtBRL(ticket)}</KpiVal>
              <KpiSub>custo médio mensal</KpiSub>
            </Kpi>
            <Kpi>
              <KpiLbl>Idade média</KpiLbl>
              <KpiVal>{a.avgAge ?? "·"}{a.avgAge ? " anos" : ""}</KpiVal>
              <KpiSub>{a.avgDependents ?? "·"} dependentes / titular</KpiSub>
            </Kpi>
          </KpiRow>
        </Section>

        {/* 2. Composição */}
        {comp.pctTitular != null && (
          <Section>
            <SecTitle>2. Composição da Carteira</SecTitle>
            <Pills>
              <Pill $color="#0270a0"><div className="lbl">Titulares</div><div className="val">{comp.pctTitular}%</div></Pill>
              <Pill $color="#1e8449"><div className="lbl">Cônjuges</div><div className="val">{comp.pctConjuge}%</div></Pill>
              <Pill $color="#7c5cbf"><div className="lbl">Filhos / Dependentes</div><div className="val">{comp.pctFilho}%</div></Pill>
            </Pills>
          </Section>
        )}

        {/* 3. Evolução */}
        {series.length >= 2 && (
          <Section>
            <SecTitle>3. Evolução do Período</SecTitle>
            <Table>
              <thead>
                <tr><th>Competência</th><th>Vidas</th><th>Faturamento</th><th>Ticket médio</th><th>Δ Faturamento</th></tr>
              </thead>
              <tbody>
                {series.map((r, i) => {
                  const prev = i > 0 ? series[i - 1] : null;
                  const dPct = prev && prev.valor > 0 ? ((r.valor - prev.valor) / prev.valor) * 100 : null;
                  return (
                    <tr key={r.id} className={r.isCurrent ? "current" : ""}>
                      <td>{r.full}</td>
                      <td>{fmtN(r.vidas)}</td>
                      <td>{fmtBRL(r.valor)}</td>
                      <td>{fmtBRL(r.ticket)}</td>
                      <td>{dPct == null ? "·" : `${dPct > 0 ? "+" : ""}${dPct.toFixed(1)}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {evoPct != null && (
              <Insight>
                💡 De <strong>{first.full}</strong> a <strong>{last.full}</strong>, o faturamento
                variou <strong>{evoPct > 0 ? "+" : ""}{evoPct.toFixed(1)}%</strong>
                {" "}({fmtBRL(first.valor)} → {fmtBRL(last.valor)}), com as vidas indo de
                {" "}<strong>{fmtN(first.vidas)}</strong> para <strong>{fmtN(last.vidas)}</strong>.
              </Insight>
            )}
          </Section>
        )}

        {/* 4. Maiores centros de custo */}
        {cc.length > 0 && (
          <Section>
            <SecTitle>4. Maiores Centros de Custo</SecTitle>
            <Table>
              <thead>
                <tr><th>Centro de Custo</th><th>Vidas</th><th>Custo / vida</th><th>Total</th></tr>
              </thead>
              <tbody>
                {cc.map((c, i) => (
                  <tr key={i}>
                    <td>{c.name}</td>
                    <td>{fmtN(c.count)}</td>
                    <td>{fmtBRL(c.avgPerLife)}</td>
                    <td>{fmtBRL(c.total)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Section>
        )}

        {/* 5. Auditoria de fatura */}
        {div && div.summary && (
          <Section>
            <SecTitle>5. Auditoria Automática da Fatura{div.has_previous ? ` (vs. ${div.previous_label})` : ""}</SecTitle>
            <DivRow>
              <DivBox $tone="good"><div className="v">{div.summary.added}</div><div className="l">Inclusões</div></DivBox>
              <DivBox><div className="v">{div.summary.removed}</div><div className="l">Exclusões</div></DivBox>
              <DivBox $tone="warn"><div className="v">{div.summary.value_changed}</div><div className="l">Mudança de valor</div></DivBox>
              <DivBox $tone={div.summary.duplicates > 0 ? "crit" : "good"}><div className="v">{div.summary.duplicates}</div><div className="l">Duplicidades</div></DivBox>
            </DivRow>
            {div.has_previous && (
              <Insight>
                💡 Variação total de faturamento no período:{" "}
                <strong>{div.summary.value_delta > 0 ? "+" : ""}{fmtBRL(div.summary.value_delta)}</strong>.
                {div.summary.duplicates > 0 && <> Atenção: <strong>{div.summary.duplicates} duplicidade(s)</strong> de cobrança identificada(s) · revisar antes do pagamento.</>}
              </Insight>
            )}
          </Section>
        )}

        {/* 6. Projeção de risco */}
        {(risk.current45to54 != null || risk.avgAge != null) && (
          <Section>
            <SecTitle>6. Projeção de Risco · Envelhecimento da Carteira</SecTitle>
            <Table>
              <thead><tr><th>Indicador</th><th>Titulares</th></tr></thead>
              <tbody>
                <tr><td>45–54 anos hoje (alto risco)</td><td>{fmtN(risk.current45to54)}</td></tr>
                <tr><td>35–44 hoje → migram p/ 45–54 em ~10 anos</td><td>{fmtN(risk.willBe45to54in10y)}</td></tr>
                <tr><td>55+ anos hoje (muito alto risco)</td><td>{fmtN(risk.current55plus)}</td></tr>
                <tr><td>Idade média dos titulares</td><td>{risk.avgAge ?? "·"} anos</td></tr>
              </tbody>
            </Table>
            <Insight>
              💡 A transição da faixa 35–44 para 45–54 costuma elevar o custo per capita em
              <strong> 2 a 3×</strong> (referência ANS). Antecipar ações de saúde nesse grupo é a
              principal alavanca para conter o reajuste futuro.
            </Insight>
          </Section>
        )}

        <Foot>
          <span>FRB Consultoria · Documento gerencial confidencial</span>
          <span>Gerado automaticamente em {genDate}</span>
        </Foot>
      </Doc>
    </Screen>
  );
};
