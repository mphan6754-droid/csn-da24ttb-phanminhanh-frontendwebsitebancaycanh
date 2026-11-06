import GioiThieu from "./GioiThieu";
import { QuanLyGioHang } from "./QuanLyGioHang";
import Lienhe from "./Lienhe";
import SanPham from "./SanPham";
import ChiTietSanPham from "./ChiTietSanPham";
import GioHangPage from "./DLieuGioHangPage";
import ThanhToan from "./ThanhToan";
import TrangChu from "./TrangChu";
import DonHang from "./DonHang";

function App() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const productDetailMatch = path.match(/^\/san-pham\/(\d+)$/);

  return (
    <QuanLyGioHang>
      {path === "/" ? (
        <TrangChu />
      ) : path === "/gioi-thieu" ? (
        <GioiThieu />
      ) : path === "/san-pham" ? (
        <SanPham />
      ) : productDetailMatch ? (
        <ChiTietSanPham productId={Number(productDetailMatch[1])} />
      ) : path === "/gio-hang" ? (
        <GioHangPage />
      ) : path === "/thanh-toan" ? (
        <ThanhToan />
      ) : path === "/don-hang" ? (
        <DonHang />
      ) : path === "/lien-he" ? (
        <Lienhe />
      ) : (
        <GioiThieu />
      )}
    </QuanLyGioHang>
  );
}

export default App;