// src/pages/BillingHistory/index.jsx
// Histórico de faturamentos mensais salvos.
// Acessível por invoicingadmin, invoicinguser e rh.

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiCalendar, FiUsers, FiDollarSign,
  FiTrash2, FiRefreshCw, FiBarChart2, FiSearch,
  FiFileText, FiLoader, FiBriefcase,
} from "react-icons/fi";
import {
  PageWrapper, Topbar, TopbarLogo, TopbarTitle, BackBtn,
  Content, SectionTitle,
} from "../BillingOrganization/style";
import {
  FilterBar, FilterGroup, FilterSelect, FilterInput,
  SnapshotGrid, SnapshotCard, CardHeader, CardMonth,
  CardCompany, CardStats, StatItem, StatLabel, StatValue,
  CardFooter, DeleteBtn, ViewBtn, EmptyHistory, EmptyIcon,
  SubsChips, SubChip,
  ProductBadge, ProductFilterChip,
} from "./style";
import FRB from "../../assets/img/logoBranca.webp";
import { api } from "../../services/api";
import { notifySucess, notifyError } from "../../Toastfy";
import { SkeletonCards } from "../../components/Skeleton/Skeleton";

const MONTHS = [
  "","Jan","Fev","Mar","Abr","Mai","Jun",
  "Jul","Ago","Set","Out","Nov","Dez",
];

const PRODUCT_LABELS = { dental: "Dental", saude: "Saúde" };

