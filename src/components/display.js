import React, { useRef, useState } from 'react';
import { getContract } from '../Blockchain';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const ReceiptDisplay = ({ receiptText, receiptInfo }) => {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const uploadReceipt = useMutation(api.company.uploadReceipt);

  const handleSave = async () => {
    if (!receiptText || !receiptInfo) return;
    setLoading(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const lineHeight = 20;
    const lines = receiptText.split('\n');
    canvas.width = 600;
    canvas.height = lineHeight * lines.length + 20;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#000000';
    ctx.font = '16px monospace';

    lines.forEach((line, i) => {
      ctx.fillText(line, 10, 20 + i * lineHeight);
    });

    const base64Image = canvas.toDataURL('image/png');

    const imageData = base64Image.split(',')[1];
    const buffer = Uint8Array.from(atob(imageData), c => c.charCodeAt(0));
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    try {
      const contract = await getContract();
      const tx = await contract.registerReceipt(hashHex, receiptInfo.company);
      await tx.wait();
      console.log('Receipt hash registered on blockchain!');

      await uploadReceipt({
        base64: base64Image,
        company: receiptInfo.company,
        TIN: receiptInfo.TIN,
        ORnumber: receiptInfo.ORnumber,
        companyAddress: receiptInfo.companyAddress,
        date: receiptInfo.date,
      });

      setHasUploaded(true);
      console.log('Receipt uploaded to Convex!');
    } catch (err) {
      console.error('Error saving receipt:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="receipt-display">
      <h2>Receipt</h2>
      <textarea
        value={receiptText}
        rows={receiptText.split('\n').length}
        readOnly
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={handleSave} disabled={hasUploaded || loading}>
        {loading ? 'Saving...' : hasUploaded ? 'Saved' : 'Save to Blockchain and Upload'}
      </button>
    </div>
  );
};

export default ReceiptDisplay;
