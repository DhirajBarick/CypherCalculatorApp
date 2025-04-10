function caesarEncrypt(text, key) {
  key = parseInt(key);
  const steps = [];
  const result = text
    .split("")
    .map((char) => {
      if (char.match(/[a-z]/i)) {
        const base = char === char.toUpperCase() ? 65 : 97;
        const original = char.charCodeAt(0) - base;
        const shifted = (original + key + 26) % 26;
        const encryptedChar = String.fromCharCode(shifted + base);
        steps.push(`'${char}' → '${encryptedChar}' (Shift '${char}' by +${key} → '${encryptedChar}')`);
        return encryptedChar;
      }
      steps.push(`${char} (unchanged)`);
      return char;
    })
    .join("");
  return { result, steps };
}

function caesarDecrypt(text, key) {
  return caesarEncrypt(text, -parseInt(key));
}

function vigenereEncrypt(text, key) {
  const steps = [];
  key = key.toUpperCase();
  let result = "";
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      const k = key[j % key.length].charCodeAt(0) - 65;
      const keyChar = key[j % key.length];
      const encryptedChar = String.fromCharCode(
        ((char.charCodeAt(0) - base + k) % 26) + base
      );
      steps.push(
        `'${char}' → '${encryptedChar}' (Shift using key '${keyChar}' → +${k})`
      );
      result += encryptedChar;
      j++;
    } else {
      steps.push(`${char} (unchanged)`);
      result += char;
    }
  }
  return { result, steps };
}

function vigenereDecrypt(text, key) {
  const steps = [];
  key = key.toUpperCase();
  let result = "";
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-z]/i)) {
      const base = char === char.toUpperCase() ? 65 : 97;
      const k = key[j % key.length].charCodeAt(0) - 65;
      const keyChar = key[j % key.length];
      const decryptedChar = String.fromCharCode(
        ((char.charCodeAt(0) - base - k + 26) % 26) + base
      );
      steps.push(
        `'${char}' → '${decryptedChar}' (Shift using key '${keyChar}' → +${k})`
      );
      result += decryptedChar;
      j++;
    } else {
      steps.push(`${char} (unchanged)`);
      result += char;
    }
  }
  return { result, steps };
}

function createPlayfairMatrix(key) {
  key = key.toUpperCase().replace(/J/g, "I");
  const seen = new Set();
  const matrix = [];
  const uniqueKey = key + "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  for (const char of uniqueKey) {
    if (!seen.has(char) && /[A-Z]/.test(char)) {
      seen.add(char);
      matrix.push(char);
    }
  }
  const grid = [];
  for (let i = 0; i < 5; i++) {
    grid.push(matrix.slice(i * 5, i * 5 + 5));
  }
  return grid;
}

function formatPlayfairMessage(msg) {
  msg = msg
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  let result = "";
  for (let i = 0; i < msg.length; i += 2) {
    let a = msg[i];
    let b = msg[i + 1];
    if (!b || a === b) {
      b = "X";
      i--;
    }
    result += a + b;
  }
  return result.match(/.{1,2}/g);
}

function findPosition(matrix, char) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (matrix[i][j] === char) return [i, j];
    }
  }
}

function playfairEncrypt(message, key) {
  const steps = [];
  const matrix = createPlayfairMatrix(key);
  const pairs = formatPlayfairMessage(message);
  const encrypted = pairs
    .map((pair) => {
      const [row1, col1] = findPosition(matrix, pair[0]);
      const [row2, col2] = findPosition(matrix, pair[1]);

      let char1, char2;
      if (row1 === row2) {
        char1 = matrix[row1][(col1 + 1) % 5];
        char2 = matrix[row2][(col2 + 1) % 5];
        steps.push(`${pair} → Same row → ${char1}${char2}`);
      } else if (col1 === col2) {
        char1 = matrix[(row1 + 1) % 5][col1];
        char2 = matrix[(row2 + 1) % 5][col2];
        steps.push(`${pair} → Same column → ${char1}${char2}`);
      } else {
        char1 = matrix[row1][col2];
        char2 = matrix[row2][col1];
        steps.push(`${pair} → Rectangle swap → ${char1}${char2}`);
      }
      return char1 + char2;
    })
    .join("");
  return { result: encrypted, steps, matrix };
}

function playfairDecrypt(message, key) {
  const steps = [];
  const matrix = createPlayfairMatrix(key);
  const pairs = message
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .match(/.{1,2}/g);
  const decrypted = pairs
    .map((pair) => {
      const [row1, col1] = findPosition(matrix, pair[0]);
      const [row2, col2] = findPosition(matrix, pair[1]);

      let char1, char2;
      if (row1 === row2) {
        char1 = matrix[row1][(col1 + 4) % 5];
        char2 = matrix[row2][(col2 + 4) % 5];
        steps.push(`${pair} → Same row → ${char1}${char2}`);
      } else if (col1 === col2) {
        char1 = matrix[(row1 + 4) % 5][col1];
        char2 = matrix[(row2 + 4) % 5][col2];
        steps.push(`${pair} → Same column → ${char1}${char2}`);
      } else {
        char1 = matrix[row1][col2];
        char2 = matrix[row2][col1];
        steps.push(`${pair} → Rectangle swap → ${char1}${char2}`);
      }
      return char1 + char2;
    })
    .join("");
  return { result: decrypted, steps, matrix };
}

module.exports = {
  caesarEncrypt,
  caesarDecrypt,
  vigenereEncrypt,
  vigenereDecrypt,
  playfairEncrypt,
  playfairDecrypt,
};
