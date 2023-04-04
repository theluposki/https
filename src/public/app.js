import { generateKey, encrypt, decrypt, pack, unpack } from "./cryptoUtil.js"

const panelView = document.querySelector(".panelView")
const text = document.getElementById("text")

let textEnc;

async function init() {
  const key = await generateKey()
  console.log(key)

  
  document.getElementById("enc").addEventListener("click", async () => {
    const { cipher, iv } = await encrypt(text.value, key)

    const result = {
      cipher: pack(cipher),
      iv: pack(iv)
    }

    textEnc = result

    console.log(result)
    panelView.innerHTML = `<pre>${JSON.stringify(result, null, 4)}</pre>`
  })

  document.getElementById("dec").addEventListener("click", async () => {
    const final = await decrypt(unpack(textEnc.cipher), key, unpack(textEnc.iv))

    console.log(final)
    panelView.innerHTML = `<pre>${final}</pre>`
  })

}

init()
