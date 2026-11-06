import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";
import TheSanPham from "./TheSanPham";  
import { productGroups, products } from "./SanPham";

const featuredProducts = products.filter((product) =>
  [1, 6, 9, 11].includes(product.id)
);

const groupDescriptions: Record<string, string> = {
  "Cây mini": "Chậu cây nhỏ xinh, phù hợp với bàn học và bàn làm việc.",
  "Cây văn phòng": "Thêm sắc xanh dịu mắt cho không gian làm việc.",
  "Cây phong thủy": "Những loại cây được yêu thích để trang trí hoặc làm quà.",
  "Dụng cụ chăm sóc": "Vật dụng cần thiết giúp việc chăm cây thuận tiện hơn.",
};

export default function TrangChu() {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Green Garden - Trang chủ">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#314c39] font-serif text-sm font-bold text-[#f8f7f2]">
              gg
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide text-[#263b2d]">GREEN GARDEN</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#7b8177]">Cây xanh cho nhà mình</span>
            </span>
          </a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/san-pham" className="text-[#59645b] hover:text-[#314c39]">Sản phẩm</a>
            <a href="/gioi-thieu" className="text-[#59645b] hover:text-[#314c39]">Về chúng tôi</a>
            <a href="/don-hang" className="text-[#59645b] hover:text-[#314c39]">Đơn hàng của tôi</a>
            <a href="/lien-he" className="text-[#59645b] hover:text-[#314c39]">Liên hệ</a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main>
        <section className="relative isolate flex min-h-[440px] items-center overflow-hidden px-5 py-16 sm:min-h-[520px] sm:px-8">
          <img
            src="/images/banner-gioithieu.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#193a27]/85 via-[#193a27]/60 to-[#193a27]/15" />
          <div className="mx-auto w-full max-w-7xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">GREEN GARDEN · VĨNH LONG</p>
            <h1 className="mt-5 max-w-[16ch] font-serif text-4xl leading-tight sm:max-w-none sm:text-6xl">
              <span className="sm:block">Mang một góc xanh</span>{" "}
              <span className="sm:block">nhỏ về nhà</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/90 sm:text-lg">
              Chọn một chậu cây dễ chăm, phù hợp với không gian sống và nhịp sinh hoạt của bạn.
            </p>
            <a
              href="/san-pham"
              className="mt-8 inline-flex rounded-full bg-[#f8f7f2] px-7 py-3.5 text-sm font-semibold text-[#314c39] transition hover:bg-white"
            >
              Mua cây ngay
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:py-18">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Khám phá theo nhu cầu</p>
              <h2 className="mt-3 font-serif text-3xl text-[#263b2d] sm:text-4xl">Nhóm cây và sản phẩm</h2>
            </div>
            <a href="/san-pham" className="text-sm font-semibold text-[#526a51] hover:underline">Xem tất cả →</a>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {productGroups.map((group, index) => (
              <a
                key={group}
                href={`/san-pham?group=${encodeURIComponent(group)}`}
                className="rounded-2xl border border-[#e2e0d7] bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="font-serif text-2xl text-[#8b9b80]">0{index + 1}</span>
                <h3 className="mt-4 font-semibold text-[#314c39]">{group}</h3>
                <p className="mt-2 text-sm leading-6 text-[#747a70]">{groupDescriptions[group]}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-[#f1f0e9] px-5 py-14 sm:px-8 md:py-18">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">Được yêu thích</p>
                <h2 className="mt-3 font-serif text-3xl text-[#263b2d] sm:text-4xl">Cây nổi bật</h2>
              </div>
              <a href="/san-pham" className="text-sm font-semibold text-[#526a51] hover:underline">Khám phá cửa hàng →</a>
            </div>
            <div className="mt-7 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <TheSanPham key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

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

      <footer className="bg-[#24382b] px-5 py-8 text-center text-sm text-[#b8c2b6] sm:px-8">
        <p className="font-serif text-lg text-[#e7e9e1]">GREEN GARDEN</p>
        <p className="mt-2">Cây xanh cho nhà mình · Vĩnh Long, Việt Nam</p>
        <p className="mt-4 text-xs">Website còn trong giai đoạn phát triển.</p>
      </footer>
    </div>
  );
}
