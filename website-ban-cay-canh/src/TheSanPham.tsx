import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { getProductImage, type Product } from "./SanPham";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function TheSanPham({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const image = getProductImage(product.id);

  useEffect(() => {
    if (!added) return;
    const timeoutId = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [added]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e5dc] bg-white">
      <a
        href={`/san-pham/${product.id}`}
        className="group relative block overflow-hidden bg-[#e7e9df]"
        aria-label={`Xem chi tiết ${product.name}`}
      >
        <img
          src={image}
          alt={product.name}
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-[#f8f7f2]/90 px-3 py-1 text-[11px] font-medium tracking-wide text-[#526254]">
          {product.group}
        </span>
      </a>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-serif text-xl text-[#263b2d]">
          <a href={`/san-pham/${product.id}`} className="hover:underline">
            {product.name}
          </a>
        </h2>
        <p className="mt-2 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-[#747a70]">
          {product.description}
        </p>
        {product.origin && (
          <p className="mt-2 text-xs text-[#85887e]">Xuất xứ: Việt Nam {product.origin}</p>
        )}
        <p className="mt-4 font-semibold text-[#314c39]">
          {formatPrice(product.price)}
        </p>
        <button
          type="button"
          onClick={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image,
            });
            setAdded(true);
          }}
          className="mt-auto w-full rounded-full bg-[#314c39] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#243c2c] focus:outline-none focus:ring-2 focus:ring-[#70836a] focus:ring-offset-2"
        >
          {added ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
        </button>
        <p aria-live="polite" className="sr-only">
          {added ? `${product.name} đã được thêm vào giỏ hàng.` : ""}
        </p>
      </div>
    </article>
  );
}
