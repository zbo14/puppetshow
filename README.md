# puppetshow

A command-line utility for sequentially viewing webpages in a browser window.

## Install

`npm i @zbo14/puppetshow`

## Usage

```
                     _       _
 ___ _ _ ___ ___ ___| |_ ___| |_ ___ _ _ _
| . | | | . | . | -_|  _|_ -|   | . | | | |
|  _|___|  _|  _|___|_| |___|_|_|___|_____|
|_|     |_| |_|


Usage: puppetshow [options] <file>

Options:
  -V, --version         output the version number
  -d, --dev-tools       open dev-tools in browser window
  -k, --insecure        ignore HTTPS errors
  -p, --proto <string>  protocol to prepend to IP addresses and hostnames (default: "https")
  -q, --quiet           don't show banner and info
  -h, --help            display help for command
```

`<file>` contains a list of URLs, IP addresses, or hostnames.

**Note:** for every non-URL, `puppetshow` will prepend "https://" unless otherwise specified.

When you run the command, it should open a chromium browser window.

In terminal, you can enter the following commands to stdin:
  * `n` to go to the next webpage
  * `p` to go to the previous webpage
  * `ctrl-c` to close the browser window and stop the program
