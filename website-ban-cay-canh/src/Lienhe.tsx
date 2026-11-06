import { useState, type SubmitEvent } from "react";
import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";

function Lienhe() {
  const [formMessage, setFormMessage] = useState("");

  const handleContact = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormMessage(
      "Biểu mẫu hiện chưa kết nối với máy chủ. Vui lòng gọi 0888898646 hoặc gửi email đến anhphan6754@gmail.com."
    );
  };

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

          <nav
            aria-label="Điều hướng chính"
            className="flex flex-wrap items-center gap-3 text-sm sm:gap-6"
          >
            <a href="/san-pham" className="text-[#59645b] transition hover:text-[#314c39]">
              Sản phẩm
            </a>
            <a href="/gioi-thieu" className="text-[#59645b] transition hover:text-[#314c39]">
              Về chúng tôi
            </a>
            <a
              href="/lien-he"
              aria-current="page"
              className="font-semibold text-[#314c39]"
            >
              Liên hệ
            </a>
            <CartMenu />
            <AccountMenu />
          </nav>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-[340px] items-center justify-center overflow-hidden px-5 py-16 text-center sm:min-h-[380px]">
          <img
            src={`/images/${encodeURIComponent("ảnh banner của phần liên hệ.jpg")}`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#173b26]/60" />
          <div className="relative mx-auto max-w-4xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              GREEN GARDEN · VĨNH LONG
            </p>
            <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Kết nối cùng GREEN GARDEN
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/95 sm:text-lg">
              Chúng tôi luôn sẵn lòng lắng nghe và đồng hành cùng bạn trên hành trình mang thêm sắc xanh vào không gian sống.
            </p>
            <a
              href="#gui-lien-he"
              className="mt-7 inline-flex rounded-full bg-[#f8f7f2] px-6 py-3 text-sm font-semibold text-[#314c39] transition hover:bg-white"
            >
              Gửi lời nhắn cho chúng tôi
            </a>
          </div>
        </section>

        <section className="border-y border-[#e7e5dc] bg-[#f1f0e9]">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-8 md:grid-cols-3 md:gap-10">
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#8b9b80]">01</span>
              <div>
                <h2 className="font-semibold text-[#314c39]">Tư vấn chọn cây</h2>
                <p className="mt-1 text-sm leading-6 text-[#747a70]">Gợi ý loại cây và phụ kiện phù hợp với không gian của bạn.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#8b9b80]">02</span>
              <div>
                <h2 className="font-semibold text-[#314c39]">Hỗ trợ đặt hàng</h2>
                <p className="mt-1 text-sm leading-6 text-[#747a70]">Liên hệ với chúng tôi để được giải đáp về sản phẩm và đơn hàng.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#8b9b80]">03</span>
              <div>
                <h2 className="font-semibold text-[#314c39]">Luôn sẵn sàng lắng nghe</h2>
                <p className="mt-1 text-sm leading-6 text-[#747a70]">Ghé cửa hàng, gọi điện hoặc gửi lời nhắn cho GREEN GARDEN.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 md:py-16">
          <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-b border-[#e2e0d7] pb-6">
            <h2 className="font-serif text-3xl text-[#263b2d]">
              Chúng tôi ở đây để giúp bạn
            </h2>
            <p className="mt-2 text-[#747a70]">
              GREEN GARDEN luôn sẵn sàng hỗ trợ bạn trong quá trình lựa chọn
              sản phẩm.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <section className="rounded-2xl bg-[#e9ebe2] p-7 md:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#78836f]">GREEN GARDEN · VĨNH LONG</p>
              <h2 className="mb-7 mt-3 font-serif text-2xl text-[#314c39]">
                Ghé thăm hoặc gọi cho chúng tôi
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <span aria-hidden="true" className="mt-1 text-sm text-[#70836a]">
                    01
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#314c39]">Địa chỉ</h3>
                    <p className="mt-1 leading-7 text-[#687168]">
                      Số 492, Đường Đồng Khởi, Khóm 15, Phường Trà Vinh, Thành phố Vĩnh Long, Vĩnh Long, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span aria-hidden="true" className="mt-1 text-sm text-[#70836a]">
                    02
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#314c39]">Số điện thoại</h3>
                    <a
                      href="tel:0888898646"
                      className="mt-1 inline-block text-[#687168] hover:text-[#314c39]"
                    >
                      0888898646
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span aria-hidden="true" className="mt-1 text-sm text-[#70836a]">
                    03
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#314c39]">Email</h3>
                    <a
                      href="mailto:mphan6754@gmail.com"
                      className="mt-1 inline-block break-all text-[#687168] hover:text-[#314c39]"
                    >
                      mphan6754@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span aria-hidden="true" className="mt-1 text-sm text-[#70836a]">
                    04
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#314c39]">Thời gian làm việc</h3>
                    <p className="mt-1 text-[#687168]">
                      Thứ hai - Chủ nhật: 8:00 - 21:00
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-8 border-t border-[#d1d6c9] pt-6 leading-7 text-[#687168]">
                GREEN GARDEN giới thiệu cây cảnh, cây văn phòng, chậu mini,
                tiểu cảnh terrarium và cây phong thủy. Bạn có thể chọn sản phẩm
                để trang trí bàn học, nhà cửa hoặc làm quà tặng.
              </p>
            </section>

            <section id="gui-lien-he" className="scroll-mt-28 rounded-2xl border border-[#e7e5dc] bg-white p-7 md:p-9">
              <h2 className="mb-6 font-serif text-2xl text-[#314c39]">
                Gửi thông tin liên hệ
              </h2>

              <form onSubmit={handleContact} className="space-y-5">
                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-2 block text-sm font-medium text-[#526254]"
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
                    className="w-full rounded-xl border border-[#deded4] px-4 py-3 text-sm outline-none transition placeholder:text-[#9a9e93] focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#526254]"
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
                    className="w-full rounded-xl border border-[#deded4] px-4 py-3 text-sm outline-none transition placeholder:text-[#9a9e93] focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-[#526254]"
                  >
                    Số điện thoại
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Nhập số điện thoại"
                    className="w-full rounded-xl border border-[#deded4] px-4 py-3 text-sm outline-none transition placeholder:text-[#9a9e93] focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-[#526254]"
                  >
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Nhập nội dung cần tư vấn"
                    className="w-full resize-y rounded-xl border border-[#deded4] px-4 py-3 text-sm outline-none transition placeholder:text-[#9a9e93] focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#314c39] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#243c2c] focus:outline-none focus:ring-2 focus:ring-[#70836a] focus:ring-offset-2"
                >
                  Gửi liên hệ
                </button>
                <p aria-live="polite" className="min-h-6 text-sm text-[#526a51]">
                  {formMessage}
                </p>
              </form>
            </section>
          </div>

          </div>
        </section>
      </main>

      <footer className="bg-[#24382b] px-5 py-10 text-[#e7e9e1] sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="font-serif text-xl">GREEN GARDEN</h2>
            <p className="mt-3 text-sm text-[#b8c2b6]">Cây xanh cho không gian thêm xanh.</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Người thực hiện</h2>
            <p className="mt-3 text-sm">Phan Minh Anh</p>
            <p className="mt-1 text-sm">Lớp: DA24TTB</p>
            <p className="mt-1 text-sm">MSSV: 110124003</p>          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Liên hệ</h2>
            <a href="tel:0888898646" className="mt-3 block text-sm hover:text-white">0888898646</a>
            <a href="mailto:anhphan6754@gmail.com" className="mt-1 block break-all text-sm hover:text-white">mphan6754@gmail.com</a>
            <p className="mt-1 text-sm">Vĩnh Long, Việt Nam</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b8c2b6]">Khám phá</h2>
            <div className="flex flex-wrap gap-4">
              <a href="/san-pham" className="mt-3 text-sm hover:text-white">Sản phẩm</a>
              <a href="/gioi-thieu" className="mt-3 text-sm hover:text-white">Về chúng tôi</a>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl border-t border-white/10 pt-5 text-xs text-[#aeb9ac]">
          © {new Date().getFullYear()} GREEN GARDEN
        </p>
      </footer>
    </div>
  );
}

export default Lienhe;
