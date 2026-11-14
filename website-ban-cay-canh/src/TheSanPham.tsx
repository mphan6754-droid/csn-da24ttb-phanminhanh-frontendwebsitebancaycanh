import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { getProductImage, type Product } from "./SanPham";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export default function TheSanPham({
  product,
  isFavorite = false,
  salesCount,
  isBestSeller = false,
}: {
  product: Product;
  isFavorite?: boolean;
  salesCount?: number;
  isBestSeller?: boolean;
}) {
  const { addToCart, items } = useCart();
  const [added, setAdded] = useState(false);
  const image = getProductImage(product.id);
  const cartQuantity = items.find((item) => item.id === product.id)?.quantity ?? 0;
  const isOutOfStock = cartQuantity >= product.stock;
  const addProductToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      stock: product.stock,
    });
    setAdded(true);
  };

  useEffect(() => {
    if (!added) return;
    const timeoutId = window.setTimeout(() => setAdded(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [added]);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e7e5dc] bg-white">
      <div className="relative overflow-hidden bg-[#e7e9df]">
        <a
          href={`/san-pham/${product.id}`}
          className="group relative block overflow-hidden"
          aria-label={`Xem chi tiết ${product.name}`}
        >
          <img
            src={image}
            alt={product.name}
            //transition duration-500: giúp chuyển động ảnh mượt
            //group-hover:scale-[1.03]: giúp phóng ảnh khi rê chuột
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-[#f8f7f2]/90 px-3 py-1 text-[11px] font-medium tracking-wide text-[#526254]">
            {product.group}
          </span>
          {isBestSeller && (
            <span className="absolute left-4 top-12 rounded-full bg-[#314c39]/90 px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
              Bán chạy
            </span>
          )}
        </a>
        <button
          type="button"
          onClick={addProductToCart}
          disabled={isOutOfStock}
          aria-label={`Thêm nhanh ${product.name} vào giỏ hàng`}
          title={isOutOfStock ? "Đã hết số lượng có thể thêm" : "Thêm nhanh vào giỏ hàng"}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#c24e42] shadow-sm transition hover:bg-[#fff1ef] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Heart
            size={20}
            fill={isFavorite || added ? "currentColor" : "none"}
            aria-hidden="true"
          />
        </button>
      </div>

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
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-semibold text-[#314c39]">
            {formatPrice(product.price)}
          </p>
          {salesCount !== undefined && salesCount > 0 && (
            <p className="text-xs text-[#85887e]">{salesCount} lượt bán</p>
          )}
        </div>
        <p className="mt-2 text-sm text-[#747a70]">Tồn kho: {product.stock} sản phẩm</p>
        <div className="mt-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={addProductToCart}
            disabled={isOutOfStock}
            className="w-full rounded-full bg-[#314c39] px-2 py-3 text-xs font-semibold text-white transition hover:bg-[#243c2c] focus:outline-none focus:ring-2 focus:ring-[#70836a] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            {isOutOfStock ? "Đã hết hàng" : added ? "Đã thêm vào giỏ" : "Thêm giỏ hàng"}
          </button>
          {isOutOfStock ? (
            <button
              type="button"
              disabled
              className="w-full rounded-full border border-[#d7dbd0] px-2 py-3 text-xs font-semibold text-[#747a70] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            >
              Đã hết hàng
            </button>
          ) : (
            <a
              href="/thanh-toan"
              onClick={addProductToCart}
              className="flex w-full items-center justify-center rounded-full bg-[#9a602f] px-2 py-3 text-center text-xs font-semibold text-white transition hover:bg-[#804d27] focus:outline-none focus:ring-2 focus:ring-[#70836a] focus:ring-offset-2 sm:text-sm"
            >
              Thanh toán ngay
            </a>
          )}
        </div>
        <p aria-live="polite" className="sr-only">
          {added ? `${product.name} đã được thêm vào giỏ hàng.` : ""}
        </p>
      </div>
    </article>
  );
}
