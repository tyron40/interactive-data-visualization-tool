import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  onChange,
  variant = 'default',
  className = '',
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };

  const variantStyles = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 text-sm font-medium',
      active: 'text-blue-600 border-b-2 border-blue-600',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
    pills: {
      container: 'space-x-2',
      tab: 'px-3 py-2 text-sm font-medium rounded-md',
      active: 'bg-blue-100 text-blue-700',
      inactive: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
    },
    underline: {
      container: 'border-b border-gray-200',
      tab: 'px-1 py-2 mx-3 text-sm font-medium',
      active: 'text-blue-600 border-b-2 border-blue-600',
      inactive: 'text-gray-500 hover:text-gray-700 hover:border-gray-300',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className={className}>
      <div className={`flex ${styles.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
              activeTabId === tab.id ? styles.active : styles.inactive
            } flex items-center`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {tabs.find((tab) => tab.id === activeTabId)?.content}
      </div>
    </div>
  );
};

export default Tabs;