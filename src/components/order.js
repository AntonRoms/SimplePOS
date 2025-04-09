import React from 'react';

const OrderSummary = ({
  cart,
  clientName,
  clientAddress,
  hasDiscountId,
  setClientName,
  setClientAddress,
  setHasDiscountId,
  updateQuantity,
  removeItem,
  calculateSubtotal,
  calculateVAT,
  calculateDiscount,
  calculateTotal,
  handleCheckout,
  isPrinting
}) => {
  return (
    <div className="order-summary">
      <h2>Order Summary</h2>

      {cart.length === 0 && <p>No items in order.</p>}
      {cart.map(item => (
        <div key={item.id} className="cart-item">
          <span>{item.name}</span>
          <input
            type="number"
            value={item.quantity}
            min="1"
            onChange={(e) => updateQuantity(item.id, e.target.value)}
          />
          <span>₱{(item.price * item.quantity).toFixed(2)}</span>
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      <div className="client-info">
        <input
          type="text"
          placeholder="Client Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Client Address (optional)"
          value={clientAddress}
          onChange={(e) => setClientAddress(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={hasDiscountId}
            onChange={(e) => setHasDiscountId(e.target.checked)}
          />
          Has Senior/PWD Discount ID
        </label>
      </div>

      <div className="totals">
        <p>Subtotal: ₱{calculateSubtotal().toFixed(2)}</p>
        <p>VAT: ₱{calculateVAT(calculateSubtotal()).toFixed(2)}</p>
        {hasDiscountId && (
          <p>Discount: -₱{calculateDiscount(calculateSubtotal()).toFixed(2)}</p>
        )}
        <h3>Total: ₱{calculateTotal().toFixed(2)}</h3>
      </div>

      <button onClick={handleCheckout} disabled={isPrinting}>
        {isPrinting ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  );
};

export default OrderSummary;
