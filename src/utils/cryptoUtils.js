import CryptoJS from 'crypto-js';

// En un entorno real, esta clave debería venir de variables de entorno (.env)
// Pero para el frontend es suficiente para ofuscar/cifrar el ID del paquete en las URLs
const SECRET_KEY = 'correos-cr-secure-key-2026-v2';

export const encryptId = (data) => {
  if (!data) return null;
  // Encriptamos y hacemos el string URL-safe (reemplazando +, / y =)
  return CryptoJS.AES.encrypt(data, SECRET_KEY)
    .toString()
    .replace(/\+/g, 'xMl3Jk')
    .replace(/\//g, 'Por21Ld')
    .replace(/=/g, 'Ml32');
};

export const decryptId = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    // Revertimos el string URL-safe a su formato base64 original
    const originalCipher = ciphertext
      .replace(/xMl3Jk/g, '+')
      .replace(/Por21Ld/g, '/')
      .replace(/Ml32/g, '=');
      
    const bytes = CryptoJS.AES.decrypt(originalCipher, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    return decryptedData;
  } catch (error) {
    console.error('Error al desencriptar la ruta:', error);
    return null;
  }
};
