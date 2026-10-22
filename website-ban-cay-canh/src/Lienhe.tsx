import { useState, type SubmitEvent } from "react";
import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";

function Lienhe() {
  const [formMessage, setFormMessage] = useState("");

  const handleContact = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(
      "Form hiện chưa kết nối máy chủ. Vui lòng gọi 0888898646 hoặc gửi email đến anhphan6754@gmail.com."
    );
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
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

          <nav
            aria-label="Điều hướng chính"
            className="flex flex-wrap items-center gap-6"
          >
            <a href="/san-pham" className="hover:text-green-700">
              Sản phẩm
            </a>
            <a href="/gioi-thieu" className="hover:text-green-700">
              Giới thiệu
            </a>
            <a
              href="/lien-he"
              aria-current="page"
              className="font-bold text-green-700"
            >
              Liên hệ
            </a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-600 px-6 py-20 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-3 font-semibold uppercase tracking-[0.2em] text-green-100">
            GREEN GARDEN luôn sẵn sàng hỗ trợ
          </p>
          <h1 className="mb-5 text-3xl font-bold md:text-5xl">
            Liên hệ với GREEN GARDEN
          </h1>
          <p className="text-lg leading-8 text-white/95">
            Nếu bạn cần tư vấn chọn cây cảnh mini, phụ kiện chăm sóc cây hoặc
            muốn đặt hàng, hãy gửi thông tin cho chúng tôi.
          </p>
        </div>
      </section>

      <main className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-green-800">
              Thông tin liên hệ
            </h2>
            <p className="text-gray-600">
              GREEN GARDEN luôn sẵn sàng hỗ trợ bạn trong quá trình lựa chọn
              sản phẩm.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-2xl border border-green-100 bg-green-50 p-7 shadow-sm md:p-9">
              <h2 className="mb-7 text-2xl font-bold text-green-800">
                GREEN GARDEN
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <span aria-hidden="true" className="text-2xl">
                    📍
                  </span>
                  <div>
                    <h3 className="font-semibold">Địa chỉ</h3>
                    <p className="mt-1 leading-7 text-gray-600">
                      313 Dương Quang Đông, khóm 3, phường Hòa Thuận, tỉnh Vĩnh
                      Long
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span aria-hidden="true" className="text-2xl">
                    ☎️
                  </span>
                  <div>
                    <h3 className="font-semibold">Số điện thoại</h3>
                    <a
                      href="tel:0888898646"
                      className="mt-1 inline-block text-gray-600 hover:text-green-700"
                    >
                      0888898646
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span aria-hidden="true" className="text-2xl">
                    ✉️
                  </span>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <a
                      href="mailto:anhphan6754@gmail.com"
                      className="mt-1 inline-block break-all text-gray-600 hover:text-green-700"
                    >
                      anhphan6754@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span aria-hidden="true" className="text-2xl">
                    ⏰
                  </span>
                  <div>
                    <h3 className="font-semibold">Thời gian làm việc</h3>
                    <p className="mt-1 text-gray-600">
                      Thứ 2 - Chủ nhật: 8:00 - 21:00
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-8 border-t border-green-200 pt-6 leading-7 text-gray-600">
                GREEN GARDEN cung cấp các loại cây cảnh, cây văn phòng, chậu
                mini, tiểu cảnh terrarium và cây phong thủy. Sản phẩm phù hợp
                để trang trí bàn học, nhà cửa hoặc làm quà tặng.
              </p>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm md:p-9">
              <h2 className="mb-6 text-2xl font-bold text-green-800">
                Gửi thông tin liên hệ
              </h2>

              <form onSubmit={handleContact} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-2 block font-medium text-gray-700"
                  >
                    Họ và tên
                  </label>
                  <input
                    id="fullname"
                    name="fullname"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Nhập họ và tên của bạn"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="Nhập email của bạn"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block font-medium text-gray-700"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block font-medium text-gray-700"
                  >
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Nhập nội dung cần tư vấn"
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Gửi liên hệ
                </button>
                <p aria-live="polite" className="min-h-6 text-sm text-green-800">
                  {formMessage}
                </p>
              </form>
            </section>
          </div>

          <section className="mt-10 rounded-2xl border border-green-100 bg-white p-7 shadow-sm md:p-9">
            <h2 className="mb-3 text-2xl font-bold text-green-800">
              Vị trí cửa hàng
            </h2>
            <p className="mb-5 text-gray-600">
              GREEN GARDEN - 313 Dương Quang Đông, khóm 3, phường Hòa Thuận,
              tỉnh Vĩnh Long
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=313+Duong+Quang+Dong+Vinh+Long"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Xem trên Google Maps
            </a>
          </section>
        </div>
      </main>

      <footer className="bg-green-950 px-6 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-5 text-2xl font-bold">GREEN GARDEN</h2>
            <p>Cửa hàng cây cảnh mini</p>
            <p className="mt-2">Mang thiên nhiên đến góc nhỏ của bạn.</p>
          </div>

          <div>
            <h2 className="mb-5 font-bold">SV THỰC HIỆN</h2>
            <p>Phan Minh Anh</p>
            <p className="mt-2">Lớp: DA24TTB</p>
            <p className="mt-2">MSSV: 110124003</p>
          </div>

          <div>
            <h2 className="mb-5 font-bold">THÔNG TIN LIÊN HỆ</h2>
            <p>SĐT: 0888898646</p>
            <p className="mt-2 break-all">Email: anhphan6754@gmail.com</p>
            <p className="mt-2">Địa chỉ: Vĩnh Long</p>
          </div>

          <div>
            <h2 className="mb-5 font-bold">MẠNG XÃ HỘI</h2>
            <div className="flex flex-wrap gap-4">
              <a href="https://x.com" className="hover:text-green-300">
                Twitter
              </a>
              <a
                href="https://instagram.com"
                className="hover:text-green-300"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                className="hover:text-green-300"
              >
                Facebook
              </a>
              <a
                href="https://linkedin.com"
                className="hover:text-green-300"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Lienhe;
