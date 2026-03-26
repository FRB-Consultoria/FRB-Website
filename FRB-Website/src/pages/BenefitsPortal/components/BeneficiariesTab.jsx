import React from "react";
import { FiChevronLeft, FiChevronRight, FiUsers } from "react-icons/fi";
import { PersonCard } from "./PersonCard";
import { RegistrationChip, IntakeChip } from "./BenefitsChips";
import { safeText, formatCPF } from "../utils/benefitsFormatters";

export const BeneficiariesTab = ({
  titularList,
  selectedRootId,
  currentRoot,
  selectedTreeLoading,
  beneficiariesFetching,
  beneficiariesMeta,
  goBeneficiariesNextPage,
  goBeneficiariesPrevPage,
  handleSelectRoot,
  copiedKey,
  onCopy,
  getCardDraftValue,
  onCardChange,
  onSaveCard,
  onMarkCardMissing,
  onReactivateCard,
  onMarkRegistered,
}) => (
  <div className="workspace">
    {/* ── Topbar ── */}
    <div className="contentTopbar">
      <div className="pageTitle">
        <h1>Titulares e árvore de dependentes</h1>
        <p>
          Os titulares pendentes ficam no topo. Clique em um titular para abrir
          a raiz da família e operar o cadastro no plano.
        </p>
      </div>

      <div className="statsRow">
        <div className="metaChip">
          <span>Total da página</span>
          <strong>{titularList.length}</strong>
        </div>
        <div className="metaChip">
          <span>Total no geral</span>
          <strong>{beneficiariesMeta?.count || 0}</strong>
        </div>
        <div className="metaChip">
          <span>A cadastrar</span>
          <strong>
            {
              titularList.filter(
                (item) =>
                  String(item.PLAN_REGISTRATION_STATUS) === "to_register"
              ).length
            }
          </strong>
        </div>
      </div>
    </div>

    <div className="treeLayout">
      {/* ── Left panel: titular list ── */}
      <div className="panel">
        <div className="panelHeader">
          <div>
            <h3>Lista de titulares</h3>
            <p>Selecione um titular para abrir a árvore.</p>
          </div>
        </div>

        <div className="panelBody">
          {beneficiariesFetching ? (
            <div className="emptyState">Carregando titulares...</div>
          ) : titularList.length === 0 ? (
            <div className="emptyState">
              Nenhum titular encontrado para a empresa/filtro atual.
            </div>
          ) : (
            <>
              <div className="rootList">
                {titularList.map((item) => (
                  <div
                    key={item.id}
                    className={`rootItem ${
                      String(selectedRootId) === String(item.id) ? "active" : ""
                    }`}
                    onClick={() => handleSelectRoot(item.id)}
                  >
                    <div className="rootItemTop">
                      <div>
                        <div className="rootItemName">
                          {safeText(item.NOME)}
                        </div>
                        <div className="rootItemSub">
                          <span className="mono">
                            CPF: {formatCPF(item.CPF_TIT)}
                          </span>
                          <span className="mono">
                            Matrícula: {safeText(item.MATRICULA)}
                          </span>
                          <span>Plano: {safeText(item.CODIGO_DO_PLANO)}</span>
                          <span>
                            Saúde:{" "}
                            {item.NO_HEALTH_CARD
                              ? "Não existe"
                              : safeText(item.CARTEIRINHA_SAUDE)}
                          </span>
                          <span>
                            Dental:{" "}
                            {item.NO_DENTAL_CARD
                              ? "Não existe"
                              : safeText(item.CARTEIRINHA_DENTAL)}
                          </span>
                        </div>
                      </div>

                      <span className="chip default">
                        <FiUsers />
                        {item.DEPENDENT_COUNT || 0}
                      </span>
                    </div>

                    <div className="rootItemFooter">
                      <RegistrationChip
                        status={item.PLAN_REGISTRATION_STATUS}
                      />
                      <IntakeChip status={item.STATUS} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="paginationBar">
                <button
                  className="pageBtn"
                  disabled={!beneficiariesMeta?.previous}
                  onClick={goBeneficiariesPrevPage}
                  type="button"
                >
                  <FiChevronLeft />
                  Anterior
                </button>
                <div className="pageInfo">
                  Página {beneficiariesMeta?.page || 1}
                </div>
                <button
                  className="pageBtn"
                  disabled={!beneficiariesMeta?.next}
                  onClick={goBeneficiariesNextPage}
                  type="button"
                >
                  Próxima
                  <FiChevronRight />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Right panel: family tree ── */}
      <div className="panel">
        <div className="panelHeader">
          <div>
            <h3>Árvore da família</h3>
            <p>
              Titular na raiz, dependentes abaixo e ações individuais por
              pessoa.
            </p>
          </div>
        </div>

        <div className="panelBody">
          {selectedTreeLoading ? (
            <div className="detailEmpty">Carregando árvore da família...</div>
          ) : !currentRoot ? (
            <div className="detailEmpty">
              Selecione um titular na lista ao lado para visualizar a raiz e os
              dependentes.
            </div>
          ) : (
            <div className="treeScroll">
              <div className="rootTreeLine">
                <PersonCard
                  personRaw={currentRoot}
                  isRoot
                  copiedKey={copiedKey}
                  onCopy={onCopy}
                  getCardDraftValue={getCardDraftValue}
                  onCardChange={onCardChange}
                  onSaveCard={onSaveCard}
                  onMarkCardMissing={onMarkCardMissing}
                  onReactivateCard={onReactivateCard}
                  onMarkRegistered={onMarkRegistered}
                />
              </div>

              <div className="sectionDivider" />

              <div>
                <div
                  className="panelHeader"
                  style={{ padding: 0, borderBottom: 0 }}
                >
                  <div>
                    <h3>Dependentes</h3>
                    <p>
                      Cada dependente pode ser marcado como cadastrado e ter sua
                      própria carteirinha de saúde e dental salva.
                    </p>
                  </div>
                </div>

                {(currentRoot.DEPENDENTES || []).length === 0 ? (
                  <div className="emptyState">
                    Este titular não possui dependentes cadastrados.
                  </div>
                ) : (
                  <div className="dependentsGrid">
                    {(currentRoot.DEPENDENTES || []).map((dep) => (
                      <div className="dependentLine" key={dep.id}>
                        <PersonCard
                          personRaw={dep}
                          isRoot={false}
                          copiedKey={copiedKey}
                          onCopy={onCopy}
                          getCardDraftValue={getCardDraftValue}
                          onCardChange={onCardChange}
                          onSaveCard={onSaveCard}
                          onMarkCardMissing={onMarkCardMissing}
                          onReactivateCard={onReactivateCard}
                          onMarkRegistered={onMarkRegistered}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);