import React from 'react';
import './styles/App.css';
import ProductList from './components/productList';
import OrderSummary from './components/order';
import ReceiptDisplay from './components/display';
import QRCodeDisplay from './components/qrDisplay';
import usePOSLogic from './hooks/posLogic';

function App() {
  const pos = usePOSLogic();

  const { receiptText, receiptInfo } = pos;

  return (
    <div className="pos-container">
      <ProductList products={pos.products} addToOrder={pos.addToOrder} />
      <OrderSummary {...pos} />
      {receiptText && <ReceiptDisplay receiptText={receiptText} receiptInfo={receiptInfo} />}
      {pos.qrCode && <QRCodeDisplay qrCode={pos.qrCode} qrCodeRef={pos.qrCodeRef} />}
    </div>
  );
}

export default App;
