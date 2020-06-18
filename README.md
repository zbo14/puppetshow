# puppetshow

A command-line utility for sequentially viewing webpages in a browser window.

## Why?

A common process in bug bounty recon is taking screenshots of target URLs with a tool like Aquatone or EyeWitness. While this strategy provides important visual information, manually visiting endpoints in the browser is often more effective. This way, you can see redirects occur, monitor the Network tab for AJAX/fetch requests, inspect markup and JavaScript, and gain a better understanding of your target.

`puppetshow` allows you to consecutively view a list of endpoints in Chromium. In addition, you can cycle back and forth through the endpoints in case you want to take a second (or third) look. This provides a nice medium between opening dozens of tabs in your browser and scrolling through hundreds or thousands of screenshots. With each new tab you open, the former strategy becomes disproportionately more frustrating and cumbersome. The latter strategy has the benefit of convenience but inevitably comes at the cost of (some) information. Therefore, if you have a list of target endpoints that isn't prohibitively large, `puppetshow` provides a viable alternative without sacrificing information. You can even leave the browser and terminal windows open and resume viewing at a later time.

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
  -V, --version                      output the version number
  -d, --dev-tools                    open dev-tools in browser window
  -k, --insecure                     ignore HTTPS errors
  -p, --protocols <string>           comma-separated list of protocols to prepend to IP addresses/hostnames (default: "http,https")
  -q, --quiet                        don't show banner and info
  -r, --reverse                      visit endpoints in reverse order
  -x, --proxy <[proto://]host:port>  use proxy for chromium
  -h, --help                         display help for command
```

`<file>` contains a list of URLs, IP addresses, or hostnames.

For every non-URL, `puppetshow` will prepend "http://" *and* "https://" unless `--protocols` indicates otherwise.

When you run the command, it should open a Chromium browser window.

In terminal, you can enter the following commands to stdin:
  * `n` to go to the next webpage
  * `p` to go to the previous webpage
  * `ctrl-c` to close the browser window and stop the program
