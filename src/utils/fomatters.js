export const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      console.error("Error: formatCurrency received a non-numeric value:", amount);
      return '₱--.--';
    }
    return `₱${amount.toFixed(2)}`;
  };
  
  export const generateORNumber = () => {
    const now = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `OR-${now.toString().slice(-6)}-${random}`;
  };
  