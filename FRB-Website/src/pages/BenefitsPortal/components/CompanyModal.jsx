import React from "react";
import { FiFilter } from "react-icons/fi";

export const CompanyModal = ({
  open,
  companyPick,
  setCompanyPick,
  companiesOptions,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="companyModalOverlay">
      <div className="companyModalCard">
        <div className="companyModalHeader">
          <h3>Selecione a empresa</h3>
        </div>

        <div className="companyModalBody">
          <div className="companyFormField">
            <label>Empresa</label>
            <select
              value={companyPick}
              onChange={(e) => setCompanyPick(e.target.value)}
            >
              <option value="">Selecione...</option>
              {companiesOptions.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="companyModalActions">
            <button className="primaryBtn" onClick={onConfirm} type="button">
              <FiFilter />
              Carregar dados
            </button>
          </div>

          <p className="companyHint">
            Sem selecionar a empresa o portal não consegue buscar os titulares,
            dependentes e exclusões.
          </p>
        </div>
      </div>
    </div>
  );
};