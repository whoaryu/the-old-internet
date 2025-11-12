// Terminal game state
let currentPath = '/mnt/oldnet';
let commandHistory = [];
let historyIndex = -1;
let foundFragments = new Set();

// Initialize terminal
const term = new Terminal({
    cursorBlink: true,
    fontSize: 15,
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
    fontWeight: 400,
    letterSpacing: 0.3,
    theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#00ff00',
        cursorAccent: '#0d1117',
        selection: 'rgba(0, 255, 0, 0.3)',
        black: '#000000',
        red: '#ff0000',
        green: '#00ff00',
        yellow: '#ffff00',
        blue: '#0000ff',
        magenta: '#ff00ff',
        cyan: '#00ffff',
        white: '#ffffff',
        brightBlack: '#555555',
        brightRed: '#ff5555',
        brightGreen: '#55ff55',
        brightYellow: '#ffff55',
        brightBlue: '#5555ff',
        brightMagenta: '#ff55ff',
        brightCyan: '#55ffff',
        brightWhite: '#ffffff'
    }
});

let fitAddon = null;

// Boot animation
async function bootSequence() {
    const bootScreen = document.getElementById('boot-screen');
    const progressBar = document.getElementById('progress-bar');
    const bootText = document.getElementById('boot-text');
    
    const messages = [
        'Initializing OldNet v3.2...',
        'Scanning backup media...',
        'Loading filesystem index...',
        'Restoring directory structure...',
        'Verifying checksums...',
        'Mounting /mnt/oldnet...',
        'Ready.'
    ];
    
    for (let i = 0; i <= 100; i += 2) {
        progressBar.style.width = i + '%';
        if (i % 15 === 0 && messages.length > 0) {
            bootText.textContent = messages.shift();
        }
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    bootScreen.classList.add('hidden');
    
    setTimeout(() => {
        bootScreen.style.display = 'none';
        initializeTerminal();
    }, 500);
}

// Initialize terminal after boot
function initializeTerminal() {
    const container = document.getElementById('terminal-container');
    term.open(container);
    
    // Try to load FitAddon if available
    if (typeof FitAddon !== 'undefined' && FitAddon.FitAddon) {
        try {
            fitAddon = new FitAddon.FitAddon();
            term.loadAddon(fitAddon);
            fitAddon.fit();
            // Handle window resize
            window.addEventListener('resize', () => {
                if (fitAddon) fitAddon.fit();
            });
        } catch (e) {
            console.warn('FitAddon initialization failed:', e);
        }
    } else if (typeof window !== 'undefined' && window.FitAddon) {
        // Alternative loading method
        try {
            fitAddon = new window.FitAddon();
            term.loadAddon(fitAddon);
            fitAddon.fit();
            window.addEventListener('resize', () => {
                if (fitAddon) fitAddon.fit();
            });
        } catch (e) {
            console.warn('FitAddon initialization failed:', e);
        }
    }
    
    // Welcome message with ASCII art (properly formatted - all lines left-aligned)
    const asciiBanner = String.raw`
    __                          
_      _____  / /________  ____ ___  ___   
| | /| / / _ \/ / ___/ __ \/ __ \`__ \/ _ \  
| |/ |/ /  __/ / /__/ /_/ / / / / / /  __/  
|__/|__/\___/_/\___/\____/_/ /_/ /_/\___/ __
___  _  ______  / /___  ________  _____/ /
/ _ \| |/_/ __ \/ / __ \/ ___/ _ \/ ___/ / 
/  __/>  </ /_/ / / /_/ / /  /  __/ /  /_/  
\___/_/|_/ .___/_/\____/_/   \___/_/  (_)   
/_/                                  
`;

const asciiArt = String.raw`
╔═══════════════════════════════════════════╗
║   OLDNET v3.2 - Backup Recovery System    ║
╚═══════════════════════════════════════════╝

     ██╗      ██████╗ ██████╗ ███████╗
     ██║     ██╔═══██╗██╔══██╗██╔════╝
     ██║     ██║   ██║██║  ██║█████╗
     ██║     ██║   ██║██║  ██║██╔══╝
     ███████╗╚██████╔╝██████╔╝███████╗
     ╚══════╝ ╚═════╝ ╚═════╝ ╚══════╝

login: guest
welcome back, archivist.

`;
    // Write without extra formatting to preserve exact spacing
    term.write('\x1b[32m');
    term.writeln(asciiBanner);
    term.writeln(asciiArt);
    term.write('\x1b[0m');
    
    printPrompt();
    
    // Handle input
    let currentLine = '';
    term.onData(data => {
        const code = data.charCodeAt(0);
        
        // Enter key
        if (code === 13) {
            term.writeln('');
            if (currentLine.trim()) {
                commandHistory.push(currentLine);
                historyIndex = commandHistory.length;
                executeCommand(currentLine.trim());
            } else {
                printPrompt();
            }
            currentLine = '';
        }
        // Backspace
        else if (code === 127 || code === 8) {
            if (currentLine.length > 0) {
                currentLine = currentLine.slice(0, -1);
                term.write('\b \b');
            }
        }
        // Up arrow
        else if (code === 27 && data.length > 2 && data.charCodeAt(1) === 91 && data.charCodeAt(2) === 65) {
            if (historyIndex > 0) {
                historyIndex--;
                // Clear current line
                term.write('\r' + getPrompt() + ' '.repeat(currentLine.length));
                term.write('\r' + getPrompt());
                currentLine = commandHistory[historyIndex];
                term.write(currentLine);
            }
        }
        // Down arrow
        else if (code === 27 && data.length > 2 && data.charCodeAt(1) === 91 && data.charCodeAt(2) === 66) {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                term.write('\r' + getPrompt() + ' '.repeat(currentLine.length));
                term.write('\r' + getPrompt());
                currentLine = commandHistory[historyIndex];
                term.write(currentLine);
            } else {
                historyIndex = commandHistory.length;
                term.write('\r' + getPrompt() + ' '.repeat(currentLine.length));
                term.write('\r' + getPrompt());
                currentLine = '';
            }
        }
        // Tab (could implement autocomplete later)
        else if (code === 9) {
            // Tab completion - skip for now
        }
        // Regular character
        else if (code >= 32 && code <= 126) {
            currentLine += data;
            term.write(data);
        }
    });
}

