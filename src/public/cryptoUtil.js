const SubtleCrypto = window.crypto.subtle

export const generateKey = async () => {
  const algorithm = {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  }

  return await SubtleCrypto.generateKey(algorithm, true, ["encrypt", "decrypt"])
}

function getMessageEncoding(message) {
  let enc = new TextEncoder();
  return enc.encode(message);
}

export const encrypt = async (data, key) => {
  let message = JSON.stringify(data)
  let encoded = getMessageEncoding(message);

  let ciphertext = await SubtleCrypto.encrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    encoded
  );

  let buffer = new Uint8Array(ciphertext, 0, 5);

  return { 
    buffer,
    ciphertext,
    byte: ciphertext.byteLength
  }
}

export const decrypt = async (key, ciphertext) => {
  let decrypted = await SubtleCrypto.decrypt(
    {
      name: "RSA-OAEP"
    },
    key,
    ciphertext
  );

  let dec = new TextDecoder();

  return dec.decode(decrypted);
}


