// --- HELPERS ---
export const formatCurrency = (amount) => {
    const numberAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
    if (isNaN(numberAmount)) {
        return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(0);
    }
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(numberAmount);
};
