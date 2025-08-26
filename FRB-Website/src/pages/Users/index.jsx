import { Main } from "./style";
import React from "react";
import { UserContext } from "../../contexts/userContext/userContext";
import { useContext } from "react";
import FRB from "../../assets/img/FRB.webp";
import { BsArrowLeftCircle } from "react-icons/bs";
import jwt_decode from "jwt-decode";
import { useEffect, } from "react";
import { useNavigate } from "react-router";

export const User = () => {
  const { userInfo, observer, setObserver, user } = useContext(UserContext);
  // const [full, setFull] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.user_level !== "rh" && user.user_level !== "medic" && user.user_level !== "invoicinguser") navigate("/");
  }, [user, navigate]);
  
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("@token"));
    const userToken = jwt_decode(token);
    setObserver(userToken);
  }, []);

  return (
    <Main>
      <div className="borderBotton">
        <div className="positionHeader">
          <BsArrowLeftCircle
            className="iconBack"
            onClick={() => {
              navigate("/areadocliente");
            }}
          />
          <img className="imgLogo" src={FRB} alt="Logo da empresa" />
        </div>
      </div>
        <p className="nameUser">Seja bem-vindo {observer.name}!</p>
        
      
      <div className="positionBi">
        <iframe
       
          // width="1024"
          // height="700"
          allowfullscreen="false"
          src={observer.power_bi_link}
          frameBorder="0"
        ></iframe>
      </div>
      
    </Main>
  );
};
