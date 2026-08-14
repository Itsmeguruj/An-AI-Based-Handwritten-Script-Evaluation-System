import React from 'react';

interface PortalTabsProps {
  activeTab: 'coordinator' | 'admin';
  onChange: (tab: 'coordinator' | 'admin') => void;
}

export const PortalTabs: React.FC<PortalTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="tabs-container">
      <button
        type="button"
        className={`tab-btn ${activeTab === 'coordinator' ? 'active-coordinator' : ''}`}
        onClick={() => onChange('coordinator')}
      >
        Coordinator Portal
      </button>
      <button
        type="button"
        className={`tab-btn ${activeTab === 'admin' ? 'active-admin' : ''}`}
        onClick={() => onChange('admin')}
      >
        Admin Portal
      </button>
    </div>
  );
};
