(() => {
  const root = document.documentElement;
  if (!document.querySelector("#theme-toggle-btn") && document.body) {
    const button = document.createElement("button");
    button.id = "theme-toggle-btn";
    button.className = "theme-toggle theme-toggle--floating";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", "التبديل إلى الوضع الداكن");
    button.textContent = "☾";
    document.body.appendChild(button);
  }

  const themeButtons = [...document.querySelectorAll("#theme-toggle-btn")];
  let themeTransitionTimer;

  function applyTheme(theme) {
    const isDark = theme === "dark";
    root.classList.add("theme-switching");
    window.clearTimeout(themeTransitionTimer);
    root.dataset.theme = isDark ? "dark" : "light";
    document.body.classList.toggle("dark-theme", isDark);
    document.body.classList.toggle("light-theme", !isDark);
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      meta.setAttribute("content", isDark ? "#0b1220" : "#ffffff");
    });
    themeButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "aria-label",
        isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن",
      );
      button.title = isDark ? "الوضع الفاتح" : "الوضع الداكن";
      const icon = button.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = isDark ? "☀" : "☾";
      } else {
        button.textContent = isDark ? "☀" : "☾";
      }
    });
    themeTransitionTimer = window.setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 200);
  }

  applyTheme(localStorage.getItem("theme") === "dark" ? "dark" : "light");

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
    });
  });

  window.addEventListener("storage", (event) => {
    if (event.key === "theme") {
      applyTheme(event.newValue === "dark" ? "dark" : "light");
    }
  });

  const isSubdir =
    location.pathname.includes("/uni/") ||
    location.pathname.includes("/cv/") ||
    location.pathname.includes("/html/") ||
    location.pathname.includes("/pages/") ||
    location.pathname.includes("/transfer/");
  const isStandaloneContentPage = location.pathname.includes("/html/");

  // One shared responsive menu: desktop links remain visible; mobile uses a dropdown.
  function setupMobileProjectMenu() {
    const topbar = document.querySelector(".topbar");
    const nav = document.querySelector(".project-nav");
    if (!topbar || !nav) return;

    if (!nav.id) nav.id = "project-navigation-menu";
    let menuButton = topbar.querySelector(".mobile-menu-toggle");
    if (!menuButton) {
      // Fallback for pages that do not yet contain the shared button markup.
      menuButton = document.createElement("button");
      menuButton.type = "button";
      menuButton.className = "mobile-menu-toggle";
      menuButton.innerHTML =
        '<span class="mobile-menu-toggle__bars" aria-hidden="true">' +
        '<span class="mobile-menu-toggle__line"></span>' +
        '<span class="mobile-menu-toggle__line"></span>' +
        '<span class="mobile-menu-toggle__line"></span>' +
        '</span>';
      menuButton.setAttribute("aria-controls", nav.id);
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "فتح القائمة");
      topbar.appendChild(menuButton);
    }
    menuButton.setAttribute("aria-controls", nav.id);

    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "فتح القائمة");
      menuButton.classList.remove("is-open");
    };

    menuButton.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
      menuButton.classList.toggle("is-open", isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (!topbar.contains(event.target) && !nav.contains(event.target)) closeMenu();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });

    // The stylesheet only collapses navigation after the control is wired.
    // If JavaScript fails, mobile users still see every navigation link.
    root.classList.add("mobile-menu-ready");
  }

  setupMobileProjectMenu();

  const swUrl = isSubdir ? "../service-worker.js?v=24" : "./service-worker.js?v=24";
  const swScope = isSubdir ? "../" : "./";

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker
      .register(swUrl, {
        scope: swScope,
        updateViaCache: "none",
      })
      .catch((error) => {
        console.error("تعذر إعداد التخزين المشترك دون اتصال.", error);
      });
  }

  // ── PWA Install Banner & Custom Buttons ─────────────────────────────────
  let deferredPrompt = null;

  function handleInstallClick() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(({ outcome }) => {
        deferredPrompt = null;
        const banner = document.getElementById("pwa-install-banner");
        if (banner) banner.classList.remove("visible");
        if (outcome === "accepted") {
          localStorage.setItem("pwa-installed", "1");
        }
      });
    } else {
      alert("التطبيق يدعم العمل كتطبيق هاتف وكمبيوتر! يمكنك إضافته من قائمة المتصفح عبر خيار 'تثبيت التطبيق' أو 'إضافة إلى الشاشة الرئيسية'.");
    }
  }

  function setupCustomInstallButtons() {
    document.querySelectorAll("[data-pwa-install], #hero-install-btn").forEach((btn) => {
      if (btn.dataset.pwaBound) return;
      btn.dataset.pwaBound = "true";
      btn.addEventListener("click", handleInstallClick);
    });
  }

  function injectBanner() {
    if (document.getElementById("pwa-install-banner")) return;
    const banner = document.createElement("div");
    banner.id = "pwa-install-banner";
    banner.setAttribute("role", "complementary");
    banner.setAttribute("aria-label", "تثبيت التطبيق");
    banner.innerHTML = `
      <img src="${_pwaLogoSrc()}" alt="أيقونة المنصة">
      <div class="pwa-text">
        <strong>ثبّت التطبيق على جهازك</strong>
        <span>يعمل بدون إنترنت • متوافق مع الكمبيوتر والهاتف</span>
      </div>
      <button id="pwa-install-btn" type="button">تثبيت</button>
      <button id="pwa-dismiss-btn" type="button" aria-label="إغلاق">✕</button>
    `;
    document.body.appendChild(banner);

    document.getElementById("pwa-install-btn").addEventListener("click", handleInstallClick);

    document.getElementById("pwa-dismiss-btn").addEventListener("click", () => {
      banner.classList.remove("visible");
      localStorage.setItem("pwa-dismissed", Date.now().toString());
    });
  }

  function _pwaLogoSrc() {
    return isSubdir ? "../logo.png" : "./logo.png";
  }

  function shouldShowBanner() {
    if (localStorage.getItem("pwa-installed")) return false;
    const dismissed = parseInt(localStorage.getItem("pwa-dismissed") || "0", 10);
    if (dismissed && Date.now() - dismissed < 3 * 24 * 60 * 60 * 1000) return false;
    return true;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    if (isStandaloneContentPage) return;
    e.preventDefault();
    deferredPrompt = e;
    document.documentElement.classList.add("can-install-pwa");
    if (!shouldShowBanner()) return;
    injectBanner();
    setTimeout(() => {
      const banner = document.getElementById("pwa-install-banner");
      if (banner) banner.classList.add("visible");
    }, 2500);
  });

  window.addEventListener("appinstalled", () => {
    if (isStandaloneContentPage) return;
    localStorage.setItem("pwa-installed", "1");
    document.documentElement.classList.remove("can-install-pwa");
    const banner = document.getElementById("pwa-install-banner");
    if (banner) banner.classList.remove("visible");
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupCustomInstallButtons);
  } else {
    setupCustomInstallButtons();
  }
})();
// ============================================================
// كود تتبع الزوار الحقيقي والمباشر لمنصة التعليم السورية
// يعمل 100% على GitHub Pages بدون أي سيرفر خارجي
// ============================================================
(function() {
  function detectRealVisitor() {
    // الاتصال بمزود الموقع الجغرافي الحقيقي
    fetch('https://ipwho.is/')
      .then(function(res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function(data) {
        if (!data || data.success === false) return;

        var country = data.country || 'Unknown';
        var countryCode = data.country_code || 'SY';
        var city = data.city || '';
        var flag = (data.flag && data.flag.emoji) ? data.flag.emoji : '🇸🇾';
        var ip = data.ip || '';
        var page = window.location.pathname;

        // طباعة موقعك الحقيقي في الكونسول (F12) فوراً!
        console.log('%c📍 [VisitorPulse] تم رصد وتحديد موقعك الحقيقي بنجاح:', 'color:#00d1b2; font-weight:bold; font-size:14px;');
        console.log('   🇸🇾 الدولة:', country, flag);
        console.log('   🏙 المدينة:', city);
        console.log('   🌐 الآي بي (IP):', ip);
        console.log('   📄 الصفحة الحالية:', page);

        // حفظ الموقع محلياً في المتصفح
        try {
          localStorage.setItem('visitorpulse_geo', JSON.stringify({
            ip: ip, country: country, city: city, flag: flag, page: page, time: new Date().toLocaleTimeString('ar-SA')
          }));
        } catch(e) {}

        // إذا تم تصفح الموقع من داخل تطبيق الأندرويد، يُرسل الزائر مباشرة للتطبيق:
        if (window.VisitorPulseBridge && window.VisitorPulseBridge.logVisit) {
          window.VisitorPulseBridge.logVisit(page, country, countryCode, city, flag, ip);
        }
      })
      .catch(function(err) {
        console.warn('[VisitorPulse] تعذر الاتصال بمزود الموقع:', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectRealVisitor);
  } else {
    detectRealVisitor();
  }
})();
