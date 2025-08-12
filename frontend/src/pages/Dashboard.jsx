import React from 'react';
import Header from '../components/Header';
import MainInfo from '../components/MainInfo';
import InteractiveMap from '../components/InteractiveMap';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 flex h-[calc(100vh-80px)] flex-col md:flex-row">
          <div className="w-full md:w-1/5 md:min-w-[280px] lg:min-w-[320px] bg-gray-50 border-r border-gray-200 order-2 md:order-1 border-t md:border-t-0 md:border-r">
            <MainInfo />
          </div>
          <div className="w-full md:w-4/5 flex-1 bg-white order-1 md:order-2 min-h-[60vh] md:min-h-0">
            <InteractiveMap />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
