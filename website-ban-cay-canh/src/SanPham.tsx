import { useMemo, useState } from "react";
import AccountMenu from "./Dangnhap/Dangky";
import { useCart } from "./CartContext";
import { CartMenu } from "./GioHang";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  origin: string;
  description: string;
  light: string;
  watering: string;
  care: string;
  size: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Sen đá",
    price: 45000,
    category: "Sen đá",
    description: "Cây nhỏ gọn, thích hợp trang trí bàn học.",
    light: "Ánh sáng tự nhiên, thoáng mát; tránh nắng gắt buổi trưa.",
    watering: "Tưới khi đất đã khô hoàn toàn, khoảng 1–2 lần mỗi tuần.",
    care: "Dùng đất thoát nước tốt và chậu có lỗ thoát nước.",
    size: "Chậu mini, cao khoảng 8–12 cm.",
  },
  {
    id: 2,
    name: "Xương rồng",
    price: 55000,
    category: "Xương rồng",
    description: "Dễ chăm sóc, thích hợp đặt ở nơi có ánh sáng.",
    light: "Ưa nơi nhiều ánh sáng, có thể nhận nắng nhẹ mỗi ngày.",
    watering: "Tưới ít, chỉ tưới khi đất khô; tránh để cây bị úng.",
    care: "Đặt nơi thông thoáng và dùng giá thể thoát nước tốt.",
    size: "Chậu mini, cao khoảng 8–15 cm tùy loại.",
  },
  {
    id: 3,
    name: "Trầu bà",
    price: 75000,
    category: "Cây lá",
    description: "Cây lá xanh giúp không gian thêm tươi mát.",
    light: "Ánh sáng gián tiếp hoặc bóng râm sáng; tránh nắng trực tiếp.",
    watering: "Tưới khi mặt đất se khô, thường khoảng 2–3 lần mỗi tuần.",
    care: "Lau lá định kỳ và tỉa bỏ lá vàng để cây phát triển khỏe mạnh.",
    size: "Cây cao khoảng 20–35 cm, có thể trồng chậu hoặc để dây rủ.",
  },
  {
    id: 4,
    name: "Cây phát tài",
    price: 55000,
    category: "phát tài",
    description: "Dễ chăm sóc, thích hợp đặt ở nơi có ánh sáng.",
    light: "Ánh sáng tán xạ hoặc nơi sáng nhẹ trong nhà.",
    watering: "Tưới vừa đủ khi đất bắt đầu khô, không để nước đọng ở gốc.",
    care: "Giữ đất tơi xốp, lau lá và xoay chậu để cây nhận sáng đều.",
    size: "Cây cao khoảng 20–30 cm.",
  },
  {
    id: 5,
    name: "Cây lưỡi hổ mini",
    price: 55000,
    category: "lưỡi hổ",
    description: "Dễ chăm sóc, thích hợp đặt ở nơi có ánh sáng.",
    light: "Phát triển tốt ở nơi có ánh sáng gián tiếp, chịu bóng nhẹ.",
    watering: "Bạn chỉ cần tưới nước khoảng 1 lần mỗi 2 tuần vì lá cây có khả năng dự trữ nước rất tốt, phù hợp cho những ai bận rộn hoặc hay quên.",
    care: "Trồng trong đất thoát nước tốt và tránh tưới quá nhiều.",
    size: "Chậu mini, cao khoảng 10–20 cm.",
  },
  AM, giúp cây nhả oxy và hấp thụ khí độc vào ban đêm, giúp không khí quanh bàn làm việc luôn tươi mới

];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function SanPham() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [expandedProductId, setExpandedProductId] = useState<number | null>(
    null
  );
  const { addToCart } = useCart();

  const categories = useMemo(
    () => [...new Set(products.map((item) => item.category))],
    []
  );

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesCategory =
        category === "all" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 text-stone-800">
      {/* Header */}
      <header className="border-b border-green-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">
          <a href="/" className="flex items-center gap-3">
            <span className="rounded-xl bg-green-800 px-3 py-2 font-bold text-white">
              GG
            </span>

            <span className="text-xl font-bold text-green-900">
              GREEN GARDEN 
            </span>
          </a>

          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <a href="/san-pham" aria-current="page" className="font-bold text-green-700">
              Sản phẩm
            </a>

            <a href="/gioi-thieu" className="hover:text-green-700">
              Giới thiệu
            </a>

            <a href="/lien-he" className="hover:text-green-700">
              Liên hệ
            </a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-900 md:text-4xl">
            Tất cả sản phẩm
          </h1>

          <p className="mt-3 text-stone-600">
            Danh sách các sản phẩm hiện đang được bán tại GREEN GARDEN
          </p>
        </div>

        {/* Tìm kiếm và lọc */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">
              Tìm kiếm sản phẩm
            </label>

            <input
              id="search"
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
          <div>
            <label htmlFor="category" className="sr-only">
              Danh mục sản phẩm
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            >
              <option value="all">Tất cả danh mục</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p aria-live="polite" className="mb-4 text-sm text-stone-500">
          Tìm thấy {filteredProducts.length} sản phẩm
        </p>

        {/* Danh sách sản phẩm */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm"
              >
                {/* Thay bằng ảnh thật khi có dữ liệu sản phẩm */}
                <div className="flex h-48 items-center justify-center bg-green-100 text-green-800">
                  Ảnh {product.name}
                </div>

                <div className="p-6">
                  <p className="text-sm font-medium text-green-700">
                    {product.category}
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    {product.name}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {product.description}
                  </p>

                  <p className="mt-3 text-sm text-stone-500">
                    Xuất xứ: {product.origin}
                  </p>

                  <button
                    type="button"
                    aria-expanded={expandedProductId === product.id}
                    aria-controls={`product-details-${product.id}`}
                    onClick={() =>
                      setExpandedProductId((currentId) =>
                        currentId === product.id ? null : product.id
                      )
                    }
                    className="mt-4 font-semibold text-green-700 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {expandedProductId === product.id
                      ? "Ẩn thông tin chi tiết"
                      : "Xem thông tin chi tiết"}
                  </button>

                  {expandedProductId === product.id && (
                    <div
                      id={`product-details-${product.id}`}
                      className="mt-4 space-y-2 rounded-xl bg-green-50 p-4 text-sm leading-6 text-stone-700"
                    >
                      <p>
                        <span className="font-semibold text-green-900">
                          Ánh sáng:
                        </span>{" "}
                        {product.light}
                      </p>
                      <p>
                        <span className="font-semibold text-green-900">
                          Tưới nước:
                        </span>{" "}
                        {product.watering}
                      </p>
                      <p>
                        <span className="font-semibold text-green-900">
                          Cách chăm sóc:
                        </span>{" "}
                        {product.care}
                      </p>
                      <p>
                        <span className="font-semibold text-green-900">
                          Kích thước:
                        </span>{" "}
                        {product.size}
                      </p>
                    </div>
                  )}

                  <p className="mt-4 text-xl font-bold text-green-800">
                    {formatPrice(product.price)}
                  </p>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="mt-5 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-stone-300 p-10 text-center text-stone-600">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-green-950 text-green-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold">GREEN GARDEN</h2>
            <p className="mt-3 text-sm">Cửa hàng cây cảnh mini</p>
            <p className="mt-2 text-sm">
              Mang thiên nhiên đến góc nhỏ của bạn.
            </p>
          </div>

          <div>
            <h2 className="font-bold">SINH VIÊN THỰC HIỆN</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p>Phan Minh Anh</p>
              <p>Lớp: DA24TTB</p>
              <p>MSSV: 110124003</p>
            </div>
          </div>

          <div>
            <h2 className="font-bold">THÔNG TIN LIÊN HỆ</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p>SĐT: 0888898646</p>
              <p>Email: anhphan6745@gmail.com</p>
              <p>Địa chỉ: Vĩnh Long</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
