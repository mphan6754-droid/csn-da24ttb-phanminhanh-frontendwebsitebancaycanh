import { useMemo, useState } from "react";
import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";
import TheSanPham from "./TheSanPham";

export type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  group: string;
  origin?: string;
  description: string;
  light: string;
  watering: string;
  care: string;
  size: string;
  placement?: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Cây Sen Đá",
    price: 35000,
    category: "Sen đá",
    group: "Cây mini",
    description: "Cây nhỏ gọn, thích hợp trang trí bàn học.",
    light: "Ánh sáng tự nhiên, thoáng mát; tránh nắng gắt buổi trưa.",
    watering: "Tưới khi đất đã khô hoàn toàn, khoảng 1–2 lần mỗi tuần.",
    care: "Dùng đất thoát nước tốt và chậu có lỗ thoát nước.",
    size: "Chậu mini, cao khoảng 8–12 cm.",
  },
  {
    id: 2,
    name: "Cây Xương Rồng",
    price: 45000,
    category: "Xương rồng",
    group: "Cây mini",
    description: "Dễ chăm sóc, thích hợp đặt ở nơi có ánh sáng.",
    light: "Ưa nơi nhiều ánh sáng, có thể nhận nắng nhẹ mỗi ngày.",
    watering: "Tưới ít, chỉ tưới khi đất khô; tránh để cây bị úng.",
    care: "Đặt nơi thông thoáng và dùng giá thể thoát nước tốt.",
    size: "Chậu mini, cao khoảng 8–15 cm tùy loại.",
  },
  {
    id: 3,
    name: "Cây Kim Ngân",
    price: 85000,
    category: "Kim Ngân",
    group: "Cây văn phòng",
    description: "Cây Kim Ngân có dáng đẹp, phù hợp trang trí bàn làm việc, phòng khách hoặc sảnh.",
    light: "Cây ưa ánh sáng gián tiếp. Tránh để cây dưới nắng gắt.",
    watering: "Tưới 1–2 lần mỗi tuần, để đất khô nhẹ giữa các lần tưới.",
    care: "Phun sương nhẹ lên lá để giữ độ ẩm trong phòng điều hòa.",
    size: "Cây cao khoảng 20–35 cm, có thể trồng chậu hoặc để dây rủ.",
  },
  {
    id: 4,
    name: "Cây Phát Tài",
    price: 120000,
    category: "Phát Tài",
    group: "Cây phong thủy",
    description: "Cây dễ chăm sóc, phù hợp trang trí không gian sống và làm việc.",
    light: "Ánh sáng tán xạ hoặc nơi sáng nhẹ trong nhà.",
    watering: "Tưới vừa đủ khi đất bắt đầu khô, không để nước đọng ở gốc.",
    care: "Giữ đất tơi xốp, lau lá và xoay chậu để cây nhận sáng đều.",
    size: "Cây cao khoảng 20–30 cm.",
  },
  {
    id: 5,
    name: "Cây Lưỡi Hổ Mini",
    price: 75000,
    category: "Lưỡi hổ",
    group: "Cây phong thủy",
    description: "Dáng cây gọn gàng, dễ chăm sóc và phù hợp với nhiều không gian.",
    light: "Phát triển tốt ở nơi có ánh sáng gián tiếp, chịu bóng nhẹ.",
    watering: "Tưới khi đất khô; cây thường cần ít nước hơn vào những ngày mát.",
    care: "Trồng trong đất thoát nước tốt và tránh tưới quá nhiều.",
    size: "Chậu mini, cao khoảng 10–20 cm.",
  },
  {
    id: 6,
    name: "Cây Kim Tiền",
    price: 120000,
    category: "Kim Tiền",
    group: "Cây phong thủy",
    description: "Cây Kim Tiền có lá xanh bóng, dáng khỏe khoắn và thường được chọn để trang trí nhà ở, văn phòng.",
    light: "Phát triển tốt ở nơi có ánh sáng gián tiếp, chịu bóng nhẹ.",
    watering: "Tưới khi đất đã khô; tránh để nước đọng lâu trong chậu.",
    care: "Đặt cây ở nơi thoáng, có ánh sáng gián tiếp và dùng đất thoát nước tốt.",
    size: "Chậu mini, cao khoảng 20–25 cm.",
  },
  {
    id: 7,
    name: "Cây Phú Quý",
    price: 85000,
    category: "Phú Quý",
    group: "Cây phong thủy",
    description: "Cây Phú Quý nổi bật với sắc lá xanh pha đỏ, thích hợp trang trí bàn làm việc hoặc phòng khách.",
    light: "Cây ưa ánh sáng tán xạ, tránh nắng gắt trực tiếp.",
    watering: "Tưới khi đất bắt đầu khô; nếu trồng thủy sinh, thay nước định kỳ.",
    care: "Đặt cây ở nơi có ánh sáng tán xạ và tránh nắng gắt.",
    size: "Chậu mini, cao khoảng 10–20 cm.",
  },
  {
    id: 8,
    name: "Cây Ngọc Ngân",
    price: 85000,
    category: "Ngọc Ngân",
    group: "Cây phong thủy",
    description: "Cây Ngọc Ngân có lá xanh điểm trắng đẹp mắt, phù hợp trang trí bàn làm việc hoặc góc phòng.",
    light: "Cây ưa bóng mát, tránh nắng trực tiếp.",
    watering: "Tưới khi bề mặt đất bắt đầu khô; tránh để cây bị úng.",
    care: "Đặt cây ở nơi thoáng mát, có ánh sáng gián tiếp.",
    size: "Cây cao khoảng 20–60 cm.",
  },
  {
    id: 9,
    name: "Cây Trầu Bà Leo",
    price: 120000,
    category: "Trầu Bà Leo",
    group: "Cây văn phòng",
    description: "Trầu Bà Leo có dáng dây mềm mại, phù hợp treo hoặc đặt trên kệ để tạo điểm nhấn xanh.",
    light: "Cây ưa ánh sáng gián tiếp, tránh nắng gắt trực tiếp.",
    watering: "Tưới khi đất se khô, điều chỉnh lượng nước theo điều kiện thời tiết.",
    care: "Cây chịu bóng nhẹ. Tỉa dây dài để giữ dáng gọn gàng và khuyến khích cây ra nhánh mới.",
    size: "Cây dạng dây leo, có thể buông rủ.",
  },
  {
    id: 10,
    name: "Cây Trầu Bà Đế Vương",
    price: 180000,
    category: "Trầu Bà Đế Vương",
    group: "Cây văn phòng",
    description: "Trầu Bà Đế Vương có tán lá lớn, màu xanh đậm hoặc đỏ tía, tạo điểm nhấn nổi bật cho căn phòng.",
    light: "Cây phù hợp với ánh sáng gián tiếp và có thể chịu bóng nhẹ.",
    watering: "Tưới vừa phải khi đất khô; tránh để nước đọng ở gốc.",
    care: "Chờ đất khô nhẹ rồi mới tưới lại. Tránh tưới quá nhiều để hạn chế úng rễ.",
    size: "Cây trồng chậu, có tán lá lớn.",
  },
  {
    id: 11,
    name: "Cây Hồng Môn",
    price: 95000,
    category: "Hồng Môn",
    group: "Cây văn phòng",
    description: "Hồng Môn nổi bật với hoa đỏ rực và lá xanh bóng, thích hợp trang trí bàn làm việc hoặc phòng khách.",
    light: "Ưa ánh sáng gián tiếp, tránh nắng gắt chiếu trực tiếp.",
    watering: "Giữ đất hơi ẩm, tưới khi bề mặt đất bắt đầu khô.",
    care: "Đặt cây nơi thông thoáng, có thể phun sương nhẹ khi không khí khô.",
    size: "Cây chậu để bàn, cao khoảng 20–40 cm.",
  },
  {
    id: 12,
    name: "Cây May Mắn",
    price: 65000,
    category: "May Mắn",
    group: "Cây mini",
    description: "Chậu cây mini nhỏ gọn, phù hợp trang trí bàn học, bàn làm việc hoặc góc phòng.",
    light: "Đặt nơi sáng thoáng, có ánh sáng tự nhiên gián tiếp.",
    watering: "Tưới vừa đủ khi đất se khô, tránh để nước đọng dưới đáy chậu.",
    care: "Giữ cây ở nơi thông thoáng và tỉa bỏ lá khô.",
    size: "Chậu mini, phù hợp trang trí mặt bàn.",
  },
  {
    id: 13,
    name: "Cây Si Đài Loan",
    price: 150000,
    category: "Si Đài Loan",
    group: "Cây văn phòng",
    description: "Cây Si Đài Loan có thân và tán lá đẹp, thường được tạo dáng bonsai để trang trí bàn làm việc hoặc phòng khách.",
    light: "Đặt cây ở nơi sáng thoáng, có ánh sáng tự nhiên.",
    watering: "Tưới khi đất bắt đầu khô; điều chỉnh lượng nước theo điều kiện thực tế.",
    care: "Tỉa cành định kỳ để giữ dáng bonsai. Bón phân theo hướng dẫn của sản phẩm.",
    size: "Dạng bonsai, có thể uốn nắn và tạo dáng theo thời gian.",
    placement: "Bàn làm việc, kệ trang trí hoặc phòng khách.",
  },
  {
    id: 14,
    name: "Cây Tùng Tuyết",
    price: 120000,
    category: "Tùng Tuyết",
    group: "Cây phong thủy",
    description: "Tùng Tuyết có dáng cây xanh quanh năm, thích hợp trang trí bàn hoặc kệ trong nhà.",
    light: "Đặt nơi sáng thoáng, ưu tiên ánh sáng tự nhiên.",
    watering: "Tưới khi lớp đất mặt khô nhẹ, không để cây bị úng.",
    care: "Giữ cây thông thoáng, tỉa cành khô và dùng đất thoát nước tốt.",
    size: "Cây trồng chậu trang trí, kích thước tùy cây.",
  },
  {
    id: 15,
    name: "Cây Đa Búp",
    price: 90000,
    category: "Đa Búp",
    group: "Cây văn phòng",
    description: "Cây Đa Búp có lá xanh dày, bóng đẹp, phù hợp đặt ở bàn làm việc hoặc góc phòng nhiều ánh sáng.",
    light: "Ưa ánh sáng gián tiếp, tránh nắng gắt kéo dài.",
    watering: "Tưới khi bề mặt đất khô, không để chậu đọng nước.",
    care: "Lau lá định kỳ và đặt cây nơi thông thoáng.",
    size: "Cây chậu để bàn, kích thước tùy cây.",
  },
  {
    id: 16,
    name: "Cây Đuôi Công",
    price: 110000,
    category: "Đuôi Công",
    group: "Cây văn phòng",
    description: "Cây Đuôi Công gây ấn tượng với họa tiết lá độc đáo, giúp không gian trong nhà thêm sinh động.",
    light: "Ưa ánh sáng tán xạ và môi trường có độ ẩm vừa phải.",
    watering: "Giữ đất ẩm nhẹ, tránh tưới quá nhiều gây úng rễ.",
    care: "Tránh nắng trực tiếp, có thể phun sương nhẹ khi không khí khô.",
    size: "Cây trồng chậu trang trí, kích thước tùy cây.",
  },
  {
    id: 17,
    name: "Phân bón Amino đạm cá Nhật Bản",
    price: 55000,
    category: "Phân bón",
    group: "Dụng cụ chăm sóc",
    description: "Phân bón Amino giúp bổ sung dinh dưỡng cho cây trồng.",
    light: "Dùng để bổ sung dinh dưỡng cho cây.",
    watering: "Pha và sử dụng theo hướng dẫn trên bao bì sản phẩm.",
    care: "Không tự ý tăng liều lượng; bảo quản kín sau khi sử dụng.",
    size: "Đóng gói theo sản phẩm trong ảnh.",
  },
  {
    id: 18,
    name: "Bình tưới mini 15 ml",
    price: 15000,
    category: "Bình tưới",
    group: "Dụng cụ chăm sóc",
    description: "Bình tưới mini giúp tưới lượng nước nhỏ, thuận tiện chăm sóc cây để bàn.",
    light: "Phù hợp tưới cây mini và cây trồng trong chậu nhỏ.",
    watering: "Châm nước và bóp nhẹ để tưới từ từ.",
    care: "Rửa sạch, để khô sau khi dùng và bảo quản nơi thoáng mát.",
    size: "Dung tích 15 ml.",
  },
  {
    id: 19,
    name: "Bình tưới nước vòi dài",
    price: 45000,
    category: "Bình tưới",
    group: "Dụng cụ chăm sóc",
    description: "Vòi tưới dài giúp đưa nước đến gốc cây và các vị trí khó với tới.",
    light: "Dùng tưới cây trồng trong nhà và cây đặt trên kệ.",
    watering: "Rót nước chậm qua vòi để hạn chế làm xói đất.",
    care: "Đổ hết nước và vệ sinh bình sau khi sử dụng.",
    size: "Bình tưới có vòi dài.",
  },
  {
    id: 20,
    name: "Bộ dụng cụ làm vườn 3 món",
    price: 85000,
    category: "Dụng cụ làm vườn",
    group: "Dụng cụ chăm sóc",
    description: "Bộ dụng cụ cơ bản hỗ trợ xới đất, trồng và chăm sóc cây tại nhà.",
    light: "Phù hợp chăm sóc cây trồng chậu và làm vườn tại nhà.",
    watering: "Làm sạch đất bám trên dụng cụ sau khi sử dụng.",
    care: "Lau khô và cất giữ nơi khô ráo.",
    size: "Bộ gồm 3 món.",
  },
  {
    id: 21,
    name: "Găng tay làm vườn",
    price: 25000,
    category: "Găng tay",
    group: "Dụng cụ chăm sóc",
    description: "Găng tay hỗ trợ bảo vệ tay khi trồng cây, xới đất và làm vườn.",
    light: "Dùng trong các công việc trồng và chăm sóc cây.",
    watering: "Chọn kích cỡ vừa tay để thao tác thuận tiện.",
    care: "Giũ sạch đất, phơi khô sau khi dùng và cất nơi thoáng.",
    size: "Kích cỡ theo sản phẩm trong ảnh.",
  },
];

