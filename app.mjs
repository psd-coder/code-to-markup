import Alpine from "https://cdn.jsdelivr.net/npm/alpinejs@3.14.9/+esm";

const APP_URL = "https://psd-coder.github.io/code-to-markup/";
const FALLBACK_HIGHLIGHTER = "shiki";
const FALLBACK_LANGUAGE = "yaml";
const FALLBACK_THEME = "github-dark";
const STATE_TO_SEARCH_PARAMS = { highlighter: "h", theme: "t", language: "l" };
const HIGHLIGHTERS = {
  shiki: {
    name: "Shiki",
    file: "./highlighters/shiki.mjs",
  },
  highlight: {
    name: "Highlight.js",
    file: "./highlighters/highlight.mjs",
  },
  prism: {
    name: "Prism.js",
    file: "./highlighters/prism.mjs",
  },
};

const INITIAL_CODE = `# lefthook.yml

# Build commit messages
prepare-commit-msg:
  commands:
    commitzen:
      interactive: true
      run: yarn run cz --hook
      env:
        LEFTHOOK: 0

# Validate commit messages
commit-msg:
  commands:
    "lint commit message":
      run: yarn run commitlint --edit {1}`;
const HIGHLIGHTER_STATUS = {
  IDLE: "IDLE",
  INITIALIZING: "INITIALIZING",
  FAILED: "FAILED",
};
const HIGHLIGHTING_STATUS = {
  IDLE: "IDLE",
  HIGHLIGHTING: "HIGHLIGHTING",
  FAILED: "FAILED",
};
const LOADING_STATUS = {
  LOADED: "LOADED",
  LOADING: "LOADING",
  FAILED: "FAILED",
};

main();

