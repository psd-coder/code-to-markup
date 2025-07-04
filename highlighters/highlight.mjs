export default {
  baseUrl: "https://cdn.jsdelivr.net/npm/highlight.js@11.11.1",
  highlightInstance: null,
  async setup({ loadModule }) {
    this.highlightInstance = await loadModule(`${this.baseUrl}/+esm`).then(
      (m) => m.default
    );
  },
  async loadTheme(theme) {
    const url = `${this.baseUrl}/styles/${theme}.min.css`;

    return fetch(url)
      .then(async (res) => ({
        styles: await res.text(),
        size: res.headers.get("Content-Length"),
      }))
      .then(({ styles, size }) => ({ isCss: true, url, styles, size }));
  },
  async loadLanguage(language, { loadModule }) {
    return loadModule(`${this.baseUrl}/es/languages/${language}.js`).then(
      (m) => {
        this.highlightInstance.registerLanguage(language, m.default);
      }
    );
  },
  async highlight({ code, language }) {
    const highlighted = this.highlightInstance.highlight(code, {
      language,
    }).value;

    return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
  },
  defaultTheme: "night-owl",
  themes: [
    { value: "a11y-dark", name: "A11y Dark" },
    { value: "a11y-light", name: "A11y Light" },
    { value: "agate", name: "Agate" },
    { value: "an-old-hope", name: "An Old Hope" },
    { value: "androidstudio", name: "Android Studio" },
    { value: "arduino-light", name: "Arduino Light" },
    { value: "atom-one-dark", name: "Atom One Dark" },
    { value: "atom-one-dark-reasonable", name: "Atom One Dark Reasonable" },
    { value: "atom-one-light", name: "Atom One Light" },
    { value: "github", name: "GitHub" },
    { value: "github-dark", name: "GitHub Dark" },
    { value: "github-dark-dimmed", name: "GitHub Dark Dimmed" },
    { value: "gradient-dark", name: "Gradient Dark" },
    { value: "gradient-light", name: "Gradient Light" },
    { value: "monokai", name: "Monokai" },
    { value: "monokai-sublime", name: "Monokai Sublime" },
    { value: "night-owl", name: "Night Owl" },
    { value: "nord", name: "Nord" },
    { value: "obsidian", name: "Obsidian" },
    { value: "rose-pine", name: "Rose Pine" },
    { value: "rose-pine-dawn", name: "Rose Pine Dawn" },
    { value: "rose-pine-moon", name: "Rose Pine Moon" },
    { value: "tokyo-night-dark", name: "Tokyo Night Dark" },
    { value: "tokyo-night-light", name: "Tokyo Night Light" },
    { value: "vs", name: "Visual Studio" },
    { value: "vs2015", name: "VS 2015" },
    { value: "xcode", name: "Xcode" },
    { value: "default", name: "Default" },
    { value: "base16/3024", name: "Base 16 / 3024" },
    { value: "base16/apathy", name: "Base 16 / Apathy" },
    { value: "base16/apprentice", name: "Base 16 / Apprentice" },
    { value: "base16/ashes", name: "Base 16 / Ashes" },
    {
      value: "base16/atelier-cave-light",
      name: "Base 16 / Atelier Cave Light",
    },
    { value: "base16/atelier-cave", name: "Base 16 / Atelier Cave" },
    {
      value: "base16/atelier-dune-light",
      name: "Base 16 / Atelier Dune Light",
    },
    { value: "base16/atelier-dune", name: "Base 16 / Atelier Dune" },
    {
      value: "base16/atelier-estuary-light",
      name: "Base 16 / Atelier Estuary Light",
    },
    { value: "base16/atelier-estuary", name: "Base 16 / Atelier Estuary" },
    {
      value: "base16/atelier-forest-light",
      name: "Base 16 / Atelier Forest Light",
    },
    { value: "base16/atelier-forest", name: "Base 16 / Atelier Forest" },
    {
      value: "base16/atelier-heath-light",
      name: "Base 16 / Atelier Heath Light",
    },
    { value: "base16/atelier-heath", name: "Base 16 / Atelier Heath" },
    {
      value: "base16/atelier-lakeside-light",
      name: "Base 16 / Atelier Lakeside Light",
    },
    { value: "base16/atelier-lakeside", name: "Base 16 / Atelier Lakeside" },
    {
      value: "base16/atelier-plateau-light",
      name: "Base 16 / Atelier Plateau Light",
    },
    { value: "base16/atelier-plateau", name: "Base 16 / Atelier Plateau" },
    {
      value: "base16/atelier-savanna-light",
      name: "Base 16 / Atelier Savanna Light",
    },
    { value: "base16/atelier-savanna", name: "Base 16 / Atelier Savanna" },
    {
      value: "base16/atelier-seaside-light",
      name: "Base 16 / Atelier Seaside Light",
    },
    { value: "base16/atelier-seaside", name: "Base 16 / Atelier Seaside" },
    {
      value: "base16/atelier-sulphurpool-light",
      name: "Base 16 / Atelier Sulphurpool Light",
    },
    {
      value: "base16/atelier-sulphurpool",
      name: "Base 16 / Atelier Sulphurpool",
    },
    { value: "base16/atlas", name: "Base 16 / Atlas" },
    { value: "base16/bespin", name: "Base 16 / Bespin" },
    {
      value: "base16/black-metal-bathory",
      name: "Base 16 / Black Metal Bathory",
    },
    {
      value: "base16/black-metal-burzum",
      name: "Base 16 / Black Metal Burzum",
    },
    {
      value: "base16/black-metal-dark-funeral",
      name: "Base 16 / Black Metal Dark Funeral",
    },
    {
      value: "base16/black-metal-gorgoroth",
      name: "Base 16 / Black Metal Gorgoroth",
    },
    {
      value: "base16/black-metal-immortal",
      name: "Base 16 / Black Metal Immortal",
    },
    {
      value: "base16/black-metal-khold",
      name: "Base 16 / Black Metal Khold",
    },
    {
      value: "base16/black-metal-marduk",
      name: "Base 16 / Black Metal Marduk",
    },
    {
      value: "base16/black-metal-mayhem",
      name: "Base 16 / Black Metal Mayhem",
    },
    { value: "base16/black-metal-nile", name: "Base 16 / Black Metal Nile" },
    {
      value: "base16/black-metal-venom",
      name: "Base 16 / Black Metal Venom",
    },
    { value: "base16/black-metal", name: "Base 16 / Black Metal" },
    { value: "base16/brewer", name: "Base 16 / Brewer" },
    { value: "base16/bright", name: "Base 16 / Bright" },
    { value: "base16/brogrammer", name: "Base 16 / Brogrammer" },
    { value: "base16/brush-trees-dark", name: "Base 16 / Brush Trees Dark" },
    { value: "base16/brush-trees", name: "Base 16 / Brush Trees" },
    { value: "base16/chalk", name: "Base 16 / Chalk" },
    { value: "base16/circus", name: "Base 16 / Circus" },
    { value: "base16/classic-dark", name: "Base 16 / Classic Dark" },
    { value: "base16/classic-light", name: "Base 16 / Classic Light" },
    { value: "base16/codeschool", name: "Base 16 / Codeschool" },
    { value: "base16/colors", name: "Base 16 / Colors" },
    { value: "base16/cupcake", name: "Base 16 / Cupcake" },
    { value: "base16/cupertino", name: "Base 16 / Cupertino" },
    { value: "base16/danqing", name: "Base 16 / Danqing" },
    { value: "base16/darcula", name: "Base 16 / Darcula" },
    { value: "base16/dark-violet", name: "Base 16 / Dark Violet" },
    { value: "base16/darkmoss", name: "Base 16 / Darkmoss" },
    { value: "base16/darktooth", name: "Base 16 / Darktooth" },
    { value: "base16/decaf", name: "Base 16 / Decaf" },
    { value: "base16/default-dark", name: "Base 16 / Default Dark" },
    { value: "base16/default-light", name: "Base 16 / Default Light" },
    { value: "base16/dirtysea", name: "Base 16 / Dirtysea" },
    { value: "base16/dracula", name: "Base 16 / Dracula" },
    { value: "base16/edge-dark", name: "Base 16 / Edge Dark" },
    { value: "base16/edge-light", name: "Base 16 / Edge Light" },
    { value: "base16/eighties", name: "Base 16 / Eighties" },
    { value: "base16/embers", name: "Base 16 / Embers" },
    { value: "base16/equilibrium-dark", name: "Base 16 / Equilibrium Dark" },
    {
      value: "base16/equilibrium-gray-dark",
      name: "Base 16 / Equilibrium Gray Dark",
    },
    {
      value: "base16/equilibrium-gray-light",
      name: "Base 16 / Equilibrium Gray Light",
    },
    {
      value: "base16/equilibrium-light",
      name: "Base 16 / Equilibrium Light",
    },
    { value: "base16/espresso", name: "Base 16 / Espresso" },
    { value: "base16/eva-dim", name: "Base 16 / Eva Dim" },
    { value: "base16/eva", name: "Base 16 / Eva" },
    { value: "base16/flat", name: "Base 16 / Flat" },
    { value: "base16/framer", name: "Base 16 / Framer" },
    { value: "base16/fruit-soda", name: "Base 16 / Fruit Soda" },
    { value: "base16/gigavolt", name: "Base 16 / Gigavolt" },
    { value: "base16/github", name: "Base 16 / GitHub" },
    { value: "base16/google-dark", name: "Base 16 / Google Dark" },
    { value: "base16/google-light", name: "Base 16 / Google Light" },
    { value: "base16/grayscale-dark", name: "Base 16 / Grayscale Dark" },
    { value: "base16/grayscale-light", name: "Base 16 / Grayscale Light" },
    { value: "base16/green-screen", name: "Base 16 / Green Screen" },
    {
      value: "base16/gruvbox-dark-hard",
      name: "Base 16 / Gruvbox Dark Hard",
    },
    {
      value: "base16/gruvbox-dark-medium",
      name: "Base 16 / Gruvbox Dark Medium",
    },
    {
      value: "base16/gruvbox-dark-pale",
      name: "Base 16 / Gruvbox Dark Pale",
    },
    {
      value: "base16/gruvbox-dark-soft",
      name: "Base 16 / Gruvbox Dark Soft",
    },
    {
      value: "base16/gruvbox-light-hard",
      name: "Base 16 / Gruvbox Light Hard",
    },
    {
      value: "base16/gruvbox-light-medium",
      name: "Base 16 / Gruvbox Light Medium",
    },
    {
      value: "base16/gruvbox-light-soft",
      name: "Base 16 / Gruvbox Light Soft",
    },
    { value: "base16/hardcore", name: "Base 16 / Hardcore" },
    { value: "base16/harmonic16-dark", name: "Base 16 / Harmonic16 Dark" },
    { value: "base16/harmonic16-light", name: "Base 16 / Harmonic16 Light" },
    { value: "base16/heetch-dark", name: "Base 16 / Heetch Dark" },
    { value: "base16/heetch-light", name: "Base 16 / Heetch Light" },
    { value: "base16/helios", name: "Base 16 / Helios" },
    { value: "base16/hopscotch", name: "Base 16 / Hopscotch" },
    { value: "base16/horizon-dark", name: "Base 16 / Horizon Dark" },
    { value: "base16/horizon-light", name: "Base 16 / Horizon Light" },
    { value: "base16/humanoid-dark", name: "Base 16 / Humanoid Dark" },
    { value: "base16/humanoid-light", name: "Base 16 / Humanoid Light" },
    { value: "base16/ia-dark", name: "Base 16 / IA Dark" },
    { value: "base16/ia-light", name: "Base 16 / IA Light" },
    { value: "base16/icy-dark", name: "Base 16 / Icy Dark" },
    { value: "base16/ir-black", name: "Base 16 / IR Black" },
    { value: "base16/isotope", name: "Base 16 / Isotope" },
    { value: "base16/kimber", name: "Base 16 / Kimber" },
    { value: "base16/london-tube", name: "Base 16 / London Tube" },
    { value: "base16/macintosh", name: "Base 16 / Macintosh" },
    { value: "base16/marrakesh", name: "Base 16 / Marrakesh" },
    { value: "base16/materia", name: "Base 16 / Materia" },
    { value: "base16/material-darker", name: "Base 16 / Material Darker" },
    { value: "base16/material-lighter", name: "Base 16 / Material Lighter" },
    {
      value: "base16/material-palenight",
      name: "Base 16 / Material Palenight",
    },
    { value: "base16/material-vivid", name: "Base 16 / Material Vivid" },
    { value: "base16/material", name: "Base 16 / Material" },
    { value: "base16/mellow-purple", name: "Base 16 / Mellow Purple" },
    { value: "base16/mexico-light", name: "Base 16 / Mexico Light" },
    { value: "base16/mocha", name: "Base 16 / Mocha" },
    { value: "base16/monokai", name: "Base 16 / Monokai" },
    { value: "base16/nebula", name: "Base 16 / Nebula" },
    { value: "base16/nord", name: "Base 16 / Nord" },
    { value: "base16/nova", name: "Base 16 / Nova" },
    { value: "base16/ocean", name: "Base 16 / Ocean" },
    { value: "base16/oceanicnext", name: "Base 16 / Oceanic Next" },
    { value: "base16/one-light", name: "Base 16 / One Light" },
    { value: "base16/onedark", name: "Base 16 / One Dark" },
    { value: "base16/outrun-dark", name: "Base 16 / Outrun Dark" },
    { value: "base16/papercolor-dark", name: "Base 16 / PaperColor Dark" },
    { value: "base16/papercolor-light", name: "Base 16 / PaperColor Light" },
    { value: "base16/paraiso", name: "Base 16 / Paraiso" },
    { value: "base16/pasque", name: "Base 16 / Pasque" },
    { value: "base16/phd", name: "Base 16 / PhD" },
    { value: "base16/pico", name: "Base 16 / Pico" },
    { value: "base16/pop", name: "Base 16 / Pop" },
    { value: "base16/porple", name: "Base 16 / Porple" },
    { value: "base16/qualia", name: "Base 16 / Qualia" },
    { value: "base16/railscasts", name: "Base 16 / Railscasts" },
    { value: "base16/rebecca", name: "Base 16 / Rebecca" },
    { value: "base16/ros-pine-dawn", name: "Base 16 / Rosé Pine Dawn" },
    { value: "base16/ros-pine-moon", name: "Base 16 / Rosé Pine Moon" },
    { value: "base16/ros-pine", name: "Base 16 / Rosé Pine" },
    { value: "base16/sagelight", name: "Base 16 / Sagelight" },
    { value: "base16/sandcastle", name: "Base 16 / Sandcastle" },
    { value: "base16/seti-ui", name: "Base 16 / Seti UI" },
    { value: "base16/shapeshifter", name: "Base 16 / Shapeshifter" },
    { value: "base16/silk-dark", name: "Base 16 / Silk Dark" },
    { value: "base16/silk-light", name: "Base 16 / Silk Light" },
    { value: "base16/snazzy", name: "Base 16 / Snazzy" },
    {
      value: "base16/solar-flare-light",
      name: "Base 16 / Solar Flare Light",
    },
    { value: "base16/solar-flare", name: "Base 16 / Solar Flare" },
    { value: "base16/solarized-dark", name: "Base 16 / Solarized Dark" },
    { value: "base16/solarized-light", name: "Base 16 / Solarized Light" },
    { value: "base16/spacemacs", name: "Base 16 / Spacemacs" },
    { value: "base16/summercamp", name: "Base 16 / Summercamp" },
    { value: "base16/summerfruit-dark", name: "Base 16 / Summerfruit Dark" },
    {
      value: "base16/summerfruit-light",
      name: "Base 16 / Summerfruit Light",
    },
    {
      value: "base16/synth-midnight-terminal-dark",
      name: "Base 16 / Synth Midnight Dark",
    },
    {
      value: "base16/synth-midnight-terminal-light",
      name: "Base 16 / Synth Midnight Light",
    },
    { value: "base16/tango", name: "Base 16 / Tango" },
    { value: "base16/tender", name: "Base 16 / Tender" },
    { value: "base16/tomorrow-night", name: "Base 16 / Tomorrow Night" },
    { value: "base16/tomorrow", name: "Base 16 / Tomorrow" },
    { value: "base16/twilight", name: "Base 16 / Twilight" },
    { value: "base16/unikitty-dark", name: "Base 16 / Unikitty Dark" },
    { value: "base16/unikitty-light", name: "Base 16 / Unikitty Light" },
    { value: "base16/vulcan", name: "Base 16 / Vulcan" },
    { value: "base16/windows-10-light", name: "Base 16 / Windows 10 Light" },
    { value: "base16/windows-10", name: "Base 16 / Windows 10" },
    { value: "base16/windows-95-light", name: "Base 16 / Windows 95 Light" },
    { value: "base16/windows-95", name: "Base 16 / Windows 95" },
    {
      value: "base16/windows-high-contrast-light",
      name: "Base 16 / Windows HC Light",
    },
    { value: "base16/windows-high-contrast", name: "Base 16 / Windows HC" },
    { value: "base16/windows-nt-light", name: "Base 16 / Windows NT Light" },
    { value: "base16/windows-nt", name: "Base 16 / Windows NT" },
    { value: "base16/woodland", name: "Base 16 / Woodland" },
    { value: "base16/xcode-dusk", name: "Base 16 / Xcode Dusk" },
    { value: "base16/zenburn", name: "Base 16 / Zenburn" },
  ],
  languages: [
    { value: "1c", name: "1C" },
    { value: "abnf", name: "ABNF" },
    { value: "accesslog", name: "Access Log" },
    { value: "actionscript", name: "ActionScript" },
    { value: "ada", name: "Ada" },
    { value: "angelscript", name: "AngelScript" },
    { value: "apache", name: "Apache" },
    { value: "applescript", name: "AppleScript" },
    { value: "arcade", name: "Arcade" },
    { value: "arduino", name: "Arduino" },
    { value: "armasm", name: "ARM Assembly" },
    { value: "asciidoc", name: "AsciiDoc" },
    { value: "aspectj", name: "AspectJ" },
    { value: "autohotkey", name: "AutoHotkey" },
    { value: "autoit", name: "AutoIt" },
    { value: "avrasm", name: "AVR Assembly" },
    { value: "awk", name: "Awk" },
    { value: "axapta", name: "Axapta" },
    { value: "bash", name: "Bash" },
    { value: "basic", name: "Basic" },
    { value: "bnf", name: "BNF" },
    { value: "brainfuck", name: "Brainfuck" },
    { value: "c", name: "C" },
    { value: "cal", name: "C/AL" },
    { value: "capnproto", name: "Cap'n Proto" },
    { value: "ceylon", name: "Ceylon" },
    { value: "clean", name: "Clean" },
    { value: "clojure", name: "Clojure" },
    { value: "clojure-repl", name: "Clojure REPL" },
    { value: "cmake", name: "CMake" },
    { value: "coffeescript", name: "CoffeeScript" },
    { value: "coq", name: "Coq" },
    { value: "cos", name: "Caché Object Script" },
    { value: "cpp", name: "C++" },
    { value: "crmsh", name: "crmsh" },
    { value: "crystal", name: "Crystal" },
    { value: "csharp", name: "C#" },
    { value: "csp", name: "CSP" },
    { value: "css", name: "CSS" },
    { value: "d", name: "D" },
    { value: "dart", name: "Dart" },
    { value: "delphi", name: "Delphi" },
    { value: "diff", name: "Diff" },
    { value: "django", name: "Django" },
    { value: "dns", name: "DNS Zone" },
    { value: "dockerfile", name: "Dockerfile" },
    { value: "dos", name: "DOS" },
    { value: "dsconfig", name: "DSConfig" },
    { value: "dts", name: "Device Tree" },
    { value: "dust", name: "Dust" },
    { value: "ebnf", name: "EBNF" },
    { value: "elixir", name: "Elixir" },
    { value: "elm", name: "Elm" },
    { value: "erb", name: "ERB" },
    { value: "erlang", name: "Erlang" },
    { value: "erlang-repl", name: "Erlang REPL" },
    { value: "excel", name: "Excel" },
    { value: "fix", name: "FIX" },
    { value: "flix", name: "Flix" },
    { value: "fortran", name: "Fortran" },
    { value: "fsharp", name: "F#" },
    { value: "gams", name: "GAMS" },
    { value: "gauss", name: "GAUSS" },
    { value: "gcode", name: "G-code" },
    { value: "gherkin", name: "Gherkin" },
    { value: "glsl", name: "GLSL" },
    { value: "gml", name: "GML" },
    { value: "go", name: "Go" },
    { value: "golo", name: "Golo" },
    { value: "gradle", name: "Gradle" },
    { value: "graphql", name: "GraphQL" },
    { value: "groovy", name: "Groovy" },
    { value: "haml", name: "HAML" },
    { value: "handlebars", name: "Handlebars" },
    { value: "haskell", name: "Haskell" },
    { value: "haxe", name: "Haxe" },
    { value: "hsp", name: "HSP" },
    { value: "http", name: "HTTP" },
    { value: "hy", name: "Hy" },
    { value: "xml", name: "HTML" },
    { value: "inform7", name: "Inform 7" },
    { value: "ini", name: "INI" },
    { value: "irpf90", name: "IRPF90" },
    { value: "isbl", name: "ISBL" },
    { value: "java", name: "Java" },
    { value: "javascript", name: "JavaScript" },
    { value: "jboss-cli", name: "JBoss CLI" },
    { value: "json", name: "JSON" },
    { value: "julia", name: "Julia" },
    { value: "julia-repl", name: "Julia REPL" },
    { value: "kotlin", name: "Kotlin" },
    { value: "lasso", name: "Lasso" },
    { value: "latex", name: "LaTeX" },
    { value: "ldif", name: "LDIF" },
    { value: "leaf", name: "Leaf" },
    { value: "less", name: "Less" },
    { value: "lisp", name: "Lisp" },
    { value: "livecodeserver", name: "LiveCode Server" },
    { value: "livescript", name: "LiveScript" },
    { value: "llvm", name: "LLVM IR" },
    { value: "lsl", name: "LSL" },
    { value: "lua", name: "Lua" },
    { value: "makefile", name: "Makefile" },
    { value: "markdown", name: "Markdown" },
    { value: "mathematica", name: "Mathematica" },
    { value: "matlab", name: "MATLAB" },
    { value: "maxima", name: "Maxima" },
    { value: "mel", name: "MEL" },
    { value: "mercury", name: "Mercury" },
    { value: "mipsasm", name: "MIPS Assembly" },
    { value: "mizar", name: "Mizar" },
    { value: "mojolicious", name: "Mojolicious" },
    { value: "monkey", name: "Monkey" },
    { value: "moonscript", name: "MoonScript" },
    { value: "n1ql", name: "N1QL" },
    { value: "nestedtext", name: "NestedText" },
    { value: "nginx", name: "Nginx" },
    { value: "nim", name: "Nim" },
    { value: "nix", name: "Nix" },
    { value: "node-repl", name: "Node REPL" },
    { value: "nsis", name: "NSIS" },
    { value: "objectivec", name: "Objective-C" },
    { value: "ocaml", name: "OCaml" },
    { value: "openscad", name: "OpenSCAD" },
    { value: "oxygene", name: "Oxygene" },
    { value: "parser3", name: "Parser3" },
    { value: "perl", name: "Perl" },
    { value: "pf", name: "pf" },
    { value: "pgsql", name: "PostgreSQL" },
    { value: "php", name: "PHP" },
    { value: "php-template", name: "PHP Template" },
    { value: "plaintext", name: "Plain Text" },
    { value: "pony", name: "Pony" },
    { value: "powershell", name: "PowerShell" },
    { value: "processing", name: "Processing" },
    { value: "profile", name: "Profile" },
    { value: "prolog", name: "Prolog" },
    { value: "properties", name: "Properties" },
    { value: "protobuf", name: "Protocol Buffers" },
    { value: "puppet", name: "Puppet" },
    { value: "purebasic", name: "PureBasic" },
    { value: "python", name: "Python" },
    { value: "python-repl", name: "Python REPL" },
    { value: "q", name: "Q" },
    { value: "qml", name: "QML" },
    { value: "r", name: "R" },
    { value: "reasonml", name: "ReasonML" },
    { value: "rib", name: "RenderMan RIB" },
    { value: "roboconf", name: "Roboconf" },
    { value: "routeros", name: "RouterOS" },
    { value: "rsl", name: "RSL" },
    { value: "ruby", name: "Ruby" },
    { value: "ruleslanguage", name: "Rules Language" },
    { value: "rust", name: "Rust" },
    { value: "sas", name: "SAS" },
    { value: "scala", name: "Scala" },
    { value: "scheme", name: "Scheme" },
    { value: "scilab", name: "Scilab" },
    { value: "scss", name: "SCSS" },
    { value: "shell", name: "Shell" },
    { value: "smali", name: "Smali" },
    { value: "smalltalk", name: "Smalltalk" },
    { value: "sml", name: "SML" },
    { value: "sqf", name: "SQF" },
    { value: "sql", name: "SQL" },
    { value: "stan", name: "Stan" },
    { value: "stata", name: "Stata" },
    { value: "step21", name: "STEP Part 21" },
    { value: "stylus", name: "Stylus" },
    { value: "subunit", name: "SubUnit" },
    { value: "swift", name: "Swift" },
    { value: "taggerscript", name: "Tagger Script" },
    { value: "tap", name: "TAP" },
    { value: "tcl", name: "Tcl" },
    { value: "thrift", name: "Thrift" },
    { value: "tp", name: "TP" },
    { value: "twig", name: "Twig" },
    { value: "typescript", name: "TypeScript" },
    { value: "vala", name: "Vala" },
    { value: "vbnet", name: "VB.NET" },
    { value: "vbscript", name: "VBScript" },
    { value: "vbscript-html", name: "VBScript in HTML" },
    { value: "verilog", name: "Verilog" },
    { value: "vhdl", name: "VHDL" },
    { value: "vim", name: "Vim Script" },
    { value: "wasm", name: "WebAssembly" },
    { value: "wren", name: "Wren" },
    { value: "x86asm", name: "x86 Assembly" },
    { value: "xl", name: "XL" },
    { value: "xml", name: "XML" },
    { value: "xquery", name: "XQuery" },
    { value: "yaml", name: "YAML" },
    { value: "zephir", name: "Zephir" },
  ],
};
