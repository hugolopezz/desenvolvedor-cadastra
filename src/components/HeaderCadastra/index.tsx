import React from "react";
import { Logo, MinicartIcon } from "../../img";
import { MinicartComponent } from "../Minicart";
import { useMinicartActions } from "../../context";

function HeaderCadastra() {
  const { toggleMinicartVisibility, totalItemsInCart } = useMinicartActions();

  return (
    <header className="header">
      <div className="header__center">
        <div className="logo">
          <img src={Logo} alt="Logo Cadastra" />
        </div>
        <div className="minicart icon" onClick={() => toggleMinicartVisibility()}>
          <img src={MinicartIcon} alt="Minicart Icon" />
          <span>{totalItemsInCart}</span>
        </div>
      </div>

      <MinicartComponent />
    </header>
  );
}

export default HeaderCadastra;
