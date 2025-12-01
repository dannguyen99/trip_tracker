import type { User, Expense } from '../types';

export interface Debt {
  from: string;
  to: string;
  amount: number;
}

export const calculateDebts = (users: User[], expenses: Expense[]): Debt[] => {
  const balances: Record<string, number> = {};
  users.forEach(u => balances[u.id] = 0);

  expenses.forEach(exp => {
    if (exp.type === 'SETTLEMENT') {
      // Direct payment from payerId to splitTo[0] (receiver)
      // Payer's balance increases (they paid, so they are owed/less in debt)
      // Receiver's balance decreases (they received, so they owe/less credit)
      if (exp.splitTo && exp.splitTo.length > 0) {
        const receiverId = exp.splitTo[0];
        balances[exp.payerId] = (balances[exp.payerId] || 0) + exp.amountVND;
        balances[receiverId] = (balances[receiverId] || 0) - exp.amountVND;
      }
    } else if (exp.type === 'SHARED') {
      // Determine who is involved in the split
      const splitUsers = exp.splitTo && exp.splitTo.length > 0
        ? users.filter(u => exp.splitTo!.includes(u.id))
        : users;

      if (splitUsers.length > 0) {
        const splitAmount = exp.amountVND / splitUsers.length;

        // Payer paid the full amount
        balances[exp.payerId] = (balances[exp.payerId] || 0) + exp.amountVND;

        // Only split users consume the amount
        splitUsers.forEach(u => {
          balances[u.id] = (balances[u.id] || 0) - splitAmount;
        });
      }
    }
    // PERSONAL expenses don't affect debt
  });

  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  Object.entries(balances).forEach(([id, amount]) => {
    // Use a small epsilon for float comparison
    if (amount < -1) debtors.push({ id, amount });
    else if (amount > 1) creditors.push({ id, amount });
  });

  debtors.sort((a, b) => a.amount - b.amount); // Ascending (most negative first)
  creditors.sort((a, b) => b.amount - a.amount); // Descending (most positive first)

  const debts: Debt[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    // The amount to settle is the minimum of what the debtor owes and what the creditor is owed
    const amount = Math.min(Math.abs(debtor.amount), creditor.amount);

    if (amount > 1) { // Only record significant debts
      debts.push({
        from: debtor.id,
        to: creditor.id,
        amount
      });
    }

    debtor.amount += amount;
    creditor.amount -= amount;

    // If settled (close to 0), move to next
    if (Math.abs(debtor.amount) < 1) i++;
    if (creditor.amount < 1) j++;
  }

  return debts;
};