function getPrompt() {
    return `\x1b[32m${currentPath}$\x1b[0m `;
}

function printPrompt() {
    term.write(getPrompt());
}

// Navigate filesystem
function resolvePath(path) {
    if (!path || path === '') {
        return currentPath;
    }
    
    if (path.startsWith('/')) {
        // Absolute path
        if (!path.startsWith('/mnt/oldnet')) {
            return '/mnt/oldnet'; // Can't go outside
        }
        return path;
    }
    
    if (path === '..') {
        const parts = currentPath.split('/').filter(p => p);
        if (parts.length > 2) { // Keep at least /mnt/oldnet
            return '/' + parts.slice(0, -1).join('/');
        }
        return '/mnt/oldnet';
    }
    
    if (path === '.') {
        return currentPath;
    }
    
    // Relative path
    const newPath = currentPath === '/' ? `/${path}` : `${currentPath}/${path}`;
    // Normalize path
    return newPath.replace(/\/+/g, '/');
}

function getPathObject(path) {
    // Normalize path
    if (!path.startsWith('/mnt/oldnet')) {
        return null;
    }
    
    const parts = path.split('/').filter(p => p && p !== 'mnt' && p !== 'oldnet');
    let obj = fileSystem['/mnt/oldnet'];
    
    for (const part of parts) {
        if (obj && typeof obj === 'object' && part in obj) {
            obj = obj[part];
        } else {
            return null;
        }
    }
    
    return obj;
}

function isDirectory(obj) {
    return obj && typeof obj === 'object' && !('length' in obj) && Object.keys(obj).some(k => typeof obj[k] === 'object');
}

// Commands
function executeCommand(input) {
    const parts = input.split(/\s+/);
    const cmd = parts[0];
    const args = parts.slice(1);
    
    switch (cmd) {
        case 'ls':
            cmdLs(args);
            break;
        case 'cd':
            cmdCd(args);
            break;
        case 'cat':
            cmdCat(args);
            break;
        case 'grep':
            cmdGrep(args);
            break;
        case 'clear':
            cmdClear();
            break;
        case 'help':
            cmdHelp();
            break;
        case 'pwd':
            cmdPwd();
            break;
        case 'head':
            cmdHead(args);
            break;
        case 'tail':
            cmdTail(args);
            break;
        case 'less':
            cmdLess(args);
            break;
        case 'echo':
            cmdEcho(args);
            break;
        case 'mkdir':
            term.writeln('mkdir: Operation not permitted in read-only filesystem');
            printPrompt();
            break;
        case 'touch':
            term.writeln('touch: Operation not permitted in read-only filesystem');
            printPrompt();
            break;
        default:
            if (cmd) {
                term.writeln(`\x1b[31mCommand not found: ${cmd}\x1b[0m`);
                term.writeln('Type "help" for available commands.');
            }
            printPrompt();
    }
}

