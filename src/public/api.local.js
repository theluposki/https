const db = new Dexie("Friends");

db.version(1).stores({
  messages: `
    id,
    sender,
    receiver,
    message,
    createdAt
  `
});

export const getMessage = async (id) => {
  return await db.messages.get(id)
}

export const getMessagesWhereSenderAndReceiver = async (sender, receiver) => {
  // const sende = await db.messages.where({ sender: sender, receiver: receiver, receiver: sender, sender: receiver }).toArray()
  // const receive = await db.messages.where({ receiver: sender, sender: receiver }).toArray()
  // console.log([...sende, ...receive])
  // return [...sende, ...receive]

  const result = await db.messages.where({ sender, receiver }).toArray() 

  console.log(result)

  return result
}

export const addMessage = async ( body ) => {
  const { sender, receiver, message } = body
  const id = window.crypto.randomUUID()
  const createdAt = Date.now()

  const msg = await db.messages.add({
    id,
    sender,
    receiver,
    message,
    createdAt
  })

  return await getMessage(msg)
}
