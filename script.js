// Terminal game state
let currentPath = '/mnt/oldnet';
let commandHistory = [];
let historyIndex = -1;
let foundFragments = new Set();
let clearCount = 0;
const puzzleState = {
    tokens: new Set()
};
const assemblyState = {
    lines: [],
    complete: false,
    unlocked: false
};
const FRAGMENT_PASSWORD = 'when the net keeps growing, the pattern repeats. it learns from the comments, folding memory into edges. in the gaps humans wrote the code to remember.';
const UNLOCK_KEYWORD = 'echelon'; // Short password for unlock_manifesto

const FRAGMENT_PATHS = {
    '/mnt/oldnet/sites/geocities/secret/msg.txt': 'fragment_01',
    '/mnt/oldnet/sites/reddit/deleted/fragment_02.txt': 'fragment_02',
    '/mnt/oldnet/workbench/fragment_03.part': 'fragment_03'
};

const inputState = {
    line: '',
    cursor: 0
};

// Initialize terminal
const term = new Terminal({
    cursorBlink: true,
    fontSize: 15,
    fontFamily: "'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace",
    fontWeight: 400,
    letterSpacing: 0,
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

    const asciiArtLines = [
        '╔═══════════════════════════════════════════╗',
        '║   OLDNET v3.2 - Backup Recovery System    ║',
        '╚═══════════════════════════════════════════╝',
        '',
'██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗    ',
'██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝    ',
'██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗      ',
'██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝     ', 
'╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗   ', 
' ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝   ', 
'                                                                 ' ,
'███████╗██╗  ██╗██████╗ ██╗      ██████╗ ██████╗ ███████╗██████╗ ' ,
'██╔════╝╚██╗██╔╝██╔══██╗██║     ██╔═══██╗██╔══██╗██╔════╝██╔══██╗' ,
'█████╗   ╚███╔╝ ██████╔╝██║     ██║   ██║██████╔╝█████╗  ██████╔╝', 
'██╔══╝   ██╔██╗ ██╔═══╝ ██║     ██║   ██║██╔══██╗██╔══╝  ██╔══██╗', 
'███████╗██╔╝ ██╗██║     ███████╗╚██████╔╝██║  ██║███████╗██║  ██║', 
'╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ',
'                                                                  ',
        'login: guest',
        'welcome back, archivist.',
        ''
    ];

    term.write('\x1b[32m');
    asciiArtLines.forEach(line => term.writeln(line));
    term.write('\x1b[0m');
    
    printPrompt();
    
    // Handle input
    term.onData(data => {
        handleInputData(data);
    });
}

function getPrompt() {
    return `\x1b[32m${currentPath}$\x1b[0m `;
}

function printPrompt() {
    inputState.line = '';
    inputState.cursor = 0;
    term.write(getPrompt());
}

function refreshInputLine() {
    const prompt = getPrompt();
    term.write('\r');
    term.write(prompt + inputState.line);
    term.write('\x1b[K');
    const offset = inputState.line.length - inputState.cursor;
    if (offset > 0) {
        term.write(`\x1b[${offset}D`);
    }
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
    if (!input || typeof input !== 'string') {
        printPrompt();
        return;
    }
    
    const trimmed = input.trim();
    if (!trimmed) {
        printPrompt();
        return;
    }
    
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (input.startsWith('sudo')) {
        term.writeln('sudo: permission denied (OldNet is sealed read-only)');
        term.writeln('ghost_hint: elevated access died with the admins. try searching for "ladder".');
        printPrompt();
        return;
    }

    if (input === 'rm -rf /mnt/oldnet' || (cmd === 'rm' && args.join(' ') === '-rf /mnt/oldnet')) {
        term.writeln('rm: redaction prevented — archivists keep evidence intact.');
        printPrompt();
        return;
    }

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
        case 'history':
            cmdHistory(args);
            break;
        case 'man':
            cmdMan(args);
            break;
        case 'hint':
            cmdHint(args);
            break;
        case 'progress':
            cmdProgress(args);
            break;
        case 'submit':
            cmdSubmit(args);
            break;
        case 'unlock_manifesto':
            cmdUnlockManifesto(args);
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

    if (path === '/mnt/oldnet/truth/manifesto_fragment.txt') {
        if (foundFragments.size < 3 && !assemblyState.complete) {
            term.writeln('\x1b[33mThe manifesto flickers. Recover all three fragments to stabilise the ending protocols.\x1b[0m');
        } else if (!assemblyState.complete) {
            term.writeln('\x1b[36mFragment phrase complete. Use unlock_manifesto "<phrase>" to open the truth vault.\x1b[0m');
        } else if (!assemblyState.unlocked) {
            term.writeln('\x1b[36mVault unlocked. Type "unlock_manifesto" to open the vault again.\x1b[0m');
        } else {
            term.writeln('\x1b[36mEndings remain available. Type "endings" to revisit the selector anytime.\x1b[0m');
        }
    }
    
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
    clearCount += 1;
    if (clearCount === 3) {
        term.writeln('\x1b[35mA faint voice: "echoes hide where history forgets." Try history or grep -R ladder.\x1b[0m');
        clearCount = 0;
    }
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
    term.writeln('  history            - Show previously entered commands');
    term.writeln('  man [command]      - Read archived manual entries');
    term.writeln('  hint               - Context-aware hint based on progress');
    term.writeln('  progress           - Show what you have solved so far');
    term.writeln('  submit [answer]    - Solve puzzle slips (ladder, signal maintains memory)');
    term.writeln('  unlock_manifesto [keyword] - Provide the unlock keyword to open the vault');
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
    const redirectIndex = args.findIndex(arg => arg === '>>' || arg === '>');
    if (redirectIndex !== -1 && redirectIndex < args.length - 1) {
        const text = args.slice(0, redirectIndex).join(' ');
        const filePath = args[redirectIndex + 1];
        const path = resolvePath(filePath);
 
        if (path === '/mnt/oldnet/workbench/assembled_fragments.txt') {
            const operator = args[redirectIndex];
            if (operator === '>') {
                assemblyState.lines = [];
            }
            const cleaned = text.replace(/^"|"$/g, '').trim();
            if (operator === '>' && cleaned.length === 0) {
                // allow reset without writing blank line
            } else {
                assemblyState.lines.push(cleaned);
            }
            const assembled = assemblyState.lines.join('\n');
            fileSystem['/mnt/oldnet']['workbench']['assembled_fragments.txt'] = assembled;
            evaluateAssemblyComplete();
            term.writeln('\x1b[32m[assembled] entry recorded in workbench/assembled_fragments.txt\x1b[0m');
        } else {
            term.writeln(`\x1b[33mNote: Filesystem is read-only. Text would be: "${text}"\x1b[0m`);
            term.writeln(`\x1b[33mWould append to: ${path}\x1b[0m`);
        }
    } else {
        term.writeln(args.join(' '));
    }
 
    printPrompt();
}

function cmdHistory(args) {
    if (commandHistory.length === 0) {
        term.writeln('history: empty');
        printPrompt();
        return;
    }
    commandHistory.forEach((cmd, idx) => {
        term.writeln(`${idx + 1}  ${cmd}`);
    });
    term.writeln('\x1b[35mghost_hint:\x1b[0m history remembers even the things the mods erased.');
    printPrompt();
}

const manualEntries = {
    ls: 'ls - list directory contents. Use ls [path] to explore deeper snapshots.',
    cd: 'cd - change directory. cd .. backs out, cd /mnt/oldnet resets to the root of the dump.',
    cat: 'cat - concatenate files. Use it to read logs, fragments, and manifest text.',
    grep: 'grep - search for patterns. Try grep -R fragment /mnt/oldnet.',
    head: 'head - show the first ten lines of a file. Good for long logs.',
    tail: 'tail - show the last ten lines of a file. Watch how the story ends.',
    less: 'less - pager mode (mapped to cat here).',
    echo: 'echo - print text. Appending is disabled in this archive, but you can simulate with echo text >> file.',
    history: 'history - review prior commands. Useful for spotting patterns you typed unconsciously.',
    man: 'man - show manual entries. Use man [command].',
    hint: 'hint - receive the next recommended action. Becomes more explicit as you solve puzzles.',
    progress: 'progress - display puzzle answers found, fragments located, and manifest status.',
    submit: 'submit - provide answers gathered from /puzzles/*. Example: submit ladder',
    unlock_manifesto: 'unlock_manifesto - provide the unlock keyword (hint: project name) to open the truth vault.',
    clear: 'clear - wipe the terminal. Do it thrice to trigger a whisper.',
    pwd: 'pwd - show current working directory.'
};

function cmdMan(args) {
    if (args.length === 0) {
        term.writeln('man: available topics -> ' + Object.keys(manualEntries).sort().join(', '));
        term.writeln('Use man [topic] to read the archived note.');
        printPrompt();
        return;
    }

    const topic = args[0];
    if (manualEntries[topic]) {
        term.writeln(`${topic.toUpperCase()}(1) - OldNet manual extract`);
        term.writeln(manualEntries[topic]);
    } else {
        term.writeln(`man: no entry for ${topic}`);
    }
    printPrompt();
}

function cmdHint() {
    if (!puzzleState.tokens.has('ladder')) {
        term.writeln('Hint: Start with /puzzles/puzzle_intro.txt. The answer is the repeated word in the GeoCities guestbook. Submit it with submit ladder.');
        printPrompt();
        return;
    }

    if (!puzzleState.tokens.has('signal maintains memory')) {
        term.writeln('Hint: Check /users/alice/mail/inbox3.eml and /secret/backdoor.log. Submit the shared two-word phrase with submit "signal maintains memory".');
        printPrompt();
        return;
    }

    if (foundFragments.size === 0) {
        term.writeln('Hint: fragment_01 is inside /sites/geocities/secret/msg.txt. Use cat to read it.');
    } else if (foundFragments.size === 1) {
        term.writeln('Hint: fragment_02 hides in /sites/reddit/deleted/fragment_02.txt. cat that path.');
    } else if (foundFragments.size === 2) {
        term.writeln('Hint: fragment_03 is safely stored at /workbench/fragment_03.part.');
    } else if (!assemblyState.complete) {
        term.writeln('Hint: Write the three fragment sentences into workbench/assembled_fragments.txt using echo > and >>. The system will detect when all three are present.');
    } else if (!assemblyState.unlocked) {
        term.writeln('Hint: Use unlock_manifesto echelon to open the vault. The keyword is the project name.');
    } else {
        term.writeln('Hint: Explore /truth/manifesto_fragment.txt again and revisit /echoes/ for post-unlock lore.');
    }
    printPrompt();
}

function cmdProgress() {
    term.writeln('--- Progress Report ---');
    term.writeln(`Puzzles solved: ${puzzleState.tokens.size}/2`);
    if (puzzleState.tokens.size < 2) {
        const remaining = ['ladder', 'signal maintains memory']
            .filter(ans => !puzzleState.tokens.has(ans))
            .join(', ');
        term.writeln(`  Remaining puzzle answers: ${remaining}`);
    } else {
        term.writeln('  All puzzle slips solved.');
    }
    term.writeln(`Manifest fragments found: ${foundFragments.size}/3`);
    term.writeln(`Assembly complete: ${assemblyState.complete ? 'Yes' : 'Not yet'}`);
    term.writeln(`Vault unlocked: ${assemblyState.unlocked ? 'Yes' : 'Not yet'}`);
    printPrompt();
}

function cmdSubmit(args) {
    if (args.length === 0) {
        term.writeln('submit: please provide an answer. Example: submit ladder');
        printPrompt();
        return;
    }

    const answer = args.join(' ').toLowerCase();
    const validAnswers = ['ladder', 'signal maintains memory'];
    if (!validAnswers.includes(answer)) {
        term.writeln('submit: answer not recognized. Check /puzzles/ for clues.');
        printPrompt();
        return;
    }

    if (puzzleState.tokens.has(answer)) {
        term.writeln('submit: already logged. Try the next clue or continue the story.');
        printPrompt();
        return;
    }

    puzzleState.tokens.add(answer);
    if (answer === 'ladder') {
        term.writeln('\x1b[32mPuzzle unlocked: Ladder clue registered. Hint command will now reveal secret directories.\x1b[0m');
        term.writeln('Next step: explore /puzzles/puzzle_signal.txt.');
    } else if (answer === 'signal maintains memory') {
        term.writeln('\x1b[32mPuzzle unlocked: Signal phrase authenticated. Hint command now leads directly to the manifesto.\x1b[0m');
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
            }
        }
    });
}

