import "/socket.io/socket.io.js"
import { importKey, generateKey, exportKey, encrypt, decrypt } from "./cryptoUtil.js"
import { formatDateTime } from "./util.js"
import { addMessage, getMessagesWhereSenderAndReceiver } from "./api.local.js" 

const server = io()

server.on("user_connected", (username) => {
  console.log("user_connected: ", username)
})

const containerMessagesChat = document.querySelector(".containerMessagesChat")

server.on("new_message", async (msg) => {

  const nMsg = await addMessage({
    sender: msg.sender,
    receiver: msg.receiver,
    message: msg.message,
  })
  
  containerMessagesChat.innerHTML += `
  <div class="boxMessage receiver">
    <span>${nMsg.sender}</span>
    <h5>${nMsg.message}</h5>
    <span>${formatDateTime(nMsg.createdAt)}</span>
  </div>
  `
  
  if((containerMessagesChat.scrollTop + containerMessagesChat.clientHeight) + 100 < containerMessagesChat.scrollHeight) {
    return 
  }
  
  containerMessagesChat.scrollTop = containerMessagesChat.scrollHeight
  
})

let myUser;
let Friends = [];
let CurrentMessages = []
let currentChat;





if(localStorage.getItem("myUser")) { 
  server.emit("user_connected", localStorage.getItem("myUser"))
  myUser = localStorage.getItem("myUser")
} else {
  myUser = window.crypto.randomUUID()
  localStorage.setItem("myUser", myUser)
  server.emit("user_connected", myUser)
}

const currentChatSpan = document.getElementById("currentChatSpan")

const listContacts = document.querySelector(".listContacts")

const selectCurrentChat = async (id) => {
  containerMessagesChat.innerHTML = `
  <span id="currentChatSpan">
    <i class='bx bxs-user' style='color:#f4f4f4' ></i>&nbsp;
  </span>
  `
  currentChat = id
  currentChatSpan.innerHTML = id
  
  document.querySelectorAll(".li").forEach(item => {
    item.classList.remove("li-active")
  })
  
  document.querySelector(`[data-id='${id}']`).classList.add("li-active")

  CurrentMessages = await getMessagesWhereSenderAndReceiver(myUser, currentChat)

  CurrentMessages.forEach(item => {
    containerMessagesChat.innerHTML += `
      <div class="boxMessage ${item.sender === myUser? "sender": "receiver"}">
        <span>${item.sender}</span>
        <h5>${item.message}</h5>
        <span>${formatDateTime(item.createdAt)}</span>
      </div>
    `
  })

  containerMessagesChat.scrollTop = containerMessagesChat.scrollHeight
}

document.body.addEventListener("click", function (evt) {
  evt.preventDefault()

  const target = evt.target.getAttribute("data-id")

  if(target) {
    selectCurrentChat(target)
  }
})

if(localStorage.getItem("myFriends")) { 
  Friends = JSON.parse(localStorage.getItem("myFriends"))
  
  
  Friends.forEach(i => {
    listContacts.innerHTML += `
        <li class="li" data-id="${i}">
          ${i}
        </li>
      `
  })

} else {
  Friends = []
  localStorage.setItem("myFriends", JSON.stringify(Friends))
}

let chat = false

const text = document.getElementById("text")
const footerChat = document.querySelector(".footerChat")
const footer = document.querySelector(".footer")
const options = document.querySelector(".options")
const optionsChat = document.querySelector(".optionsChat")
const contactsView = document.querySelector(".contactsView")

const btnViewText = document.querySelector(".btnViewText")
const btnViewChat = document.querySelector(".btnViewChat")

const btnViewListFriend = document.querySelector(".btnViewListFriend")

btnViewListFriend.addEventListener("click", () => {
  const styled = window.getComputedStyle(contactsView)
  if(styled["display"] === "none") {
    contactsView.style.display = "flex"
  } else {
    contactsView.style.display = "none"
  }
})


btnViewText.addEventListener("click", () => {
  chat = false

  text.style.display = "block"
  footer.style.display = "flex"
  options.style.display = "flex"

  
  optionsChat.style.display = "none"
  footerChat.style.display = "none"
  containerMessagesChat.style.display = "none"
  contactsView.style.display = "none"
  currentChatSpan.style.display = "none"

  btnViewChat.classList.remove("btnViewActive")
  btnViewText.classList.add("btnViewActive")
})

