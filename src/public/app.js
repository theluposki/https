import { generateKey, encrypt, decrypt } from "./cryptoUtil.js"

const panelView = document.querySelector(".panelView")
const text = document.getElementById("text")

let textEnc

async function init() {
  const keyPair = await generateKey()
  
  document.getElementById("enc").addEventListener("click", async () => {
    const { ciphertext } = await encrypt(text.value, keyPair.publicKey)
    
    textEnc = ciphertext

    console.log(textEnc)

    panelView.innerHTML = textEnc // encrypted.ciphertext
  })



  
  
  document.getElementById("dec").addEventListener("click", async () => {
    console.log(text.value)

    const decrypted = await decrypt(keyPair.privateKey, textEnc)
    
    console.log(decrypted)

    panelView.innerHTML = decrypted
    
  })

}

init()
