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
2) grep -R "fragment" . | sort
3) cat /mnt/oldnet/sites/geocities/secret/msg.txt
4) cat /mnt/oldnet/sites/reddit/deleted/fragment_02.txt
5) cat /mnt/oldnet/workbench/fragment_03.part
6) echo "$(cat /mnt/oldnet/sites/geocities/secret/msg.txt) $(cat /mnt/oldnet/sites/reddit/deleted/fragment_02.txt) $(cat /mnt/oldnet/workbench/fragment_03.part)" > /mnt/oldnet/workbench/assembled_fragments.txt
7) cat /mnt/oldnet/workbench/assembled_fragments.txt
8) compare assembled output with /mnt/oldnet/truth/clue_header.part* using diff

Good luck.`,
    
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
╚═══════════════════════════════╝`
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
2006-06-12T14:01:33Z  admin: note "archive sanitized - checksum mismatch detected"`
        },
        
        'deleted': {
          'ai_comment.log': `[bot-4321] 2006-06-12T13:49:59Z: "Indices complete. Reporting entropy low. Recommend prune."
[bot-4321] 2006-06-12T13:50:03Z: "Sanitation applied to thread."
(note: admin override at 2006-06-12T13:58)`,
          
          'fragment_02.txt': `fragment_02:
"it learns from the comments, folding memory into edges."`,
          
          'gov_notice.txt': `[REDACTED] - Classified information removed per policy.`
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
Check the timestamps. Something is learning.`
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
- note: DO NOT TOUCH secure/echelon_archive.tar.gz.sha256`
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
      
      'assembled_fragments.txt': `(empty - player must assemble this)`
    },
    
    'secure': {
      'echelon_archive.tar.gz.sha256': `d41d8cd98f00b204e9800998ecf8427e  echelon_archive.tar.gz
(note: file missing from dump, checksum indicates empty file in this fragment)`
    },
    
    'notes': {
      'hash_map.txt': `# helpful commands: grep -R "fragment" .  ;  sort /workbench/* > /workbench/assembled.txt`
    },
    
    'secret': {
      'hint_note.txt': `If a checksum looks wrong, remember: sometimes emptiness is the message.
An empty checksum (d41d8cd98f00b204e9800998ecf8427e) means deliberate removal.
Look for text fragments outside /secure/ that mirror missing titles.`
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

