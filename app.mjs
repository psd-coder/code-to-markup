import Alpine from "https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.14.1/module.esm.min.js";

const INITIAL_HIGHLIGHTER = "highlight";
const INITIAL_LANGUAGE = "yaml";
const INITIAL_THEME = "night-owl";
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

main();

function main() {
  Alpine.data("app", () => {
    return {
      ready: false,
      highlighters: {
        highlight: {
          name: "Highlight.js",
          file: "./highlighters/highlight.mjs",
          module: null,
          setupPromise: null,
        },
        prism: {
          name: "Prism.js",
          file: "./highlighters/prism.mjs",
          module: null,
          setupPromise: null,
        },
        shiki: {
          name: "Shiki",
          file: "./highlighters/shiki.mjs",
          module: null,
          setupPromise: null,
        },
      },
      selectedHighlighter: INITIAL_HIGHLIGHTER,
      selectedTheme: INITIAL_THEME,
      selectedLanguage: INITIAL_LANGUAGE,
      inputCode: INITIAL_CODE,
      highlightedCode: "",

      get currentHighlighter() {
        return this.highlighters[this.selectedHighlighter].module;
      },

      get currentThemeCssUrl() {
        return this.currentHighlighter.getThemeUrl(this.selectedTheme);
      },

      get cssStyles() {
        return (
          this.currentThemeCssUrl &&
          `<link rel="stylesheet" href="${this.currentThemeCssUrl}">`
        );
      },

      get cssSize() {
        return (
          this.currentThemeCssUrl && getCSSFileSize(this.currentThemeCssUrl)
        );
      },

      async init() {
        await this.ensureHighlighterInitialized(this.selectedHighlighter);
        this.ready = true;
        this.highlightCode();
      },

      async ensureHighlighterInitialized(id) {
        if (!this.highlighters[id].initialized) {
          const module = await import(this.highlighters[id].file).then(
            ({ default: module }) => module
          );

          this.highlighters[id].module = module;
          this.highlighters[id].setupPromise = module.setup({
            loadScript,
          });
        }

        return this.highlighters[id].setupPromise;
      },

      async highlightCode() {
        if (!this.inputCode.trim()) {
          this.highlightedCode = "";
          return;
        }

        this.highlightedCode = await this.currentHighlighter.highlight({
          loadScript,
          code: this.inputCode,
          language: this.selectedLanguage,
          theme: this.selectedTheme,
        });
      },

      async onHighlighterChange(event) {
        await this.ensureHighlighterInitialized(event.target.value);
        this.selectedHighlighter = event.target.value;
        this.selectedTheme = this.currentHighlighter.defaultTheme;
        this.selectedLanguage = this.currentHighlighter.languages.find(
          (l) => l.value === this.selectedLanguage
        )
          ? this.selectedLanguage
          : this.currentHighlighter.languages[0].value;
        this.highlightCode();
      },

      onThemeChange(event) {
        this.selectedTheme = event.target.value;
        this.highlightCode();
      },

      onLanguageChange(event) {
        this.selectedLanguage = event.target.value;
        this.highlightCode();
      },

      onInputCodeChange(event) {
        this.inputCode = event.target.value;
        this.highlightCode();
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
      await navigator.clipboard.writeText(data);

      setTimeout(() => {
        this.isCopying = false;
      }, 2000);
    },
  }));

  Alpine.start();
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

async function getCSSFileSize(url) {
  try {
    const response = await fetch(url, { method: "HEAD" });
    const size = response.headers.get("Content-Length");

    if (size) {
      const formatter = Intl.NumberFormat("en", {
        notation: "compact",
        style: "unit",
        unit: "byte",
        unitDisplay: "narrow",
      });

      return formatter.format(size);
    }
  } catch (error) {
    console.warn("Could not fetch CSS size:", error);
  }

  return "Unknown";
}
