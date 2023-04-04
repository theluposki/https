import { generateKey, encrypt, decrypt } from "./cryptoUtil.js"

const panelView = document.querySelector(".panelView")
const text = document.getElementById("text")

let textEnc

async function init() {
  const keyPair = await generateKey()

  console.log(keyPair)
  
  document.getElementById("enc").addEventListener("click", async () => {
    const { ciphertext, buffer } = await encrypt(text.value, keyPair)
    
    textEnc =ciphertext

    console.log(textEnc)
    console.log(buffer)

    panelView.innerHTML = textEnc // encrypted.ciphertext
  })



  
  
  document.getElementById("dec").addEventListener("click", async () => {
    console.log(text.value)

    const decrypted = await decrypt(keyPair, textEnc)
    
    console.log(decrypted)

    panelView.innerHTML = decrypted
    
  })

}

init()
