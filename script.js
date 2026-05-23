const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const contactForm = document.querySelector("[data-contact-form]");

navToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const company = formData.get("company") || "未入力";
  const name = formData.get("name") || "未入力";
  const message = formData.get("message") || "";
  const body = [
    "プライズネス健康経営サポートについて相談したいです。",
    "",
    `会社名: ${company}`,
    `お名前: ${name}`,
    "",
    "ご相談内容:",
    String(message),
  ].join("\n");

  window.location.href = `mailto:?subject=${encodeURIComponent(
    "健康経営サポートの相談"
  )}&body=${encodeURIComponent(body)}`;
});
