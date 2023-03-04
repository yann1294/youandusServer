import bcrypt from "bcrypt";
import crypto from 'crypto';


export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

export const comparePassword = (password, hashed) => {
  return bcrypt.compare(password, hashed); // boolean
};



/* ****Asymmetric encryption functions ** */
//Key generation
export const keyGeneration = () => {
   const {publicKey, privateKey}  = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: '',
    },
  })
  return {publicKey, privateKey}
}

export const decryptPassword = ({privateKey}, encryptedPassword) => {
  const decryptedPassword = crypto.privateDecrypt({
    key: privateKey,
    //padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    // oaepHash: 'sha256',
    passphrase: ''
  },
  Buffer.from(encryptedPassword, 'base64')
  )
  return decryptedPassword.toString('utf8');
}