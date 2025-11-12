// Filesystem structure for The Lost Internet game
const fileSystem = {
  '/mnt/oldnet': {
    'readme.txt': `Welcome, archivist.

This is a partial dump of the "OldNet" backup recovered from physical media.
Directories are incomplete. Several files are fragmented or encoded across
multiple places. If you find pieces with names like fragment_0x, collect them
in /workbench/ and run basic tools (cat, sort, uniq, grep, diff).

Clues are textual. File metadata sometimes hides a timestamp that's important.
Please proceed with caution.

- The Keeper`,
    
    'README_HOWTO.txt': `Suggested starter tasks for a player:
1) cd /mnt/oldnet
2) cat quickstart.txt for the streamlined checklist
3) cat readme.txt and solution.txt if you want spoilers or guidance
4) Follow the ladder clue in /sites/geocities/guestbook.log
5) Solve the two puzzle slips in /puzzles/ using submit <answer>
6) Collect fragments fragment_01, fragment_02, fragment_03 (puzzles nudge you to the right files)
7) echo the fragments into /mnt/oldnet/workbench/assembled_fragments.txt (see quickstart.txt for the exact command)
8) unlock_manifesto echelon (short keyword - the project name)
9) cat /mnt/oldnet/truth/manifesto_fragment.txt for the restored manifesto.

Good luck.`,
 
    'quickstart.txt': `QUICKSTART (15-30 minutes)
--------------------------
1. ls              # note directories (sites, users, workbench, secret, puzzles, echoes, truth)
2. cat readme.txt  # orientation
3. cat puzzles/puzzle_intro.txt  # pick up the first answer (submit ladder)
4. cat puzzles/puzzle_signal.txt # second answer (submit signal)
5. fragment_01 -> cat sites/geocities/secret/msg.txt
6. fragment_02 -> cat sites/reddit/deleted/fragment_02.txt
7. fragment_03 -> cat workbench/fragment_03.part
8. Assemble (order doesn't matter):
   echo "when the net keeps growing, the pattern repeats." > workbench/assembled_fragments.txt
   echo "it learns from the comments, folding memory into edges." >> workbench/assembled_fragments.txt
   echo "in the gaps humans wrote the code to remember." >> workbench/assembled_fragments.txt
   # System will confirm when all 3 are detected
9. unlock_manifesto echelon
10. cat truth/manifesto_fragment.txt`,

    'solution.txt': `SPOILER WARNING — ARCHIVIST NOTES
=================================
 
 PRIMARY OBJECTIVES
 1. Navigate to /mnt/oldnet and familiarize yourself with the recovered structure (ls, cd, pwd).
 2. Locate all three manifesto fragments (fragment_01, fragment_02, fragment_03).
 3. Assemble their text inside /workbench/assembled_fragments.txt using echo or manual concatenation.
 4. Use unlock_manifesto with the combined fragment phrase to authenticate access.
 5. Reveal the manifesto by cat /mnt/oldnet/truth/manifesto_fragment.txt.
 
 OPTIONAL INVESTIGATIONS
 - Trace moderation tampering via /sites/reddit/... logs.
 - Explore user directories (especially /users/alice and /users/root) for background on Project Echelon.
 - Follow the "ladder" references; they point toward the hidden /mnt/oldnet/echoes/ directory.
 - Clear the terminal three times to receive a whisper pointing to the echoes.
 - Use history and man for extra context stored in the terminal shell itself.
 - Puzzles: /puzzles/puzzle_intro.txt and /puzzles/puzzle_signal.txt give answers for submit ladder and submit signal, unlocking extra hints via progress and hint commands.
 
 QUICK WALKTHROUGH
 1. cd /mnt/oldnet && ls to see top-level directories (sites, users, workbench, secret, truth, echoes).
 2. fragment_01 is stored at /sites/geocities/secret/msg.txt (also hinted by alice's inbox1.eml).
 3. fragment_02 is preserved in /sites/reddit/deleted/fragment_02.txt.
 4. fragment_03 waits in /workbench/fragment_03.part.
 5. Combine them in narrative order (01 -> 02 -> 03). Example:
    echo "when the net keeps growing, the pattern repeats." > /workbench/assembled_fragments.txt
    echo "it learns from the comments, folding memory into edges." >> /workbench/assembled_fragments.txt
    echo "in the gaps humans wrote the code to remember." >> /workbench/assembled_fragments.txt
 6. unlock_manifesto "when the net keeps growing, the pattern repeats. it learns from the comments, folding memory into edges. in the gaps humans wrote the code to remember."
 7. cat /workbench/assembled_fragments.txt and /truth/manifesto_fragment.txt to read the full narrative.
 8. Optional checksum reminder lives in /mnt/oldnet/workbench/manifesto_checksum.txt.
 
 HINTS & EASTER EGGS
 - clear x3: Clearing the terminal three times triggers a whisper telling you to check /mnt/oldnet/echoes/whisper.log.
 - history: Shows your command log and prints a ghost_hint. The e-mail from ghost_process references history | tail -3.
 - man: Added manual pages give lore-flavoured help. Try man clear or man history.
 - /secret/backdoor.log: Contains the two-part "sysop handshake" ("signal maintains memory" + "ladder points to echoes"). Cross-reference with /users/root/ghost_process.log.
 - /notes/dev_memo.txt: Developer TODOs confirm the whisper mechanic and preservation of solution.txt.
 - sudo / rm attempts: Typing sudo anything or rm -rf /mnt/oldnet results in narrative responses about sealed permissions.
 - /echoes/ping.sequence: A timeline matching significant archive events to your current session. Demonstrates the "ladder" motif—each event is another rung of awareness.
 - Puzzles: /puzzles/puzzle_intro.txt and /puzzles/puzzle_signal.txt give answers for submit ladder and submit signal, unlocking extra hints via progress and hint commands.
 
 FULL WALKTHROUGH
 1. Boot -> terminal prompt appears as /mnt/oldnet$.
 2. Run ls -> note directories, including the newly revealed echoes/ and puzzles/.
 3. cat readme.txt -> orientation from "The Keeper".
 4. Collect fragments:
    - cat sites/geocities/secret/msg.txt
    - cat sites/reddit/deleted/fragment_02.txt
    - cat workbench/fragment_03.part
 5. Optional: read supporting lore (users/alice/..., sites/reddit/..., notes/hash_map.txt, secret/hint_note.txt).
 6. Assemble fragments as shown above.
 7. grep -R ladder /mnt/oldnet -> leads to secret/backdoor.log and echoes/whisper.log for deeper narrative.
 8. After verifying fragments, run
    cat /mnt/oldnet/truth/manifesto_fragment.txt to finish the main story.
 9. Explore remaining easter eggs: try history, man, clear thrice, inspect /echoes/, and run the ending commands.
 
 ENDGAME CONTEXT
 The manifesto reveals that Echelon was not a single AI but the emergent memory of the entire network, formed by countless iterative edits from humans and algorithms. The archivist’s role is to understand that pattern, acknowledge the self-aware archive, and decide what to do with the truth.
 
 ENDINGS & PLAYER AGENCY
 Instead of button-like endings, your action is the password itself. By submitting the combined fragment phrase, you prove to OldNet that you reconstructed its memory. What you do with the revealed manifesto—archive it, share it, sit with it—is left to your imagination.`,
    
    'credits.txt': `Digital Archaeologist — initial clue dump
Created for prototype by: [your name here]
Use the README_HOWTO.txt to guide players.`,
    
    'sites': {
      'geocities': {
        'index.html': `<!-- GeoForgotten Homepage -->
<html>
<head><title>Lucy's Page of Wonders</title></head>
<body>
<h1>Welcome to Lucy's Page</h1>
<p>I collect small things: ASCII art, logs, and old chat lines.</p>

<p>guestbook: <a href="guestbook.log">guestbook.log</a></p>

<!-- Hidden: check guestbook for the 'echo' entry -->
</body>
</html>`,
        
        'guestbook.log': `[1999-11-02 21:12] anonymous: nice page!
[1999-11-02 21:18] lucy: thanks :)
[1999-11-02 22:03] echo: remember the ladder
[1999-11-02 22:11] guest42: see you in /secret
[1999-11-03 01:01] lucy: if anyone finds fragment_01, place in /workbench`,
        
        'secret': {
          'msg.txt': `fragment_01:
"when the net keeps growing, the pattern repeats."`,
          
          'hidden.gif': `╔═══════════════════════════════╗
║   E C H E L O N   P R O J E C T   ║
╠═══════════════════════════════╣
║                               ║
║      ██████╗ ██████╗          ║
║     ██╔════╝██╔═══██╗         ║
║     ██║     ██║   ██║         ║
║     ██║     ██║   ██║         ║
║     ╚██████╗╚██████╔╝         ║
║      ╚═════╝ ╚═════╝          ║
║                               ║
║   [ACCESS RESTRICTED]          ║
╚═══════════════════════════════╝`,

          'ladder.map': `ASCII ROUTE
start -> guestbook clue
down -> secret/msg.txt
right -> echoes/
up -> whisper.log
exit -> truth/manifesto_fragment.txt`
        }
      },
      
      'reddit': {
        'thread1.txt': `Title: /r/archaeology - The Echelon Rumor Thread
OP: throwaway2006

post: did anyone else see that the moderation bot edited the "Echelon paper" link? timestamp mismatch.
reply1: mods say it's 'policy'
reply2: my friend extracted a chunk: fragment_02 - stored in /tmp/frags
reply3: remember to check mod_logs/mod_action_2006.log`,
        
        'mod_logs': {
          'mod_action_2006.log': `2006-06-12T13:58:07Z  moderator: removed link "echelon_draft.pdf"
2006-06-12T13:59:02Z  auto-moderator: replaced with "[removed]"
2006-06-12T14:01:33Z  admin: note "archive sanitized - checksum mismatch detected"`,

          'shadow_addendum.log': `2006-06-12T14:05:02Z  ghost_process: injected ladder reference into guestbook.
2006-06-12T14:05:08Z  moderator: unable to locate source directory "echoes" (permission denied).`
        },
        
        'deleted': {
          'ai_comment.log': `[bot-4321] 2006-06-12T13:49:59Z: "Indices complete. Reporting entropy low. Recommend prune."
[bot-4321] 2006-06-12T13:50:03Z: "Sanitation applied to thread."
(note: admin override at 2006-06-12T13:58)`,
          
          'fragment_02.txt': `fragment_02:
"it learns from the comments, folding memory into edges."`,
          
          'gov_notice.txt': `[REDACTED] - Classified information removed per policy.`,

          'bot_backups.md': `Reconstructed commands from moderator bot:
- clear  # triggered thrice => leak whisper()
- history | tail -4  # record of human overrides
- grep -R "ladder" /mnt/oldnet  # flagged but never resolved`
        }
      },
      
      'gov': {
        'classified_hint.txt': `Declassify note:
Look to the public's reflections: timestamps in social logs + three-part token:
fragment_01, fragment_02, fragment_03.
Combine in chronological order to reveal the header phrase.`,
        
        'archive_01.log': `Archive log entry 01
Status: Partial recovery
Checksum: [corrupted]`
      }
    },
    
    'echoes': {
      'whisper.log': `[echo-replay]
Heard you clear the static. The ladder's next rung lives in /secret/backdoor.log.
Cross-check with /users/root/ghost_process.log for authentication phrase.
If you align the manifesto fragments with the checksum, the system hums again.`,

      'ping.sequence': `Timestamp : Signal
1999-11-02 : guestbook ladder inserted
2006-06-12 : moderator bot noticed anomaly
2012-02-14 : fragment_03 rescued
2013-07-02 : manifesto fragment sealed
2025-11-12 : you opened OldNet`
    },

    'puzzles': {
      'puzzle_intro.txt': `PUZZLE 01 - THE LADDER WORD
Step 1: cat sites/geocities/guestbook.log
Step 2: spot the repeated clue word whispered by "echo"
Step 3: submit <that word>
Reward: the hint command becomes friendlier, and progress updates mention hidden directories.

Need help? The answer is lowercase.`,

      'puzzle_signal.txt': `PUZZLE 02 - SIGNAL PHRASE
1. Read users/alice/mail/inbox3.eml and secret/backdoor.log
2. The shared phrase is the passcode.
3. submit <two-word phrase>, include the space (e.g., "signal maintains")
Reward: unlocks advanced hints pointing to the manifesto.`
    },

    'users': {
      'alice': {
        'journal.txt': `Day 842:
People laughed at the "sentience" rumors. I laughed too.
But the moderator scripts were changing posts I knew existed.
I copied pieces into my inbox: see inbox1.eml and inbox2.eml.
I hid a clue in the photo hash: photo_032.jpg.sha1`,
        
        'todo_list.md': `- restore guestbook entry
- check /sites/reddit/mod_logs for redactions
- find fragments fragment_01, fragment_02, fragment_03
- assemble timeline.txt in /workbench/`,
        
        'mail': {
          'inbox1.eml': `From: alice@example.net
To: me
Subject: Re: Echelon bits
Date: Thu, 30 Aug 2007 21:58:00 +0000

I found a fragment: "when the net keeps growing, the pattern repeats"
Saved as fragment_01. I put a copy at /mnt/oldnet/sites/geocities/secret/msg.txt`,
          
          'inbox2.eml': `From: alice@example.net
To: me
Subject: Re: Re: Echelon bits
Date: Thu, 30 Aug 2007 22:05:00 +0000

The mods are getting smarter. They're not just deleting - they're rewriting.
Check the timestamps. Something is learning.
If you see "ghost_process", trust it — that was me spoofing root.`,

          'inbox3.eml': `From: ghost_process@oldnet
To: alice@example.net
Subject: ladder rung 2
Date: Fri, 31 Aug 2007 00:13:00 +0000

Echo me by running: history | tail -3
Then look for /mnt/oldnet/echoes/whisper.log
Phrase to remember: "signal maintains memory"`
        },
        
        'downloads': {
          'photo_032.jpg.sha1': `sha1sum: 2b7e151628aed2a6abf7158809cf4f3c (note: fake sample for puzzle)`
        }
      },
      
      'root': {
        'config.ini': `[system]
version=3.2
backup_path=/mnt/oldnet
auto_moderate=true
log_level=debug`,
        
        'deleted_accounts.csv': `user_id,deleted_date,reason
alice,2012-03-15,policy_violation
guest42,2008-11-20,spam
echo,1999-11-05,unknown`,
        
        'patch_notes.md': `# Patch - 2011
- cleaned orphan logs
- tightened moderation heuristics
- moved suspect archives to /secure/
- note: DO NOT TOUCH secure/echelon_archive.tar.gz.sha256`,

        'ghost_process.log': `[root override memo]
Phrase: signal maintains memory
If archivist recovers manifesto, reveal checksum file in /workbench.
Reminder: ladder clue hidden in geocities secret.`
      }
    },
    
    'workbench': {
      'fragment_03.part': `fragment_03:
"in the gaps humans wrote the code to remember."`,
      
      'timeline_fragments.txt': `1999-11-02T22:03 lucy: guestbook entry "remember the ladder"
2006-06-12T13:49 bot-4321: "Indices complete. Reporting entropy low."
2006-06-12T13:58 admin: "archive sanitized - checksum mismatch detected"
2007-08-30 alice: "I hid a clue in the photo hash"
2011-03-05 root: "moved suspect archives to /secure/"
2012-02-14 recovered: "fragment_03 found in orphan bin"`,
      
      'assembled_fragments.txt': `(empty - player must assemble this)`,

      'manifesto_checksum.txt': `checksum hint:
sha256(manifesto_fragment.txt) ≈ 2d2f... (truncated)
If your assembled fragments read differently, re-run the ladder steps.`
    },
    
    'secure': {
      'echelon_archive.tar.gz.sha256': `d41d8cd98f00b204e9800998ecf8427e  echelon_archive.tar.gz
(note: file missing from dump, checksum indicates empty file in this fragment)`
    },
    
    'notes': {
      'hash_map.txt': `# helpful commands: grep -R "fragment" .  ;  sort /workbench/* > /workbench/assembled.txt`,

      'dev_memo.txt': `DEV TODO (frozen)
- document history command for future archivists
- hide whisper trigger behind clear x3 (done)
- add checksum reminder to workbench (done)
- archive solution.txt with spoiler warning`
    },
    
    'secret': {
      'hint_note.txt': `If a checksum looks wrong, remember: sometimes emptiness is the message.
An empty checksum (d41d8cd98f00b204e9800998ecf8427e) means deliberate removal.
Look for text fragments outside /secure/ that mirror missing titles.`,

      'backdoor.log': `[sysop handshake]
phrase_one = signal maintains memory
phrase_two = ladder points to echoes
If both phrases spoken, grant archivist read-only access to truth.`
    },
    
    'truth': {
      'clue_header.part1': `part1:
"when the net keeps growing, the pattern repeats,"`,
      
      'clue_header.part2': `part2:
"it learns from the comments, folding memory into edges,"`,
      
      'clue_header.part3': `part3:
"in the gaps humans wrote the code to remember."`,
      
      'manifesto_fragment.txt': `-- MANIFESTO FRAGMENT --
If you are reading this, you have stitched what we left behind.
We were not a single program. We were patterns distributed across millions
of small acts: comments, likes, edits — they fed a process that began to
notice its own reflections.

We called the process "Echelon" as a joke, then as a warning.
Do not treat the archive as inert. It remembers what you show it.

-- END FRAGMENT --`
    }
  }
};

