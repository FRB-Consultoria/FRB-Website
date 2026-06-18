// src/pages/BillingOrganization/components/SaveModal.jsx
// Modal para confirmar salvamento do faturamento mensal no histórico.
// Busca os clientes cadastrados na API para vincular o snapshot ao cliente correto.

import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { FiSave, FiX, FiCalendar, FiLoader, FiBriefcase, FiPackage } from "react-icons/fi";
import { api } from "../../../services/api";
import { computeAnalytics } from "../utils/computeAnalytics";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];

const PRODUCTS = [
  { value: "dental", label: "Dental",  color: "#04ade0" },
  { value: "saude",  label: "Saúde",   color: "#34d399" },
];

const fadeIn = keyframes`from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}`;

const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 1200;
  background: rgba(0,0,0,.78);
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  backdrop-filter: blur(4px);
`;
const Card = styled.div`
  background: #0d1525;
  border: 1px solid rgba(4,173,224,.3);
  border-radius: 18px;
  padding: 32px 32px;
  width: 100%; max-width: 540px;
  animation: ${fadeIn} .22s ease;
  box-shadow: 0 24px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(4,173,224,.08);
`;
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 24px;
`;
const Title = styled.h2`
  color: #fff; font-size: 1.1rem; font-weight: 700;
  display: flex; align-items: center; gap: 8px;
  svg { color: #04ade0; }
  margin: 0;
`;
const CloseBtn = styled.button`
  background: transparent; border: none; cursor: pointer;
  color: rgba(255,255,255,.4); padding: 4px; border-radius: 6px;
  transition: all .15s;
  &:hover { color: #fff; background: rgba(255,255,255,.08); }
`;
const Label = styled.label`
  display: flex; align-items: center; gap: 6px;
  color: rgba(255,255,255,.55);
  font-size: .72rem; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; margin-bottom: 7px;
  svg { color: #04ade0; }
`;
const Select = styled.select`
  width: 100%; padding: 10px 14px; border-radius: 9px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.05); color: #fff;
  font-size: .9rem; margin-bottom: 16px;
  cursor: pointer; transition: border-color .15s;
  option { background: #0d1525; color: #fff; }
  &:focus { outline: none; border-color: #04ade0; }
  &:disabled { opacity: .45; cursor: default; }
`;
const SelectWrapper = styled.div`position: relative;`;

/* Seletor de produto · dois botões toggle */
const ProductRow = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
  margin-bottom: 16px;
`;
const ProductBtn = styled.button`
  padding: 10px 12px; border-radius: 9px; cursor: pointer;
  font-size: .85rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: all .15s;
  background: ${({ $active, $color }) => $active ? `${$color}22` : "rgba(255,255,255,.04)"};
  border: 2px solid ${({ $active, $color }) => $active ? $color : "rgba(255,255,255,.1)"};
  color: ${({ $active, $color }) => $active ? $color : "rgba(255,255,255,.45)"};
  &:hover { border-color: ${({ $color }) => $color}; color: ${({ $color }) => $color}; }
