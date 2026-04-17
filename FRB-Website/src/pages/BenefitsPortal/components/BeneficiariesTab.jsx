// src/pages/BenefitsPortal/components/BeneficiariesTab.jsx
import React, { useRef, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiUsers, FiAlertCircle, FiCheckCircle, FiX, FiUserCheck } from "react-icons/fi";
import { PersonCard } from "./PersonCard";
import { RegistrationChip, IntakeChip } from "./BenefitsChips";
import { safeText, formatCPF } from "../utils/benefitsFormatters";
import { getFamilyColor, getFamilyPendingReasons, mapPerson } from "../utils/benefitsHelpers";

const ColorLegend = () => (
  <div className="colorLegend">
    <span className="legendTitle">Legenda:</span>
    <span className="legendItem">
      <span className="legendDot legendDotGreen" /> Família completa
    </span>
    <span className="legendItem">
      <span className="legendDot legendDotYellow" /> Ação parcial (pendência)
    </span>
    <span className="legendItem">
      <span className="legendDot legendDotRed" /> Nenhuma ação feita
    </span>
  </div>
);

/**
 * Cor do card na lista lateral:
 * - Verde  → card_saved E e-mail enviado
 * - Amarelo → card_saved sem e-mail, ou registered_waiting_card
 * - Vermelho → to_register ou sem ação
 */
