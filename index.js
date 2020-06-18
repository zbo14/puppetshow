#!/usr/bin/env node

'use strict'

const { once } = require('events')
const fs = require('fs')
const commander = require('commander')
const path = require('path')
const puppeteer = require('puppeteer')
const readline = require('readline')

const banner = fs.readFileSync(path.join(__dirname, 'banner'), 'utf8')
const error = arg => console.error('\x1b[31m%s\x1b[0m', arg)
const warn = arg => console.warn('\x1b[33m%s\x1b[0m', arg)

readline.emitKeypressEvents(process.stdin)

process.stdin.isTTY && process.stdin.setRawMode(true)
process.stdin.setEncoding('utf8')

const program = new commander.Command()

program
  .version('0.3.3')
  .arguments('<file>')
  .option('-d, --dev-tools', 'open dev-tools in browser window')
  .option('-k, --insecure', 'ignore HTTPS errors')
  .option('-p, --protocols <string>', 'comma-separated list of protocols to prepend to IP addresses/hostnames', 'http,https')
  .option('-q, --quiet', 'don\'t show banner and info')
  .option('-r, --reverse', 'visit endpoints in reverse order')
  .option('-x, --proxy <[proto://]host:port>', 'use proxy for chromium')
  .action(async (file, opts) => {
    let data

    try {
      data = await fs.promises.readFile(file, 'utf8')
    } catch {
      error('[!] Couldn\'t find file: ' + file)
      process.exit(1)
    }

    const protos = opts.protocols
      .toLowerCase()
      .split(',')
      .map(proto => proto.trim())
      .filter(Boolean)

    protos.forEach(proto => {
      if (!['http', 'https'].includes(proto)) {
        error('[!] Unsupported protocol: ' + proto)
        process.exit(1)
      }
    })

    const targets = data.split('\n').filter(Boolean)

    opts.reverse && targets.reverse()

    if (!opts.quiet) {
      error(banner)
      warn('[-] Loaded file')
    }

    const args = []

    opts.proxy && args.push('--proxy-server=' + opts.proxy)

    const browser = await puppeteer.launch({
      args,
      devtools: opts.devTools,
      headless: false,
      ignoreHTTPSErrors: opts.insecure
    })

    const page = await browser.newPage()

    page.once('close', async () => {
      if (!opts.quiet) {
        warn('[-] Page closed')
        warn('[-] Exiting')
      }

      await browser.close()
      process.exit()
    })

    const urls = []

    targets.forEach(target => {
      for (const proto of protos) {
        if (target.startsWith(proto + '://')) {
          return urls.push(target)
        }
      }

      protos.forEach(proto => urls.push(proto + '://' + target))
    })

    opts.quiet || warn(`[-] Found ${urls.length} URLs`)

    let forward = true
    let url

    for (let i = 0; i < urls.length;) {
      url = urls[i]

      try {
        await page.goto(url, { timeout: 5e3 })
      } catch {
        forward ? ++i : --i
        continue
      }

      opts.quiet || warn('[+] ' + url)

      while (true) {
        const [, { name, ctrl }] = await once(process.stdin, 'keypress')

        if (name === 'c' && ctrl) return page.emit('close')

        forward = true

        if (name === 'n') {
          if (i + 1 === urls.length) {
            if (!opts.quiet) {
              error('[!] No more URLs!')
              warn('[-] If you\'re done, close the browser window or enter `ctrl-c` here')
            }
          } else {
            ++i
            break
          }
        } else if (name === 'p') {
          if (i) {
            --i
            forward = false
            break
          } else {
            opts.quiet || error('[!] No previous URL to visit')
          }
        } else {
          opts.quiet || error('[!] I don\'t know what you want me to do!')
        }
      }
    }
  })
  .parseAsync(process.argv)
  .catch(err => error(err) || 1)
  .then(process.exit)
