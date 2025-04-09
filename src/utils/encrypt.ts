import CryptoJS from 'crypto-js';

const secretKey = 'qwesdrftghhnjhjkfabsdf'; // Replace with your generated key

export const encryptId = (id: string): string => {
    return CryptoJS.AES.encrypt(id, secretKey).toString();
};

export const decryptId = (encryptedId: string): string => {
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};