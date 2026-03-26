import React, { useEffect, useState } from "react";
import { requestLoader } from "../../services/requestLoader";
import { Overlay, Card, Spinner, Dots } from "./style";

export const GlobalRequestLoader = () => {
  const [count, setCount] = useState(requestLoader.getCount());
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = requestLoader.subscribe((nextCount) => {
      setCount(nextCount);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let timer = null;

    if (count > 0) {
      timer = window.setTimeout(() => {
        setVisible(true);
      }, 120);
    } else {
      setVisible(false);
    }

    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [count]);

  if (!visible) return null;

  return (
    <Overlay>
      <Card>
        <Spinner />
        <h3>Carregando informações</h3>
        <p>Estamos processando sua solicitação. Aguarde um instante.</p>
        <Dots>
          <span />
          <span />
          <span />
        </Dots>
      </Card>
    </Overlay>
  );
};