const fmtBRL = (v) =>
  (v ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// ─────────────────────────────────────────────────────────────────────────────
export const BillingHistory = () => {
  const navigate = useNavigate();

  const [snapshots, setSnapshots] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [deleting,  setDeleting]  = useState(null);

  // Filtros
  const [filterMonth,   setFilterMonth]   = useState("");
  const [filterYear,    setFilterYear]    = useState("");
  const [filterCompany, setFilterCompany] = useState("");   // busca por texto (contém)
  const [companySel,    setCompanySel]    = useState("");   // seleção exata via dropdown
  const [filterProduct, setFilterProduct] = useState("");  // ""=Todos, "dental", "saude"

  const years = [...new Set(snapshots.map(s => s.year))].sort((a, b) => b - a);
  // Lista de empresas para o seletor · derivada de todos os snapshots carregados
  const companies = [...new Set(snapshots.map(s => s.company_name || "").filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  // company_name NÃO vai no servidor · assim a lista de empresas do dropdown
  // permanece completa; a filtragem por empresa é feita no cliente.
  const fetchSnapshots = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterMonth)   params.month   = filterMonth;
      if (filterYear)    params.year    = filterYear;
      if (filterProduct) params.product = filterProduct;

      const res  = await api.get("billing-snapshots/", { params, skipGlobalLoader: true });
      const data = res.data?.results ?? res.data ?? [];
      setSnapshots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      notifyError("Erro ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }, [filterMonth, filterYear, filterProduct]);

  useEffect(() => { fetchSnapshots(); }, [fetchSnapshots]);

  const handleDelete = async (snap) => {
    const prodLabel = PRODUCT_LABELS[snap.product] ?? snap.product ?? "";
    if (!confirm(`Excluir faturamento ${prodLabel} de ${MONTHS[snap.month]}/${snap.year} · ${snap.company_name || "sem empresa"}?`)) return;
    setDeleting(snap.id);
    try {
      await api.delete(`billing-snapshots/${snap.id}/`, { skipGlobalLoader: true });
      setSnapshots(prev => prev.filter(s => s.id !== snap.id));
      notifySucess("Faturamento removido.");
    } catch (err) {
      console.error(err);
      notifyError("Erro ao remover.");
    } finally {
      setDeleting(null);
    }
  };

  // Filtragem local + ordenação por data (mais recente primeiro)
  const displayed = snapshots
    .filter(s => {
      const name = (s.company_name ?? "");
      if (companySel && name !== companySel) return false;
      if (filterCompany && !name.toLowerCase().includes(filterCompany.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) =>
      (a.year - b.year) ||
      (a.month - b.month) ||
      String(a.company_name || "").localeCompare(String(b.company_name || ""), "pt-BR")
    );

  return (
    <PageWrapper>
      <Topbar>
        <TopbarLogo src={FRB} alt="FRB" />
        <TopbarTitle>Histórico de Faturamento</TopbarTitle>
        <div style={{ display: "flex", gap: 10 }}>
          <BackBtn onClick={() => navigate("/beneficios/faturamento/dashboard")}
            style={{ borderColor: "rgba(4,173,224,.3)", color: "#04ade0" }}>
            <FiBarChart2 size={13} /> Dashboard
          </BackBtn>
          <BackBtn onClick={() => navigate("/user")}>
            <FiArrowLeft size={13} /> Menu de serviços
          </BackBtn>
        </div>
      </Topbar>

      <Content>
        <SectionTitle><FiCalendar /> Faturamentos Salvos</SectionTitle>

        {/* ── Filtros ── */}
        <FilterBar>
          <FilterGroup>
            <FiBriefcase size={14} />
            <FilterSelect value={companySel} onChange={e => setCompanySel(e.target.value)}>
              <option value="">Todas as empresas</option>
              {companies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FiSearch size={14} />
            <FilterInput
              placeholder="Buscar empresa..."
              value={filterCompany}
              onChange={e => setFilterCompany(e.target.value)}
            />
          </FilterGroup>
          <FilterGroup>
            <FiCalendar size={14} />
            <FilterSelect value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
              <option value="">Todos os meses</option>
              {MONTHS.slice(1).map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          <FilterGroup>
            <FilterSelect value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              <option value="">Todos os anos</option>
              {(years.length > 0 ? years : [new Date().getFullYear()]).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          {/* Filtro por produto */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[
              { value: "",       label: "Todos"  },
              { value: "dental", label: "Dental" },
              { value: "saude",  label: "Saúde"  },
            ].map(p => (
              <ProductFilterChip
                key={p.value}
                $active={filterProduct === p.value}
                $product={p.value}
                onClick={() => setFilterProduct(p.value)}
              >
                {p.label}
              </ProductFilterChip>
            ))}
          </div>

          <BackBtn onClick={fetchSnapshots} style={{ marginLeft: "auto" }}>
            <FiRefreshCw size={13} /> Atualizar
          </BackBtn>
        </FilterBar>

        {/* ── Lista ── */}
        {loading ? (
          <SkeletonCards count={6} cols={3} />
        ) : displayed.length === 0 ? (
          <EmptyHistory>
            <EmptyIcon><FiFileText size={48} /></EmptyIcon>
            <h3>Nenhum faturamento encontrado</h3>
            <p>Processe um faturamento e clique em <strong>"Salvar no Histórico"</strong> para registrá-lo aqui.</p>
            <BackBtn onClick={() => navigate("/beneficios/faturamento")} style={{ marginTop: 16 }}>
              <FiArrowLeft size={13} /> Ir para Faturamento
            </BackBtn>
          </EmptyHistory>
        ) : (
          <SnapshotGrid>
            {displayed.map(snap => (
              <SnapshotCard key={snap.id}>
                <CardHeader>
                  <CardMonth>
                    <span className="month">{MONTHS[snap.month]}</span>
                    <span className="year">{snap.year}</span>
                  </CardMonth>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <CardCompany style={{ margin: 0 }}>
                        {snap.company_name || <em style={{ opacity: .4 }}>Sem empresa</em>}
                      </CardCompany>
                      <ProductBadge $product={snap.product}>
                        {PRODUCT_LABELS[snap.product] ?? snap.product ?? "·"}
                      </ProductBadge>
                    </div>
                  </div>
                </CardHeader>

                <CardStats>
                  <StatItem>
                    <FiUsers size={14} />
                    <div>
                      <StatLabel>Vidas</StatLabel>
                      <StatValue>{(snap.total_vidas ?? 0).toLocaleString("pt-BR")}</StatValue>
                    </div>
                  </StatItem>
                  <StatItem>
                    <FiDollarSign size={14} />
                    <div>
                      <StatLabel>Total</StatLabel>
                      <StatValue>{fmtBRL(parseFloat(snap.total_value ?? 0))}</StatValue>
                    </div>
                  </StatItem>
                </CardStats>

                {snap.summary_blocks?.length > 0 && (
                  <SubsChips>
                    {snap.summary_blocks.map(b => (
                      <SubChip key={b.sub}>Sub {b.sub}</SubChip>
                    ))}
                  </SubsChips>
                )}

                <CardFooter>
                  <div style={{ fontSize: ".7rem", color: "rgba(255,255,255,.3)" }}>
                    Salvo em {new Date(snap.created_at).toLocaleDateString("pt-BR")}
                    {snap.created_by_name ? ` · ${snap.created_by_name}` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <ViewBtn onClick={() => navigate(`/beneficios/faturamento/dashboard?snapshot=${snap.id}`)}>
                      <FiBarChart2 size={12} /> Ver
                    </ViewBtn>
                    <DeleteBtn onClick={() => handleDelete(snap)} disabled={deleting === snap.id}>
                      {deleting === snap.id
                        ? <FiLoader size={12} className="spin" />
                        : <FiTrash2 size={12} />}
                    </DeleteBtn>
                  </div>
                </CardFooter>
              </SnapshotCard>
            ))}
          </SnapshotGrid>
        )}
      </Content>
    </PageWrapper>
  );
};
