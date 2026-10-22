
import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";

function GioiThieu() {
  return (
    <div className="min-h-screen bg-white text-gray-800">

      {/* HEADER */}
      <header className="bg-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-6 py-5">

          <a href="/" className="flex items-center gap-3">
            <span className="rounded-lg bg-green-700 px-3 py-2 font-bold text-white">
              GG
            </span>
            <span className="text-2xl font-bold text-green-800">
           GREEN GARDEN
            </span>
          </a>

          <nav className="flex flex-wrap items-center gap-6">
            <a href="/san-pham" className="hover:text-green-700">
              Sản phẩm
            </a>

            <a href="/gioi-thieu" className="font-bold text-green-700">
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

{/* BANNER GIỚI THIỆU */}
<section className="relative flex min-h-[420px] items-center justify-center overflow-hidden px-6 py-20">
  <img
    src="/images/caycanh.jpg"
    alt="Banner giới thiệu Green Garden"
    className="absolute inset-0 h-full w-full object-cover"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-green-900/60 via-green-800/20 to-green-700/40"></div>

  <div className="relative z-10 mx-auto max-w-4xl text-center text-white">
    <h1 className="mb-5 text-3xl font-bold md:text-5xl">
      Giới thiệu về GREEN GARDEN
    </h1>

    <p className="text-lg leading-8 text-white/95">
      GREEN GARDEN mang cây xanh mini đến gần hơn với không gian học tập,
      làm việc và sinh hoạt hằng ngày của bạn.
    </p>
  </div>
</section>


      {/* GIỚI THIỆU CỬA HÀNG */}
      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <img
            src="/images/GIOITHIEU.jpg"
            alt="Banner giới thiệu Green Garden"
            className="h-96 w-full rounded-2xl object-cover shadow-md"
          />
          <div>
            <h2 className="mb-6 text-3xl font-bold text-green-800">
              GREEN GARDEN Là gì?
            </h2>

            <p className="mb-5 leading-8 text-gray-600">
              GREEN GARDEN là cửa hàng trực tuyến chuyên cung cấp các loại cây cảnh mini,
              cây văn phòng, chậu mini, tiểu cảnh terrarium, cây phong thủy.
              Các sản phẩm của GREEN GARDEN phù hợp để trang trí bàn học,
              bàn làm việc, phòng ngủ hoặc làm quà tặng cho bạn bè, người thân.
            </p>

            <p className="mb-8 leading-8 text-gray-600">
              Với mong muốn mang thiên nhiên đến gần hơn với cuộc sống
              hiện đại, GREEN GARDEN tập trung vào những sản phẩm nhỏ gọn,
              dễ chăm sóc, có tính thẩm mỹ cao và phù hợp với nhiều
              không gian và nhu cầu khác nhau của khách hàng.
            </p>

            <a
              href="/san-pham"
              className="inline-block rounded-lg bg-green-700 px-7 py-3 font-semibold text-white hover:bg-green-800"
            >
              Xem sản phẩm
            </a>
          </div>
        </div>
      </section>

      {/* SỨ MỆNH */}
      <section className="bg-green-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-green-800">
              Sứ mệnh của GREEN GARDEN
            </h2>
            <p className="text-gray-600">
              Lan tỏa lối sống xanh thông qua những chậu cây nhỏ xinh.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <div className="mb-5 text-5xl">🌱</div>
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Mang thiên nhiên vào không gian sống
              </h3>
              <p className="leading-7 text-gray-600">
                GREEN GARDEN giúp góc học tập, bàn làm việc và phòng ở
                trở nên xanh mát, giúp ban có cảm giác thư giãn, gần gũi với thiên nhiên.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <div className="mb-5 text-5xl">🪴</div>
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Cung cấp sản phẩm dễ chăm sóc
              </h3>
              <p className="leading-7 text-gray-600">
                Các loại cây được lựa chọn phù hợp với người mới bắt đầu,
                không cần quá nhiều kinh nghiệm chăm cây.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 text-center shadow-md">
              <div className="mb-5 text-5xl">💚</div>
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Tạo niềm vui từ những điều nhỏ
              </h3>
              <p className="leading-7 text-gray-600">
                Một chậu cây nhỏ có thể giúp không gian thêm sinh động
                và tạo cảm giác thư giãn mỗi ngày.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CAM KẾT */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-green-800">
              Cam kết của cửa hàng
            </h2>
            <p className="text-gray-600">
              Green Garden luôn đặt chất lượng sản phẩm và trải nghiệm
              khách hàng lên hàng đầu.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-green-100 p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Cây khỏe, dáng đẹp, dễ chăm sóc.
              </h3>
              <p className="leading-7 text-gray-600">
                Mỗi cây trước khi đến tay khách hàng đều được lựa
                chọn kỹ, đảm bảo cây có hình dáng đẹp và dễ thích nghi.
              </p>
            </div>

            <div className="rounded-2xl border border-green-100 p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Thông tin rõ ràng
              </h3>
              <p className="leading-7 text-gray-600">
                Sản phẩm được cung cấp đầy đủ thông tin về giá bán,
                danh mục, xuất xứ và cách chăm sóc.
              </p>
            </div>

            <div className="rounded-2xl border border-green-100 p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Giá cả phù hợp
              </h3>
              <p className="leading-7 text-gray-600">
                GREEN GARDEN hướng đến mức giá hợp lý, phù hợp với
                học sinh, sinh viên và người đi làm.
              </p>
            </div>

            <div className="rounded-2xl border border-green-100 p-7 shadow-sm">
              <h3 className="mb-4 text-xl font-bold text-green-800">
                Hỗ trợ tư vấn
              </h3>
              <p className="leading-7 text-gray-600">
                Khách hàng có thể liên hệ để được tư vấn chọn cây
                phù hợp với nhu cầu và không gian sử dụng.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-green-950 px-6 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <h2 className="mb-5 text-2xl font-bold">
             GREEN GARDEN
            </h2>
            <p>Cửa hàng cây cảnh mini</p>
            <p>Mang thiên nhiên đến góc nhỏ của bạn.</p>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              SV THỰC HIỆN
            </h3>
            <p>Phan Minh Anh</p>
            <p>Lớp: DA24TTB</p>
            <p>MSSV: 110124003</p>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              THÔNG TIN LIÊN HỆ
            </h3>
            <p>SĐT: 0888898646</p>
            <p className="break-all">
              Email: anhphan6754@gmail.com
            </p>
            <p>Địa chỉ: Vĩnh Long</p>
          </div>

          <div>
            <h3 className="mb-5 font-bold">
              MẠNG XÃ HỘI
            </h3>
            <div className="flex flex-wrap gap-4">
              <a href="https://x.com">Twitter</a>
              <a href="https://instagram.com">Instagram</a>
              <a href="https://facebook.com">Facebook</a>
              <a href="https://linkedin.com">LinkedIn</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

export default GioiThieu;
