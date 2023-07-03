import { GlobalStyle } from "./styles/global";
import { MainRoutes as Routes } from "./routes";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./contexts/userContext/userContext";

import "react-toastify/dist/ReactToastify.css";
import { Animations } from "./styles/animations";
function App() {
  // if(!window.location.href.includes("https")){
  //   window.location.href = "https://frbconsultoria.com.br"
  // }
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <GlobalStyle />
      <Animations/>
      <UserProvider>
        <Routes />
      </UserProvider>
    </>
  );
}

export default App;
