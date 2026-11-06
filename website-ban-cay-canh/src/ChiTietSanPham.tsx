import AccountMenu from "./Dangnhap/Dangky";
import { useCart } from "./CartContext";
import { CartMenu } from "./GioHang";
import { getProductImage, products } from "./SanPham";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function ChiTietSanPham({ productId }: { productId: number }) {
  const product = products.find((item) => item.id === productId);
  const { addToCart } = useCart();

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="font-serif text-3xl text-[#263b2d]">Không tìm thấy sản phẩm</h1>
        <a href="/san-pham" className="mt-6 inline-flex rounded-full bg-[#314c39] px-6 py-3 text-sm font-semibold text-white hover:bg-[#243c2c]">Quay lại danh sách sản phẩm</a>
      </main>
    );
  }

  const image = getProductImage(product.id);
  const isPlant = product.group !== "Dụng cụ chăm sóc";

  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="font-serif text-lg font-semibold tracking-wide text-[#263b2d]">GREEN GARDEN</a>
          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/san-pham" className="font-semibold text-[#314c39]">Sản phẩm</a>
            <a href="/gioi-thieu" className="text-[#59645b] hover:text-[#314c39]">Về chúng tôi</a>
            <a href="/lien-he" className="text-[#59645b] hover:text-[#314c39]">Liên hệ</a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-16">
        <a href="/san-pham" className="text-sm font-medium text-[#526a51] hover:underline">← Quay lại danh sách sản phẩm</a>
        <div className="mt-6 grid gap-10 md:grid-cols-2 md:items-start md:gap-14">
          <div className="overflow-hidden rounded-3xl bg-[#e7e9df]">
            <img
              src={image ?? "/images/caycanh.jpg"}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#78836f]">{product.group}</p>
            <h1 className="mt-3 font-serif text-4xl leading-tight text-[#263b2d] sm:text-5xl">{product.name}</h1>
            <p className="mt-5 text-2xl font-semibold text-[#314c39]">{formatPrice(product.price)}</p>
            <p className="mt-5 max-w-prose leading-7 text-[#687168]">
              {product.description}
            </p>
            {product.origin && <p className="mt-3 text-sm text-[#747a70]">Xuất xứ: {product.origin}</p>}

            <button
              type="button"
              onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image })}
              className="mt-7 w-full rounded-full bg-[#314c39] px-5 py-3 font-semibold text-white transition hover:bg-[#243c2c] sm:w-auto sm:min-w-56"
            >
              Thêm vào giỏ hàng
            </button>

            <div className="mt-9 rounded-2xl bg-[#f0f1e9] p-5 sm:p-6">
              <h2 className="font-serif text-2xl text-[#314c39]">{isPlant ? "Thông tin chăm sóc" : "Thông tin sử dụng"}</h2>
              <div className="mt-4 space-y-2 text-sm leading-6 text-[#59645b]">
                <p>
                  <span className="font-semibold text-[#314c39]">{isPlant ? "Ánh sáng:" : "Công dụng:"}</span>{" "}
                  {product.light}
                </p>
                <p>
                  <span className="font-semibold text-[#314c39]">{isPlant ? "Tưới nước:" : "Hướng dẫn sử dụng:"}</span>{" "}
                  {product.watering}
                </p>
                <p>
                  <span className="font-semibold text-[#314c39]">{isPlant ? "Cách chăm sóc:" : "Bảo quản:"}</span>{" "}
                  {product.care}
                </p>
                <p>
                  <span className="font-semibold text-[#314c39]">Kích thước:</span>{" "}
                  {product.size}
                </p>
                {product.placement && (
                  <p>
                    <span className="font-semibold text-[#314c39]">Vị trí đặt lý tưởng:</span>{" "}
                    {product.placement}
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