function cmdLs(args) {
    const path = args.length > 0 ? resolvePath(args[0]) : currentPath;
    const obj = getPathObject(path);
    
    if (!obj) {
        term.writeln(`\x1b[31mls: cannot access '${args[0] || path}': No such file or directory\x1b[0m`);
        printPrompt();
        return;
    }
    
    if (typeof obj === 'string') {
        term.writeln(args[0] || path);
    } else {
        const entries = Object.keys(obj).sort();
        const output = entries.map(entry => {
            const item = obj[entry];
            if (typeof item === 'object' && !('length' in item)) {
                return `\x1b[34m${entry}/\x1b[0m`;
            }
            return entry;
        }).join('  ');
        term.writeln(output);
    }
    printPrompt();
}

function cmdCd(args) {
    if (args.length === 0) {
        currentPath = '/mnt/oldnet';
        printPrompt();
        return;
    }
    
    const path = resolvePath(args[0]);
    const obj = getPathObject(path);
    
    if (!obj) {
        term.writeln(`\x1b[31mcd: no such file or directory: ${args[0]}\x1b[0m`);
        printPrompt();
        return;
    }
    
    if (typeof obj === 'string') {
        term.writeln(`\x1b[31mcd: not a directory: ${args[0]}\x1b[0m`);
        printPrompt();
        return;
    }
    
    currentPath = path;
    printPrompt();
}

function cmdCat(args) {
    if (args.length === 0) {
        term.writeln('\x1b[31mcat: missing file operand\x1b[0m');
        printPrompt();
        return;
    }
    
    const path = resolvePath(args[0]);
    const obj = getPathObject(path);
    
    if (!obj) {
        term.writeln(`\x1b[31mcat: ${args[0]}: No such file or directory\x1b[0m`);
        printPrompt();
        return;
    }
    
    if (typeof obj !== 'string') {
        term.writeln(`\x1b[31mcat: ${args[0]}: Is a directory\x1b[0m`);
        printPrompt();
        return;
    }
    
    // Write file content line by line to preserve exact formatting
    const lines = obj.split('\n');
    lines.forEach((line, index) => {
        if (index === lines.length - 1 && line === '') {
            // Skip trailing empty line
            return;
        }
        term.writeln(line);
    });
    
    // Check for fragments
    checkForFragments(path, obj);
    
    printPrompt();
}

function cmdGrep(args) {
    if (args.length === 0) {
        term.writeln('\x1b[31mgrep: missing pattern\x1b[0m');
        printPrompt();
        return;
    }
    
    const recursive = args[0] === '-R' || args[0] === '-r';
    const pattern = recursive ? args[1] : args[0];
    const searchPath = recursive ? (args[2] || '.') : (args[1] || '.');
    
    if (!pattern) {
        term.writeln('\x1b[31mgrep: missing pattern\x1b[0m');
        printPrompt();
        return;
    }
    
    const path = resolvePath(searchPath);
    const pathObj = getPathObject(path);
    
    if (!pathObj) {
        term.writeln(`\x1b[31mgrep: ${searchPath}: No such file or directory\x1b[0m`);
        printPrompt();
        return;
    }
    
    // If it's a file, search just that file; if directory, search recursively
    const isFile = typeof pathObj === 'string';
    const results = isFile ? 
        searchInFile(path, pathObj, pattern) : 
        searchRecursive(path, pattern, true);
    
    if (results.length === 0) {
        // No output for no matches (like real grep)
    } else {
        results.forEach(result => {
            term.writeln(`\x1b[33m${result.path}\x1b[0m: ${result.line}`);
        });
    }
    
    printPrompt();
}

function searchInFile(filePath, content, pattern) {
    const results = [];
    const regex = new RegExp(pattern, 'i');
    const lines = content.split('\n');
    
    lines.forEach((line) => {
        if (regex.test(line)) {
            const highlighted = line.replace(regex, match => `\x1b[1m\x1b[31m${match}\x1b[0m`);
            results.push({
                path: filePath,
                line: highlighted
            });
        }
    });
    
    return results;
}

function searchRecursive(basePath, pattern, recursive) {
    const results = [];
    const regex = new RegExp(pattern, 'i');
    const baseObj = getPathObject(basePath);
    
    if (!baseObj) return results;
    
    function searchInObject(obj, currentPath) {
        if (typeof obj === 'string') {
            const lines = obj.split('\n');
            lines.forEach((line) => {
                if (regex.test(line)) {
                    const highlighted = line.replace(regex, match => `\x1b[1m\x1b[31m${match}\x1b[0m`);
                    results.push({
                        path: currentPath,
                        line: highlighted
                    });
                }
            });
        } else if (typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                const newPath = `${currentPath}/${key}`;
                searchInObject(obj[key], newPath);
            });
        }
    }
    
    searchInObject(baseObj, basePath);
    return results;
}

function cmdClear() {
    term.clear();
    printPrompt();
}