function main() {
  Alpine.data("app", () => {
    const loadModule = getModuleLoader();
    const initialState = getInitialState(Object.keys(HIGHLIGHTERS), {
      highlighter: FALLBACK_HIGHLIGHTER,
      theme: FALLBACK_THEME,
      language: FALLBACK_LANGUAGE,
      code: INITIAL_CODE,
    });

    return {
      highlighters: Object.entries(HIGHLIGHTERS).reduce((acc, [id, data]) => {
        acc[id] = {
          ...data,
          module: null,
          initialized: false,
          setupPromise: null,
        };
        return acc;
      }, {}),
      highlighterStatus: HIGHLIGHTER_STATUS.IDLE,
      highlightingStatus: HIGHLIGHTING_STATUS.IDLE,
      themeLoadingStatus: LOADING_STATUS.LOADED,
      languageLoadingStatus: LOADING_STATUS.LOADED,
      isOnline: navigator.onLine,
      state: initialState,
      output: {
        code: null,
        cssTheme: null,
      },

      get currentHighlighter() {
        return (
          this.highlighters[this.state.highlighter].module ??
          getHighlighterFallback(initialState)
        );
      },

      get isProcessing() {
        return (
          this.highlighterStatus === HIGHLIGHTER_STATUS.INITIALIZING ||
          this.highlightingStatus === HIGHLIGHTING_STATUS.HIGHLIGHTING ||
          this.themeLoadingStatus === LOADING_STATUS.LOADING ||
          this.languageLoadingStatus === LOADING_STATUS.LOADING
        );
      },

      get showFallback() {
        return (
          this.isProcessing ||
          this.highlighterStatus === HIGHLIGHTER_STATUS.FAILED ||
          this.highlightingStatus === HIGHLIGHTING_STATUS.FAILED ||
          this.themeLoadingStatus === LOADING_STATUS.FAILED ||
          this.languageLoadingStatus === LOADING_STATUS.FAILED ||
          !this.output.code
        );
      },

      get fallbackHighlightedMessage() {
        const offlineAddition = this.isOnline
          ? "Try reload page to…"
          : "You are offline now. You can still edit the code, but highlighting will only work for already loaded highlighters, languages, and themes from when you were online.";

        if (this.highlighterStatus === HIGHLIGHTER_STATUS.INITIALIZING) {
          return "Loading highlighter...";
        }

        if (this.highlighterStatus === HIGHLIGHTER_STATUS.FAILED) {
          return `Failed to load highlighter "${this.state.highlighter}". ${offlineAddition}`;
        }

        if (this.highlightingStatus === HIGHLIGHTING_STATUS.HIGHLIGHTING) {
          return "Highlighting code...";
        }

        if (this.highlightingStatus === HIGHLIGHTING_STATUS.FAILED) {
          return `Failed to highlight code with "${this.state.highlighter}", language "${this.state.language}", theme "${this.state.theme}". ${offlineAddition}`;
        }

        if (this.themeLoadingStatus === LOADING_STATUS.FAILED) {
          return `Failed to load theme "${this.state.theme}". ${offlineAddition}`;
        }

        if (this.languageLoadingStatus === LOADING_STATUS.FAILED) {
          return `Failed to load language "${this.state.language}". ${offlineAddition}`;
        }

        if (this.languageLoadingStatus === LOADING_STATUS.LOADING) {
          return `Loading language "${this.state.language}"...`;
        }

        if (this.themeLoadingStatus === LOADING_STATUS.LOADING) {
          return `Loading theme "${this.state.theme}"...`;
        }

        return "Highlighted code will appear here...";
      },

      async init() {
        this.trackOffline();
        await this.ensureHighlighterInitialized(this.state.highlighter);
        this.highlightCode();
      },

      trackOffline() {
        this.checkConnectivity();

        // Listen to browser online/offline events (not very reliable)
        window.addEventListener("online", () => this.checkConnectivity());
        window.addEventListener("offline", () => (this.isOnline = false));
        window.addEventListener("focus", () => this.checkConnectivity());
        setInterval(() => this.checkConnectivity(), 30_000);
      },

      async checkConnectivity() {
        if (!navigator.onLine) {
          this.isOnline = false;
          return;
        }

        try {
          const response = await fetch("./favicon.ico", {
            method: "HEAD",
            cache: "no-cache",
            timeout: 5000,
          });

          this.isOnline = response.ok;
        } catch {
          this.isOnline = false;
        }

        if (!this.isOnline) {
          return;
        }

        let needHighlight = false;

        if (this.highlighterStatus === HIGHLIGHTER_STATUS.FAILED) {
          needHighlight = true;
          await this.ensureHighlighterInitialized(this.state.highlighter);
        }

        if (this.languageLoadingStatus === LOADING_STATUS.FAILED) {
          needHighlight = true;
          await this.handleLanguageChange();
        }

        if (this.themeLoadingStatus === LOADING_STATUS.FAILED) {
          needHighlight = true;
          await this.handleThemeChange();
        }

        if (
          needHighlight &&
          this.languageLoadingStatus === LOADING_STATUS.LOADED &&
          this.themeLoadingStatus === LOADING_STATUS.LOADED
        ) {
          this.updateURLAndHighlight();
        }
      },

      async ensureHighlighterInitialized(id) {
        if (!this.highlighters[id].initialized) {
          try {
            this.highlighterStatus = HIGHLIGHTER_STATUS.INITIALIZING;
            const highlighterUrl = new URL(
              this.highlighters[id].file,
              import.meta.url
            ).toString();
            const module = await loadModule(highlighterUrl).then(
              ({ default: module }) => module
            );

            this.highlighters[id].module = module;
            this.highlighters[id].setupPromise = module.setup({
              loadScript,
              loadModule,
            });

            await this.highlighters[id].setupPromise;
            this.highlighters[id].initialized = true;
            await this.ensureThemeAndLanguageLoaded();
            this.highlighterStatus = HIGHLIGHTER_STATUS.IDLE;
          } catch {
            console.error("Failed to initialize highlighter:", id);
            this.highlighterStatus = HIGHLIGHTER_STATUS.FAILED;
          }
        }

        return this.highlighters[id].setupPromise;
      },

      async ensureThemeAndLanguageLoaded() {
        this.state.theme = this.currentHighlighter.themes.find(
          (t) => t.value === this.state.theme
        )
          ? this.state.theme
          : this.currentHighlighter.defaultTheme;
        this.state.language = this.currentHighlighter.languages.find(
          (l) => l.value === this.state.language
        )
          ? this.state.language
          : this.currentHighlighter.languages[0].value;

        return Promise.all([
          this.handleThemeChange(),
          this.handleLanguageChange(),
        ]);
      },

      async updateURLAndHighlight(options) {
        updateURLAndLocalStorage(this.state);
        return this.highlightCode(options);
      },

      async highlightCode(options) {
        const opts = Object.assign({}, { toggleLoadingState: true }, options);

        if (!this.state.code.trim()) {
          this.output.code = "";
          return;
        }

        try {
          if (opts.toggleLoadingState) {
            this.highlightingStatus = HIGHLIGHTING_STATUS.HIGHLIGHTING;
          }

          this.output.code = await this.currentHighlighter.highlight({
            ...this.state,
            loadScript,
          });

          // This is hack for https://github.com/alpinejs/alpine/blob/main/packages/alpinejs/src/directives/x-show.js,
          // otherwise it get's crazy about isProcessing state switch back and forth and starts showing icon incorrectly
          requestAnimationFrame(
            () => (this.highlightingStatus = HIGHLIGHTING_STATUS.IDLE)
          );
        } catch {
          console.error("Failed to highlight code:", this.state);
          this.highlightingStatus = HIGHLIGHTING_STATUS.FAILED;
        }
      },

      getHighligtedCodeForCopying() {
        return `<!-- Code is generated by Code to Markup. Go there if you want to update it: ${APP_URL}${getURL(
          this.state,
          false
        )} -->\n${this.output.code}`;
      },

      async onHighlighterChange(event) {
        this.state.highlighter = event.target.value;
        await this.ensureHighlighterInitialized(event.target.value);
        await this.ensureThemeAndLanguageLoaded();
        this.updateURLAndHighlight();
      },

      async onThemeChange(event) {
        this.state.theme = event.target.value;
        await this.handleThemeChange();
        this.updateURLAndHighlight();
      },

      async handleThemeChange() {
        try {
          this.themeLoadingStatus = LOADING_STATUS.LOADING;
          this.output.cssTheme = null;
          const theme = await this.currentHighlighter.loadTheme(
            this.state.theme,
            { loadModule }
          );

          if (theme.isCss) {
            this.output.cssTheme = {
              ...theme,
              instruction: `<link rel="stylesheet" href="${theme.url}">`,
              formattedSize: formatSize(theme.size),
            };
          }

          this.themeLoadingStatus = LOADING_STATUS.LOADED;
        } catch {
          console.log("Failed to load theme:", this.state.theme);
          this.themeLoadingStatus = LOADING_STATUS.FAILED;
        }
      },

      async onLanguageChange(event) {
        this.state.language = event.target.value;
        await this.handleLanguageChange();
        this.updateURLAndHighlight();
      },

      async handleLanguageChange() {
        try {
          this.languageLoadingStatus = LOADING_STATUS.LOADING;
          await this.currentHighlighter.loadLanguage(this.state.language, {
            loadModule,
          });
          this.languageLoadingStatus = LOADING_STATUS.LOADED;
        } catch {
          console.log("Failed to load language:", this.state.language);
          this.languageLoadingStatus = LOADING_STATUS.FAILED;
        }
      },

      onCodeChange(event) {
        this.state.code = event.target.value;
        this.updateURLAndHighlight({ toggleLoadingState: false });
      },
    };
  });

  Alpine.data("copyButton", () => ({
    isCopying: false,
    async copy(data) {
      if (!data.trim()) {
        return;
      }

      this.isCopying = true;

      if (!navigator.clipboard.write) {
        await navigator.clipboard.writeText(data);
      } else {
        const itemRecords = { "text/plain": data };

        if (this.$el.hasAttribute("data-as-html")) {
          itemRecords["text/html"] = data;
        }

        await navigator.clipboard.write([new ClipboardItem(itemRecords)]);
      }

      setTimeout(() => {
        this.isCopying = false;
      }, 2000);
    },
  }));

  Alpine.start();
}

