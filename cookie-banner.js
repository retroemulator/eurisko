(function () {
  "use strict";

  var STORAGE_KEY = "cookie-consent";

  var TEXTS = {
    it: {
      text: "Questo sito utilizza cookie tecnici e cookie di Google Analytics per analizzare il traffico in forma anonima. Maggiori dettagli nella nostra ",
      linkText: "Cookie Policy",
      linkUrl: "/cookie-policy",
      accept: "Accetta",
      reject: "Rifiuta"
    },
    en: {
      text: "This site uses technical cookies and Google Analytics cookies to analyze traffic anonymously. More details in our ",
      linkText: "Cookie Policy",
      linkUrl: "/en/cookie-policy",
      accept: "Accept",
      reject: "Reject"
    }
  };

  function detectLang() {
    var htmlLang = document.documentElement.lang;
    var path = window.location.pathname;
    if (htmlLang === "en" || path.indexOf("/en/") === 0) {
      return "en";
    }
    return "it";
  }

  function ensureGtag() {
    if (typeof window.gtag !== "function") {
      window.gtag = function () {};
    }
  }

  function hideBanner(banner) {
    if (banner) {
      banner.classList.remove("is-visible");
    }
  }

  function showBanner(banner) {
    if (banner) {
      banner.classList.add("is-visible");
    }
  }

  function injectTexts(banner, lang) {
    var t = TEXTS[lang];

    var textEl = banner.querySelector(".cookie-banner__text");
    if (textEl) {
      while (textEl.firstChild) {
        textEl.removeChild(textEl.firstChild);
      }
      textEl.appendChild(document.createTextNode(t.text));
      var link = document.createElement("a");
      link.className = "cookie-banner__link";
      link.href = t.linkUrl;
      link.textContent = t.linkText;
      textEl.appendChild(link);
      textEl.appendChild(document.createTextNode("."));
    }

    var acceptBtn = banner.querySelector(".cookie-banner__accept");
    if (acceptBtn) {
      acceptBtn.textContent = t.accept;
    }

    var rejectBtn = banner.querySelector(".cookie-banner__reject");
    if (rejectBtn) {
      rejectBtn.textContent = t.reject;
    }
  }

  function onAccept(banner) {
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
    } catch (e) {}
    ensureGtag();
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted"
    });
    hideBanner(banner);
  }

  function onReject(banner) {
    try {
      localStorage.setItem(STORAGE_KEY, "denied");
    } catch (e) {}
    hideBanner(banner);
  }

  function init() {
    var banner = document.querySelector(".cookie-banner");
    if (!banner) {
      return;
    }

    var lang = detectLang();
    injectTexts(banner, lang);

    var acceptBtn = banner.querySelector(".cookie-banner__accept");
    var rejectBtn = banner.querySelector(".cookie-banner__reject");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        onAccept(banner);
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        onReject(banner);
      });
    }

    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}

    if (stored === null) {
      showBanner(banner);
    }
  }

  window.resetCookieConsent = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    window.location.reload();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