export const productGroups = [
  "Cây mini",
  "Cây văn phòng",
  "Cây phong thủy",
  "Dụng cụ chăm sóc",
];

const productImage = (fileName: string) =>
  `/images/${encodeURIComponent(fileName)}`;

const productImages: Record<number, string> = {
  1: productImage("Cây sen đá.jpeg"),
  2: productImage("cây xương rồng.jpg"),
  3: productImage("cây kim ngân.jpeg"),
  4: productImage("Cây phát tài.jpeg"),
  5: productImage("Cây lưỡi Hổ.jpeg"),
  6: productImage("Cây kim tiền.jpeg"),
  7: productImage("Cây phú quý.jpeg"),
  8: productImage("Cây ngọc ngân.jpeg"),
  9: productImage("Cây Trầu Bà Leo.jpeg"),
  10: productImage("Cây Trầu Bà Đế Vương.jpeg"),
  11: productImage("Cây hồng môn.jpeg"),
  12: productImage("Cây mai mắn.webp"),
  13: productImage("cây si đài loan.jpeg"),
  14: productImage("cây tùng tuyết.jpeg"),
  15: productImage("cây đa búp.webp"),
  16: productImage("cây đui công.webp"),
  17: productImage("Amino- phân bón đam cá Nhật Bản.webp"),
  18: productImage("bình tưới 15ml.webp"),
  19: productImage("bình tưới nước vòi dài.webp"),
  20: productImage("Bộ dụng cụ làm vườn 3 món.webp"),
  21: productImage("găng tay làm vườn.webp"),
};

