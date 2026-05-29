import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, RefreshCw } from 'lucide-react';
import { useOfflineFAQs } from '../hooks/useOfflineFAQs';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-500/90 backdrop-blur-sm border-b border-amber-400/50 px-4 py-2"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-900" />
            <span className="text-amber-900 font-medium text-sm">
              You are offline. Some features may be limited.
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OfflineSyncButton() {
  const { isOnline, cacheSize, lastSynced, syncFAQs, clearCache } = useOfflineFAQs();
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await syncFAQs();
    setSyncing(false);
  };

  return (
    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-400" />
          ) : (
            <WifiOff className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <p className="text-white font-medium">Offline Access</p>
            <p className="text-slate-400 text-sm">
              {isOnline ? 'Online' : 'Offline'} - {cacheSize} FAQs cached
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSync}
            disabled={!isOnline || syncing}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {syncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="text-sm">Sync</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearCache}
            className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors text-sm"
          >
            Clear
          </motion.button>
        </div>
      </div>

      {lastSynced && (
        <p className="text-slate-500 text-xs">
          Last synced: {lastSynced.toLocaleString()}
        </p>
      )}
    </div>
  );
}
