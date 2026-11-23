import { useEffect, useState } from "react";
import GioiThieu from "./GioiThieu";
import { QuanLyGioHang } from "./QuanLyGioHang";
import Lienhe from "./Lienhe";
import SanPham from "./SanPham";
import ChiTietSanPham from "./ChiTietSanPham";
import GioHangPage from "./DLieuGioHangPage";
import ThanhToan from "./ThanhToan";
import TrangChu from "./TrangChu";
import DonHang from "./DonHang";
import Admin from "./Admin";
import { AuthPage } from "./AuthPages";
import TaiKhoan from "./TaiKhoan";
import { useAuth } from "./AuthContext";
import { initializeLocalStore } from "./GreenGardenStore";
import { productGroups, products as seedProducts } from "./SanPham";

function getCurrentPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function App() {
  initializeLocalStore(seedProducts, productGroups);
  const [path, setPath] = useState(getCurrentPath);
  const { user } = useAuth();

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(getCurrentPath());
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const link = target?.closest("a");

      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || link.target === "_blank" || link.hasAttribute("download")) {
        return;
      }

      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      event.preventDefault();
      window.history.pushState({}, "", url.pathname + url.search + url.hash);
      setPath(url.pathname.replace(/\/+$/, "") || "/");
    };

    window.addEventListener("popstate", handleLocationChange);
    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  const productDetailMatch = path.match(/^\/san-pham\/(\d+)$/);
  const requiresUser = path === "/don-hang" || path === "/thanh-toan" || path === "/tai-khoan";

  return (
    <QuanLyGioHang>
      {requiresUser && !user ? (
        <RequireUser />
      ) : path === "/admin" ? (
        <Admin />
      ) : path === "/dang-nhap" ? (
        <AuthPage />
      ) : path === "/tai-khoan" ? (
        <TaiKhoan />
      ) : path === "/" ? (
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
        <TrangChu />
      )}
    </QuanLyGioHang>
  );
}

function RequireUser() {
  useEffect(() => {
    const destination = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`/dang-nhap?returnTo=${encodeURIComponent(destination)}`);
  }, []);
  return <main className="p-8 text-center text-[#526254]">Đang chuyển đến trang đăng nhập...</main>;
}

export default App;