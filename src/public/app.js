import { encrypt, decrypt, exportKey, importKey} from "./cryptoUtil.js"

const panelView = document.querySelector(".panelView")
const text = document.getElementById("text")
panelView.innerHTML = "Saida"
const generatedKeyText = document.getElementById("generatedKey")

let textEnc;

async function init() {

  let CryptoKey;

  document.getElementById("btnGeneratedKey").addEventListener("click", async () => {
    console.log(await exportKey())
  })

  document.getElementById("btnImportedKey").addEventListener("click", async () => {
    const chave = "eyJhbGciOiJBMjU2R0NNIiwiZXh0Ijp0cnVlLCJrIjoiOWcyajV4RzRiSzhQV0hacm9vS2RfQTE3d3RmdFhFRGxnXzdhVlZHU0Z5YyIsImtleV9vcHMiOlsiZW5jcnlwdCIsImRlY3J5cHQiXSwia3R5Ijoib2N0In0="
    console.log(await importKey(chave))
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
