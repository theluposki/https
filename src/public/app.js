import { generateKey, encrypt, decrypt } from "./cryptoUtil.js"

const panelView = document.querySelector(".panelView")
const text = document.getElementById("text")
panelView.innerHTML = "Saida"
const generatedKeyText = document.getElementById("generatedKey")

let textEnc;

async function init() {

  let CryptoKey;

  const genKey = async () => {
    const key = await generateKey()
    const exported = await window.crypto.subtle.exportKey("jwk", key)
    
    CryptoKey = key

    localStorage.setItem("key", btoa(JSON.stringify(exported)))
    generatedKeyText.value = btoa(JSON.stringify(exported)) 
  }

  
  const getCurrentKey = async () => {
    if(localStorage.getItem("key")) {
      const currentKey = JSON.parse(atob(localStorage.getItem("key")))
      return await window.crypto.subtle.importKey("jwk", currentKey, "AES-GCM", true, ["encrypt", "decrypt"]);
    }
    return await genKey()
  }

  CryptoKey = await getCurrentKey();

  console.log(await getCurrentKey())

  const impKey = async () => {
    const importedKeyText = document.getElementById("importedKey")

    if(importedKeyText.value !== "") {
      localStorage.setItem("key", importedKeyText.value)
      const newKey = JSON.parse(atob(importedKeyText.value))
      const key = await window.crypto.subtle.importKey("jwk", newKey, "AES-GCM", true, ["encrypt", "decrypt"]);
      CryptoKey = key
    }
  }

  document.getElementById("btnGeneratedKey").addEventListener("click", () => {
    genKey()
  })

  document.getElementById("btnImportedKey").addEventListener("click", () => {
    impKey()
  })

  //localStorage.setItem("key", JSON.stringify(exported))

  document.getElementById("enc").addEventListener("click", async () => {
    const result = await encrypt(text.value, await CryptoKey)

    textEnc = result

    console.log(result)
    panelView.innerHTML = `<pre>${JSON.stringify(result, null, 2)}</pre>`
  })

  document.getElementById("dec").addEventListener("click", async () => {
    console.log(textEnc)
    const result = await decrypt(textEnc, await CryptoKey)

    console.log(result)
    panelView.innerHTML = `<pre>${result}</pre>`
  })

}

init()
