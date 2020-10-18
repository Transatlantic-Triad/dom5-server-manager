## New game process

* Create a server to allow players to upload their pretender files
* `--era` option required (otherwise prompting happens and that's ugh)
* domcmd file with `settimeleft <seconds>` starts the game at this stage
* Once started, the game will run as a normal Dom5 server, with the specified server options

## Restart existing game process

* Server seems to ignore new game options (like `--era`)
* `--statusdump` may be useful for reading the current game status from code

## Quirks:

* Game really don't like filenames that are not lowercase alphanumeric. Enforce this for maps and savedgames.
* Killing the game with connections open doesn't actually kill the process... Potential workaround: use proxy layer to close all connections before killing server.
* .map is needed for the mapfile argument.

## Ideas:
* Reverse proxy can keep track of IP's that have connected to a certain game, and if the IP is known not request a masterpass, if it isn't known do request a masterpass