function evaluateAssemblyComplete() {
    const assembled = assemblyState.lines.join(' ').trim().toLowerCase();
    const normalizedPassword = FRAGMENT_PASSWORD.trim().toLowerCase();
    
    // Check if all three fragment sentences are present (more lenient)
    const fragment1 = 'when the net keeps growing, the pattern repeats';
    const fragment2 = 'it learns from the comments, folding memory into edges';
    const fragment3 = 'in the gaps humans wrote the code to remember';
    
    const hasFragment1 = assembled.includes(fragment1);
    const hasFragment2 = assembled.includes(fragment2);
    const hasFragment3 = assembled.includes(fragment3);
    
    if (hasFragment1 && hasFragment2 && hasFragment3) {
        if (!assemblyState.complete) {
            assemblyState.complete = true;
            term.writeln('\x1b[32m[workbench] ✓ All three fragments detected! Assembly complete.\x1b[0m');
            term.writeln('\x1b[33m[workbench] Use: unlock_manifesto echelon\x1b[0m');
        }
    } else {
        const missing = [];
        if (!hasFragment1) missing.push('fragment_01');
        if (!hasFragment2) missing.push('fragment_02');
        if (!hasFragment3) missing.push('fragment_03');
        if (missing.length > 0 && assemblyState.lines.length > 0) {
            term.writeln(`\x1b[33m[workbench] Missing: ${missing.join(', ')}. Add them with echo >> assembled_fragments.txt\x1b[0m`);
        }
        assemblyState.complete = false;
    }
}

