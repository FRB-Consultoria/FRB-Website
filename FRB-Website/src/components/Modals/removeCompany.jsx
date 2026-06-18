import { ModalBackground } from "./ModalBackground";
import { useContext } from "react";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { UserContext } from "../../contexts/userContext/userContext";
import { ModalTitle, ConfirmText, BtnRow, ModalGhostBtn, ModalDangerBtn } from "./modalShared";

export const RemoveCompanyModal = ({ name, client_id }) => {
  const { deleteClient } = useContext(AdminContext);
  const { setCompanyModal } = useContext(UserContext);

  return (
    <ModalBackground size="removeCompany">
      <ModalTitle>Remover Cliente</ModalTitle>
      <ConfirmText>
        Tem certeza que deseja remover o cliente <strong>{name}</strong>?
        <br />Esta ação não pode ser desfeita.
      </ConfirmText>
      <BtnRow>
        <ModalGhostBtn type="button" onClick={() => setCompanyModal(false)}>
          Cancelar
        </ModalGhostBtn>
        <ModalDangerBtn
          type="button"
          onClick={() => deleteClient(client_id, "Sim, tenho certeza")}
        >
          Sim, remover
        </ModalDangerBtn>
      </BtnRow>
    </ModalBackground>
  );
};
