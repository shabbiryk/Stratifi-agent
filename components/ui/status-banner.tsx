"use client";

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { Button } from './button';

type StatusType = 'info' | 'success' | 'warning' | 'error';

interface StatusBannerProps {
  type?: StatusType;
  message: string;
  details?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  autoHide?: number; // Auto hide after X seconds
}

const statusIcons = {
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: AlertCircle,
};

const statusStyles = {
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
  success: 'bg-green-500/10 border-green-500/30 text-green-300',
  warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
  error: 'bg-red-500/10 border-red-500/30 text-red-300',
};

export function StatusBanner({
  type = 'info',
  message,
  details,
  dismissible = true,
  onDismiss,
  autoHide,
}: StatusBannerProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHide && autoHide > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoHide * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [autoHide, onDismiss]);

  if (!visible) return null;

  const Icon = statusIcons[type];

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${statusStyles[type]} animate-in slide-in-from-top-2 duration-300`}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium">{message}</p>
        {details && (
          <p className="text-sm opacity-90 mt-1">{details}</p>
        )}
      </div>
      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="opacity-70 hover:opacity-100 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

// Pre-configured status banners for common use cases
export const StatusBanners = {
  WalletConnecting: (props: Omit<StatusBannerProps, 'type' | 'message'>) => (
    <StatusBanner
      type="info"
      message="Connecting to wallet..."
      details="Please check your wallet extension for connection request"
      {...props}
    />
  ),
  
  AgentInitializing: (props: Omit<StatusBannerProps, 'type' | 'message'>) => (
    <StatusBanner
      type="info"
      message="Initializing your DeFi agent..."
      details="Setting up market access and wallet integration"
      {...props}
    />
  ),
  
  TransactionPending: (props: Omit<StatusBannerProps, 'type' | 'message'>) => (
    <StatusBanner
      type="warning"
      message="Transaction pending..."
      details="Your transaction is being processed on the blockchain"
      {...props}
    />
  ),
  
  SystemOnline: (props: Omit<StatusBannerProps, 'type' | 'message'>) => (
    <StatusBanner
      type="success"
      message="All systems operational"
      details="Ready to execute DeFi transactions"
      dismissible={false}
      autoHide={3}
      {...props}
    />
  ),
  
  BackendOffline: (props: Omit<StatusBannerProps, 'type' | 'message'>) => (
    <StatusBanner
      type="warning"
      message="Agent backend temporarily unavailable"
      details="Using fallback responses. Full functionality will return shortly."
      {...props}
    />
  ),
}; 