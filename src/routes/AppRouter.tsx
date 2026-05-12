import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PublicLayout from "./PublicLayout";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import GetQuotePage from "../pages/GetQuotePage";
import ScheduleAppointmentPage from "../pages/ScheduleAppointmentPage";
import TrackStatusPage from "../pages/TrackStatusPage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminQuotesPage from "../pages/admin/AdminQuotesPage";
import AdminAppointmentsPage from "../pages/admin/AdminAppointmentsPage";
import AdminWorkOrdersPage from "../pages/admin/AdminWorkOrdersPage";

export function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/get-quote" element={<GetQuotePage />} />
                    <Route path="/schedule" element={<ScheduleAppointmentPage />} />
                    <Route path="/track-status" element={<TrackStatusPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/quotes" element={<AdminQuotesPage />} />
                    <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
                    <Route path="/admin/work-orders" element={<AdminWorkOrdersPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
