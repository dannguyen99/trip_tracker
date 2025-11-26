import { utils, writeFile } from 'xlsx';
import type { Expense, User } from '../types';

const formatData = (expenses: Expense[], users: User[]) => {
  return expenses.map(exp => {
    const user = users.find(u => u.id === exp.payerId);
    return {
      Date: new Date(exp.date).toLocaleDateString(),
      Payer: user?.name || 'Unknown',
      Description: exp.description,
      Category: exp.category,
      Type: exp.type,
      Amount: exp.originalAmount,
      Currency: exp.currency,
      'Amount (VND)': exp.amountVND
    };
  });
};

export const exportToCSV = (expenses: Expense[], users: User[]) => {
  const data = formatData(expenses, users);
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Expenses");
  writeFile(wb, `trip_expenses_${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportToExcel = (expenses: Expense[], users: User[]) => {
  const data = formatData(expenses, users);
  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Expenses");
  writeFile(wb, `trip_expenses_${new Date().toISOString().split('T')[0]}.xlsx`);
};
