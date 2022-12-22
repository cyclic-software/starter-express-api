import React from "react";
import { Button } from "@mui/material";
import { secondaryColor } from "../../constants/colors";
import { useLocation } from "react-router-dom";

const Menu = ({ menu = [] }) => {
  const location = useLocation();
  console.log(location);

  if (!menu.length) return <></>;
  return menu.map((button) => (
    <Button
      key={`menu_button_${button.id}`}
      style={{
        backgroundColor: location.pathname == button.link ? secondaryColor : "white",
        marginLeft: 10,
        marginRight: 10,
        color: location.pathname == button.link ? "white" : secondaryColor,
        fontWeight: location.pathname == button.link ? "bold" : "",
      }}
      onClick={() => {
        button.onClickFunction();
      }}
    >
      {button.icon}&nbsp;&nbsp; {button.text}
    </Button>
  ));
};

export default Menu;