export const getProductImage = (productId: number) => productImages[productId];

export default function SanPham() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(() => {
    const requestedGroup = new URLSearchParams(window.location.search).get("group");
    return productGroups.find((group) => group === requestedGroup) ?? "all";
  });

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesCategory =
        category === "all" || item.group === category;

      return matchesSearch && matchesCategory;
    });
  }, [category, search]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Green Garden - Trang chủ">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#314c39] font-serif text-sm font-bold tracking-tight text-[#f8f7f2]">
              gg
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide text-[#263b2d]">GREEN GARDEN</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#7b8177]">Cây xanh cho nhà mình</span>
            </span>
          </a>

          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/san-pham" aria-current="page" className="font-semibold text-[#314c39]">
              Sản phẩm
            </a>

            <a href="/gioi-thieu" className="text-[#59645b] transition hover:text-[#314c39]">
              Về chúng tôi
            </a>

            <a href="/don-hang" className="text-[#59645b] transition hover:text-[#314c39]">
              Đơn hàng
            </a>

            <a href="/lien-he" className="text-[#59645b] transition hover:text-[#314c39]">
              Liên hệ
            </a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-12 sm:px-8 md:py-16">
        <div className="mb-9 flex flex-col justify-between gap-5 border-b border-[#e2e0d7] pb-8 md:flex-row md:items-end">
          <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">GREEN GARDEN · VĨNH LONG</p>
          <h1 className="font-serif text-4xl text-[#263b2d] sm:text-5xl">
          Thêm màu xanh cho không gian của bạn
          </h1>
          <p className="mt-3 max-w-xl leading-7 text-[#687168]">
            Chọn một người bạn xanh nhỏ cho bàn làm việc, kệ sách hoặc góc phòng.
          </p>
          </div>
          <p className="text-sm text-[#7b8177]">Được chọn lọc để dễ chăm mỗi ngày.</p>
        </div>

        <div className="mb-7 flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Tìm kiếm sản phẩm
            </label>

            <input
              id="search"
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-[#deded4] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#9a9e93] focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
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
              className="w-full rounded-xl border border-[#deded4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
            >
              <option value="all">Tất cả nhóm sản phẩm</option>

              {productGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p aria-live="polite" className="mb-4 text-xs uppercase tracking-[0.12em] text-[#85887e]">
          Tìm thấy {filteredProducts.length} sản phẩm
        </p>

        {/* Danh sách sản phẩm */}
        {filteredProducts.length > 0 ? (
          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <TheSanPham key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d6d8ce] bg-white p-12 text-center text-[#747a70]">
            Không tìm thấy sản phẩm phù hợp.
          </div>
        )}
      </main>

      <footer className="mt-16 bg-[#24382b] text-[#e7e9e1]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3">
          <div>
            <h2 className="font-serif text-xl">GREEN GARDEN</h2>
            <p className="mt-3 text-sm text-[#b8c2b6]">Thêm sắc xanh cho không gian sống.</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Người thực hiện</h2>
            <div className="mt-3 space-y-1 text-sm">
              <p>Phan Minh Anh</p>
              <p>Lớp: DA24TTB</p>
              <p>MSSV: 110124003</p>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Liên hệ</h2>
            <div className="mt-3 space-y-2 text-sm">
              <a href="tel:0888898646" className="block hover:text-white">0888898646</a>
              <a href="mailto:mphan6754@gmail.com" className="block break-all hover:text-white">mphan6754@gmail.com</a>
              <p>Vĩnh Long, Việt Nam</p>
            </div>
          </div>
        </div>
        <p className="mx-auto max-w-7xl border-t border-white/10 px-5 py-5 text-xs text-[#aeb9ac] sm:px-8">
          © {new Date().getFullYear()} GREEN GARDEN
        </p>
      </footer>
    </div>
  );
}
