"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [cipher, setCipher] = useState("Caesar");
  const [inputText, setInputText] = useState("");
  const [key, setKey] = useState("");
  const [action, setAction] = useState("encrypt");
  const [inputin, setInputin] = useState("");
  const [result, setResult] = useState("");
  const [steps, setSteps] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTheory, setSelectedTheory] = useState(null);

  const cipherTheory = {
    Caesar: {
      brief:
        "The Caesar cipher is a simple encryption technique that was used by Julius Caesar to send secret messages to his allies. It works by shifting the letters in the plaintext message by a certain number of positions, known as the “shift” or “key”. The Caesar Cipher technique is one of the earliest and simplest methods of encryption techniques. \n It’s simply a type of substitution cipher, i.e., each letter of a given text is replaced by a letter with a fixed number of positions down the alphabet. \nThe method is apparently named after Julius Caesar, who apparently used it to communicate with his officials.",
      working:
        'Pick a number (called the key) – this is how many letters you shift.\n Substitute each letter in your message with the letter that is X positions ahead in the alphabet. \nIf the shift goes past "Z",  it wraps around to the beginning of the alphabet. \nExample (Shift of 3): \nPlaintext: HELLO \nEncrypted: KHOOR \nTo decrypt, simply shift the letters backwards by the same key.',
    },
    Vigenere: {
      brief:
        "Vigenere Cipher is a method of encrypting alphabetic text. It uses a simple form of polyalphabetic substitution. A polyalphabetic cipher is any cipher based on substitution, using multiple substitution alphabets.\n\nThe encryption of the original text is done using the Vigenère square or Vigenère table.",
      working:
        "The table consists of the alphabets written out 26 times in different rows, each alphabet shifted cyclically to the left compared to the previous alphabet, corresponding to the 26 possible Caesar Ciphers.\nAt different points in the encryption process, the cipher uses a different alphabet from one of the rows.\nEach letter in the plaintext is shifted by the corresponding letter's alphabetical position in the keyword. If the keyword is shorter than the plaintext, it repeats.",
    },
    Playfair: {
      brief:
        "The Playfair Cipher is a polyalphabetic digraph substitution cipher, meaning it encrypts two letters at a time (digraphs) instead of single letters. This makes frequency analysis more difficult compared to monoalphabetic ciphers like Caesar. \nIt was invented by Charles Wheatstone in 1854 but is named after Lord Playfair, who promoted its use",
      working:
        "Create a 5x5 grid of letters using a keyword (combine I & J into one cell).\nBreak the plaintext into pairs of letters (e.g., HELLO → HE, LX, LO – repeating letters are separated by 'X').\nApply rules to encrypt each pair:\n• Same row: Replace each letter with the one to its right.\n• Same column: Replace each letter with the one below it.\n• Rectangle: Swap letters diagonally within the rectangle.\n\nExample (Keyword: MONARCHY):\n\nPlaintext: BALLOON\nPairs: BA LX LO ON\nEncrypted: IB MU UP NX ",
    },
  };

  useEffect(() => {
    setIsMounted(true);
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    if (newDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!inputText.trim()) {
      setErrorMessage("Please enter the text to encrypt or decrypt.");
      return;
    }

    if (!key.trim()) {
      setErrorMessage("Please enter the key.");
      return;
    }

    if (cipher === "Caesar" && !/^\d+$/.test(key)) {
      setErrorMessage("For Caesar cipher, key must be a non-negative integer.");
      return;
    }

    if (
      (cipher === "Vigenere" || cipher === "Playfair") &&
      !/^[a-zA-Z]+$/.test(key)
    ) {
      setErrorMessage("Key must contain only letters for this cipher.");
      return;
    }

    try {
      const response = await axios.post(
        "yourbackenddeployedurl/api",
        {
          cipher,
          message: inputText,
          key,
          mode: action,
        }
      );

      setResult(response.data.result);
      setSteps(response.data.steps);
      setMatrix(response.data.matrix || []);
      setSelectedTheory(cipher);
      setInputin(inputText);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred while processing your request.");
    }
  };

  if (!isMounted) {
    return (
      <div className="app-container">
        <h1 className="title">Cipher Calculator Tool 🔐</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="title">Cipher Calculator Tool 🔐</h1>
        <div className="darktoggle">
          <label style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
            />
            Dark Mode
          </label>
        </div>
      </div>

      <div className="form-container">
        <div className="input-group">
          <label>Select Cipher</label>
          <select
            value={cipher}
            onChange={(e) => {
              setCipher(e.target.value);
              setKey("");
            }}
          >
            <option value="Caesar">Caesar</option>
            <option value="Vigenere">Vigenere</option>
            <option value="Playfair">Playfair</option>
          </select>
        </div>

        <div className="input-group">
          <label>Enter Text</label>
          <textarea
            rows="4"
            cols="20"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to encrypt or decrypt"
          />
        </div>

        <div className="input-group">
          <label>Key</label>
          <input
            type="text"
            value={key}
            onChange={(e) => {
              const value = e.target.value;
              if (cipher === "Caesar") {
                if (/^\d*$/.test(value)) setKey(value);
              } else {
                if (/^[a-zA-Z]*$/.test(value)) setKey(value);
              }
            }}
            placeholder={
              cipher === "Caesar" ? "Enter numeric key" : "Enter alphabetic key"
            }
          />
        </div>

        <div className="input-group">
          <label>Action</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
        <button onClick={handleSubmit}>Process</button>
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {(result || matrix.length > 0 || steps.length > 0) && (
        <div className="results-container">
          {result && (
            <div className="result">
              <h2>Given Cypher Text</h2>
              <p>
                {inputin.split("").map((char, index) => (
                  <span key={index}>{char}</span>
                ))}
              </p>
              <h2>Result Text</h2>
              <div className="output">
                <p>
                  {result.split("").map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </p>
                <button
                  className="copy"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  Copy
                </button>
              </div>
            </div>
          )}

          {selectedTheory && (
            <section className="theory">
              <h2>{selectedTheory} Cipher</h2>

              <div className="theory-content">
                <h3>Introduction</h3>
                <p>
                  {cipherTheory[selectedTheory].brief
                    .split("\n")
                    .map((line, index) => (
                      <span key={index}>
                        {line.trim()}
                        <br />
                      </span>
                    ))}
                </p>

                <h3>How It Works</h3>
                <p>
                  {cipherTheory[selectedTheory].working
                    .split("\n")
                    .map((line, index) => (
                      <span key={index}>
                        {line.trim()}
                        <br />
                      </span>
                    ))}
                </p>
              </div>
            </section>
          )}

          {matrix.length > 0 && (
            <div className="matrix">
              <h2>Playfair Matrix</h2>
              <table>
                <tbody>
                  {matrix.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => (
                        <td key={colIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {steps.length > 0 && (
            <div className="steps">
              <h2>Steps</h2>
              <ol>
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>

              {result && (
                <div className="final-result">
                  <h3>Final Result</h3>
                  <p>
                    {result.split("").map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
