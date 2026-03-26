import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ExclusionCard } from "./ExclusionCard";

export const ExclusionsTab = ({
  exclusionRows,
  benefitsFetching,
  benefitsMeta,
  goBenefitsNextPage,
  goBenefitsPrevPage,
  sendExclusionReminder,
  markExclusionResolved,
  benefitsSelectedCompany,
}) => (
  <div className="workspace">
    {/* ── Topbar ── */}
    <div className="contentTopbar">
      <div className="pageTitle">
        <h1>Exclusões pendentes</h1>
        <p>
          Quando a exclusão for do titular, a família inteira pode ser
          resolvida. Quando a exclusão for só de um dependente, apenas ele
          aparece e apenas ele é resolvido.
        </p>
      </div>

      <div className="statsRow">
        <div className="metaChip">
          <span>Total da página</span>
          <strong>{exclusionRows.length}</strong>
        </div>
        <div className="metaChip">
          <span>Total no geral</span>
          <strong>{benefitsMeta?.count || 0}</strong>
        </div>
        <div className="metaChip">
          <span>Pendentes</span>
          <strong>
            {
              exclusionRows.filter((row) => String(row.status) === "pending")
                .length
            }
          </strong>
        </div>
      </div>
    </div>

    <div className="panel">
      <div className="panelHeader">
        <div>
          <h3>Fluxo de exclusões</h3>
          <p>
            Cards individuais por beneficiário para manter o mesmo padrão
            visual dos titulares.
          </p>
        </div>
      </div>

      <div className="panelBody">
        {benefitsFetching ? (
          <div className="emptyState">Carregando exclusões...</div>
        ) : exclusionRows.length === 0 ? (
          <div className="emptyState">Nenhuma exclusão encontrada.</div>
        ) : (
          <div className="exclusionCardGrid">
            {exclusionRows.map((row) => (
              <ExclusionCard
                key={row.id}
                row={row}
                onSendReminder={sendExclusionReminder}
                onResolve={markExclusionResolved}
                benefitsSelectedCompany={benefitsSelectedCompany}
              />
            ))}
          </div>
        )}

        <div className="paginationBar">
          <button
            className="pageBtn"
            disabled={!benefitsMeta?.previous}
            onClick={goBenefitsPrevPage}
            type="button"
          >
            <FiChevronLeft />
            Anterior
          </button>
          <div className="pageInfo">Página {benefitsMeta?.page || 1}</div>
          <button
            className="pageBtn"
            disabled={!benefitsMeta?.next}
            onClick={goBenefitsNextPage}
            type="button"
          >
            Próxima
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  </div>
);