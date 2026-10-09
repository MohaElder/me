// Seal a new letter for the If I Die page:
//   pnpm encrypt "<message>" "<key>"
// Appends the ciphertext to src/utils/eulogies.json; give the key to its reader.
import { readFileSync, writeFileSync } from 'node:fs'
import CryptoJS from 'crypto-js'

const [message, key] = process.argv.slice(2)
if (!message || !key) {
  console.error('Usage: pnpm encrypt "<message>" "<key>"')
  process.exit(1)
}

// The page only shows text that decrypts to this prefix, so a wrong key never renders garbage.
const cipher = CryptoJS.AES.encrypt('DECRYPTED ' + message, key).toString()
const file = new URL('../src/utils/eulogies.json', import.meta.url)
const eulogies = JSON.parse(readFileSync(file, 'utf8'))
writeFileSync(file, JSON.stringify([...eulogies, cipher], null, 2) + '\n')
console.log(`Sealed letter #${eulogies.length + 1}.`)
