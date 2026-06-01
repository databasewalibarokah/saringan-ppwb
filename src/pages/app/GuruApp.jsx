import React, { useState, Suspense } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useStudentSelection } from '../../hooks/useStudentSelection';
import AppLayout from '../../components/Layout/AppLayout';
import SuccessAlert from '../../components/SuccessAlert';

// Lazy load feature pages
const HomePage = React.lazy(() => import('../../features/home/HomePage'));
const StatsPage = React.lazy(() => import('../../features/stats/StatsPage'));
const AccountPage = React.lazy(() => import('../../features/account/AccountPage'));
const SelectStudentPage = React.lazy(() => import('../../features/evaluation/SelectStudentPage'));
const EvaluationPage = React.lazy(() => import('../../features/evaluation/EvaluationPage'));
const AkhlakPage = React.lazy(() => import('../../features/evaluation/AkhlakPage'));
const BacaanSelectPage = React.lazy(() => import('../../features/evaluation/BacaanSelectPage'));
const BacaanEvaluatePage = React.lazy(() => import('../../features/evaluation/BacaanEvaluatePage'));
const DaftarPesertaPage = React.lazy(() => import('../../features/students/DaftarPesertaPage'));
const StudentDetailPage = React.lazy(() => import('../../features/students/StudentDetailPage'));
const AdminPeriodePage = React.lazy(() => import('../../features/admin/AdminPeriodePage'));
const AdminDashboard = React.lazy(() => import('../../features/admin/dashboard/AdminDashboard'));

export default function GuruApp() {
  const { user, logout, isAdmin } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [currentTab, setCurrentTab] = useState('home');
  const [view, setView] = useState('main');
  const [evalType, setEvalType] = useState('penyampaian');
  const [successAlert, setSuccessAlert] = useState({ show: false, message: '' });
  
  const { selectedStudents, toggleStudent, clearSelection } = useStudentSelection();

  const handleTabChange = (tabKey) => {
    setCurrentTab(tabKey);
    setView('main');
  };

  const renderCurrentView = () => {
    if (view === 'admin-periode') {
      if (!isAdmin) { setView('main'); return null; }
      return <AdminPeriodePage onBack={() => setView('main')} />;
    }

    if (currentTab === 'stats') return <StatsPage />;
    if (currentTab === 'account') return <AccountPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} onLogout={logout} onNavigate={setView} />;
    
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
      if (evalType === 'bacaan') {
        return (
          <BacaanSelectPage 
            selectedStudents={selectedStudents}
            toggleStudent={toggleStudent}
            onBack={() => setView('main')}
            onContinue={() => setView('bacaan-evaluate')}
          />
        );
      }
      return (
        <SelectStudentPage 
          selectedStudents={selectedStudents}
          toggleStudent={toggleStudent}
          onBack={() => setView('main')}
          onContinue={() => setView(evalType === 'akhlak' ? 'akhlak' : 'evaluate')}
        />
      );
    }

    if (view === 'bacaan-evaluate') {
      return (
        <BacaanEvaluatePage 
          selectedStudents={selectedStudents}
          onBack={() => setView('select')}
          onSubmit={(results) => {
            const count = Object.keys(results).length;
            setSuccessAlert({ show: true, message: `Berhasil menyimpan hasil tes bacaan untuk ${count} santri!` });
            clearSelection();
            setView('main');
          }}
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
    
    if (isAdmin && view === 'admin-dashboard') {
      return <AdminDashboard user={user} onNavigate={setView} />;
    }

    return <HomePage onNavigate={(v, type) => { 
      setView(v); 
      if (type) {
        setEvalType(type);
        clearSelection();
      }
    }} user={user} isAdmin={isAdmin} />;
  };

  return (
    <AppLayout 
      view={view} 
      currentTab={currentTab} 
      onTabChange={handleTabChange}
      user={user}
      onLogout={logout}
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
