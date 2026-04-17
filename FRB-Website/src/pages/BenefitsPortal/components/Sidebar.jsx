// src/pages/BenefitsPortal/components/Sidebar.jsx
import React from "react";
import { FiSearch, FiRefreshCw, FiX } from "react-icons/fi";
import FRB from "../../../assets/img/logoBranca.webp";
import { IntegrationPanel } from "./IntegrationPanel";

export const Sidebar = ({
  activeTab,
  setActiveTab,
  benefitsSelectedCompany,
  setBenefitsSelectedCompany,
  setCompanyPick,
  companiesOptions,
  benefitsSearch,
  onSearchChange,
  onSearch,
  onClearSearch,
  onLoadCompany,
  benefPlanFilter,
  setBenefPlanFilter,
  benefRegistrationFilter,
  setBenefRegistrationFilter,
  benefitPlanOptions,
  exclStatus,
  setExclStatus,
  exclPlano,
  setExclPlano,
  exclusionPlanOptions,
}) => (
  <aside className="sidebar">
    <div className="logoBox">
      <img className="logo" src={FRB} alt="FRB Consultoria" />
    </div>

    <div className="sideTitle">
      <h2>Benefícios</h2>
      <p>Portal administrativo</p>
    </div>

    {/* ── Tabs ── */}
    <div className="sideSection">
      <div className="sectionTitle">Abas</div>
      <div className="tabBar">
        <button
          className={`tabBtn ${activeTab === "beneficiaries" ? "active" : ""}`}
          onClick={() => setActiveTab("beneficiaries")}
          type="button"
        >
          Titulares
        </button>
        <button
          className={`tabBtn ${activeTab === "exclusions" ? "active" : ""}`}
          onClick={() => setActiveTab("exclusions")}
          type="button"
        >
          Exclusões
        </button>
      </div>
    </div>

    {/* ── Company + search ── */}
    <div className="sideSection">
      <div className="sectionTitle">Empresa e busca</div>

      <div className="field">
        <label>Empresa</label>
        <select
          value={benefitsSelectedCompany || ""}
          onChange={(e) => {
            setBenefitsSelectedCompany(e.target.value);
            setCompanyPick(e.target.value);
          }}
        >
          <option value="">Selecione...</option>
          {companiesOptions.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <button className="primaryBtn" type="button" onClick={onLoadCompany}>
        <FiRefreshCw />
        Carregar empresa
      </button>

      <div className="field" style={{ marginTop: 8 }}>
        <label>Busca</label>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <input
            value={benefitsSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            maxLength={120}
            placeholder="Nome, CPF, matrícula ou plano..."
            style={{ flex: 1 }}
          />
          {benefitsSearch && (
            <button type="button" className="filterClearBtn" onClick={onClearSearch} title="Limpar busca">
              <FiX />
            </button>
          )}
        </div>
      </div>

      <button className="ghostBtn" onClick={onSearch} type="button">
        <FiSearch />
        Buscar
      </button>
    </div>

    {/* ── Integration Panel (public_id / webhook) ── */}
    {benefitsSelectedCompany && (
      <IntegrationPanel benefitsSelectedCompany={benefitsSelectedCompany} />
    )}

    {/* ── Beneficiaries filters ── */}
    {activeTab === "beneficiaries" && (
      <div className="sideSection">
        <div className="sectionTitle">Filtros da lista</div>

        <div className="field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ marginBottom: 0 }}>Status do cadastro no plano</label>
            {benefRegistrationFilter !== "all" && (
              <button type="button" className="filterClearBtn" onClick={() => setBenefRegistrationFilter("all")} title="Limpar filtro">
                <FiX /> Limpar
              </button>
            )}
          </div>
          <select
            value={benefRegistrationFilter}
            onChange={(e) => setBenefRegistrationFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="to_register">A cadastrar</option>
            <option value="registered_waiting_card">Aguardando carteirinha</option>
            <option value="card_saved">Cadastro confirmado</option>
          </select>
        </div>

        <div className="field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ marginBottom: 0 }}>Plano</label>
            {benefPlanFilter !== "all" && (
              <button type="button" className="filterClearBtn" onClick={() => setBenefPlanFilter("all")} title="Limpar filtro">
                <FiX /> Limpar
              </button>
            )}
          </div>
          <select
            value={benefPlanFilter}
            onChange={(e) => setBenefPlanFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            {benefitPlanOptions.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>
      </div>
    )}

    {/* ── Exclusion filters ── */}
    {activeTab === "exclusions" && (
      <div className="sideSection">
        <div className="sectionTitle">Filtros das exclusões</div>

        <div className="field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ marginBottom: 0 }}>Status</label>
            {exclStatus !== "all" && (
              <button type="button" className="filterClearBtn" onClick={() => setExclStatus("all")} title="Limpar filtro">
                <FiX /> Limpar
              </button>
            )}
          </div>
          <select
            value={exclStatus}
            onChange={(e) => setExclStatus(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendentes</option>
            <option value="sent">Lembrete enviado</option>
            <option value="resolved">Resolvidos</option>
          </select>
        </div>

        <div className="field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ marginBottom: 0 }}>Plano</label>
            {exclPlano && (
              <button type="button" className="filterClearBtn" onClick={() => setExclPlano("")} title="Limpar filtro">
                <FiX /> Limpar
              </button>
            )}
          </div>
          <select
            value={exclPlano}
            onChange={(e) => setExclPlano(e.target.value)}
          >
            <option value="">Todos</option>
            {exclusionPlanOptions.map((plan) => (
              <option key={plan} value={plan}>
                {plan}
              </option>
            ))}
          </select>
        </div>
      </div>
    )}
  </aside>
);