import React from 'react';
import { useLanguage } from '../hooks/useLanguage';
import Header from '../components/Header';
import './Dashboard.scss';

const Dashboard = () => {
  const { isEnglish } = useLanguage();

  const getContent = () => {
    if (isEnglish) {
      return {
        title: 'Dashboard',
        description: 'Statistical information and interactive map will be displayed here.'
      };
    }
    return {
      title: 'დაშბორდი',
      description: 'აქ განთავსდება სტატისტიკური ინფორმაცია და ინტერაქტიული რუკა.'
    };
  };

  const content = getContent();
  return (
    <div className="dashboard">
      <Header />
      <main className="dashboard__content">
        <div className="dashboard__container">
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
