import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({ qrCode, qrCodeRef }) => {
  return (
    <div className="qr-code-display" ref={qrCodeRef}>
      <h2>QR Code</h2>
      <QRCode value={qrCode} size={256} />
    </div>
  );
};

export default QRCodeDisplay;
