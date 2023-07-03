import { MenuStyle } from "./styled";
import { FiMenu } from "react-icons/fi";
import { MenuContainer } from "./menuContainer";
import { useState } from "react";

export const MenuBox = () => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <FiMenu
        onClick={() => {
          setOpenMenu(!openMenu);
        }}
      />
      {openMenu ? (
        <MenuStyle className="slideDown">
          
          <p
            className="close"
            onClick={() => {
              setOpenMenu(false);
            }}
          >
            x
          </p>
          <MenuContainer />
        </MenuStyle>
      ) : null}
    </>
  );
};