btnViewChat.addEventListener("click", () => {
  chat = true

  text.style.display = "none"
  footer.style.display = "none"
  options.style.display = "none"

  containerMessagesChat.style.display = "flex"
  footerChat.style.display = "flex"
  optionsChat.style.display = "flex"
  contactsView.style.display = "none"
  currentChatSpan.style.display = "block"

  btnViewText.classList.remove("btnViewActive")
  btnViewChat.classList.add("btnViewActive")
})

if(chat) {
  text.style.display = "none"
  footer.style.display = "none"
  options.style.display = "none"

  containerMessagesChat.style.display = "flex"
  footerChat.style.display = "flex"
  optionsChat.style.display = "flex"
  contactsView.style.display = "none"
} else {
  text.style.display = "block"
  footer.style.display = "flex"
  options.style.display = "flex"

  
  optionsChat.style.display = "none"
  footerChat.style.display = "none"
  containerMessagesChat.style.display = "none"
  contactsView.style.display = "none"
}

const btnModalNkey = document.querySelector('.btnModalNkey')
const btnCloseModalNkey = document.querySelector(".btnCloseModalNkey")
const dialogModalNkey = document.getElementById("dialogModalNkey")
const dialogModalAddFriend = document.getElementById("dialogModalAddFriend")
const btnCloseModalAddFriend = document.querySelector(".btnCloseModalAddFriend")

const btnModalMyKey = document.querySelector('.btnModalMyKey')
const btnCloseModalMyKey = document.querySelector(".btnCloseModalMyKey")
const dialogModalMyKey = document.getElementById("dialogModalMyKey")
const btnModalAddFriend = document.querySelector(".btnModalAddFriend")

const pasteKeyMyFriend = document.getElementById("pasteKeyMyFriend")

btnModalNkey.addEventListener("click", () => dialogModalNkey.showModal())
btnCloseModalNkey.addEventListener("click", () => dialogModalNkey.close())

btnModalAddFriend.addEventListener("click", () => dialogModalAddFriend.showModal())
btnCloseModalAddFriend.addEventListener("click", () => dialogModalAddFriend.close())

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

const AddFriendLocal = document.getElementById("AddFriendLocal")

const pasteImportKeyInput = document.getElementById("pasteImportKeyInput")

pasteImportKeyInput.addEventListener("click", async () => {
  importKeyInput.value = await navigator.clipboard.readText();
})

pasteKeyMyFriend.addEventListener("click", async () => {
  AddFriendLocal.value = await navigator.clipboard.readText();
})

const btnAddFriend = document.getElementById("btnAddFriend")

const msgCopyAddFriendLocal = document.getElementById("msgCopyAddFriendLocal")

btnAddFriend.addEventListener("click", () => {
  if(AddFriendLocal.value !== "" && !Friends.includes(AddFriendLocal.value)) {
    Friends.push(AddFriendLocal.value)
    localStorage.setItem("myFriends", JSON.stringify(Friends))
    
    listContacts.innerHTML = ""

    Friends.forEach(i => {
      listContacts.innerHTML += `
        <li class="li">
          ${i}
        </li>
      `
    })

    msgCopyAddFriendLocal.innerHTML = AddFriendLocal.value
  }
  
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

const inputChat = document.getElementById("inputChat")

const sendMessage = document.getElementById("sendMessage")

const funSendMessage = () => {
  
  if(inputChat.value !== "" && currentChat !== undefined) {

    const msg = {
      sender: myUser,
      receiver: currentChat,
      message: inputChat.value,
      createdAt: Date.now()
    }
    
    
    server.emit("send_message", msg)

    containerMessagesChat.innerHTML += `
      <div class="boxMessage sender">
        <span>${msg.sender}</span>
        <h5>${msg.message}</h5>
        <span>${msg.createdAt}</span>
      </div>
    `
    inputChat.value = ""

    containerMessagesChat.scrollTop = containerMessagesChat.scrollHeight
  }
}

const funSendMessageInput = async ({ code }) => {
  
  if(inputChat.value !== "" && code === "Enter" && currentChat !== undefined) {
    
    const msg =  await addMessage({
      sender: myUser,
      receiver: currentChat,
      message: inputChat.value,
    })
    
    
    console.log(await msg)
    
    server.emit("send_message", await msg)
    
    containerMessagesChat.innerHTML += `
      <div class="boxMessage sender">
        <span>${msg.sender}</span>
        <h5>${msg.message}</h5>
        <span>${msg.createdAt}</span>
    </div>
    `
    inputChat.value = ""

    containerMessagesChat.scrollTop = containerMessagesChat.scrollHeight

  }
}

sendMessage.addEventListener("click", funSendMessage)

inputChat.addEventListener("keydown", funSendMessageInput)


