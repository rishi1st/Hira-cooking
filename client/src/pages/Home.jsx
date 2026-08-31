import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import About from "../components/About.jsx";
import FoodMenu from "../components/FoodMenu.jsx";
import HowItWorks from "../components/HowItWorks.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import WhatsAppCTA from "../components/WhatsAppCTA.jsx";
import SelectedItemsBar from "../components/SelectedItemsBar.jsx";
import Footer from "../components/Footer.jsx";
import { fetchSettings } from "../services/api.js";

const Home = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetchSettings()
      .then(({ data }) => setSettings(data.data))
      .catch(() => setSettings(null));
  }, []);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main>
        <Hero settings={settings} />
        <About />
        <FoodMenu />
        <HowItWorks />
        <EnquiryForm settings={settings} />
      </main>
      <Footer settings={settings} />
      <WhatsAppCTA settings={settings} />
      <SelectedItemsBar />
    </div>
  );
};

export default Home;
