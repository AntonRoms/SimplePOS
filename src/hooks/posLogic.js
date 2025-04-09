import { useState, useRef } from 'react';
import { formatCurrency, generateORNumber } from '../utils/fomatters';

const usePOSLogic = () => {
  const [products] = useState([
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
    { id: 4, name: 'Monitor', price: 300 },
    { id: 5, name: 'Webcam', price: 50 },
    { id: 6, name: 'Headphones', price: 100 },
  ]);
  const [cart, setCart] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [hasDiscountId, setHasDiscountId] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [receiptText, setReceiptText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const qrCodeRef = useRef();
  const [receiptInfo, setReceiptInfo] = useState(null);

  const companyInfo = {
    name: 'TECHNOLOGY STORE',
    tin: '987-654-3210',
    address: '123, PILIPINAS',
    vatRate: 0.12,
    pwdSeniorDiscount: 0.20,
  };

  const addToOrder = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    setCart(existingItem
      ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }]
    );
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, parseInt(newQuantity)) } : item
    ));
  };

  const removeItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const calculateVAT = (subtotal) => subtotal * companyInfo.vatRate;

  const calculateDiscount = (subtotal) =>
    hasDiscountId ? subtotal * companyInfo.pwdSeniorDiscount : 0;

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateVAT(subtotal) - calculateDiscount(subtotal);
  };

  const handleCheckout = () => {
    if (cart.length === 0 || !clientName) {
      alert('Please add items to the order and enter client name.');
      return;
    }
  
    const currentDate = new Date().toLocaleDateString();
    const orNumber = generateORNumber();
  
    const receiptInfo = {
      company: companyInfo.name,
      TIN: companyInfo.tin,
      ORnumber: orNumber,
      companyAddress: companyInfo.address,
      date: currentDate,
    };
  
    setReceiptInfo(receiptInfo);
  
    setIsPrinting(true);
    const subtotal = calculateSubtotal();
    const vat = calculateVAT(subtotal);
    const discount = calculateDiscount(subtotal);
    const total = calculateTotal();
  
    let receipt = `
  ==================== RECEIPT ====================
  Company: ${companyInfo.name}
  TIN: ${companyInfo.tin}
  OR Number: ${orNumber}
  Address: ${companyInfo.address}
  Date: ${currentDate}
  ------------------------------------------------
  Client: ${clientName}
  ${clientAddress ? `Address: ${clientAddress}\n------------------------------------------------` : '------------------------------------------------'}
  `;
  
    cart.forEach(item => {
      receipt += `${item.name} x ${item.quantity} @ ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n`;
    });
  
    receipt += `
  ------------------------------------------------
  Subtotal: ${formatCurrency(subtotal)}
  VAT (${(companyInfo.vatRate * 100).toFixed(0)}%): ${formatCurrency(vat)}
  `;
  
    if (discount > 0) {
      receipt += `Discount (${(companyInfo.pwdSeniorDiscount * 100).toFixed(0)}%): -${formatCurrency(discount)}\n`;
    }
  
    receipt += `Total: ${formatCurrency(total)}
  ================================================
  Thank you for your purchase!
  `;
  
    setReceiptText(receipt);
  
    const receiptData = {
      company: companyInfo,
      orNumber,
      date: currentDate,
      clientName,
      clientAddress,
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: formatCurrency(item.price),
        total: formatCurrency(item.price * item.quantity),
      })),
      subtotal: formatCurrency(subtotal),
      vatAmount: formatCurrency(vat),
      discountAmount: formatCurrency(discount),
      totalAmount: formatCurrency(total),
    };
  
    setQrCode(JSON.stringify(receiptData, null, 2));
    setCart([]);
    setClientName('');
    setClientAddress('');
    setHasDiscountId(false);
  
    setTimeout(() => {
      setIsPrinting(false);
    }, 1000);
  };
  
  return {
    products,
    cart,
    clientName,
    clientAddress,
    hasDiscountId,
    isPrinting,
    receiptText,
    qrCode,
    qrCodeRef,
    companyInfo,
    receiptInfo,
    setClientName,
    setClientAddress,
    setHasDiscountId,
    addToOrder,
    updateQuantity,
    removeItem,
    calculateSubtotal,
    calculateVAT,
    calculateDiscount,
    calculateTotal,
    handleCheckout,
  };
};

export default usePOSLogic;
