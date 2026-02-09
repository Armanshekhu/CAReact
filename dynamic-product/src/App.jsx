import { useState } from "react";

function App() {
  const [products] = useState([
    { id: 1, name: "Mobile", price: 15000 },
    { id: 2, name: "Fridge", price: 10000 },
    { id: 3, name: "AC", price: 30000 }
  ]);

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  const toggleCart = (product) => {
    const isInCart = cartItems.includes(product.id);

    if (isInCart) {
      setCartItems(cartItems.filter(id => id !== product.id));
      setTotal(total - product.price);
    } else {
      setCartItems([...cartItems, product.id]);
      setTotal(total + product.price);
    }
  };

  return (
    <div className="app-container">
      <h1 className="dashboard-title">Dynamic Product Dashboard</h1>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => {
            const isInCart = cartItems.includes(product.id);

            return (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
                  <button
                    className={`action-btn ${isInCart ? "remove" : "add"}`}
                    onClick={() => toggleCart(product)}
                  >
                    {isInCart ? "Remove from Cart" : "Add to Cart"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="total-container">
        <h2>Total: {total}</h2>
      </div>
    </div>
  );
}

export default App;
