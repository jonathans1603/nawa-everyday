import Header from "../components/Header";
import Hero from "../components/Hero";
import Specialities from "../components/Specialities";
import Facility from "../components/Facility";
import Footer from "../components/Footer";

export default function Dashboard({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header activePage="home" onNavigate={onNavigate} />
      <main className="flex-1">
        <Hero />
        <Specialities />
        <Facility />
        <Facility />
      </main>
      <Footer />
    </div>
  );
}
