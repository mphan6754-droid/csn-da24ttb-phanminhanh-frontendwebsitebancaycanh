import { useState } from "react";
import { AccountMenu } from "./AuthPages";
import { CartMenu } from "./GioHang";
import TheSanPham from "./TheSanPham";  
import { favoriteProductIds } from "./SanPham";
import { loadProductSales } from "./DlieuDonhangStorage";
import { useStoreCategories, useStoreProducts } from "./GreenGardenStore";

// Mô tả cho từng nhóm sản phẩm
const groupDescriptions: Record<string, string> = {
  "Cây mini": "Chậu cây nhỏ xinh, phù hợp với bàn học và bàn làm việc.",
  "Cây văn phòng": "Thêm sắc xanh dịu mắt cho không gian làm việc.",
  "Cây phong thủy": "Những loại cây được yêu thích để trang trí hoặc làm quà.",
  "Dụng cụ chăm sóc": "Vật dụng cần thiết giúp việc chăm cây thuận tiện hơn.",
};
// Component TrangChu hiển thị trang chủ của website bán cây cảnh
export default function TrangChu() {
  const currentProducts = useStoreProducts();
  const categories = useStoreCategories();
  const featuredProducts = currentProducts.filter((product) =>
    [1, 6, 9, 11].includes(product.id)
  );
  const [salesState] = useState(() => {
    try {
      return { counts: loadProductSales(), error: "" };
    } catch (error) {
      console.error("Không thể thống kê lượt bán sản phẩm:", error);
      return {
        counts: {} as Record<number, number>,
        error: "Không thể tải lượt bán từ lịch sử đơn hàng.",
      };
    }
  });

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Green Garden - Trang chủ">
            <img src="/images/logo%20website.jpg" alt="" className="h-12 w-12 shrink-0 rounded-full bg-white object-contain" />
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide text-[#263b2d]">GREEN GARDEN</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#7b8177]">Cây xanh cho nhà mình</span>
            </span>
          </a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/" aria-current="page" className="font-semibold text-[#314c39]">Trang chủ</a>
            <a href="/san-pham" className="text-[#59645b] hover:text-[#314c39]">Sản phẩm</a>
            <a href="/gioi-thieu" className="text-[#59645b] hover:text-[#314c39]">Về chúng tôi</a>
            <a href="/lien-he" className="text-[#59645b] hover:text-[#314c39]">Liên hệ</a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>
      <main>
        <section className="relative isolate flex min-h-[440px] items-center overflow-hidden px-5 py-16 sm:min-h-[520px] sm:px-8">
          <img
            src={`/images/${encodeURIComponent("banner trang chủ.jpg")}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#315d3d]/75 via-[#315d3d]/45 to-[#315d3d]/10" />
          <div className="mx-auto w-full max-w-7xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">GREEN GARDEN · VĨNH LONG</p>
            <h1 className="mt-5 max-w-[16ch] font-serif text-4xl leading-tight sm:max-w-none sm:text-6xl">
              <span className="sm:block">Mang một góc xanh</span>{" "}
              <span className="sm:block">nhỏ về nhà</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              Chọn một chậu cây dễ chăm, phù hợp với không gian sống và{" "}
              <span className="whitespace-nowrap">nhịp sinh hoạt</span> của bạn.
            </p>
            <a
              href="/san-pham"
              className="mt-8 inline-flex rounded-full bg-[#f8f7f2] px-7 py-3.5 text-sm font-semibold text-[#314c39] transition hover:bg-white"
            >
              Mua cây ngay
            </a>
          </div>
        </section>
        {/* Hiển thị các nhóm sản phẩm nổi bật với liên kết đến danh sách sản phẩm tương ứng */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-18">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Khám phá theo nhu cầu</p>
              <h2 className="mt-3 font-serif text-3xl text-[#263b2d] sm:text-4xl">Nhóm cây và sản phẩm</h2>
            </div>
            <a href="/san-pham" className="text-sm font-semibold text-[#526a51] hover:underline">Xem tất cả →</a>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((group, index) => (
              <a
                key={group}
                href={`/san-pham?group=${encodeURIComponent(group)}`}
                className="rounded-2xl border border-[#e2e0d7] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="font-serif text-2xl text-[#8b9b80]">0{index + 1}</span>
                <h3 className="mt-4 font-semibold text-[#314c39]">{group}</h3>
                <p className="mt-2 text-sm leading-6 text-[#747a70]">{groupDescriptions[group] ?? "Khám phá sản phẩm thuộc danh mục này."}</p>
              </a>
            ))}
          </div>
        </section>
        {/* Hiển thị các sản phẩm nổi bật được yêu thích với liên kết đến chi tiết sản phẩm */}
        <section className="bg-[#f1f0e9] px-5 py-14 sm:px-8 md:py-18">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Được yêu thích</p>
                <h2 className="mt-3 font-serif text-3xl text-[#263b2d] sm:text-4xl">Sản phẩm được yêu thích nhất</h2>
                <p className="mt-2 text-sm text-[#747a70]">Nhấn trái tim để thêm nhanh sản phẩm yêu thích vào giỏ hàng.</p>
              </div>
              <a href="/san-pham" className="text-sm font-semibold text-[#526a51] hover:underline">Khám phá cửa hàng →</a>
            </div>
            {salesState.error && (
              <p role="alert" className="mt-4 text-sm text-red-700">{salesState.error}</p>
            )}
            <div className="mt-7 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <TheSanPham
                  key={product.id}
                  product={product}
                  isFavorite={favoriteProductIds.includes(product.id)}
                  salesCount={
                    salesState.error
                      ? undefined
                      : salesState.counts[product.id] ?? 0
                  }
                />
              ))}
            </div>
          </div>
        </section>
        {/* Hiển thị các mẹo chăm sóc cây đơn giản cho người mới bắt đầu */}
        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center md:py-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Chăm cây thật đơn giản</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-[#263b2d] sm:text-4xl">Một vài mẹo nhỏ cho người mới bắt đầu</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl bg-white p-5">
              <h3 className="font-semibold text-[#314c39]">Quan sát ánh sáng</h3>
              <p className="mt-2 text-sm leading-6 text-[#747a70]">
                Chọn vị trí có ánh sáng phù hợp với từng loại cây. Tránh nắng gắt với cây ưa bóng.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-5">
              <h3 className="font-semibold text-[#314c39]">Tưới vừa đủ</h3>
              <p className="mt-2 text-sm leading-6 text-[#747a70]">
                Kiểm tra độ ẩm của đất trước khi tưới. Ưu tiên chậu có lỗ thoát nước.
              </p>
            </article>
            <article className="rounded-2xl bg-white p-5">
              <h3 className="font-semibold text-[#314c39]">Lau lá định kỳ</h3>
              <p className="mt-2 text-sm leading-6 text-[#747a70]">
                Nhẹ nhàng vệ sinh lá để cây sạch và góc xanh luôn tươi tắn.
              </p>
            </article>
          </div>
        </section>
      </main>
      <footer className="bg-[#24382b] px-5 py-10 text-[#e7e9e1] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-serif text-xl">GREEN GARDEN</h2>
            <p className="mt-3 text-sm leading-6 text-[#b8c2b6]">Cây xanh cho nhà mình.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Người thực hiện</h3>
            <p className="mt-3 text-sm leading-6">Phan Minh Anh · DA24TTB</p>
            <p className="text-sm text-[#b8c2b6]">MSSV: 110124003</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Liên hệ</h3>
            <a href="tel:0888898646" className="mt-3 block text-sm hover:text-white">0888898646</a>
            <a href="mailto:anhphan6754@gmail.com" className="mt-1 block break-all text-sm hover:text-white">anhphan6754@gmail.com</a>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Ghé thăm</h3>
            <p className="mt-3 text-sm leading-6">Vĩnh Long, Việt Nam</p>
            <a href="/lien-he" className="mt-1 inline-block text-sm text-[#d3dec9] hover:text-white">Chỉ đường và thông tin →</a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-[#aeb9ac]">
          © {new Date().getFullYear()} GREEN GARDEN
        </p>
      </footer>
    </div>
  );
}
