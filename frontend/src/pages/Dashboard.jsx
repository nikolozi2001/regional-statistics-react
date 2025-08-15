import React from "react";
import Header from "../components/Header";
import MainInfo from "../components/MainInfo";
import InteractiveMap from "../components/InteractiveMap";
import Footer from "../components/Footer";
import backgroundIMG from "../assets/images/reg_photos/15.jpg";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background image with opacity */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${backgroundIMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.3,
            zIndex: -1,
          }}
        />
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
          <div className="w-full md:w-[15%] md:min-w-[280px] lg:min-w-[320px] bg-transparent  order-2 md:order-1  md:border-t-0 overflow-y-auto">
            <MainInfo />
          </div>
          <div className="w-full md:w-[85%] flex-1 bg-transparent order-1 md:order-2 overflow-hidden">
            <InteractiveMap />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
