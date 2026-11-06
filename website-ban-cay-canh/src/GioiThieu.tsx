import AccountMenu from "./Dangnhap/Dangky";
import { CartMenu } from "./GioHang";

function GioiThieu() {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-[#27352c]">
      <header className="sticky top-0 z-40 border-b border-[#e7e5dc] bg-[#f8f7f2]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="Green Garden - Trang chủ">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#314c39] font-serif text-sm font-bold tracking-tight text-[#f8f7f2]">
              gg
            </span>
            <span>
              <span className="block font-serif text-lg font-semibold tracking-wide text-[#263b2d]">
                GREEN GARDEN
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#7b8177]">
                Cây xanh cho nhà mình
              </span>
            </span>
          </a>

          <nav aria-label="Điều hướng chính" className="flex flex-wrap items-center gap-3 text-sm sm:gap-6">
            <a href="/san-pham" className="text-[#59645b] transition hover:text-[#314c39]">
              Sản phẩm
            </a>
            <a href="/gioi-thieu" aria-current="page" className="font-semibold text-[#314c39]">
              Về chúng tôi
            </a>
            <a href="/lien-he" className="text-[#59645b] transition hover:text-[#314c39]">
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
            src="/images/banner-gioithieu.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#173b26]/65" />
          <div className="relative mx-auto max-w-4xl text-white">
            <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              GREEN GARDEN
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-white/95 sm:text-lg">
              Ươm sắc xanh vào từng góc nhỏ, để mỗi ngày ở nhà đều thêm thư thái và gần gũi với thiên nhiên.
            </p>
          </div>
        </section>

        <section className="border-y border-[#e7e5dc] bg-[#f1f0e9]">
          <div className="mx-auto grid max-w-7xl gap-7 px-5 py-8 sm:px-8 md:grid-cols-3 md:gap-10">
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#8b9b80]">01</span>
              <div>
                <h2 className="font-semibold text-[#314c39]">Dễ bắt đầu</h2>
                <p className="mt-1 text-sm leading-6 text-[#747a70]">Giới thiệu, gợi ý loại cây dù bạn chưa từng chăm cây.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#8b9b80]">02</span>
              <div>
                <h2 className="font-semibold text-[#314c39]">Phù hợp không gian</h2>
                <p className="mt-1 text-sm leading-6 text-[#747a70]">Trang trí không gian sống với những chậu cây nhỏ gọn.Từ cây phong thủy đến cây trang trí văn phòng</p>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="font-serif text-2xl text-[#8b9b80]">03</span>
              <div>
                <h2 className="font-semibold text-[#314c39]">Luôn có người đồng hành</h2>
                <p className="mt-1 text-sm leading-6 text-[#747a70]">Luôn sẵn sàng hỗ trợ khi bạn cần.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-16 md:py-24">
          <div className="relative">
            <img
              src={`/images/${encodeURIComponent("ảnh trang về chúng tôi.webp")}`}
              alt="Không gian tràn ngập cây xanh"
              className="h-[300px] w-full rounded-[1.5rem] object-cover sm:h-[400px]"
            />
            <p className="mt-3 text-xs tracking-wide text-[#85887e]">GREEN GARDEN · VĨNH LONG</p>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#78836f]">
              Chúng tôi tin rằng
            </p>
            <h2 className="max-w-lg font-serif text-4xl leading-tight text-[#263b2d] sm:text-5xl">
              Một chậu cây nhỏ cũng có thể làm ngày dài dịu lại.
            </h2>
            <p className="mt-6 leading-7 text-[#687168]">
              GREEN GARDEN là website chuyên cung cấp các loại cây cảnh trang trí, cây văn phòng, cây phong thủy và cây mini với mẫu mã đa dạng, giá cả hợp lý. 
              Website được thiết kế với giao diện thân thiện, dễ sử dụng, giúp khách hàng thuận tiện tìm kiếm, lựa chọn và mua sắm những chậu cây yêu thích.
               Bên cạnh đó, GREEN GARDEN còn cung cấp thông tin và hướng dẫn chăm sóc cây, giúp khách hàng dễ dàng tạo nên không gian sống xanh, tươi mát và gần gũi với thiên nhiên.
            </p>
            <p className="mt-4 leading-7 text-[#687168]">
              Dù là món quà cho người thân hay một góc xanh cho riêng mình,
              hy vọng bạn sẽ tìm được người bạn nhỏ phù hợp.
            </p>
            <a
              href="/lien-he"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#314c39] hover:text-[#70836a]"
            >
              Ghé thăm cửa hàng <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        <section className="bg-[#314c39] px-5 py-14 text-[#f8f7f2] sm:px-8 md:py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#c5cfbd]">Tìm cây hợp với bạn</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Bắt đầu từ một góc xanh nhỏ.</h2>
            </div>
            <a
              href="/san-pham"
              className="inline-flex items-center gap-3 rounded-full bg-[#f8f7f2] px-6 py-3 text-sm font-semibold text-[#314c39] transition hover:bg-white"
            >
              Xem các sản phẩm <span aria-hidden="true">→</span>
            </a>
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
            <a href="mailto:mphan6754@gmail.com" className="mt-1 block break-all text-sm hover:text-white">anhphan6754@gmail.com</a>
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

export default GioiThieu;