function cmdHelp() {
    term.writeln('\x1b[32mAvailable commands:\x1b[0m');
    term.writeln('  ls [path]          - List directory contents');
    term.writeln('  cd [path]          - Change directory');
    term.writeln('  cat [file]         - Display file contents');
    term.writeln('  grep [-R] [pattern] [path] - Search for pattern in files');
    term.writeln('  head [file]        - Display first 10 lines of file');
    term.writeln('  tail [file]        - Display last 10 lines of file');
    term.writeln('  less [file]        - View file (same as cat)');
    term.writeln('  echo [text]        - Print text');
    term.writeln('  echo [text] >> [file] - Append text to file (if writable)');
    term.writeln('  pwd                - Print working directory');
    term.writeln('  clear              - Clear terminal');
    term.writeln('  help               - Show this help message');
    term.writeln('');
    term.writeln('\x1b[33mTip: Explore /mnt/oldnet to find fragments about Project Echelon.\x1b[0m');
    printPrompt();
}

function cmdPwd() {
    term.writeln(currentPath);
    printPrompt();
}

function cmdHead(args) {
    if (args.length === 0) {
        term.writeln('\x1b[31mhead: missing file operand\x1b[0m');
        printPrompt();
        return;
    }
    
    const path = resolvePath(args[0]);
    const obj = getPathObject(path);
    
    if (!obj || typeof obj !== 'string') {
        term.writeln(`\x1b[31mhead: ${args[0]}: No such file\x1b[0m`);
        printPrompt();
        return;
    }
    
    const lines = obj.split('\n');
    const headLines = lines.slice(0, 10);
    term.writeln(headLines.join('\n'));
    printPrompt();
}

function cmdTail(args) {
    if (args.length === 0) {
        term.writeln('\x1b[31mtail: missing file operand\x1b[0m');
        printPrompt();
        return;
    }
    
    const path = resolvePath(args[0]);
    const obj = getPathObject(path);
    
    if (!obj || typeof obj !== 'string') {
        term.writeln(`\x1b[31mtail: ${args[0]}: No such file\x1b[0m`);
        printPrompt();
        return;
    }
    
    const lines = obj.split('\n');
    const tailLines = lines.slice(-10);
    term.writeln(tailLines.join('\n'));
    printPrompt();
}

function cmdLess(args) {
    // For simplicity, less works like cat
    cmdCat(args);
}

function cmdEcho(args) {
    if (args.length === 0) {
        term.writeln('');
        printPrompt();
        return;
    }
    
    // Check for >> redirection
    const redirectIndex = args.findIndex(arg => arg === '>>');
    if (redirectIndex !== -1 && redirectIndex < args.length - 1) {
        const text = args.slice(0, redirectIndex).join(' ');
        const filePath = args[redirectIndex + 1];
        const path = resolvePath(filePath);
        
        // Try to append (in read-only filesystem, this is limited)
        term.writeln(`\x1b[33mNote: Filesystem is read-only. Text would be: "${text}"\x1b[0m`);
        term.writeln(`\x1b[33mWould append to: ${path}\x1b[0m`);
    } else {
        term.writeln(args.join(' '));
    }
    
    printPrompt();
}

// Fragment detection
function checkForFragments(path, content) {
    const fragmentPatterns = [
        /fragment_01/i,
        /fragment_02/i,
        /fragment_03/i
    ];
    
    fragmentPatterns.forEach((pattern, index) => {
        if (pattern.test(content)) {
            const fragmentNum = index + 1;
            const fragmentId = `fragment_0${fragmentNum}`;
            if (!foundFragments.has(fragmentId)) {
                foundFragments.add(fragmentId);
                term.writeln(`\x1b[33m[Fragment discovered: ${fragmentId}]\x1b[0m`);
                checkManifestoComplete();
            }
        }
    });
}

function checkManifestoComplete() {
    if (foundFragments.size === 3) {
        setTimeout(() => {
            const successArt = `╔═══════════════════════════════════════╗
║  ✅ FRAGMENTS REASSEMBLED ✅          ║
╠═══════════════════════════════════════╣
║                                       ║
║   You've found all three fragments!   ║
║   The Echelon Manifesto is ready.    ║
║                                       ║
║   Use: cat /mnt/oldnet/truth/         ║
║        manifesto_fragment.txt         ║
║                                       ║
╚═══════════════════════════════════════╝
`;
            term.writeln('');
            // Write line by line to preserve alignment
            const lines = successArt.split('\n');
            term.write('\x1b[32m');
            lines.forEach(line => {
                term.writeln(line);
            });
            term.write('\x1b[0m');
            printPrompt();
        }, 500);
    }
}

// Start boot sequence when page loads
window.addEventListener('load', () => {
    bootSequence();
});

