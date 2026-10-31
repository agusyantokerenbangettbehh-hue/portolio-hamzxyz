const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const themeToggle = document.querySelector(".theme-toggle");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("open");
  menuButton.textContent = nav.classList.contains("open") ? "×" : "☰";
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuButton.textContent = "☰";
  });
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener("click", (event) => event.preventDefault());
});

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "☀";
  themeToggle.setAttribute("aria-label", "Aktifkan tema gelap");
  themeToggle.setAttribute("aria-pressed", "false");
}

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  themeToggle.textContent = isLight ? "☀" : "☾";
  themeToggle.setAttribute("aria-label", isLight ? "Aktifkan tema gelap" : "Aktifkan tema terang");
  themeToggle.setAttribute("aria-pressed", String(!isLight));
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
});
