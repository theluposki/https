import { generateKey, encrypt, decrypt, pack, unpack } from "./cryptoUtil.js"

const panelView = document.querySelector(".panelView")
const text = document.getElementById("text")

let textEnc;

async function init() {
  const key = await generateKey()

  const exported = await window.crypto.subtle.exportKey("jwk", key)

  console.log(key)
  console.log(exported)

  //localStorage.setItem("key", JSON.stringify(exported))

  const imported = await window.crypto.subtle.importKey("jwk", JSON.parse(localStorage.getItem("key")), "AES-GCM", true, ["encrypt", "decrypt"]);
  console.log(imported)
  


  
  document.getElementById("enc").addEventListener("click", async () => {
    const result = await encrypt(text.value, imported)

    textEnc = result

    console.log(result)
    panelView.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`
  })

  document.getElementById("dec").addEventListener("click", async () => {
    console.log(textEnc)
    const result = await decrypt("eyJjaXBoZXIiOiJFYmRNRC9vN1F1TkVETkxZcmdOUGdzTzZSZDdWIiwiaXYiOiIrY0FJSXhvcmpCRnpScDlPIn0=", imported)

    console.log(result)
    panelView.innerHTML = `<pre>${result}</pre>`
  })

}

init()