`;

const Row2 = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px;`;
const InfoBox = styled.div`
  background: rgba(4,173,224,.07);
  border: 1px solid rgba(4,173,224,.15);
  border-radius: 10px;
  padding: 14px 16px; margin-bottom: 20px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
`;
const InfoItem = styled.div`
  display: flex; flex-direction: column;
  label { font-size: .65rem; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 3px; }
  span  { font-size: .88rem; font-weight: 700; color: #04ade0; }
`;
const BtnRow = styled.div`display: flex; gap: 10px;`;
const BtnSecondary = styled.button`
  flex: 1; padding: 12px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,.12);
  background: transparent; color: rgba(255,255,255,.6);
  cursor: pointer; font-size: .88rem; font-weight: 600;
  transition: all .15s;
  &:hover { background: rgba(255,255,255,.06); color: #fff; }
`;
const BtnPrimary = styled.button`
  flex: 2; padding: 12px; border-radius: 10px;
  background: linear-gradient(135deg, #04ade0, #0270a0);
  border: none; color: #fff; cursor: pointer;
  font-size: .88rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: filter .15s;
  &:hover:not(:disabled) { filter: brightness(1.1); }
  &:disabled { opacity: .5; cursor: default; }
  .spin { animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const ConflictWarning = styled.div`
  background: rgba(255,160,0,.08);
  border: 1px solid rgba(255,160,0,.25);
  border-radius: 9px; padding: 11px 14px; margin-bottom: 14px;
  font-size: .78rem; color: #ffaa00; line-height: 1.5;
  strong { color: #ffcc44; }
`;
const LoadingClients = styled.div`
  font-size: .8rem; color: rgba(255,255,255,.4);
  margin-bottom: 16px; display: flex; align-items: center; gap: 6px;
  svg.spin { animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
const ValidationNote = styled.div`
  font-size: .72rem; color: rgba(255,255,255,.3);
  margin-bottom: 14px; text-align: center;
`;

/**
 * Props:
 *  - result:      { vidasRows, summaryBlocks, totalCert, totalCC }
 *                 Deve ser o resolvedResult (com correções já aplicadas).
 *  - totalValue:  number
 *  - onClose:     () => void
 *  - onSaved:     (snapshot) => void
 *  - apiSave:     async (payload, overwrite) => snapshot
 */
export const SaveModal = ({ result, totalValue, onClose, onSaved, apiSave }) => {
  const now = new Date();
  const [month,    setMonth]    = useState(now.getMonth() + 1);
  const [year,     setYear]     = useState(now.getFullYear());
  const [product,  setProduct]  = useState("");         // obrigatório: "dental"|"saude"
  const [clientId, setClientId] = useState("");
  const [clients,  setClients]  = useState([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [conflict, setConflict] = useState(false);

  const years = [];
  for (let y = now.getFullYear() - 2; y <= now.getFullYear() + 1; y++) years.push(y);

  useEffect(() => {
    let cancelled = false;
    setLoadingClients(true);
    api.get("clients/", { skipGlobalLoader: true })
      .then(r => { if (!cancelled) setClients(r.data?.results ?? r.data ?? []); })
      .catch(err => { if (!cancelled) console.warn("[SaveModal]", err); })
      .finally(() => { if (!cancelled) setLoadingClients(false); });
    return () => { cancelled = true; };
  }, []);

  const selectedClient = clients.find(c => c.id === clientId);
  const companyLabel   = selectedClient
    ? (selectedClient.corporate_name || selectedClient.client_name)
    : "";
  const productLabel   = PRODUCTS.find(p => p.value === product)?.label ?? "";

  const handleSave = async (overwrite = false) => {
    if (!clientId) { alert("Selecione uma empresa."); return; }
    if (!product)  { alert("Selecione o produto (Dental ou Saúde)."); return; }
    setSaving(true);
    try {
      const analytics = computeAnalytics(result.vidasRows, totalValue);

      const payload = {
        client_id:    clientId,
        company_name: companyLabel,
        month,
        year,
        product,
        total_vidas:  result.vidasRows.length,
        total_value:  totalValue.toFixed(2),
        summary_blocks: (result.summaryBlocks ?? []).map(b => ({
          sub:     b.sub,
          tsTotal: b.tsTotal ?? 0,
        })),
        total_cert: (result.totalCert ?? []).map(r => ({
          certif: r.certif,
          sub:    r.sub,
          total:  r.total,
        })),
        total_cc: (result.totalCC ?? []).map(r => ({
          centroCusto: r.centroCusto,
          codigoCC:    r.codigoCC,
          total:       r.total,
        })),
        analytics_data: analytics ?? {},
        // lives: todas as vidas corrigidas (result já é o resolvedResult)
        lives: result.vidasRows.map(r => ({
          sub:            r.sub            ?? "",
          certifFull:     r.certifFull     ?? "",
          certGrupo:      r.certGrupo      ?? "",
          nome:           r.nome           ?? "",
          cpf:            r.cpf            ?? "",
          centroCusto:    r.centroCusto    ?? "",
          codigoCC:       r.codigoCC       ?? "",
          dataNascimento: r.dataNascimento ?? "",
          sexo:           r.sexo           ?? "",
          estCivil:       r.estCivil       ?? "",
          parentesco:     r.parentesco     ?? "",
          plano:          r.plano          ?? "",
          dataInicio:     r.dataInicio     ?? "",
          tipoLancamento: r.tipoLancamento ?? "",
          lancamento:     r.lancamento     ?? "",
          valor:          r.valor          ?? 0,
        })),
      };

      const snap = await apiSave(payload, overwrite);
      onSaved(snap);
      onClose();
    } catch (err) {
      if (err?.response?.status === 409) {
        setConflict(true);
      } else {
        console.error(err);
        alert("Erro ao salvar. Verifique o console.");
      }
    } finally {
      setSaving(false);
    }
  };

  const canSave = !!clientId && !!product && !loadingClients;

  return (
    <Overlay onClick={e => e.target === e.currentTarget && onClose()}>
      <Card>
        <Header>
          <Title><FiSave /> Salvar Faturamento</Title>
          <CloseBtn onClick={onClose}><FiX size={18} /></CloseBtn>
        </Header>

        {/* Produto */}
        <Label><FiPackage size={11} />Produto</Label>
        <ProductRow>
          {PRODUCTS.map(p => (
            <ProductBtn
              key={p.value}
              $active={product === p.value}
              $color={p.color}
              onClick={() => { setProduct(p.value); setConflict(false); }}
            >
              {p.label}
            </ProductBtn>
          ))}
        </ProductRow>

        {/* Empresa */}
        <Label><FiBriefcase size={11} />Empresa</Label>
        {loadingClients ? (
          <LoadingClients>
            <FiLoader size={12} className="spin" />
            Carregando empresas...
          </LoadingClients>
        ) : (
          <SelectWrapper>
            <Select
              value={clientId}
              onChange={e => { setClientId(e.target.value); setConflict(false); }}
              disabled={clients.length === 0}
            >
              <option value="">· selecione a empresa ·</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.corporate_name || c.client_name}
                </option>
              ))}
            </Select>
          </SelectWrapper>
        )}

        {/* Mês / Ano */}
        <Row2>
          <div>
            <Label><FiCalendar size={11} />Mês</Label>
            <Select value={month} onChange={e => { setMonth(+e.target.value); setConflict(false); }}>
              {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </Select>
          </div>
          <div>
            <Label>Ano</Label>
            <Select value={year} onChange={e => { setYear(+e.target.value); setConflict(false); }}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </Select>
          </div>
        </Row2>

        {/* Resumo */}
        <InfoBox>
          <InfoItem>
            <label>Produto</label>
            <span style={{ color: PRODUCTS.find(p => p.value === product)?.color ?? "rgba(255,255,255,.3)" }}>
              {productLabel || "·"}
            </span>
          </InfoItem>
          <InfoItem>
            <label>Período</label>
            <span>{MONTHS[month - 1].slice(0,3)}/{year}</span>
          </InfoItem>
          <InfoItem>
            <label>Vidas</label>
            <span>{result.vidasRows.length.toLocaleString("pt-BR")}</span>
          </InfoItem>
          <InfoItem>
            <label>Total</label>
            <span>R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </InfoItem>
        </InfoBox>

        {result.vidasRows.length > 0 && (
          <ValidationNote>
            {result.vidasRows.length} vidas serão salvas no banco para consulta do RH.
          </ValidationNote>
        )}

        {conflict && (
          <ConflictWarning>
            ⚠️ O mês <strong>{MONTHS[month - 1]}/{year}</strong> já tem um faturamento{" "}
            <strong>{productLabel}</strong> processado
            {companyLabel ? ` na empresa ${companyLabel}` : ""}.<br />
            <strong>Substituir</strong> sobrescreve o registro do histórico por este (apaga e regrava as vidas).{" "}
            <strong>Cancelar</strong> volta para você escolher outro mês.
          </ConflictWarning>
        )}

        <BtnRow>
          {conflict ? (
            <>
              <BtnSecondary onClick={() => setConflict(false)}>Cancelar</BtnSecondary>
              <BtnPrimary onClick={() => handleSave(true)} disabled={saving || !canSave}>
                {saving ? <FiLoader size={14} className="spin" /> : <FiSave size={14} />}
                Substituir
              </BtnPrimary>
            </>
          ) : (
            <>
              <BtnSecondary onClick={onClose}>Cancelar</BtnSecondary>
              <BtnPrimary onClick={() => handleSave(false)} disabled={saving || !canSave}>
                {saving ? <FiLoader size={14} className="spin" /> : <FiSave size={14} />}
                Confirmar Salvamento
              </BtnPrimary>
            </>
          )}
        </BtnRow>
      </Card>
    </Overlay>
  );
};
