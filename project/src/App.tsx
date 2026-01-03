import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DiaryPage } from './pages/DiaryPage';
import { GoalsPage } from './pages/GoalsPage';
import { JobsPage } from './pages/JobsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('diary');

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setCurrentPage(hash);
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.location.hash = page;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'diary':
        return <DiaryPage />;
      case 'goals':
        return <GoalsPage />;
      case 'jobs':
        return <JobsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DiaryPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </Layout>
  );
}

export default App;
