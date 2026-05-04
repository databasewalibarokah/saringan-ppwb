import React, { useState, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { useDarkMode } from './hooks/useDarkMode';
import { useStudentSelection } from './hooks/useStudentSelection';
import AppLayout from './components/Layout/AppLayout';
import SuccessAlert from './components/SuccessAlert';
import LoginPage from './features/auth/LoginPage';

// Lazy load feature pages for better initial bundle size
const HomePage = React.lazy(() => import('./features/home/HomePage'));
const StatsPage = React.lazy(() => import('./features/stats/StatsPage'));
const AccountPage = React.lazy(() => import('./features/account/AccountPage'));
const SelectStudentPage = React.lazy(() => import('./features/evaluation/SelectStudentPage'));
const EvaluationPage = React.lazy(() => import('./features/evaluation/EvaluationPage'));
const AkhlakPage = React.lazy(() => import('./features/evaluation/AkhlakPage'));
const DaftarPesertaPage = React.lazy(() => import('./features/students/DaftarPesertaPage'));
const StudentDetailPage = React.lazy(() => import('./features/students/StudentDetailPage'));

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [currentTab, setCurrentTab] = useState('home'); // home, stats, account
  const [view, setView] = useState('main'); // main, select, evaluate, daftar-peserta, akhlak
  const [evalType, setEvalType] = useState('penyampaian'); // penyampaian, akhlak
  const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
  
  const { selectedStudents, toggleStudent, clearSelection } = useStudentSelection();

  // If not authenticated, show the login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Handle Tab changes
  const handleTabChange = (tabKey) => {
    setCurrentTab(tabKey);
    setView('main'); // Always reset to main view when switching tabs
  };

  // Render correct view based on state
  const renderCurrentView = () => {
    if (currentTab === 'stats') return <StatsPage />;
    if (currentTab === 'account') return <AccountPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
    
    // Home tab flow
    if (view === 'daftar-peserta') {
      return (
        <DaftarPesertaPage 
          selectedStudents={selectedStudents}
          toggleStudent={toggleStudent}
          onBack={() => setView('main')}
          onContinue={() => setView('student-detail')}
        />
      );
    }

    if (view === 'student-detail') {
      return (
        <StudentDetailPage 
          selectedStudents={selectedStudents}
          onBack={() => setView('daftar-peserta')}
        />
      );
    }

    if (view === 'select') {
      return (
        <SelectStudentPage 
          selectedStudents={selectedStudents}
          toggleStudent={toggleStudent}
          onBack={() => setView('main')}
          onContinue={() => setView(evalType === 'akhlak' ? 'akhlak' : 'evaluate')}
        />
      );
    }

    if (view === 'akhlak') {
      return (
        <AkhlakPage 
          selectedStudents={selectedStudents}
          onBack={() => setView('select')}
          onSubmit={(data) => {
            const count = Object.keys(data).length;
            setSuccessAlert({ show: true, message: `Berhasil menyimpan catatan untuk ${count} santri!` });
            clearSelection();
            setView('main');
          }}
        />
      );
    }
    if (view === 'evaluate') {
      return (
        <EvaluationPage 
          selectedStudents={selectedStudents}
          onBack={() => setView('select')}
          onSubmit={(scoresMap) => {
            const count = Object.keys(scoresMap).length;
            setSuccessAlert({ show: true, message: `Berhasil menyimpan penilaian untuk ${count} santri!` });
            clearSelection();
            setView('main');
          }}
        />
      );
    }
    
    return <HomePage setView={setView} setEvalType={setEvalType} />;
  };

  return (
    <AppLayout 
      view={view} 
      currentTab={currentTab} 
      onTabChange={handleTabChange}
    >
      {renderCurrentView()}
      <SuccessAlert 
        isVisible={successAlert.show}
        message={successAlert.message}
        onClose={() => setSuccessAlert({ ...successAlert, show: false })}
      />
    </AppLayout>
  );
}
