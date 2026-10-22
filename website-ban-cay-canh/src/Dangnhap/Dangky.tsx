import { useState, type SubmitEvent } from "react";

type AuthMode = "login" | "register";

function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "register") {
      const formData = new FormData(event.currentTarget);
      if (formData.get("password") !== formData.get("passwordConfirm")) {
        setMessage("Mật khẩu nhập lại chưa khớp.");
        return;
      }
    }

    setMessage(
      mode === "register"
        ? "Đây là giao diện đăng ký còn đang phát triển."
        : "Đây là giao diện đăng nhập còn đang phát triển."
    );
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage("");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="account-panel"
        className="rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800"
      >
        Tài khoản
      </button>

      {isOpen && (
        <section
          id="account-panel"
          aria-label="Đăng nhập hoặc đăng ký"
          className="absolute right-0 top-full z-50 mt-3 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-green-100 bg-white p-5 text-gray-800 shadow-xl"
        >
          <div className="mb-4 grid grid-cols-2 rounded-lg bg-green-50 p-1">
            <button
              type="button"
              onClick={() => changeMode("login")}
              aria-pressed={mode === "login"}
              className={`rounded-md px-3 py-2 text-sm font-semibold ${
                mode === "login"
                  ? "bg-green-700 text-white"
                  : "text-green-800 hover:bg-green-100"
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
                  ? "bg-green-700 text-white"
                  : "text-green-800 hover:bg-green-100"
              }`}
            >
              Đăng ký
            </button>
          </div>

          <h2 className="mb-4 text-xl font-bold text-green-800">
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                minLength={mode === "register" ? 8 : undefined}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
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
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-green-700 px-4 py-2.5 font-semibold text-white hover:bg-green-800"
            >
              {mode === "login" ? "Đăng nhập" : "Đăng ký"}
            </button>
          </form>

          <p aria-live="polite" className="mt-3 text-sm leading-5 text-gray-600">
            {message ||
              "Website còn đang phát triển nên chưa lưu tài khoản hoặc mật khẩu."}
          </p>
        </section>
      )}
    </div>
  );
}

export default AccountMenu;
