import GioiThieu from "./GioiThieu";
import { CartProvider } from "./CartProvider";
import Lienhe from "./Lienhe";
import SanPham from "./SanPham";

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  return (
    <CartProvider>
      {path === "/san-pham" ? (
        <SanPham />
      ) : path === "/lien-he" ? (
        <Lienhe />
      ) : (
        <GioiThieu />
      )}
    </CartProvider>
  );
}

export default App;