import { Route, Routes } from "react-router-dom";
import { WhoWeAre } from "../pages/whoWeAre";
import { OurDifferential } from "../pages/OurDifferential";
import { Benefits } from "../pages/Benefits";
import { Contact } from "../pages/Contact";
import { NotFound } from "../pages/NotFound";
import { CustomerArea } from "../pages/CustomerArea";
import { Admin } from "../pages/Admin";
import { User } from "../pages/Users";
import { Bi } from "../pages/Bi";
import { Thanks } from "../pages/thanks";
import { PrivacyPolicy } from "../pages/PrivacyPolicy";
import { ProtectRoutes } from "../components/ProtectRoutes";
import { MyAdminProvider } from "../Providers/adminProvider";
import { ResetPassword } from "../pages/ResetPassword";
import { Invoicinguser } from "../pages/Invoicinguser";
import { Invoicingadmin } from "../pages/Invoicingadmin";
import { BenefitsPortal } from "../pages/BenefitsPortal";
import { BillingOrganization } from "../pages/BillingOrganization";
import { BillingHistory } from "../pages/BillingHistory";
import { BillingDashboard } from "../pages/BillingDashboard";
import { BookEntregas } from "../pages/BookEntregas";
import { RelatorioGerencial } from "../pages/RelatorioGerencial";
import { Notifications } from "../pages/Notifications";

export const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WhoWeAre />} />
      <Route path="serviços" element={<OurDifferential />} />
      <Route path="beneficios" element={<Benefits />} />
      <Route path="contato" element={<Contact />} />
      <Route path="contato/obrigadopelocontato" element={<Thanks />} />
      <Route path="areadocliente" element={<CustomerArea />} />
      <Route path="politicadeprivacidade" element={<PrivacyPolicy/>} />
      <Route path="redefinirsenha/:id" element={<ResetPassword />} />
      <Route element={<ProtectRoutes />}>
        <Route path="user" element={<User />} />
        <Route path="bi" element={<Bi />} />
        {/* Billing e dashboard não precisam de AdminContext — movidos para fora do MyAdminProvider */}
        <Route path="beneficios/faturamento" element={<BillingOrganization />} />
        <Route path="beneficios/faturamento/historico" element={<BillingHistory />} />
        <Route path="beneficios/faturamento/dashboard" element={<BillingDashboard />} />
        <Route path="beneficios/faturamento/relatorio" element={<RelatorioGerencial />} />
        <Route path="beneficios/book" element={<BookEntregas />} />
        <Route path="admin/notificacoes" element={<Notifications />} />
        <Route element={<MyAdminProvider/>}>
          <Route path="admin" element={<Admin />} />
          <Route path="beneficios/portal" element={<BenefitsPortal />} />
          <Route path="faturamento/admin" element={<Invoicingadmin />} />
          <Route path="faturamento" element={<Invoicinguser />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