const getFamilyColorClass = (item) => {
  const planStatus = String(item.PLAN_REGISTRATION_STATUS || "").toLowerCase();
  const emailSent = Boolean(item.LAST_CARD_EMAIL_SENT_AT);

  if (planStatus === "card_saved" && emailSent) return "familyGreen";
  if (planStatus === "card_saved" || planStatus === "registered_waiting_card") return "familyYellow";
  return "familyRed";
};

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
  onSendCardEmail,
  toRegisterOpen,
  setToRegisterOpen,
  toRegisterLoading,
  toRegisterItems,
  toRegisterTotal,
  onToRegisterClick,
}) => {
  const familyColor = currentRoot
    ? getFamilyColor(currentRoot, currentRoot.DEPENDENTES || [])
    : null;

  // Fechar dropdown ao clicar fora
  const toRegisterRef = useRef(null);
  useEffect(() => {
    if (!toRegisterOpen) return;
    const handler = (e) => {
      if (toRegisterRef.current && !toRegisterRef.current.contains(e.target)) {
        setToRegisterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [toRegisterOpen, setToRegisterOpen]);

  const pendingReasons =
    currentRoot && familyColor && familyColor !== "green"
      ? getFamilyPendingReasons(currentRoot, currentRoot.DEPENDENTES || [])
      : [];

  return (
    <div className="workspace">
      <div className="contentTopbar">
        <div className="pageTitle">
          <h1>Titulares e árvore de dependentes</h1>
          <p>
            Os titulares pendentes ficam no topo. Clique em um titular para abrir
            a raiz da família. A cor do card reflete o status real da família inteira.
          </p>
        </div>
        <div className="statsRow">
          <div className="metaChip"><span>Total da página</span><strong>{titularList.length}</strong></div>
          <div className="metaChip"><span>Total no geral</span><strong>{beneficiariesMeta?.count || 0}</strong></div>

          {/* Chip clicável "A cadastrar" */}
          <div
            ref={toRegisterRef}
            className={`metaChip metaChipBtn${toRegisterTotal > 0 ? " metaChipAlert" : ""}`}
            onClick={onToRegisterClick}
            title="Ver lista de titulares pendentes de cadastro"
            style={{ cursor: "pointer", userSelect: "none", position: "relative" }}
          >
            <span>A cadastrar</span>
            <strong>{toRegisterTotal}</strong>

            {toRegisterOpen && (
              <div
                className="toRegisterDropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="toRegDropdownHeader">
                  <span><FiUserCheck style={{ marginRight: 4 }} />Pendentes de cadastro</span>
                  <button type="button" onClick={() => setToRegisterOpen(false)} className="toRegCloseBtn"><FiX /></button>
                </div>
                {toRegisterLoading ? (
                  <div className="toRegDropdownEmpty">
                    <div className="loaderDots"><span /><span /><span /></div>
                    Carregando...
                  </div>
                ) : toRegisterItems.length === 0 ? (
                  <div className="toRegDropdownEmpty">Nenhum titular pendente encontrado.</div>
                ) : (
                  <div className="toRegDropdownList">
                    {toRegisterTotal > toRegisterItems.length && (
                      <div className="toRegDropdownNote">Mostrando {toRegisterItems.length} de {toRegisterTotal}</div>
                    )}
                    {toRegisterItems.map((item) => (
                      <div
                        key={item.id}
                        className="toRegDropdownItem"
                        onClick={() => { handleSelectRoot(item.id); setToRegisterOpen(false); }}
                      >
                        <div className="toRegItemName">{safeText(item.NOME)}</div>
                        <div className="toRegItemCpf">CPF: {formatCPF(item.CPF_TIT)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ColorLegend />

      <div className="treeLayout">
        {/* Painel esquerdo — lista */}
        <div className="panel">
          <div className="panelHeader">
            <div>
              <h3>Lista de titulares</h3>
              <p>Selecione um titular para abrir a árvore.</p>
            </div>
          </div>
          <div className="panelBody">
            {beneficiariesFetching ? (
              <div className="emptyState">
                <div className="loaderDots"><span /><span /><span /></div>
                Carregando titulares...
              </div>
            ) : titularList.length === 0 ? (
              <div className="emptyState">Nenhum titular encontrado.</div>
            ) : (
              <>
                <div className="rootList">
                  {titularList.map((item) => {
                    const colorClass = getFamilyColorClass(item);
                    const isActive = String(selectedRootId) === String(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`rootItem ${isActive ? "active" : ""} ${colorClass}`}
                        onClick={() => handleSelectRoot(item.id)}
                      >
                        <div className="rootItemTop">
                          <div>
                            <div className="rootItemName">{safeText(item.NOME)}</div>
                            <div className="rootItemSub">
                              <span>CPF: {formatCPF(item.CPF_TIT)}</span>
                              <span>Matrícula: {safeText(item.MATRICULA)}</span>
                              <span>Plano: {safeText(item.CODIGO_DO_PLANO)}</span>
                              <span>Saúde: {item.NO_HEALTH_CARD ? "NÃO EXISTE" : safeText(item.CARTEIRINHA_SAUDE)}</span>
                              <span>Dental: {item.NO_DENTAL_CARD ? "NÃO EXISTE" : safeText(item.CARTEIRINHA_DENTAL)}</span>
                            </div>
                          </div>
                          <span className="chip default"><FiUsers />{item.DEPENDENT_COUNT || 0}</span>
                        </div>
                        <div className="rootItemFooter">
                          <RegistrationChip status={item.PLAN_REGISTRATION_STATUS} />
                          {/*
                            Na lista lateral não temos os eventos detalhados (EVENTOS_RECENTES),
                            então passamos eventos=[]. O IntakeChip não mostrará "updated"
                            sem confirmação de evento real — isso é intencional.
                            Mostrará aviso prévio / exclusão / demitido com base em STATUS e AVISO_PREVIO_ATE.
                          */}
                          <IntakeChip
                            status={item.STATUS}
                            avisoPrevioAte={item.AVISO_PREVIO_ATE}
                            eventos={[]}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="paginationBar">
                  <button className="pageBtn" disabled={!beneficiariesMeta?.previous} onClick={goBeneficiariesPrevPage} type="button">
                    <FiChevronLeft /> Anterior
                  </button>
                  <div className="pageInfo">Página {beneficiariesMeta?.page || 1}</div>
                  <button className="pageBtn" disabled={!beneficiariesMeta?.next} onClick={goBeneficiariesNextPage} type="button">
                    Próxima <FiChevronRight />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Painel direito — árvore */}
        <div className={`panel ${familyColor ? `panelBorder_${familyColor}` : ""}`}>
          <div className="panelHeader">
            <div>
              <h3>Árvore da família</h3>
              <p>Titular na raiz, dependentes abaixo. A borda reflete o status da família.</p>
            </div>

            {/* Família completa */}
            {familyColor === "green" && currentRoot && (
              <div className="familyCompleteAlert">
                <FiCheckCircle />
                <span>Família completa</span>
              </div>
            )}

            {/* Família com pendências — lista razões específicas */}
            {familyColor && familyColor !== "green" && currentRoot && (
              <div className="familyPendingAlert">
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FiAlertCircle />
                  <span>{familyColor === "red" ? "Família sem ação" : "Família com pendências"}</span>
                </div>
                {pendingReasons.length > 0 && (
                  <ul style={{ margin: "6px 0 0", padding: "0 0 0 4px", listStyle: "none", display: "grid", gap: 3 }}>
                    {pendingReasons.map((reason, i) => (
                      <li key={i} style={{ fontSize: "0.76rem", opacity: 0.9 }}>• {reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="panelBody">
            {selectedTreeLoading ? (
              <div className="detailEmpty">
                <div className="loaderDots"><span /><span /><span /></div>
                Carregando árvore da família...
              </div>
            ) : !currentRoot ? (
              <div className="detailEmpty">
                Selecione um titular na lista ao lado para visualizar a raiz e os dependentes.
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
                    onSendCardEmail={onSendCardEmail}
                    familyColor={familyColor}
                  />
                </div>

                <div className="sectionDivider" />

                <div>
                  <div className="panelHeader" style={{ padding: 0, borderBottom: 0 }}>
                    <div>
                      <h3>Dependentes</h3>
                      <p>Cada dependente pode ser cadastrado e ter carteirinha salva individualmente.</p>
                    </div>
                  </div>

                  {(currentRoot.DEPENDENTES || []).length === 0 ? (
                    <div className="emptyState">Este titular não possui dependentes cadastrados.</div>
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
                            onSendCardEmail={onSendCardEmail}
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
};