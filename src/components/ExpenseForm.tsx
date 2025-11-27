import React, { useState } from 'react';
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


export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, exchangeRate, users }) => {
  const { t } = useLanguage();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>('VND');
  const [paidBy, setPaidBy] = useState<string>(users[0]?.id || "0");
  const [type, setType] = useState<ExpenseType>('SHARED');
  const [category, setCategory] = useState<Category>('Food');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      setAmount(Number(value).toLocaleString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount.replace(/,/g, ''));
    if (!description || !numericAmount) return;

    let amountVND = numericAmount;
    if (currency === 'THB') {
      amountVND = numericAmount * exchangeRate;
    }

    const newExpense: Expense = {
      id: Date.now().toString(), // Temporary ID, will be replaced by DB
      description,
      amountVND,
      originalAmount: numericAmount,
      currency,
      payerId: paidBy,
      type,
      category,
      date: new Date().toISOString()
    };

    onAdd(newExpense);
    setDescription('');
    setAmount('');
  };

  return (
    <section className="glass-card rounded-[2rem] p-6 pop-in" style={{ animationDelay: '0.1s' }}>
      <form onSubmit={handleSubmit}>

        {/* Person Selector (Avatars) */}
        <div className="flex justify-between gap-2 mb-8 overflow-x-auto no-scrollbar p-4 -mx-4">
          {users.map((user) => (
            <div key={user.id} className="relative w-full min-w-[80px]">
              <input
                type="radio"
                name="payer"
                id={`u${user.id}`}
                checked={paidBy === user.id}
                onChange={() => setPaidBy(user.id)}
                className="peer hidden"
              />
              <label
                htmlFor={`u${user.id}`}
                className="block w-full aspect-square rounded-2xl bg-white border-2 border-slate-100 flex flex-col items-center justify-center cursor-pointer relative transition-all duration-300 peer-checked:scale-105 peer-checked:-translate-y-1 peer-checked:border-sky-500 peer-checked:bg-sky-50 peer-checked:shadow-lg opacity-60 peer-checked:opacity-100 hover:opacity-100"
              >
                {user.avatar.startsWith('data:') ? (
                  <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-full object-cover mb-2 shadow-sm" />
                ) : (
                  <div className="text-5xl mb-2 drop-shadow-sm">{user.avatar}</div>
                )}
                <div className="text-xs font-bold text-slate-700 leading-none text-center px-1 truncate w-full">{user.name}</div>
                <div className="absolute -top-2 -right-2 bg-sky-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 peer-checked:opacity-100 transition shadow-md scale-0 peer-checked:scale-100">
                  <i className="ph-bold ph-check"></i>
                </div>
              </label>
            </div>
          ))}
        </div>

        {/* Money Input with Toggle */}
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

        {/* Category Grid */}
        <div className="mb-6">
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

        {/* Description & Type */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('expenses.description_placeholder')}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold focus:outline-none focus:border-sky-500 transition"
          />

          {/* Split Toggle */}
          <div className="flex bg-slate-100 rounded-xl p-1 shrink-0">
            <div className="relative">
              <input
                type="radio"
                name="type"
                id="type-shared"
                checked={type === 'SHARED'}
                onChange={() => setType('SHARED')}
                className="peer hidden"
              />
              <label htmlFor="type-shared" className="block p-2 rounded-lg cursor-pointer transition text-slate-400 hover:text-slate-600 peer-checked:bg-slate-800 peer-checked:text-white">
                <i className="ph-bold ph-users text-xl"></i>
              </label>
            </div>
            <div className="relative">
              <input
                type="radio"
                name="type"
                id="type-personal"
                checked={type === 'PERSONAL'}
                onChange={() => setType('PERSONAL')}
                className="peer hidden"
              />
              <label htmlFor="type-personal" className="block p-2 rounded-lg cursor-pointer transition text-slate-400 hover:text-slate-600 peer-checked:bg-slate-800 peer-checked:text-white">
                <i className="ph-bold ph-user text-xl"></i>
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg shadow-slate-900/20 transition transform active:scale-[0.98] flex items-center justify-center gap-2">
          <i className="ph-bold ph-plus-circle text-xl"></i>
          <span>{t('expenses.add_expense_button')}</span>
        </button>
      </form>
    </section>
  );
};
