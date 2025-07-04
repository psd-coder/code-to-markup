export default {
  baseUrl: "https://cdn.jsdelivr.net/npm/shiki@3.4.2",
  shikiInstance: null,
  async setup({ loadModule }) {
    const [{ createHighlighterCore }, { createOnigurumaEngine }] =
      await Promise.all([
        loadModule(`${this.baseUrl}/bundle-web/+esm`),
        loadModule(`${this.baseUrl}/engine-oniguruma/+esm`),
      ]);

    this.shikiInstance = await createHighlighterCore({
      engine: createOnigurumaEngine(loadModule(`${this.baseUrl}/wasm/+esm`)),
    });
  },
  async loadTheme(theme, { loadModule }) {
    return this.shikiInstance
      .loadTheme(loadModule(`${this.baseUrl}/themes/${theme}/+esm`))
      .then(() => ({ isCSS: false }));
  },
  async loadLanguage(language, { loadModule }) {
    return this.shikiInstance.loadLanguage(
      loadModule(`${this.baseUrl}/langs/${language}/+esm`)
    );
  },
  async highlight({ code, language, theme }) {
    let highlighted = this.shikiInstance.codeToHtml(code, {
      lang: language,
      theme,
    });

    highlighted = highlighted.replace(
      "<code>",
      '<code style="padding:1em;overflow-x: auto;">'
    );

    return highlighted;
  },
  defaultTheme: "vitesse-dark",
  themes: [
    { value: "andromeeda", name: "Andromeeda" },
    { value: "aurora-x", name: "Aurora X" },
    { value: "ayu-dark", name: "Ayu Dark" },
    { value: "catppuccin-frappe", name: "Catppuccin Frappé" },
    { value: "catppuccin-latte", name: "Catppuccin Latte" },
    { value: "catppuccin-macchiato", name: "Catppuccin Macchiato" },
    { value: "catppuccin-mocha", name: "Catppuccin Mocha" },
    { value: "dark-plus", name: "Dark Plus" },
    { value: "dracula", name: "Dracula Theme" },
    { value: "dracula-soft", name: "Dracula Theme Soft" },
    { value: "everforest-dark", name: "Everforest Dark" },
    { value: "everforest-light", name: "Everforest Light" },
    { value: "github-dark", name: "GitHub Dark" },
    { value: "github-dark-default", name: "GitHub Dark Default" },
    { value: "github-dark-dimmed", name: "GitHub Dark Dimmed" },
    { value: "github-dark-high-contrast", name: "GitHub Dark High Contrast" },
    { value: "github-light", name: "GitHub Light" },
    { value: "github-light-default", name: "GitHub Light Default" },
    { value: "github-light-high-contrast", name: "GitHub Light High Contrast" },
    { value: "gruvbox-dark-hard", name: "Gruvbox Dark Hard" },
    { value: "gruvbox-dark-medium", name: "Gruvbox Dark Medium" },
    { value: "gruvbox-dark-soft", name: "Gruvbox Dark Soft" },
    { value: "gruvbox-light-hard", name: "Gruvbox Light Hard" },
    { value: "gruvbox-light-medium", name: "Gruvbox Light Medium" },
    { value: "gruvbox-light-soft", name: "Gruvbox Light Soft" },
    { value: "houston", name: "Houston" },
    { value: "kanagawa-dragon", name: "Kanagawa Dragon" },
    { value: "kanagawa-lotus", name: "Kanagawa Lotus" },
    { value: "kanagawa-wave", name: "Kanagawa Wave" },
    { value: "laserwave", name: "LaserWave" },
    { value: "light-plus", name: "Light Plus" },
    { value: "material-theme", name: "Material Theme" },
    { value: "material-theme-darker", name: "Material Theme Darker" },
    { value: "material-theme-lighter", name: "Material Theme Lighter" },
    { value: "material-theme-ocean", name: "Material Theme Ocean" },
    { value: "material-theme-palenight", name: "Material Theme Palenight" },
    { value: "min-dark", name: "Min Dark" },
    { value: "min-light", name: "Min Light" },
    { value: "monokai", name: "Monokai" },
    { value: "night-owl", name: "Night Owl" },
    { value: "nord", name: "Nord" },
    { value: "one-dark-pro", name: "One Dark Pro" },
    { value: "one-light", name: "One Light" },
    { value: "plastic", name: "Plastic" },
    { value: "poimandres", name: "Poimandres" },
    { value: "red", name: "Red" },
    { value: "rose-pine", name: "Rosé Pine" },
    { value: "rose-pine-dawn", name: "Rosé Pine Dawn" },
    { value: "rose-pine-moon", name: "Rosé Pine Moon" },
    { value: "slack-dark", name: "Slack Dark" },
    { value: "slack-ochin", name: "Slack Ochin" },
    { value: "snazzy-light", name: "Snazzy Light" },
    { value: "solarized-dark", name: "Solarized Dark" },
    { value: "solarized-light", name: "Solarized Light" },
    { value: "synthwave-84", name: "Synthwave '84" },
    { value: "tokyo-night", name: "Tokyo Night" },
    { value: "vesper", name: "Vesper" },
    { value: "vitesse-black", name: "Vitesse Black" },
    { value: "vitesse-dark", name: "Vitesse Dark" },
    { value: "vitesse-light", name: "Vitesse Light" },
  ],
  languages: [
    { value: "abap", name: "ABAP" },
    { value: "actionscript-3", name: "ActionScript" },
    { value: "ada", name: "Ada" },
    { value: "angular-html", name: "Angular HTML" },
    { value: "angular-ts", name: "Angular TypeScript" },
    { value: "apache", name: "Apache Conf" },
    { value: "apex", name: "Apex" },
    { value: "apl", name: "APL" },
    { value: "applescript", name: "AppleScript" },
    { value: "ara", name: "Ara" },
    { value: "asciidoc", name: "AsciiDoc" },
    { value: "asm", name: "Assembly" },
    { value: "astro", name: "Astro" },
    { value: "awk", name: "AWK" },
    { value: "ballerina", name: "Ballerina" },
    { value: "bat", name: "Batch File" },
    { value: "beancount", name: "Beancount" },
    { value: "berry", name: "Berry" },
    { value: "bibtex", name: "BibTeX" },
    { value: "bicep", name: "Bicep" },
    { value: "blade", name: "Blade" },
    { value: "bsl", name: "1C (Enterprise)" },
    { value: "c", name: "C" },
    { value: "cadence", name: "Cadence" },
    { value: "cairo", name: "Cairo" },
    { value: "clarity", name: "Clarity" },
    { value: "clojure", name: "Clojure" },
    { value: "cmake", name: "CMake" },
    { value: "cobol", name: "COBOL" },
    { value: "codeowners", name: "CODEOWNERS" },
    { value: "codeql", name: "CodeQL" },
    { value: "coffee", name: "CoffeeScript" },
    { value: "common-lisp", name: "Common Lisp" },
    { value: "coq", name: "Coq" },
    { value: "cpp", name: "C++" },
    { value: "crystal", name: "Crystal" },
    { value: "csharp", name: "C#" },
    { value: "css", name: "CSS" },
    { value: "csv", name: "CSV" },
    { value: "cue", name: "CUE" },
    { value: "cypher", name: "Cypher" },
    { value: "d", name: "D" },
    { value: "dart", name: "Dart" },
    { value: "dax", name: "DAX" },
    { value: "desktop", name: "Desktop" },
    { value: "diff", name: "Diff" },
    { value: "docker", name: "Dockerfile" },
    { value: "dotenv", name: "dotEnv" },
    { value: "dream-maker", name: "Dream Maker" },
    { value: "edge", name: "Edge" },
    { value: "elixir", name: "Elixir" },
    { value: "elm", name: "Elm" },
    { value: "emacs-lisp", name: "Emacs Lisp" },
    { value: "erb", name: "ERB" },
    { value: "erlang", name: "Erlang" },
    { value: "fennel", name: "Fennel" },
    { value: "fish", name: "Fish" },
    { value: "fluent", name: "Fluent" },
    { value: "fortran-fixed-form", name: "Fortran (Fixed Form)" },
    { value: "fortran-free-form", name: "Fortran (Free Form)" },
    { value: "fsharp", name: "F#" },
    { value: "gdresource", name: "GDResource" },
    { value: "gdscript", name: "GDScript" },
    { value: "gdshader", name: "GDShader" },
    { value: "genie", name: "Genie" },
    { value: "gherkin", name: "Gherkin" },
    { value: "git-commit", name: "Git Commit Message" },
    { value: "git-rebase", name: "Git Rebase Message" },
    { value: "gleam", name: "Gleam" },
    { value: "glimmer-js", name: "Glimmer JS" },
    { value: "glimmer-ts", name: "Glimmer TS" },
    { value: "glsl", name: "GLSL" },
    { value: "gnuplot", name: "Gnuplot" },
    { value: "go", name: "Go" },
    { value: "graphql", name: "GraphQL" },
    { value: "groovy", name: "Groovy" },
    { value: "hack", name: "Hack" },
    { value: "haml", name: "Ruby Haml" },
    { value: "handlebars", name: "Handlebars" },
    { value: "haskell", name: "Haskell" },
    { value: "haxe", name: "Haxe" },
    { value: "hcl", name: "HashiCorp HCL" },
    { value: "hjson", name: "Hjson" },
    { value: "hlsl", name: "HLSL" },
    { value: "html", name: "HTML" },
    { value: "html-derivative", name: "HTML (Derivative)" },
    { value: "http", name: "HTTP" },
    { value: "hxml", name: "HXML" },
    { value: "hy", name: "Hy" },
    { value: "imba", name: "Imba" },
    { value: "ini", name: "INI" },
    { value: "java", name: "Java" },
    { value: "javascript", name: "JavaScript" },
    { value: "jinja", name: "Jinja" },
    { value: "jison", name: "Jison" },
    { value: "json", name: "JSON" },
    { value: "json5", name: "JSON5" },
    { value: "jsonc", name: "JSON with Comments" },
    { value: "jsonl", name: "JSON Lines" },
    { value: "jsonnet", name: "Jsonnet" },
    { value: "jssm", name: "JSSM" },
    { value: "jsx", name: "JSX" },
    { value: "julia", name: "Julia" },
    { value: "kotlin", name: "Kotlin" },
    { value: "kusto", name: "Kusto" },
    { value: "latex", name: "LaTeX" },
    { value: "lean", name: "Lean 4" },
    { value: "less", name: "Less" },
    { value: "liquid", name: "Liquid" },
    { value: "llvm", name: "LLVM IR" },
    { value: "log", name: "Log file" },
    { value: "logo", name: "Logo" },
    { value: "lua", name: "Lua" },
    { value: "luau", name: "Luau" },
    { value: "make", name: "Makefile" },
    { value: "markdown", name: "Markdown" },
    { value: "marko", name: "Marko" },
    { value: "matlab", name: "MATLAB" },
    { value: "mdc", name: "MDC" },
    { value: "mdx", name: "MDX" },
    { value: "mermaid", name: "Mermaid" },
    { value: "mipsasm", name: "MIPS Assembly" },
    { value: "mojo", name: "Mojo" },
    { value: "move", name: "Move" },
    { value: "narrat", name: "Narrat Language" },
    { value: "nextflow", name: "Nextflow" },
    { value: "nginx", name: "Nginx" },
    { value: "nim", name: "Nim" },
    { value: "nix", name: "Nix" },
    { value: "nushell", name: "nushell" },
    { value: "objective-c", name: "Objective-C" },
    { value: "objective-cpp", name: "Objective-C++" },
    { value: "ocaml", name: "OCaml" },
    { value: "pascal", name: "Pascal" },
    { value: "perl", name: "Perl" },
    { value: "php", name: "PHP" },
    { value: "plsql", name: "PL/SQL" },
    { value: "po", name: "Gettext PO" },
    { value: "polar", name: "Polar" },
    { value: "postcss", name: "PostCSS" },
    { value: "powerquery", name: "PowerQuery" },
    { value: "powershell", name: "PowerShell" },
    { value: "prisma", name: "Prisma" },
    { value: "prolog", name: "Prolog" },
    { value: "proto", name: "Protocol Buffer 3" },
    { value: "pug", name: "Pug" },
    { value: "puppet", name: "Puppet" },
    { value: "purescript", name: "PureScript" },
    { value: "python", name: "Python" },
    { value: "qml", name: "QML" },
    { value: "qmldir", name: "QML Directory" },
    { value: "qss", name: "Qt Style Sheets" },
    { value: "r", name: "R" },
    { value: "racket", name: "Racket" },
    { value: "raku", name: "Raku" },
    { value: "razor", name: "ASP.NET Razor" },
    { value: "reg", name: "Windows Registry Script" },
    { value: "regexp", name: "RegExp" },
    { value: "rel", name: "Rel" },
    { value: "riscv", name: "RISC-V" },
    { value: "rst", name: "reStructuredText" },
    { value: "ruby", name: "Ruby" },
    { value: "rust", name: "Rust" },
    { value: "sas", name: "SAS" },
    { value: "sass", name: "Sass" },
    { value: "scala", name: "Scala" },
    { value: "scheme", name: "Scheme" },
    { value: "scss", name: "SCSS" },
    { value: "sdbl", name: "1C (Query)" },
    { value: "shaderlab", name: "ShaderLab" },
    { value: "shellscript", name: "Shell" },
    { value: "shellsession", name: "Shell Session" },
    { value: "smalltalk", name: "Smalltalk" },
    { value: "solidity", name: "Solidity" },
    { value: "soy", name: "Closure Templates" },
    { value: "sparql", name: "SPARQL" },
    { value: "splunk", name: "Splunk Query Language" },
    { value: "sql", name: "SQL" },
    { value: "ssh-config", name: "SSH Config" },
    { value: "stata", name: "Stata" },
    { value: "stylus", name: "Stylus" },
    { value: "svelte", name: "Svelte" },
    { value: "swift", name: "Swift" },
    { value: "system-verilog", name: "SystemVerilog" },
    { value: "systemd", name: "Systemd Units" },
    { value: "talonscript", name: "TalonScript" },
    { value: "tasl", name: "Tasl" },
    { value: "tcl", name: "Tcl" },
    { value: "templ", name: "Templ" },
    { value: "terraform", name: "Terraform" },
    { value: "tex", name: "TeX" },
    { value: "toml", name: "TOML" },
    { value: "ts-tags", name: "TypeScript with Tags" },
    { value: "tsv", name: "TSV" },
    { value: "tsx", name: "TSX" },
    { value: "turtle", name: "Turtle" },
    { value: "twig", name: "Twig" },
    { value: "typescript", name: "TypeScript" },
    { value: "typespec", name: "TypeSpec" },
    { value: "typst", name: "Typst" },
    { value: "v", name: "V" },
    { value: "vala", name: "Vala" },
    { value: "vb", name: "Visual Basic" },
    { value: "verilog", name: "Verilog" },
    { value: "vhdl", name: "VHDL" },
    { value: "viml", name: "Vim Script" },
    { value: "vue", name: "Vue" },
    { value: "vue-html", name: "Vue HTML" },
    { value: "vyper", name: "Vyper" },
    { value: "wasm", name: "WebAssembly" },
    { value: "wenyan", name: "Wenyan" },
    { value: "wgsl", name: "WGSL" },
    { value: "wikitext", name: "Wikitext" },
    { value: "wit", name: "WebAssembly Interface Types" },
    { value: "wolfram", name: "Wolfram" },
    { value: "xml", name: "XML" },
    { value: "xsl", name: "XSL" },
    { value: "yaml", name: "YAML" },
    { value: "zenscript", name: "ZenScript" },
    { value: "zig", name: "Zig" },
  ],
};
