import { useEffect, useMemo, useState, type SubmitEvent } from "react";
import { useAuth } from "./AuthContext";
import {
  saveCategories,
  saveProducts,
  saveUsers,
  useStoreCategories,
  useStoreProducts,
  useStoreUsers,
  type StoreUser,
} from "./GreenGardenStore";
import {
  loadOrders,
  updateOrderStatus,
  type Order,
  type OrderStatus,
} from "./DlieuDonhangStorage";
import { getProductImage, type Product } from "./SanPham";

type AdminSection = "dashboard" | "products" | "categories" | "orders" | "users";

const sectionNames: Record<AdminSection, string> = {
  dashboard: "Tổng quan",
  products: "Sản phẩm",
  categories: "Danh mục",
  orders: "Đơn hàng",
  users: "Người dùng",
};
const statuses: OrderStatus[] = ["pending", "confirmed", "shipping", "completed", "cancelled"];
const statusNames: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  completed: "Đã giao hàng",
  cancelled: "Đã hủy",
};
const formatPrice = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

export default function Admin() {
  const { user, signOut } = useAuth();
  const products = useStoreProducts();
  const categories = useStoreCategories();
  const users = useStoreUsers();
  const [section, setSection] = useState<AdminSection>("dashboard");
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderError, setOrderError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!user) {
      window.location.replace(`/dang-nhap?returnTo=${encodeURIComponent("/admin")}`);
    } else if (user.role !== "admin") {
      window.location.replace("/");
    }
  }, [user]);

  useEffect(() => {
    const refresh = () => {
      try {
        setOrders(loadOrders());
        setOrderError("");
      } catch (error) {
        console.error("Không thể tải đơn hàng từ LocalStorage:", error);
        setOrderError(error instanceof Error ? error.message : "Không thể tải đơn hàng.");
      }
    };
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("green-garden-store-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("green-garden-store-change", refresh);
    };
  }, []);

  const activeOrders = orders.filter((order) => order.status !== "cancelled");
  const revenue = activeOrders.reduce((total, order) => total + order.total, 0);

  if (!user || user.role !== "admin") {
    return <main className="p-8 text-center text-[#526254]">Đang kiểm tra quyền quản trị...</main>;
  }

  const updateStatus = (code: string, status: OrderStatus) => {
    try {
      updateOrderStatus(code, status);
      setOrders(loadOrders());
      setNotice(`Đã cập nhật trạng thái đơn ${code}.`);
    } catch (error) {
      console.error("Không thể cập nhật trạng thái đơn hàng:", error);
      setOrderError(error instanceof Error ? error.message : "Không thể cập nhật đơn hàng.");
    }
  };

  const toggleBlocked = (account: StoreUser) => {
    if (account.id === user.id) {
      setNotice("Bạn không thể tự khóa tài khoản Admin đang sử dụng.");
      return;
    }
    try {
      saveUsers(users.map((item) => item.id === account.id ? { ...item, blocked: !item.blocked } : item));
      setNotice(account.blocked ? `Đã mở khóa ${account.email}.` : `Đã khóa ${account.email}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Không thể cập nhật tài khoản.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-[#263b2d]">
      <header className="sticky top-0 z-30 border-b border-[#e1e8dd] bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <img src="/images/logo%20website.jpg" alt="" className="h-10 w-10 rounded-full object-contain" />
            <div>
              <p className="font-serif text-lg font-bold tracking-wide">GREEN GARDEN</p>
              <p className="text-xs text-[#72806f]">Khu vực quản trị</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[#687168] sm:block">{user.name}</span>
            <button type="button" onClick={() => { signOut(); window.location.assign("/"); }} className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-semibold text-[#314c39] hover:bg-[#edf0e8]">Đăng xuất</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1500px] gap-6 p-4 sm:p-6 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#e1e8dd] bg-white p-3 lg:sticky lg:top-24">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#82907e]">Quản lý cửa hàng</p>
          <nav aria-label="Điều hướng quản trị" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {(Object.keys(sectionNames) as AdminSection[]).map((item) => (
              <button key={item} type="button" onClick={() => setSection(item)} aria-current={section === item ? "page" : undefined} className={`rounded-xl px-3 py-3 text-left text-sm font-medium transition ${section === item ? "bg-[#eaf2e6] text-[#315b38]" : "text-[#647064] hover:bg-[#f5f7f2]"}`}>
                {sectionNames[item]}
              </button>
            ))}
          </nav>
          <a href="/" className="mt-4 block rounded-xl px-3 py-3 text-sm text-[#647064] hover:bg-[#f5f7f2]">← Về cửa hàng</a>
        </aside>
        <main className="min-w-0">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#81917d]">Green Garden · Admin</p>
              <h1 className="mt-1 font-serif text-3xl font-semibold">{sectionNames[section]}</h1>
            </div>
            {notice && <p role="status" className="rounded-xl bg-[#eaf2e6] px-4 py-2 text-sm text-[#315b38]">{notice}</p>}
          </div>
          {section === "dashboard" && <Dashboard products={products} users={users} orders={orders} revenue={revenue} />}
          {section === "products" && <ProductsPanel products={products} categories={categories} onNotice={setNotice} />}
          {section === "categories" && <CategoriesPanel products={products} categories={categories} onNotice={setNotice} />}
          {section === "orders" && <OrdersPanel orders={orders} error={orderError} onStatusChange={updateStatus} />}
          {section === "users" && <UsersPanel users={users} currentUserId={user.id} onToggleBlocked={toggleBlocked} />}
        </main>
      </div>
    </div>
  );
}

function Dashboard({ products, users, orders, revenue }: { products: Product[]; users: StoreUser[]; orders: Order[]; revenue: number }) {
  const recentOrders = orders.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const dailyRevenue = Array.from({ length: 7 }, (_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const dateKey = day.toLocaleDateString("vi-VN");
    const amount = orders
      .filter((order) => order.status !== "cancelled" && new Date(order.createdAt).toLocaleDateString("vi-VN") === dateKey)
      .reduce((sum, order) => sum + order.total, 0);
    return { label: day.toLocaleDateString("vi-VN", { weekday: "short" }), amount };
  });
  const peak = Math.max(...dailyRevenue.map((day) => day.amount), 1);
  const metrics = [
    ["Tổng sản phẩm", products.length.toLocaleString("vi-VN")],
    ["Tổng đơn hàng", orders.length.toLocaleString("vi-VN")],
    ["Người dùng", users.filter((account) => account.role === "user").length.toLocaleString("vi-VN")],
    ["Doanh thu", formatPrice(revenue)],
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => <section key={label} className="rounded-2xl border border-[#e1e8dd] bg-white p-5"><p className="text-sm text-[#778176]">{label}</p><p className="mt-3 break-words text-2xl font-semibold text-[#315b38]">{value}</p></section>)}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#e1e8dd] bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold">Doanh thu 7 ngày gần nhất</h2>
          <div className="mt-6 grid h-52 grid-cols-7 items-end gap-3 border-b border-l border-[#e7e5dc] px-3">
            {dailyRevenue.map((day, index) => (
              <div key={`${day.label}-${index}`} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="max-w-full truncate text-[10px] text-[#778176]">{day.amount ? formatPrice(day.amount) : "—"}</span>
                <div title={`${day.label}: ${formatPrice(day.amount)}`} className="w-full rounded-t-md bg-[#6b946d]" style={{ height: `${Math.max(4, (day.amount / peak) * 65)}%` }} />
                <span className="pb-2 text-xs text-[#778176]">{day.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[#849080]">Chỉ tính đơn chưa bị hủy. Doanh thu được tính từ các đơn lưu trên trình duyệt này.</p>
        </section>
        <section className="rounded-2xl border border-[#e1e8dd] bg-white p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold">Đơn hàng gần đây</h2>
          {recentOrders.length === 0 ? <p className="mt-5 text-sm text-[#778176]">Chưa có đơn hàng.</p> : (
            <ul className="mt-4 divide-y divide-[#edf0e9]">
              {recentOrders.map((order) => <li key={order.code} className="flex flex-wrap justify-between gap-2 py-3 text-sm"><div><p className="font-semibold">{order.code}</p><p className="mt-1 text-xs text-[#778176]">{order.recipient.name}</p></div><div className="text-right"><p className="font-medium">{formatPrice(order.total)}</p><p className="mt-1 text-xs text-[#6a8167]">{statusNames[order.status]}</p></div></li>)}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function ProductsPanel({ products, categories, onNotice }: { products: Product[]; categories: string[]; onNotice: (message: string) => void }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<Product | null>(null);
  const filtered = useMemo(() => products.filter((product) =>
    (category === "all" || product.group === category) &&
    `${product.name} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())
  ), [category, products, query]);

  const saveProduct = (data: Omit<Product, "id">) => {
    try {
      const editedProduct = editing && editing.id !== 0 ? editing : null;
      const next = editedProduct
        ? products.map((product) => product.id === editedProduct.id ? { ...data, id: editedProduct.id } : product)
        : [...products, { ...data, id: Math.max(0, ...products.map((product) => product.id)) + 1 }];
      saveProducts(next);
      setEditing(null);
      onNotice(editedProduct ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.");
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Không thể lưu sản phẩm.");
    }
  };

  const deleteProduct = (product: Product) => {
    if (!window.confirm(`Xóa sản phẩm “${product.name}”?`)) return;
    try {
      saveProducts(products.filter((item) => item.id !== product.id));
      onNotice(`Đã xóa sản phẩm ${product.name}.`);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Không thể xóa sản phẩm.");
    }
  };

  return (
    <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap gap-3">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên hoặc loại sản phẩm" className="min-w-48 flex-1 rounded-xl border border-[#dfe5da] px-3 py-2.5 text-sm" />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-[#dfe5da] bg-white px-3 py-2.5 text-sm">
            <option value="all">Tất cả danh mục</option>{categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => setEditing({ id: 0, name: "", price: 0, stock: 0, category: "", group: categories[0] ?? "", description: "", light: "", watering: "", care: "", size: "" })} className="rounded-full bg-[#416b47] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#315b38]">+ Thêm sản phẩm</button>
      </div>
      {editing && <ProductForm key={editing.id} product={editing.id === 0 ? null : editing} categories={categories} onSave={saveProduct} onCancel={() => setEditing(null)} />}
      <div className="mt-5 overflow-x-auto rounded-xl border border-[#e7e5dc]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#f5f7f2] text-xs uppercase tracking-wide text-[#71806f]"><tr><th className="px-4 py-3">Sản phẩm</th><th className="px-4 py-3">Danh mục</th><th className="px-4 py-3">Giá</th><th className="px-4 py-3">Tồn kho</th><th className="px-4 py-3">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-[#edf0e9]">
            {filtered.map((product) => <tr key={product.id}>
              <td className="px-4 py-3"><div className="flex items-center gap-3"><img src={product.image || getProductImage(product.id)} alt="" className="h-12 w-12 rounded-lg object-cover" /><div><p className="font-semibold">{product.name}</p><p className="mt-1 text-xs text-[#849080]">{product.category}</p></div></div></td>
              <td className="px-4 py-3">{product.group}</td><td className="px-4 py-3 whitespace-nowrap">{formatPrice(product.price)}</td><td className="px-4 py-3">{product.stock}</td>
              <td className="px-4 py-3"><div className="flex gap-2"><button type="button" onClick={() => setEditing(product)} className="rounded-lg border border-[#d7dbd0] px-3 py-1.5 text-xs font-semibold text-[#315b38]">Sửa</button><button type="button" onClick={() => deleteProduct(product)} className="rounded-lg border border-[#ead4d0] px-3 py-1.5 text-xs font-semibold text-[#9a564b]">Xóa</button></div></td>
            </tr>)}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-center text-sm text-[#778176]">Không tìm thấy sản phẩm.</p>}
      </div>
    </section>
  );
}

function ProductForm({ product, categories, onSave, onCancel }: { product: Product | null; categories: string[]; onSave: (product: Omit<Product, "id">) => void; onCancel: () => void }) {
  const [error, setError] = useState("");
  const submit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const productData: Omit<Product, "id"> = {
      name: String(data.get("name") ?? "").trim(),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
      category: String(data.get("type") ?? "").trim(),
      group: String(data.get("group") ?? "").trim(),
      description: String(data.get("description") ?? "").trim(),
      light: String(data.get("light") ?? "").trim(),
      watering: String(data.get("watering") ?? "").trim(),
      care: String(data.get("care") ?? "").trim(),
      size: String(data.get("size") ?? "").trim(),
      image: String(data.get("image") ?? "").trim() || undefined,
    };
    if (!productData.name || !productData.category || !productData.group || !productData.description) {
      setError("Vui lòng nhập tên, danh mục, loại và mô tả sản phẩm.");
      return;
    }
    if (!Number.isFinite(productData.price) || productData.price < 0 || !Number.isInteger(productData.stock) || productData.stock < 0) {
      setError("Giá phải là số không âm và tồn kho phải là số nguyên không âm.");
      return;
    }
    onSave(productData);
  };
  return (
    <form onSubmit={submit} className="mt-5 rounded-xl border border-[#dce6d8] bg-[#f9fbf7] p-4 sm:p-5">
      <h2 className="font-serif text-xl font-semibold">{product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-sm">Tên sản phẩm<input name="name" defaultValue={product?.name} required className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Giá (VND)<input name="price" type="number" min="0" step="1" defaultValue={product?.price ?? ""} required className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Tồn kho<input name="stock" type="number" min="0" step="1" defaultValue={product?.stock ?? 0} required className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Danh mục cửa hàng<select name="group" defaultValue={product?.group ?? categories[0] ?? ""} required className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="text-sm">Loại sản phẩm<input name="type" defaultValue={product?.category} placeholder="Ví dụ: Sen đá" required className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Đường dẫn hình ảnh<input name="image" type="text" defaultValue={product?.image} placeholder="https://... hoặc /images/..." className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm sm:col-span-2 lg:col-span-3">Mô tả<textarea name="description" defaultValue={product?.description} rows={2} required className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Ánh sáng / công dụng<input name="light" defaultValue={product?.light} className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Tưới / hướng dẫn<input name="watering" defaultValue={product?.watering} className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm">Kích thước<input name="size" defaultValue={product?.size} className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
        <label className="text-sm sm:col-span-2 lg:col-span-3">Chăm sóc / bảo quản<input name="care" defaultValue={product?.care} className="mt-1 w-full rounded-lg border border-[#dfe5da] bg-white px-3 py-2" /></label>
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
      <div className="mt-4 flex gap-2"><button className="rounded-full bg-[#416b47] px-5 py-2.5 text-sm font-semibold text-white">Lưu sản phẩm</button><button type="button" onClick={onCancel} className="rounded-full border border-[#d7dbd0] px-5 py-2.5 text-sm">Hủy</button></div>
    </form>
  );
}

function CategoriesPanel({ products, categories, onNotice }: { products: Product[]; categories: string[]; onNotice: (message: string) => void }) {
  const [newCategory, setNewCategory] = useState("");
  const addCategory = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    if (categories.some((item) => item.toLowerCase() === name.toLowerCase())) {
      onNotice("Danh mục này đã tồn tại.");
      return;
    }
    try {
      saveCategories([...categories, name]);
      setNewCategory("");
      onNotice(`Đã thêm danh mục ${name}.`);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Không thể thêm danh mục.");
    }
  };
  const renameCategory = (currentName: string) => {
    const nextName = window.prompt("Tên danh mục mới:", currentName)?.trim();
    if (!nextName || nextName === currentName) return;
    if (categories.some((item) => item.toLowerCase() === nextName.toLowerCase())) {
      onNotice("Danh mục này đã tồn tại.");
      return;
    }
    try {
      saveProducts(products.map((product) => product.group === currentName ? { ...product, group: nextName } : product));
      saveCategories(categories.map((item) => item === currentName ? nextName : item));
      onNotice(`Đã đổi tên danh mục thành ${nextName}.`);
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Không thể đổi tên danh mục.");
    }
  };
  const deleteCategory = (name: string) => {
    if (!window.confirm(`Xóa danh mục “${name}”?`)) return;
    const remaining = categories.filter((item) => item !== name);
    const replacement = remaining[0];
    if (products.some((product) => product.group === name) && !replacement) {
      onNotice("Hãy tạo danh mục khác trước khi xóa danh mục cuối cùng đang có sản phẩm.");
      return;
    }
    try {
      if (replacement) saveProducts(products.map((product) => product.group === name ? { ...product, group: replacement } : product));
      saveCategories(remaining);
      onNotice(replacement ? `Đã xóa danh mục và chuyển sản phẩm sang “${replacement}”.` : "Đã xóa danh mục.");
    } catch (error) {
      onNotice(error instanceof Error ? error.message : "Không thể xóa danh mục.");
    }
  };
  return (
    <section className="rounded-2xl border border-[#e1e8dd] bg-white p-5 sm:p-6">
      <form onSubmit={addCategory} className="flex flex-wrap gap-3">
        <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Tên danh mục mới" required className="min-w-48 flex-1 rounded-xl border border-[#dfe5da] px-3 py-2.5 text-sm" />
        <button className="rounded-full bg-[#416b47] px-5 py-2.5 text-sm font-semibold text-white">Thêm danh mục</button>
      </form>
      <ul className="mt-5 divide-y divide-[#edf0e9]">
        {categories.map((category) => <li key={category} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-semibold">{category}</p><p className="mt-1 text-xs text-[#778176]">{products.filter((product) => product.group === category).length} sản phẩm</p></div><div className="flex gap-2"><button type="button" onClick={() => renameCategory(category)} className="rounded-lg border border-[#d7dbd0] px-3 py-2 text-xs font-semibold text-[#315b38]">Sửa</button><button type="button" onClick={() => deleteCategory(category)} className="rounded-lg border border-[#ead4d0] px-3 py-2 text-xs font-semibold text-[#9a564b]">Xóa</button></div></li>)}
      </ul>
      {categories.length === 0 && <p className="py-6 text-sm text-[#778176]">Chưa có danh mục.</p>}
    </section>
  );
}

function OrdersPanel({ orders, error, onStatusChange }: { orders: Order[]; error: string; onStatusChange: (code: string, status: OrderStatus) => void }) {
  const [query, setQuery] = useState("");
  const filtered = orders.filter((order) => `${order.code} ${order.recipient.name} ${order.recipient.phone}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 sm:p-6">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm mã đơn, người nhận, số điện thoại" className="w-full rounded-xl border border-[#dfe5da] px-3 py-2.5 text-sm sm:max-w-md" />
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {filtered.length === 0 ? <p className="mt-5 text-sm text-[#778176]">Chưa có đơn hàng phù hợp.</p> : (
        <div className="mt-5 space-y-4">
          {filtered.map((order) => <details key={order.code} className="rounded-xl border border-[#e7e5dc] p-4">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span><strong>Đơn {order.code}</strong><span className="ml-3 text-sm text-[#778176]">{order.recipient.name} · {formatPrice(order.total)}</span></span>
              <select aria-label={`Trạng thái đơn ${order.code}`} value={order.status} onClick={(event) => event.stopPropagation()} onChange={(event) => onStatusChange(order.code, event.target.value as OrderStatus)} className="rounded-lg border border-[#dfe5da] bg-white px-3 py-2 text-sm">
                {statuses.map((status) => <option key={status} value={status}>{statusNames[status]}</option>)}
              </select>
            </summary>
            <div className="mt-4 grid gap-4 border-t border-[#edf0e9] pt-4 text-sm sm:grid-cols-2">
              <div><p className="font-semibold">Thông tin người nhận</p><p className="mt-2">{order.recipient.name}</p><p>{order.recipient.phone}</p><p className="break-all">{order.recipient.email}</p><p>{order.recipient.address}</p><p className="mt-2 text-xs text-[#778176]">{new Date(order.createdAt).toLocaleString("vi-VN")}</p></div>
              <div><p className="font-semibold">Sản phẩm</p><ul className="mt-2 space-y-1">{order.items.map((item) => <li key={item.id} className="flex justify-between gap-3"><span>{item.name} × {item.quantity}</span><span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span></li>)}</ul><p className="mt-3 border-t border-[#edf0e9] pt-2 font-semibold">Tổng: {formatPrice(order.total)}</p></div>
            </div>
          </details>)}
        </div>
      )}
    </section>
  );
}

function UsersPanel({ users, currentUserId, onToggleBlocked }: { users: StoreUser[]; currentUserId: string; onToggleBlocked: (account: StoreUser) => void }) {
  const [query, setQuery] = useState("");
  const filtered = users.filter((account) => `${account.name} ${account.email} ${account.phone}`.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <section className="rounded-2xl border border-[#e1e8dd] bg-white p-4 sm:p-6">
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên, email hoặc số điện thoại" className="w-full rounded-xl border border-[#dfe5da] px-3 py-2.5 text-sm sm:max-w-md" />
      <div className="mt-5 overflow-x-auto rounded-xl border border-[#e7e5dc]">
        <table className="w-full min-w-[740px] text-left text-sm">
          <thead className="bg-[#f5f7f2] text-xs uppercase tracking-wide text-[#71806f]"><tr><th className="px-4 py-3">Tài khoản</th><th className="px-4 py-3">Điện thoại</th><th className="px-4 py-3">Vai trò</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Thao tác</th></tr></thead>
          <tbody className="divide-y divide-[#edf0e9]">{filtered.map((account) => <tr key={account.id}>
            <td className="px-4 py-3"><p className="font-semibold">{account.name}</p><p className="mt-1 text-xs text-[#778176]">{account.email}</p></td>
            <td className="px-4 py-3">{account.phone}</td>
            <td className="px-4 py-3">{account.role === "admin" ? "Quản trị viên" : "Người dùng"}</td>
            <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs ${account.blocked ? "bg-red-50 text-red-700" : "bg-[#eaf2e6] text-[#315b38]"}`}>{account.blocked ? "Đã khóa" : "Đang hoạt động"}</span></td>
            <td className="px-4 py-3"><button type="button" disabled={account.id === currentUserId || account.role === "admin"} onClick={() => onToggleBlocked(account)} className="rounded-lg border border-[#d7dbd0] px-3 py-2 text-xs font-semibold text-[#315b38] disabled:cursor-not-allowed disabled:opacity-40">{account.blocked ? "Mở khóa" : "Khóa tài khoản"}</button></td>
          </tr>)}</tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className="p-5 text-sm text-[#778176]">Không tìm thấy tài khoản.</p>}
      <p className="mt-4 text-xs leading-5 text-[#849080]">Vai trò được tạo khi đăng ký và không thể tự thay đổi từ tài khoản người dùng. Khóa tài khoản sẽ kết thúc phiên đăng nhập đang hoạt động trên trình duyệt.</p>
    </section>
  );
}