// We need this, because browsers cache errors for dynamically imported modules, and if we try to load while we are offline, it will fail with the same error forever.
function getModuleLoader() {
  const loadedVersions = new Map();
  const failedModules = new Set();

  return function loadModule(path) {
    let version = loadedVersions.has(path) ? loadedVersions.get(path) : null;
    let moduleUrl = getUrlWithParams(path, { version });

    if (failedModules.has(path)) {
      version = Date.now();
      moduleUrl = getUrlWithParams(path, { version });
    }

    return import(moduleUrl)
      .then((m) => {
        loadedVersions.set(path, version);
        failedModules.delete(path);
        return m;
      })
      .catch((e) => {
        failedModules.add(path);
        throw e;
      });
  };
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

function getUrlWithParams(url, params) {
  const urlObj = new URL(url);

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null) {
      urlObj.searchParams.set(key, params[key]);
    }
  });

  return urlObj.toString();
}

function formatSize(size) {
  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  });

  return formatter.format(size);
}

function getHighlighterFallback(initial) {
  return {
    baseUrl: "",
    loadTheme() {
      return Promise.resolve({ isCss: false });
    },
    loadLanguage() {
      return Promise.resolve();
    },
    setup() {},
    highlight() {},
    defaultTheme: initial.theme,
    themes: [{ value: initial.theme, name: "" }],
    languages: [{ value: initial.language, name: "" }],
  };
}

