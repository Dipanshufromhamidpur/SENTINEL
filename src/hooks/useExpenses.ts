import { useState, useEffect } from 'react';
import { Expense, ExpenseInput } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('sentinel_expenses');
      if (stored) {
        const parsed = JSON.parse(stored);
        setExpenses(parsed);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('sentinel_expenses', JSON.stringify(expenses));
    }
  }, [expenses, loading]);

  const addExpense = async (expenseInput: ExpenseInput) => {
    try {
      const newExpense: Expense = {
        ...expenseInput,
        id: uuidv4(),
        userId: 'local-user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setExpenses(prev => {
        const next = [newExpense, ...prev];
        next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return next;
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateExpense = async (id: string, updates: Partial<ExpenseInput>) => {
    try {
      setExpenses(prev => {
        const next = prev.map(exp => 
          exp.id === id 
            ? { ...exp, ...updates, updatedAt: new Date().toISOString() } 
            : exp
        );
        next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return next;
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return { expenses, loading, error, addExpense, updateExpense, deleteExpense };
}
