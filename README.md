# The Lost Internet

A web-based interactive terminal mystery game where you play as a digital archaeologist exploring an old, broken web backup through a realistic command-line interface.

## Features

- **Realistic Terminal Interface**: Built with xterm.js, providing an authentic terminal experience
- **Immersive Story**: Explore fragments of the old internet and uncover the mystery of Project Echelon
- **Full Filesystem Simulation**: Navigate through directories, read files, and search for clues
- **Boot Animation**: Cinematic startup sequence
- **CRT Effects**: Retro terminal aesthetics with scanlines and glow effects

## How to Play

1. Open `index.html` in a modern web browser
2. Wait for the boot sequence to complete
3. Explore the filesystem using standard terminal commands:
   - `ls` - List directory contents
   - `cd [path]` - Change directory
   - `cat [file]` - View file contents
   - `grep [-R] [pattern] [path]` - Search for text in files
   - `help` - Show available commands

## Goal

Find all three fragments (fragment_01, fragment_02, fragment_03) scattered throughout the filesystem to unlock the final manifesto.

## Commands

- `ls [path]` - List files and directories
- `cd [path]` - Change directory
- `cat [file]` - Display file contents
- `grep [-R] [pattern] [path]` - Search for pattern (use -R for recursive)
- `head [file]` - Show first 10 lines
- `tail [file]` - Show last 10 lines
- `less [file]` - View file (same as cat)
- `echo [text]` - Print text
- `pwd` - Print current directory
- `clear` - Clear terminal
- `help` - Show help message

## Technical Details

- **No Backend Required**: Everything runs in the browser using vanilla JavaScript
- **xterm.js**: Terminal emulator library
- **Pure JavaScript**: No build step needed, just open the HTML file

## Browser Compatibility

Works best in modern browsers that support ES6+ JavaScript. Tested on:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Story

You are an archivist exploring a recovered backup of "OldNet" - fragments of the old internet. As you explore directories like `/mnt/oldnet/sites/geocities` and `/mnt/oldnet/users/alice`, you'll discover clues about a mysterious project called "Echelon" and piece together what happened to the old internet.

---

*"In the gaps humans wrote the code to remember."*

