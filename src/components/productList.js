import React from 'react';

const ProductList = ({ products, addToOrder }) => {
  return (
    <div className="product-list">
      <h2>Available Products</h2>
      {products.map(product => (
        <div key={product.id} className="product-card">
          <span>{product.name} - ₱{product.price.toFixed(2)}</span>
          <button onClick={() => addToOrder(product)}>Add</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