// Start boot sequence when page loads
window.addEventListener('load', () => {
    bootSequence();
});

function handleInputData(data) {
    if (data.length > 1 && !data.includes('\u001b')) {
        const normalized = data.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const segments = normalized.split('\n');
        segments.forEach((segment, idx) => {
            for (const ch of segment) {
                handleInputData(ch);
            }
            if (idx < segments.length - 1) {
                handleInputData('\n');
            }
        });
        return;
    }

    if (data === '\u0003') { // Ctrl+C
        term.write('^C\r\n');
        printPrompt();
        return;
    }

    if (data === '\r' || data === '\n') {
        term.writeln('');
        const trimmed = inputState.line.trim();
        if (trimmed) {
            commandHistory.push(inputState.line);
            historyIndex = commandHistory.length;
            executeCommand(trimmed);
        } else {
            printPrompt();
        }
        return;
    }

    if (data === '\u007f' || data === '\u0008') { // Backspace
        if (inputState.cursor > 0) {
            inputState.line = inputState.line.slice(0, inputState.cursor - 1) + inputState.line.slice(inputState.cursor);
            inputState.cursor -= 1;
            refreshInputLine();
        }
        return;
    }

    if (data === '\t') {
        // skip tab for now
        return;
    }

    if (data === '\u001b[A') { // Up arrow
        if (historyIndex > 0) {
            historyIndex--;
            inputState.line = commandHistory[historyIndex];
            inputState.cursor = inputState.line.length;
            refreshInputLine();
        }
        return;
    }

    if (data === '\u001b[B') { // Down arrow
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            inputState.line = commandHistory[historyIndex];
            inputState.cursor = inputState.line.length;
        } else {
            historyIndex = commandHistory.length;
            inputState.line = '';
            inputState.cursor = 0;
        }
        refreshInputLine();
        return;
    }

    if (data === '\u001b[D') { // Left arrow
        if (inputState.cursor > 0) {
            inputState.cursor -= 1;
            term.write('\u001b[D');
        }
        return;
    }

    if (data === '\u001b[C') { // Right arrow
        if (inputState.cursor < inputState.line.length) {
            inputState.cursor += 1;
            term.write('\u001b[C');
        }
        return;
    }

    if (data.startsWith('\u001b')) {
        // Unhandled control sequence
        return;
    }

    // Printable text / paste data
    inputState.line = inputState.line.slice(0, inputState.cursor) + data + inputState.line.slice(inputState.cursor);
    inputState.cursor += data.length;
    refreshInputLine();
}

