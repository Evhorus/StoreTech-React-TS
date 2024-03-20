import { useCart } from "./hooks/useCart";
import Header from "./components/Header";
import Product from "./components/Product";

function App() {
  const {
    data,
    cart,
    addToCart,
    decreaseQuantity,
    increaseQuantity,
    removeFromCart,
    clearCart,
    isEmpty,
    cartTotal,
  } = useCart();

  return (
    <>
      <Header
        cart={cart}
        decreaseQuantity={decreaseQuantity}
        increaseQuantity={increaseQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        isEmpty={isEmpty}
        cartTotal={cartTotal}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestros Productos</h2>
        <div className="row mt-5">
          {data.map((product) => (
            <Product key={product.id} product={product} addToCart={addToCart} />
          ))}
          ;
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            StoreTech - Todos los derechos Reservados 2024
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
