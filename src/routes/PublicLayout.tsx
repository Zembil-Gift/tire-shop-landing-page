import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
