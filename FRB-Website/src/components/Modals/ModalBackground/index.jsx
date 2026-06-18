import { ModalBackgroundStyle } from "./styled";
import { useContext } from "react";
import { UserContext } from "../../../contexts/userContext/userContext";

export const ModalBackground = ({ children, size }) => {
  const { setClientModal, ClientModal, setCompanyModal } = useContext(UserContext);

  return (
    <ModalBackgroundStyle>
      <div className={"modal opacity-2 " + size}>
        <span
          className="close"
          onClick={() => {
            ClientModal ? setClientModal(false) : setCompanyModal(false);
          }}
        >
          ×
        </span>
        {children}
      </div>
    </ModalBackgroundStyle>
  );
};
