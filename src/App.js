import React from 'react';
import './styles/App.css';
import ProductList from './components/productList';
import OrderSummary from './components/order';
import ReceiptDisplay from './components/display';
import QRCodeDisplay from './components/qrDisplay';
import usePOSLogic from './hooks/posLogic';

function App() {
  const pos = usePOSLogic();

  return (
    <div className="pos-container">
      <ProductList products={pos.products} addToOrder={pos.addToOrder} />
      <OrderSummary {...pos} />
      {pos.receiptInfo && pos.receiptText && (
        <ReceiptDisplay receiptText={pos.receiptText} receiptInfo={pos.receiptInfo} />
      )}
      <QRCodeDisplay qrCode={pos.qrCode} qrCodeRef={pos.qrCodeRef} />
    </div>
  );
}

export default App;
