import { useEffect, useState } from "react";
import { requestLoader } from "../../services/requestLoader";
import { Loader } from "../Loader";

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
      timer = window.setTimeout(() => setVisible(true), 120);
    } else {
      setVisible(false);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [count]);

  if (!visible) return null;

  // Loader ÚNICO da plataforma (overlay).
  return <Loader overlay label="Carregando informações" />;
};
