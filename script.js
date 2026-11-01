document.addEventListener("DOMContentLoaded", () => {

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  const body = document.body;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // LOADING SCREEN

  const loader = $("#loader");
  const progress = $(".loader-progress");
  const percent = $("#loader-percent");

  let loading = 0;

  const loadingInterval = setInterval(() => {

    loading += Math.floor(Math.random() * 8) + 3;

    if (loading >= 100) {
      loading = 100;
      clearInterval(loadingInterval);
    }

    progress.style.width = loading + "%";
    percent.textContent = loading + "%";

  }, 90);

  window.addEventListener("load", () => {

    clearInterval(loadingInterval);

    progress.style.width = "100%";
    percent.textContent = "100%";

    setTimeout(() => {

      loader.classList.add("hide");

      body.classList.add("js-active");
      $(".hero").classList.add("animate");

      revealElements();

      typeTerminal();

    }, 400);

  });

  // FALLBACK LOADING

  setTimeout(() => {

    if (!loader.classList.contains("hide")) {

      clearInterval(loadingInterval);

      progress.style.width = "100%";
      percent.textContent = "100%";

      loader.classList.add("hide");

      body.classList.add("js-active");
      $(".hero").classList.add("animate");

      revealElements();
      typeTerminal();

    }

  }, 5000);

  // THEME

  const themeButton = $("#theme");

  function setTheme(light) {

    body.classList.toggle("light", light);

    themeButton.textContent = light
      ? "Tema: Terang"
      : "Tema: Gelap";

    themeButton.setAttribute(
      "aria-pressed",
      String(!light)
    );

  }

  try {

    setTheme(localStorage.getItem("pf-theme2") === "light");

  } catch {

    setTheme(false);

  }

  themeButton.addEventListener("click", () => {

    const light = !body.classList.contains("light");

    setTheme(light);

    try {

      localStorage.setItem(
        "pf-theme2",
        light ? "light" : "dark"
      );

    } catch {}

  });

  // MOBILE MENU

  const side = $("#side");
  const scrim = $("#scrim");
  const burger = $("#burger");

  function drawer(open) {

    side.classList.toggle("open", open);
    scrim.classList.toggle("on", open);
    burger.classList.toggle("on", open);

    burger.setAttribute(
      "aria-expanded",
      String(open)
    );

  }

  burger.addEventListener("click", () => {

    drawer(!side.classList.contains("open"));

  });

  scrim.addEventListener("click", () => {

    drawer(false);

  });

  $$(".tree a").forEach(link => {

    link.addEventListener("click", () => {

      drawer(false);

    });

  });

  // SCROLL REVEAL

  let revealObserver;

  function revealElements() {

    const elements = $$(".reveal");

    if (reducedMotion || !("IntersectionObserver" in window)) {

      elements.forEach(element => {
        element.classList.add("in");
      });

      return;

    }

    revealObserver = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          entry.target.classList.add("in");

          revealObserver.unobserve(entry.target);

        }

      });

    }, {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px"
    });

    elements.forEach((element, index) => {

      element.style.transitionDelay =
        Math.min(index % 4 * 0.1, 0.3) + "s";

      revealObserver.observe(element);

    });

  }

  // TERMINAL TYPING

  const terminal = $("#term");

  const commands = [
    ["$ ", "whoami"],
    ["", "hamzyxz, web developer"],
    ["$ ", "ls proyek/"],
    ["", "amfinder   downly"],
    ["$ ", "open --live"]
  ];

  function typeTerminal() {

    if (terminal.dataset.started) return;

    terminal.dataset.started = "true";

    if (reducedMotion) {

      terminal.textContent = commands
        .map(([prefix, text]) => prefix + text)
        .join("\n");

      return;

    }

    let row = 0;
    let char = 0;
    let output = "";

    function type() {

      if (row >= commands.length) {

        terminal.innerHTML =
          output + '<i class="caret"></i>';

        return;

      }

      const [prefix, text] = commands[row];

      if (prefix === "") {

        output += text + "\n";

        row++;
        char = 0;

        terminal.textContent = output;

        setTimeout(type, 300);

        return;

      }

      char++;

      terminal.innerHTML =
        output +
        '<span class="pr">' +
        prefix +
        text.slice(0, char) +
        '</span><i class="caret"></i>';

      if (char >= text.length) {

        output += prefix + text + "\n";

        row++;
        char = 0;

        setTimeout(type, 400);

      } else {

        setTimeout(type, 55);

      }

    }

    type();

  }

  // FILE NAVIGATION

  const tabName = $("#tabName");
  const crumbName = $("#crumbName");
  const language = $("#lang");
  const position = $("#pos");

  const links = $$(".tree a");

  const sections = $$("main section[data-file]");

  const sectionObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const file = entry.target.dataset.file;
      const lang = entry.target.dataset.lang;

      tabName.textContent = file;
      crumbName.textContent = file;
      language.textContent = lang;

      document.title = file + " — Hamzyxz";

      links.forEach(link => {

        link.classList.toggle(
          "on",
          link.dataset.f === file
        );

      });

    });

  }, {
    rootMargin: "-35% 0px -55% 0px"
  });

  sections.forEach(section => {

    sectionObserver.observe(section);

  });

  // SCROLL PROGRESS

  const scrollProgress = $("#scrollProgress");

  function updateScroll() {

    const scrollTop = window.scrollY;

    const scrollHeight =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const percentage = scrollHeight > 0
      ? (scrollTop / scrollHeight) * 100
      : 0;

    scrollProgress.style.width = percentage + "%";

    position.textContent =
      "Ln " + (Math.floor(scrollTop / 26) + 1) +
      ", Col 1";

  }

  window.addEventListener(
    "scroll",
    updateScroll,
    { passive: true }
  );

  // NUMBER GUTTER

  const gutter = $("#gutter");

  function updateGutter() {

    const count = Math.ceil(
      document.documentElement.scrollHeight / 26
    );

    gutter.textContent = Array.from(
      { length: count },
      (_, index) => index + 1
    ).join("\n");

  }

  // PROJECT PREVIEW

  const frames = $$(".frame");

  function updateFrames() {

    frames.forEach(frame => {

      const iframe = $("iframe", frame);

      if (!iframe) return;

      const scale = frame.clientWidth / 1440;

      iframe.style.setProperty("--s", scale);

    });

  }

  // INITIALIZE

  function initialize() {

    updateScroll();
    updateGutter();
    updateFrames();

  }

  initialize();

  window.addEventListener("resize", () => {

    initialize();

  });

  window.addEventListener("load", () => {

    initialize();

  });

});