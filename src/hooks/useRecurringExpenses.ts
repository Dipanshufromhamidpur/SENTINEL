import { useState, useEffect } from 'react';
import { RecurringExpense, RecurringExpenseInput } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useRecurringExpenses() {
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sentinel_recurring');
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecurringExpenses(parsed);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('sentinel_recurring', JSON.stringify(recurringExpenses));
    }
  }, [recurringExpenses, loading]);

  const addRecurringExpense = async (expense: RecurringExpenseInput) => {
    const newExpense: RecurringExpense = {
      ...expense,
      id: uuidv4(),
      userId: 'local-user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setRecurringExpenses(prev => {
      const next = [newExpense, ...prev];
      next.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      return next;
    });
  };

  const updateRecurringExpense = async (id: string, expense: Partial<RecurringExpense>) => {
    setRecurringExpenses(prev => {
      const next = prev.map(exp => 
        exp.id === id 
          ? { ...exp, ...expense, updatedAt: new Date().toISOString() } 
          : exp
      );
      next.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      return next;
    });
  };

  const deleteRecurringExpense = async (id: string) => {
    setRecurringExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  return { recurringExpenses, loading, addRecurringExpense, updateRecurringExpense, deleteRecurringExpense };
}
