import React, { useState, useEffect } from 'react';
import type { Currency, ExpenseType, Category, User, Expense } from '../types';

interface ExpenseFormProps {
  onAdd: (expense: Expense) => void;
  exchangeRate: number;
  users: User[];
}

const CATEGORIES: { id: Category; icon: string; labelKey: string }[] = [
  { id: 'Food', icon: 'ph-bowl-food', labelKey: 'food' },
  { id: 'Transport', icon: 'ph-taxi', labelKey: 'transport' },
  { id: 'Hotel', icon: 'ph-bed', labelKey: 'hotel' },
  { id: 'Shopping', icon: 'ph-shopping-bag-open', labelKey: 'shopping' },
  { id: 'Nightlife', icon: 'ph-martini', labelKey: 'nightlife' },
  { id: 'Massage', icon: 'ph-sparkle', labelKey: 'massage' },
  { id: 'Tours', icon: 'ph-ticket', labelKey: 'tours' },
  { id: 'Misc', icon: 'ph-dots-three-circle', labelKey: 'misc' },
];

import { useLanguage } from '../contexts/LanguageContext';


import { Avatar } from './Avatar';

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, exchangeRate, users }) => {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('VND');
  const [paidBy, setPaidBy] = useState<string>(users[0]?.id || "0");
  const [type, setType] = useState<ExpenseType>('SHARED');
  const [category, setCategory] = useState<Category>('Food');

  // New state for splitting and settlement
  const [splitTo, setSplitTo] = useState<string[]>([]); // Empty means everyone
  const [isSpecificSplit, setIsSpecificSplit] = useState(false);
  const [settleReceiver, setSettleReceiver] = useState<string>(users[1]?.id || "1");

  // Reset split/receiver when type changes
  useEffect(() => {
    if (type === 'SETTLEMENT') {
      setDescription(t('expenses.settlement_default_desc') || 'Settlement');
      // Ensure receiver is different from payer
      if (paidBy === settleReceiver) {
        const other = users.find(u => u.id !== paidBy);
        if (other) setSettleReceiver(other.id);
      }
    } else {
      setDescription('');
    }
  }, [type, paidBy]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setAmount(Number(value).toLocaleString());
    }
  };

  const toggleSplitUser = (userId: string) => {
    setSplitTo(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (!description || !numericAmount) return;

    let amountVND = numericAmount;
    if (currency === 'THB') {
      amountVND = numericAmount * exchangeRate;
    }

    const finalSplitTo = type === 'SETTLEMENT'
      ? [settleReceiver]
      : (isSpecificSplit && splitTo.length > 0 ? splitTo : undefined);

    const newExpense: Expense = {
      id: Date.now().toString(), // Temporary ID, will be replaced by DB
      description,
      amountVND,
      originalAmount: numericAmount,
      currency,
      payerId: paidBy,
      type,
      category: type === 'SETTLEMENT' ? 'Misc' : category, // Default category for settlement
      date: new Date().toISOString(),
      splitTo: finalSplitTo
    };

    onAdd(newExpense);
    setDescription('');
    setAmount('');
    // Reset defaults
    setType('SHARED');
    setIsSpecificSplit(false);
    setSplitTo([]);
  };

  return (
    <section className="glass-card rounded-[2rem] p-6 pop-in" style={{ animationDelay: '0.1s' }}>
      <form onSubmit={handleSubmit}>

        {/* Top Row: Type Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-slate-100 p-1 rounded-xl flex">
            {(['SHARED', 'PERSONAL', 'SETTLEMENT'] as ExpenseType[]).map(tType => (
              <button
                key={tType}
                type="button"
                onClick={() => setType(tType)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition ${type === tType
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                {tType === 'SHARED' && <><i className="ph-bold ph-users mr-1"></i> {t('expenses.group_label')}</>}
                {tType === 'PERSONAL' && <><i className="ph-bold ph-user mr-1"></i> {t('expenses.personal_label')}</>}
                {tType === 'SETTLEMENT' && <><i className="ph-bold ph-hand-coins mr-1"></i> {t('expenses.settlement_label') || 'Settlement'}</>}
              </button>
            ))}
          </div>
        </div>

        {/* Payer Selector (Who Paid?) */}
        <div className="mb-2 px-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
            {t('expenses.paid_by_label') || 'Paid By'}
          </label>
        </div>
        <div className="flex justify-between gap-2 mb-6 overflow-x-auto no-scrollbar p-2 -mx-2">
          {users.map((user) => (
            <div key={user.id} className="relative w-full min-w-[70px]">
              <input
                type="radio"
                name="payer"
                id={`u${user.id}`}
                checked={paidBy === user.id}
                onChange={() => {
                  setPaidBy(user.id);
                  // Prevent payer == receiver in settlement
                  if (type === 'SETTLEMENT' && user.id === settleReceiver) {
                    const other = users.find(u => u.id !== user.id);
                    if (other) setSettleReceiver(other.id);
                  }
                }}
                className="peer hidden"
              />
              <label
                htmlFor={`u${user.id}`}
                className="block w-full aspect-square rounded-2xl bg-white border-2 border-slate-100 flex flex-col items-center justify-center cursor-pointer relative transition-all duration-300 peer-checked:scale-105 peer-checked:-translate-y-1 peer-checked:border-sky-500 peer-checked:bg-sky-50 peer-checked:shadow-lg opacity-60 peer-checked:opacity-100 hover:opacity-100"
              >
                <Avatar avatar={user.avatar} name={user.name} size="md" className="mb-1" />
                <div className="text-[10px] font-bold text-slate-700 leading-none text-center px-1 truncate w-full">{user.name}</div>
                <div className="absolute -top-2 -right-2 bg-sky-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 peer-checked:opacity-100 transition shadow-md scale-0 peer-checked:scale-100">
                  <i className="ph-bold ph-check"></i>
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* SETTLEMENT: Receiver Selector */}
        {type === 'SETTLEMENT' && (
          <div className="mb-6 animate-fade-in">
            <div className="mb-2 px-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                {t('expenses.paid_to_label') || 'Paid To'}
              </label>
            </div>
            <div className="flex justify-between gap-2 overflow-x-auto no-scrollbar p-2 -mx-2">
              {users.filter(u => u.id !== paidBy).map((user) => (
                <div key={user.id} className="relative w-full min-w-[70px]">
                  <input
                    type="radio"
                    name="receiver"
                    id={`r${user.id}`}
                    checked={settleReceiver === user.id}
                    onChange={() => setSettleReceiver(user.id)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={`r${user.id}`}
                    className="block w-full aspect-square rounded-2xl bg-white border-2 border-slate-100 flex flex-col items-center justify-center cursor-pointer relative transition-all duration-300 peer-checked:scale-105 peer-checked:-translate-y-1 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:shadow-lg opacity-60 peer-checked:opacity-100 hover:opacity-100"
                  >
                    <Avatar avatar={user.avatar} name={user.name} size="md" className="mb-1" />
                    <div className="text-[10px] font-bold text-slate-700 leading-none text-center px-1 truncate w-full">{user.name}</div>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 peer-checked:opacity-100 transition shadow-md scale-0 peer-checked:scale-100">
                      <i className="ph-bold ph-arrow-right"></i>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Money Input */}
        <div className="bg-slate-100 rounded-2xl p-2 flex items-center mb-6 relative">
          <div className="bg-slate-200/50 rounded-xl p-1 flex mr-3 shrink-0">
            {(['VND', 'THB'] as Currency[]).map((curr) => (
              <div key={curr} className="relative">
                <input
                  type="radio"
                  name="currency"
                  id={`curr-${curr}`}
                  checked={currency === curr}
                  onChange={() => setCurrency(curr)}
                  className="peer hidden"
                />
                <label
                  htmlFor={`curr-${curr}`}
                  className="block px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition text-slate-500 peer-checked:bg-white peer-checked:text-slate-800 peer-checked:shadow-sm"
                >
                  {curr}
                </label>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder={currency === 'VND' ? t('expenses.amount_placeholder') : "100"}
            className="w-full bg-transparent text-2xl font-bold text-slate-800 focus:outline-none placeholder:text-slate-300"
            inputMode="decimal"
          />
        </div>

        {/* SHARED: Split Options */}
        {type === 'SHARED' && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {t('expenses.split_label') || 'Split With'}
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSpecificSplit(!isSpecificSplit);
                  if (!isSpecificSplit) setSplitTo([]); // Reset when switching to specific
                }}
                className="text-[10px] font-bold text-sky-500 hover:text-sky-600 transition"
              >
                {isSpecificSplit ? (t('expenses.split_everyone') || 'Everyone') : (t('expenses.split_specific') || 'Specific People')}
              </button>
            </div>

            {isSpecificSplit && (
              <div className="flex flex-wrap gap-2 animate-fade-in-down">
                {users.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleSplitUser(user.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition ${splitTo.includes(user.id)
                      ? 'bg-sky-50 border-sky-200 text-sky-700'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                  >
                    <Avatar avatar={user.avatar} name={user.name} size="sm" />
                    <span className="text-xs font-bold">{user.name}</span>
                    {splitTo.includes(user.id) && <i className="ph-bold ph-check text-sky-500 text-xs"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Grid (Hidden for Settlement) */}
        {type !== 'SETTLEMENT' && (
          <div className="mb-6 animate-fade-in">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{t('expenses.category_label')}</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="relative">
                  <input
                    type="radio"
                    name="cat"
                    id={`cat-${cat.id}`}
                    checked={category === cat.id}
                    onChange={() => setCategory(cat.id)}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={`cat-${cat.id}`}
                    className="flex flex-col items-center justify-center p-2 rounded-xl border border-transparent cursor-pointer transition bg-white/50 hover:bg-white text-slate-400 peer-checked:bg-slate-100 peer-checked:text-sky-500 peer-checked:border-slate-300 peer-checked:shadow-inner"
                  >
                    <i className={`ph-fill ${cat.icon} text-2xl mb-1 transition-transform peer-checked:scale-110`}></i>
                    <span className="text-[9px] font-bold uppercase">{t(`expenses.categories.${cat.labelKey}` as any)}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('expenses.description_placeholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-sky-500 transition"
          />
        </div>

        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2">
          <i className="ph-bold ph-plus-circle text-xl"></i>
          <span>{t('expenses.add_expense_button')}</span>
        </button>
      </form>
    </section>
  );
};