function getInitialState(availableHighlighters, fallback) {
  const urlParams = new URLSearchParams(window.location.search);
  const initialState = { code: "" };

  try {
    initialState.code = urlSafeAtob(window.location.hash.slice(1));
  } catch {}

  Object.keys(STATE_TO_SEARCH_PARAMS).forEach((key) => {
    let value =
      urlParams.get(STATE_TO_SEARCH_PARAMS[key]) ||
      window.localStorage.getItem(key);

    // Use fallback if unsupported highlighter is specified
    if (
      key === "highlighter" &&
      value &&
      !availableHighlighters.includes(value)
    ) {
      value = null;
    }

    initialState[key] = value || fallback[key];
  });

  // If code is not specified, use our fallback code for the selected language
  if (!initialState.code) {
    initialState.code = fallback.code;
    initialState.language = fallback.language;
  }

  return initialState;
}

function updateURLAndLocalStorage(state) {
  Object.keys(STATE_TO_SEARCH_PARAMS).forEach((key) => {
    window.localStorage.setItem(key, state[key]);
  });

  window.history.replaceState(null, "", getURL(state));
}

function getURL({ code, ...searchParamsState }, withCode = true) {
  const params = new URLSearchParams();

  Object.keys(STATE_TO_SEARCH_PARAMS).forEach((key) => {
    params.set(STATE_TO_SEARCH_PARAMS[key], searchParamsState[key]);
  });

  return `?${params.toString()}#${withCode ? urlSafeBtoa(code) : ""}`;
}

function urlSafeAtob(urlSafeB64) {
  const b64 = urlSafeB64
    .replaceAll("-", "+")
    .replaceAll("_", "/")
    .padEnd(Math.ceil(urlSafeB64.length / 4) * 4, "=");

  return atob(b64);
}

function urlSafeBtoa(data) {
  return btoa(data)
    .replaceAll("=", "")
    .replaceAll("+", "-")
    .replaceAll("/", "_");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed: ", error);
      });
  });
}
