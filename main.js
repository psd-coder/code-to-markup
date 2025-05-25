const input = document.getElementById('input');
const output = document.getElementById('output');
const highlighterSelect = document.getElementById('highlighter');
const themeSelect = document.getElementById('theme');
const languageSelect = document.getElementById('language');
const hljsTheme = document.getElementById('hljs-theme');
const prismTheme = document.getElementById('prism-theme');
const cssInstruction = document.getElementById('css-instruction');
const highlighterInstructionTitle = document.getElementById('highlighter-instruction-title');
const cssSizeElement = document.getElementById('css-size');

let currentHTML = '';

const hljsThemes = {
    'atom-one-dark': 'atom-one-dark',
    'github-dark': 'github-dark',
    'monokai': 'monokai',
    'dracula': 'dracula',
    'vs2015': 'vs2015',
    'nord': 'nord',
    'solarized-dark': 'solarized-dark',
    'tokyo-night': 'tokyo-night-dark'
};

const prismThemes = {
    'atom-one-dark': 'prism-atom-dark',
    'github-dark': 'prism-ghcolors',
    'monokai': 'prism-okaidia',
    'dracula': 'prism-dracula',
    'vs2015': 'prism-vs',
    'nord': 'prism-nord',
    'solarized-dark': 'prism-solarized-dark-atom',
    'tokyo-night': 'prism-material-dark'
};

function updateThemeOptions() {
    const highlighter = highlighterSelect.value;
    const currentTheme = themeSelect.value;
    
    themeSelect.innerHTML = '';
    
    const themes = highlighter === 'highlight' ? hljsThemes : prismThemes;
    Object.keys(themes).forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = key.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        themeSelect.appendChild(option);
    });
    
    if (themes[currentTheme]) {
        themeSelect.value = currentTheme;
    }
    
    updateTheme();
    updateInstructions();
}

function updateTheme() {
    const highlighter = highlighterSelect.value;
    const theme = themeSelect.value;
    
    if (highlighter === 'highlight') {
        hljsTheme.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${hljsThemes[theme]}.min.css`;
    } else {
        prismTheme.href = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${prismThemes[theme]}.min.css`;
    }
}

function updateInstructions() {
    const highlighter = highlighterSelect.value;
    const theme = themeSelect.value;
    
    let cssUrl;
    if (highlighter === 'highlight') {
        highlighterInstructionTitle.textContent = 'For Highlight.js:';
        cssUrl = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${hljsThemes[theme]}.min.css`;
    } else {
        highlighterInstructionTitle.textContent = 'For Prism.js:';
        cssUrl = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${prismThemes[theme]}.min.css`;
    }
    
    cssInstruction.textContent = `<link rel="stylesheet" href="${cssUrl}">`;
    
    // Get CSS file size
    getCSSFileSize(cssUrl);
}

async function getCSSFileSize(url) {
    try {
        cssSizeElement.textContent = 'Loading...';
        
        // Use a CORS proxy for fetching external CSS files
        const corsProxy = 'https://api.allorigins.win/raw?url=';
        const proxyUrl = corsProxy + encodeURIComponent(url);
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const cssText = await response.text();
        const sizeInBytes = new Blob([cssText]).size;
        const sizeInKB = (sizeInBytes / 1024).toFixed(1);
        cssSizeElement.textContent = `${sizeInKB} KB`;
    } catch (error) {
        console.error('Error fetching CSS size:', error);
        // Fallback: estimate size based on typical CSS file sizes
        const estimatedSizes = {
            'atom-one-dark': '2.1',
            'github-dark': '1.9',
            'monokai': '1.8',
            'dracula': '2.0',
            'vs2015': '2.2',
            'nord': '1.7',
            'solarized-dark': '2.0',
            'tokyo-night': '2.3'
        };
        
        const theme = themeSelect.value;
        const estimatedSize = estimatedSizes[theme] || '2.0';
        cssSizeElement.textContent = `~${estimatedSize} KB`;
    }
}

async function getThemeCSS() {
    const highlighter = highlighterSelect.value;
    const theme = themeSelect.value;
    
    try {
        let url;
        if (highlighter === 'highlight') {
            url = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${hljsThemes[theme]}.min.css`;
        } else {
            url = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/${prismThemes[theme]}.min.css`;
        }
        
        const response = await fetch(url);
        return await response.text();
    } catch (error) {
        console.error('Error fetching theme CSS:', error);
        return '';
    }
}

async function convertCode() {
    const code = input.value;
    const highlighter = highlighterSelect.value;
    const language = languageSelect.value;
    
    if (!code.trim()) {
        output.innerHTML = '';
        currentHTML = '';
        return;
    }

    let highlightedHTML = '';
    
    if (highlighter === 'highlight') {
        try {
            const highlighted = hljs.highlight(code, { language: language });
            highlightedHTML = `<pre><code class="hljs language-${language}">${highlighted.value}</code></pre>`;
        } catch (e) {
            const highlighted = hljs.highlightAuto(code);
            highlightedHTML = `<pre><code class="hljs">${highlighted.value}</code></pre>`;
        }
    } else {
        try {
            const tempDiv = document.createElement('div');
            const preElement = document.createElement('pre');
            const codeElement = document.createElement('code');
            
            codeElement.className = `language-${language}`;
            codeElement.textContent = code;
            preElement.appendChild(codeElement);
            tempDiv.appendChild(preElement);
            
            Prism.highlightElement(codeElement);
            highlightedHTML = tempDiv.innerHTML;
        } catch (e) {
            highlightedHTML = `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
        }
    }
    
    // Display the highlighted code in the preview
    output.innerHTML = highlightedHTML;
    
    // Store the complete HTML with CSS for copying
    const themeCSS = await getThemeCSS();
    currentHTML = `<style>
${themeCSS}
</style>
${highlightedHTML}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function copyToClipboard() {
    if (!currentHTML) return;
    
    navigator.clipboard.writeText(currentHTML).then(() => {
        const btn = document.querySelector('.floating-copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#22c55e';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = currentHTML;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const btn = document.querySelector('.floating-copy-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#22c55e';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    });
}

// Event listeners
input.addEventListener('input', convertCode);
highlighterSelect.addEventListener('change', () => {
    updateThemeOptions();
    convertCode();
});
themeSelect.addEventListener('change', () => {
    updateTheme();
    updateInstructions();
    convertCode();
});
languageSelect.addEventListener('change', convertCode);

// Initialize
updateThemeOptions();

// Add sample code
input.value = `function createAwesomeApp() {
    const features = ['dark theme', 'syntax highlighting', 'copy to clipboard'];
    
    return {
        name: 'Code to HTML Converter',
        features,
        isAwesome: true,
        launch: () => console.log('🚀 App launched successfully!')
    };
}

const app = createAwesomeApp();
app.launch();`;

convertCode();
