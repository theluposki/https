import { importKey, generateKey, exportKey, encrypt, decrypt } from "./cryptoUtil.js"

const btnModalNkey = document.querySelector('.btnModalNkey')
const btnCloseModalNkey = document.querySelector(".btnCloseModalNkey")
const dialogModalNkey = document.getElementById("dialogModalNkey")

const btnModalMyKey = document.querySelector('.btnModalMyKey')
const btnCloseModalMyKey = document.querySelector(".btnCloseModalMyKey")
const dialogModalMyKey = document.getElementById("dialogModalMyKey")

btnModalNkey.addEventListener("click", () => dialogModalNkey.showModal())
btnCloseModalNkey.addEventListener("click", () => dialogModalNkey.close())

btnModalMyKey.addEventListener("click", () => dialogModalMyKey.showModal())
btnCloseModalMyKey.addEventListener("click", () => dialogModalMyKey.close())

let keyGlobal;

const mykeyLocal = document.getElementById("mykeyLocal")

const checkIfYouKey = async () => {
  if(localStorage.getItem("key")) {
    keyGlobal = await importKey(localStorage.getItem("key"))
    mykeyLocal.value = localStorage.getItem("key")
  }
}

checkIfYouKey()

const copyMykeyLocal = document.getElementById("copyMykeyLocal")

copyMykeyLocal.addEventListener("click", () => {
  const msgCopyMykeyLocal = document.getElementById("msgCopyMykeyLocal")
  const copyText = mykeyLocal

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  msgCopyMykeyLocal.innerHTML = "Copiado."
})

const copyImportKeyInput = document.getElementById("copyImportKeyInput")

copyImportKeyInput.addEventListener("click", () => {
  const msgCopyimportKeyInput = document.getElementById("msgCopyimportKeyInput")
  const importKeyInput = document.getElementById("importKeyInput")

  const copyText = importKeyInput

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  msgCopyimportKeyInput.innerHTML = "Copiado."
})


const copyMykeyGen = document.getElementById("copyMykeyGen")
const msgCopyMykeyGen = document.getElementById("msgCopyMykeyGen")

copyMykeyGen.addEventListener("click", () => {
  const mykeyGen = document.querySelector(".mykeyGen")
  
  const copyText = mykeyGen

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  msgCopyMykeyGen.innerHTML = "Copiado."
})

const btnGenerate = document.getElementById("btnGenerate")
const mykeyGen = document.querySelector(".mykeyGen")

btnGenerate.addEventListener("click", async () => {

  const generatedKey =  await generateKey()
  keyGlobal = generatedKey

  const exportedKeyBase64 = await exportKey(generatedKey)

  mykeyGen.value = exportedKeyBase64

  localStorage.setItem("key", exportedKeyBase64)
})

const importKeyInput = document.getElementById("importKeyInput")
const importKeyBtn = document.getElementById("importKeyBtn")


const pasteImportKeyInput = document.getElementById("pasteImportKeyInput")

pasteImportKeyInput.addEventListener("click", async () => {
  importKeyInput.value = await navigator.clipboard.readText();
})

importKeyBtn.addEventListener("click", async () => {
  const input = importKeyInput.value

  if(input) {
    const importedkey = await importKey(input)

    keyGlobal = importedkey
    localStorage.setItem("key", await exportKey(importedkey))
    msgCopyMykeyGen.innerHTML = "Chave importada"
  }
})


const text = document.getElementById("text")

const copyMyText = document.getElementById("copyMyText")
const pasteMyText = document.getElementById("pasteMyText")

copyMyText.addEventListener("click", () => {
  const msgCopyMyText = document.getElementById("msgCopyMyText")

  const copyText = text

  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  msgCopyMyText.innerHTML = "Copiado."

  setTimeout(() => msgCopyMyText.innerHTML = "", 3000)

})

pasteMyText.addEventListener("click", async () => {
  text.value = await navigator.clipboard.readText();
})

const encText = document.getElementById("encText")
const decText = document.getElementById("decText")


encText.addEventListener("click", async () => {
  const currentText = text.value

  if(currentText) {
    const encrypted = await encrypt(currentText, keyGlobal)

    text.value = encrypted
  }
})

decText.addEventListener("click", async () => {
  const currentText = text.value

  if(currentText) {
    const decrypted = await decrypt(currentText, keyGlobal)

    text.value = decrypted
  }
})

