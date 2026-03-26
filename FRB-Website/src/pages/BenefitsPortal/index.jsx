import React from "react";
import { Main } from "./style";
import { useBenefitsPortal } from "./hooks/useBenefitsPortal";
import { Sidebar } from "./components/Sidebar";
import { CompanyModal } from "./components/CompanyModal";
import { ConfirmModal } from "./components/ConfirmModal";
import { BeneficiariesTab } from "./components/BeneficiariesTab";
import { ExclusionsTab } from "./components/ExclusionsTab";

export const BenefitsPortal = () => {
  const p = useBenefitsPortal();

  return (
    <Main>
      <CompanyModal
        open={p.companyModalOpen}
        companyPick={p.companyPick}
        setCompanyPick={p.setCompanyPick}
        companiesOptions={p.companiesOptions}
        onConfirm={p.onConfirmCompany}
      />

      <ConfirmModal
        open={p.confirmModal.isOpen}
        config={p.confirmModal.config}
        loading={p.confirmModal.loading}
        onClose={p.confirmModal.close}
        onConfirm={p.confirmModal.handleConfirm}
      />

      <Sidebar
        activeTab={p.activeTab}
        setActiveTab={p.setActiveTab}
        benefitsSelectedCompany={p.benefitsSelectedCompany}
        setBenefitsSelectedCompany={p.setBenefitsSelectedCompany}
        setCompanyPick={p.setCompanyPick}
        companiesOptions={p.companiesOptions}
        benefitsSearch={p.benefitsSearch}
        onSearchChange={p.setBenefitsSearch}
        onSearch={p.onSearch}
        onLoadCompany={p.onLoadCompany}
        benefPlanFilter={p.benefPlanFilter}
        setBenefPlanFilter={p.setBenefPlanFilter}
        benefRegistrationFilter={p.benefRegistrationFilter}
        setBenefRegistrationFilter={p.setBenefRegistrationFilter}
        benefitPlanOptions={p.benefitPlanOptions}
        exclStatus={p.exclStatus}
        setExclStatus={p.setExclStatus}
        exclPlano={p.exclPlano}
        setExclPlano={p.setExclPlano}
        exclusionPlanOptions={p.exclusionPlanOptions}
      />

      <section className="content">
        {p.activeTab === "beneficiaries" && (
          <BeneficiariesTab
            titularList={p.titularList}
            selectedRootId={p.selectedRootId}
            currentRoot={p.currentRoot}
            selectedTreeLoading={p.selectedTreeLoading}
            beneficiariesFetching={p.beneficiariesFetching}
            beneficiariesMeta={p.beneficiariesMeta}
            goBeneficiariesNextPage={p.goBeneficiariesNextPage}
            goBeneficiariesPrevPage={p.goBeneficiariesPrevPage}
            handleSelectRoot={p.handleSelectRoot}
            copiedKey={p.copiedKey}
            onCopy={p.copyToClipboard}
            getCardDraftValue={p.getCardDraftValue}
            onCardChange={p.onCardChange}
            onSaveCard={p.handleSavePersonCard}
            onMarkCardMissing={p.handleMarkCardMissing}
            onReactivateCard={p.handleReactivateCardInput}
            onMarkRegistered={p.handleMarkRegistered}
          />
        )}

        {p.activeTab === "exclusions" && (
          <ExclusionsTab
            exclusionRows={p.exclusionRows}
            benefitsFetching={p.benefitsFetching}
            benefitsMeta={p.benefitsMeta}
            goBenefitsNextPage={p.goBenefitsNextPage}
            goBenefitsPrevPage={p.goBenefitsPrevPage}
            sendExclusionReminder={p.sendExclusionReminder}
            markExclusionResolved={p.markExclusionResolved}
            benefitsSelectedCompany={p.benefitsSelectedCompany}
          />
        )}
      </section>
    </Main>
  );
};