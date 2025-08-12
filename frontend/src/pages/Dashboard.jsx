import React from 'react';
import Header from '../components/Header';
import MainInfo from '../components/MainInfo';
import InteractiveMap from '../components/InteractiveMap';
import './Dashboard.scss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard__content">
        <div className="dashboard__layout">
          <div className="dashboard__sidebar">
            <MainInfo />
          </div>
          <div className="dashboard__main">
            <InteractiveMap />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
