export const generateKey = async () => {
  const algorithm = {
    name: "AES-GCM",
    length: 256,
  }

  return await window.crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"])
}

const encode = (data) => {
  const encoder = new TextEncoder()
  return encoder.encode(data)
}

const decode = (bytestream) => {
  const decoder = new TextDecoder()
  return decoder.decode(bytestream)
}

const generateIv = () => {
  return window.crypto.getRandomValues(new Uint8Array(12))
}

export const encrypt = async (data, key) => {

  const encoded = encode(data)
  const iv = generateIv()

  const cipher = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv }, 
    key,
    encoded
  );

  return { 
    cipher,
    iv
  }
}

export const pack = (buffer) => {
  return window.btoa(
    String.fromCharCode.apply(null, new Uint8Array(buffer))
  )
}

export const unpack = (packed) => {
  const string = window.atob(packed)
  const buffer = new ArrayBuffer(string.length)
  const bufferView = new Uint8Array(buffer)

  for(let i = 0; i < string.length; i++) {
    bufferView[i] = string.charCodeAt(i)
  }

  return buffer
}

export const decrypt = async (cipher, key, iv) => {
  const encoded = await window.crypto.subtle.decrypt({
    name: 'AES-GCM',
    iv,
  }, key, cipher)

  return decode(encoded)
}
