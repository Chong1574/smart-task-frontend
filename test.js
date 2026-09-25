const state = {
    accounts: [
        {
            id: 1,
            name: 'Didi prestamo',
            type: 'loan',
            sub_type: 'debit',
            balance: -1352.8,
            payment_day: 5,
            payment_frequency: 'MONTHLY',
            monthly_payment: 586.67
        }
    ],
    transactions: []
};

const payments = [];
const now = new Date(2026, 8, 25);
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

state.accounts.forEach(acc => {
    const isDebt = acc.type === 'loan' || (acc.type === 'card' && acc.sub_type === 'credit');
    if (!isDebt || Number(acc.balance) >= 0 || !acc.payment_day) return;
    if (acc.payment_frequency === 'ONCE') return;

    let nextDate;
    if (acc.payment_frequency === 'WEEKLY') {
        const targetDow = acc.payment_day === 7 ? 0 : acc.payment_day;
        const delta = (targetDow - today.getDay() + 7) % 7 || 7;
        nextDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + delta);
    } else if (acc.payment_frequency === 'BIWEEKLY') {
        nextDate = new Date(today.getFullYear(), today.getMonth(), acc.payment_day);
        while (nextDate < today) nextDate.setDate(nextDate.getDate() + 14);
    } else {
        nextDate = new Date(today.getFullYear(), today.getMonth(), acc.payment_day);
        if (nextDate < today) nextDate.setMonth(nextDate.getMonth() + 1);
    }

    const daysRemaining = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    let amountToPay = Number(acc.monthly_payment);
    if (!amountToPay || amountToPay === 0) {
        const balance = Math.abs(Number(acc.balance));
        amountToPay = balance < 500 ? balance : balance * 0.05; 
    }

    let cycleDays = 30;
    if (acc.payment_frequency === 'WEEKLY') cycleDays = 7;
    else if (acc.payment_frequency === 'BIWEEKLY') cycleDays = 14;

    const cycleStart = new Date(nextDate.getTime() - (cycleDays * 24 * 3600 * 1000));
    const nextDateEnd = new Date(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate(), 23, 59, 59);

    const paymentsThisCycle = state.transactions.filter(t => 
        t.accountId === acc.id &&
        (t.type === 'credit_payment' || t.type === 'loan_payment') &&
        new Date(t.date) >= cycleStart &&
        new Date(t.date) <= nextDateEnd
    );

    const totalPaidThisCycle = paymentsThisCycle.reduce((sum, t) => sum + Number(t.amount), 0);
    amountToPay = Math.max(0, amountToPay - totalPaidThisCycle);

    if (amountToPay <= 0) return;

    payments.push({
        name: 'Pago ' + acc.name,
        amount: amountToPay,
        date: nextDate,
        type: acc.type === 'loan' ? 'Préstamo' : 'Tarjeta de Crédito',
        daysRemaining,
        sourceType: 'account',
        sourceId: acc.id,
        accountId: acc.id,
        category: acc.type === 'loan' ? 'Pago Préstamo' : 'Pago Tarjeta',
    });
});

console.log(payments.filter(p => p.daysRemaining <= 31).sort((a, b) => a.daysRemaining - b.daysRemaining));
