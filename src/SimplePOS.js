import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import './SimplePOS.css'; // Import the CSS file

function SimplePOS() {
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

  const companyInfo = {
    name: 'TECHNOLOGY STORE',
    tin: '987-654-3210',
    address: '123, PILIPINAS',
    vatRate: 0.12,
    pwdSeniorDiscount: 0.20,
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      console.error("Error: formatCurrency received a non-numeric value:", amount);
      return '₱--.--';
    }
    return `₱${amount.toFixed(2)}`;
  };

  const generateORNumber = () => {
    const now = Date.now();
    const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `OR-${now.toString().slice(-6)}-${randomNumber}`;
  };

  const addToOrder = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCart(cart.map(item =>
      item.id === itemId ? { ...item, quantity: Math.max(1, parseInt(newQuantity)) } : item
    ));
  };

  const removeItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateVAT = (subtotal) => {
    return subtotal * companyInfo.vatRate;
  };

  const calculateDiscount = (subtotal) => {
    return hasDiscountId ? subtotal * companyInfo.pwdSeniorDiscount : 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const vat = calculateVAT(subtotal);
    const discount = calculateDiscount(subtotal);
    return subtotal + vat - discount;
  };

  const handleCheckout = () => {
    if (cart.length > 0 && clientName) {
      setIsPrinting(true);
      const currentDate = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
      const orNumber = generateORNumber();
      const subtotal = calculateSubtotal();
      const vatAmount = calculateVAT(subtotal);
      const discountAmount = calculateDiscount(subtotal);
      const totalAmount = calculateTotal();

      let receiptContent = `
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

      cart.forEach((item) => {
        receiptContent += `${item.name} x ${item.quantity} @ ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}\n`;
      });

      receiptContent += `
------------------------------------------------
Subtotal: ${formatCurrency(subtotal)}
VAT (${(companyInfo.vatRate * 100).toFixed(0)}%): ${formatCurrency(vatAmount)}
`;

      if (discountAmount > 0) {
        receiptContent += `Discount (${(companyInfo.pwdSeniorDiscount * 100).toFixed(0)}%): -${formatCurrency(discountAmount)}\n`;
      }

      receiptContent += `Total: ${formatCurrency(totalAmount)}
================================================
Thank you for your purchase!
      `;

      setReceiptText(receiptContent);

      const receiptData = {
        company: companyInfo,
        orNumber: orNumber,
        date: currentDate,
        clientName: clientName,
        clientAddress: clientAddress,
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: formatCurrency(item.price),
          total: formatCurrency(item.price * item.quantity),
        })),
        subtotal: formatCurrency(subtotal),
        vatAmount: formatCurrency(vatAmount),
        vatRate: companyInfo.vatRate,
        discountAmount: formatCurrency(discountAmount),
        discountRate: companyInfo.pwdSeniorDiscount,
        totalAmount: formatCurrency(totalAmount),
      };
      setQrCode(JSON.stringify(receiptData, null, 2));

      setCart([]);
      setClientName('');
      setClientAddress('');
      setHasDiscountId(false);

      setTimeout(() => {
        console.log("Text Receipt:", receiptContent);
        console.log("JSON for QR Code:", qrCode);
        alert('Checkout successful! Receipt generated.');
        setIsPrinting(false);
        //setReceiptText(''); // Clear receipt after showing alert (optional)
        //setQrCode(''); // Clear QR code after showing alert (optional)
      }, 1000);
    } else {
      alert('Please add items to the order and enter client name.');
    }
  };

  return (
    <div className="pos-container">
      <div className="product-list">
        <h2>Products</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-item">
              <div className="product-name">{product.name}</div>
              <div className="product-price">{formatCurrency(product.price)}</div>
              <button className="add-to-order" onClick={() => addToOrder(product)}>Add to Order</button>
            </div>
          ))}
        </div>
      </div>

      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.length === 0 ? (
          <p>No items in order.</p>
        ) : (
          <ul>
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <span>{item.name}</span>
                <div className="item-quantity">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        {cart.length > 0 && (
          <div className="totals">
            <div className="total-line">
              <span>Subtotal:</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            <div className="total-line">
              <span>VAT ({`${(companyInfo.vatRate * 100).toFixed(0)}%`}):</span>
              <span>{formatCurrency(calculateVAT(calculateSubtotal()))}</span>
            </div>
            {hasDiscountId && (
              <div className="total-line">
                <span>Discount ({`${(companyInfo.pwdSeniorDiscount * 100).toFixed(0)}%`}):</span>
                <span>-{formatCurrency(calculateDiscount(calculateSubtotal()))}</span>
              </div>
            )}
            <div className="total-line grand-total">
              <span>Total:</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <div className="customer-info">
              <h3>Customer Info</h3>
              <div className="input-group">
                <label htmlFor="clientName">Name:</label>
                <input
                  type="text"
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="clientAddress">Address (Optional):</label>
                <input
                  type="text"
                  id="clientAddress"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>
              <div className="discount-check">
                <label>
                  <input
                    type="checkbox"
                    checked={hasDiscountId}
                    onChange={(e) => setHasDiscountId(e.target.checked)}
                  />
                  Apply PWD/Senior Discount ({`${(companyInfo.pwdSeniorDiscount * 100).toFixed(0)}%`})
                </label>
              </div>
            </div>

            <button className="checkout-button" onClick={handleCheckout} disabled={isPrinting || cart.length === 0 || !clientName}>
              {isPrinting ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>

      {receiptText && (
        <div className="receipt-display">
          <h3>Receipt:</h3>
          <pre>{receiptText}</pre>
        </div>
      )}

      {qrCode && (
        <div className="qrcode-display">
          <h3>QR Code (JSON):</h3>
          <QRCodeCanvas value={qrCode} size={400} level="H" ref={qrCodeRef} />
          <p>Scan to view JSON receipt data.</p>
        </div>
      )}
    </div>
  );
}

export default SimplePOS;