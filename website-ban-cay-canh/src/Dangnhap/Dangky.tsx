import { useState, type SubmitEvent } from "react";

type AuthMode = "login" | "register";

function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [activeEmail, setActiveEmail] = useState(
    () => sessionStorage.getItem("green-garden-user-email") ?? ""
  );
  const [activeName, setActiveName] = useState(
    () => sessionStorage.getItem("green-garden-user-name") ?? ""
  );

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (mode === "register") {
      if (formData.get("password") !== formData.get("passwordConfirm")) {
        setMessage("Mật khẩu nhập lại chưa khớp.");
        return;
      }
    }

    const name =
      mode === "register"
        ? String(formData.get("name") ?? "").trim()
        : email.split("@")[0];

    try {
      sessionStorage.setItem("green-garden-user-email", email);
      sessionStorage.setItem("green-garden-user-name", name);
      setActiveEmail(email);
      setActiveName(name);
      setMessage(
        mode === "register"
          ? "Tạo tài khoản mô phỏng thành công."
          : "Đăng nhập mô phỏng thành công."
      );
    } catch (error) {
      console.error("Không thể lưu trạng thái tài khoản trong phiên:", error);
      setMessage("Trình duyệt không cho phép lưu phiên tài khoản này.");
    }
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("green-garden-user-email");
    sessionStorage.removeItem("green-garden-user-name");
    setActiveEmail("");
    setActiveName("");
    setMessage("Bạn đã đăng xuất.");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="account-panel"
        className="rounded-full border border-[#d7dbd0] px-4 py-2 text-sm font-medium text-[#314c39] transition hover:border-[#9ca994] hover:bg-[#edf0e8]"
      >
        {activeEmail ? `Xin chào, ${activeName || activeEmail}` : "Tài khoản"}
      </button>

      {isOpen && (
        <section
          id="account-panel"
          aria-label="Đăng nhập hoặc đăng ký"
          className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-[#e7e5dc] bg-[#fffefa] p-5 text-[#27352c] shadow-[0_16px_50px_rgba(39,53,44,0.14)]"
        >
          {activeEmail ? (
            <div>
              <h2 className="font-serif text-2xl text-[#314c39]">
                Tài khoản của bạn
              </h2>
              <p className="mt-2 break-all text-sm text-[#687168]">{activeEmail}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 w-full rounded-full border border-[#d7dbd0] px-4 py-2.5 text-sm font-semibold text-[#314c39] hover:bg-[#edf0e8]"
              >
                Đăng xuất
              </button>
              <p aria-live="polite" className="mt-3 text-sm text-[#687168]">
                {message || "Tài khoản đang ở chế độ mô phỏng trên trình duyệt này."}
              </p>
            </div>
          ) : (
          <>
          <div className="mb-4 grid grid-cols-2 rounded-full bg-[#f0f1e9] p-1">
            <button
              type="button"
              onClick={() => changeMode("login")}
              aria-pressed={mode === "login"}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                mode === "login"
                  ? "bg-[#314c39] text-white"
                  : "text-[#526254] hover:bg-white"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => changeMode("register")}
              aria-pressed={mode === "register"}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                mode === "register"
                  ? "bg-[#314c39] text-white"
                  : "text-[#526254] hover:bg-white"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <h2 className="mb-4 font-serif text-2xl text-[#314c39]">
            {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-1 block text-sm font-medium"
                >
                  Họ và tên
                </label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full rounded-xl border border-[#deded4] px-3 py-2 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="account-email"
                className="mb-1 block text-sm font-medium"
              >
                Email
              </label>
              <input
                id="account-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[#deded4] px-3 py-2 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
              />
            </div>

            <div>
              <label
                htmlFor="account-password"
                className="mb-1 block text-sm font-medium"
              >
                Mật khẩu
              </label>
              <input
                id="account-password"
                name="password"
                type="password"
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                minLength={mode === "register" ? 9 : undefined}
                required
                className="w-full rounded-xl border border-[#deded4] px-3 py-2 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
              />
              {mode === "register" && (
                <p className="mt-1 text-xs text-gray-500">
                  Tối thiểu 9 ký tự
                </p>
              )}
            </div>

            {mode === "register" && (
              <div>
                <label
                  htmlFor="account-password-confirm"
                  className="mb-1 block text-sm font-medium"
                >
                  Nhập lại mật khẩu
                </label>
                <input
                  id="account-password-confirm"
                  name="passwordConfirm"
                  type="password"
                  autoComplete="new-password"
                  minLength={9}
                  required
                  className="w-full rounded-xl border border-[#deded4] px-3 py-2 outline-none focus:border-[#6f866f] focus:ring-2 focus:ring-[#e5e9df]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#314c39] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#243c2c]"
            >
              {mode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          <p aria-live="polite" className="mt-3 text-sm leading-5 text-[#687168]">
            {message ||
              "Đăng nhập và đăng ký hiện chỉ mang tính mô phỏng. Mật khẩu không được lưu và chức năng chưa kết nối với máy chủ."}
          </p>
          </>
          )}
        </section>
      )}
    </div>
  );
}

export default AccountMenu;
