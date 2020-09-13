## New game process

* Create a server to allow players to upload their pretender files
* `--era` option required (otherwise prompting happens and that's ugh)
* domcmd file with `settimeleft <seconds>` starts the game at this stage
* Once started, the game will run as a normal Dom5 server, with the specified server options

## Restart existing game process

* Server seems to ignore new game options (like `--era`)
* `--statusdump` may be useful for reading the current game status from code