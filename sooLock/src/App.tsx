import React, { useState } from 'react';
import Layout from './components/Layout';
import PasswordCard from './components/PasswordCard';
import UnlockScreen from './components/UnlockScreen';
import AddPasswordModal from './components/AddPasswordModal';
import PasswordGenerator from './components/PasswordGenerator';
import Settings from './components/Settings';
import { Plus, Search } from 'lucide-react';
import { usePasswordVault } from './hooks/usePasswordVault';

function App() {
  const {
    isInitialized,
    passwords,
    error,
    unlockVault,
    addPassword,
    searchPasswords,
    logout,
    walletAddress,
    masterKey
  } = usePasswordVault();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('passwords');

  if (!isInitialized) {
    return <UnlockScreen onUnlock={unlockVault} error={error} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case 'generator':
        return <PasswordGenerator />;
      case 'settings':
        return <Settings walletAddress={walletAddress || ''} onLogout={logout} />;
      default:
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-[#c4ff9e]">Password Vault</h1>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Password
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#c4ff9e]" />
              </div>
              <input
                type="text"
                className="input-primary pl-10"
                placeholder="Search passwords..."
                onChange={(e) => searchPasswords(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {passwords.map((pass) => (
                <PasswordCard
                  key={pass.id}
                  {...pass}
                  onDelete={(id) => console.log('Delete', id)}
                  masterKey={masterKey}
                />
              ))}
            </div>

            <AddPasswordModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={addPassword}
            />
          </>
        );
    }
  };

  return (
    <Layout 
      walletAddress={walletAddress} 
      onLogout={logout}
      onNavigate={setCurrentView}
      currentView={currentView}
    >
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </Layout>
  );
}

export default App;