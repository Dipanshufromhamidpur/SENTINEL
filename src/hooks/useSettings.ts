import { useState, useEffect } from 'react';
import { UserSettings } from '../types';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sentinel_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (budget: number, defaultCurrency: string) => {
    const newSettings: UserSettings = {
      userId: 'local-user',
      monthlyBudget: budget,
      defaultCurrency,
      updatedAt: new Date().toISOString(),
    };
    setSettings(newSettings);
    localStorage.setItem('sentinel_settings', JSON.stringify(newSettings));
  };

  return { settings, loading, updateSettings };
}
