const SubtleCrypto = window.crypto.subtle

let iv;

export const generateKey = async () => {
  const algorithm = {
    name: "AES-GCM",
    length: 256,
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

  iv = window.crypto.getRandomValues(new Uint8Array(12));

  let ciphertext = await SubtleCrypto.encrypt(
    {
      name: "AES-GCM",
      iv: iv
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
      name: "AES-GCM",
      iv: iv
    },
    key,
    ciphertext
  );

  let dec = new TextDecoder();

  return dec.decode(decrypted);
}


