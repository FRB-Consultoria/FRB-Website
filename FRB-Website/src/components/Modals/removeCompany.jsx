import { ModalBackground } from "./ModalBackground";
import { Button } from "../Button";
import { RemoveCompanyStyle } from "./removeCompanyStyle";
import { useContext } from "react";
import { AdminContext } from "../../contexts/adminContext/adminContext";
import { UserContext } from "../../contexts/userContext/userContext";

export const RemoveCompanyModal = ({name, client_id}) => {
  const { deleteClient } = useContext(AdminContext);
  const { setCompanyModal } = useContext(UserContext);

  return (
      <RemoveCompanyStyle>
          <ModalBackground size="removeCompany">
            <h4>Tem certeza que deseja remover o cliente {name}?</h4>
            <div>
              <span>
                <Button type="button" name="Cancelar" onClick={()=>{setCompanyModal(false)}}/>
                <Button type="button" name="Sim, tenho certeza" onClick={()=>{deleteClient(client_id, "Sim, tenho certeza")}} />
              </span>
            </div>
          </ModalBackground>
      </RemoveCompanyStyle>
  );
};
