import React from 'react';

const ReceiptDisplay = ({ receiptText }) => {
  return (
    <div className="receipt-display">
      <h2>Receipt</h2>
      <textarea
        value={receiptText}
        rows={receiptText.split('\n').length}
        readOnly
      />
    </div>
  );
};

export default ReceiptDisplay;