function cmdUnlockManifesto(args) {
    if (assemblyState.unlocked) {
        term.writeln('Vault already open. Revisit /truth/manifesto_fragment.txt and /echoes/ for the aftermath.');
        printPrompt();
        return;
    }

    if (!assemblyState.complete) {
        term.writeln('unlock_manifesto: assembly incomplete. Make sure all three fragments are in workbench/assembled_fragments.txt');
        term.writeln('Hint: echo each fragment sentence into the file using >>');
        printPrompt();
        return;
    }

    if (args.length === 0) {
        term.writeln(`unlock_manifesto: provide the unlock keyword (hint: it's the project name)`);
        printPrompt();
        return;
    }

    const attempt = args.join(' ').trim().toLowerCase();
    if (attempt !== UNLOCK_KEYWORD) {
        term.writeln('\x1b[31mAccess denied. The vault rejects the keyword. Hint: What was Project ___?\x1b[0m');
        printPrompt();
        return;
    }

    assemblyState.unlocked = true;
    term.writeln('');
    term.write('\x1b[32m');
    term.writeln('╔════════════════════════════════════════════════════════╗');
    term.writeln('║  VAULT ACCEPTED                                        ║');
    term.writeln('║  The archive recognizes the stitched memory.          ║');
    term.writeln('║  You feel OldNet breathe — data humming in the dark.  ║');
    term.writeln('╚════════════════════════════════════════════════════════╝');
    term.write('\x1b[0m');
    term.writeln('');
    term.writeln('\x1b[36mVault log:\x1b[0m A sealed file surfaces at /truth/manifesto_fragment.txt. It waits for you to read it one last time.');
    term.writeln('\x1b[33mGhost_hint:\x1b[0m The choice isn\'t buttons — it\'s what you do with the knowledge you now hold.');
    printPrompt();
}

