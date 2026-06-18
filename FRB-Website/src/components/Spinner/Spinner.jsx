// src/components/Spinner/Spinner.jsx
// Mantido por compatibilidade — agora usa o Loader ÚNICO da plataforma.
import { Loader } from "../Loader";

export const Spinner = ({ small }) => <Loader small={small} size={small ? 20 : 56} />;

export default Spinner;
