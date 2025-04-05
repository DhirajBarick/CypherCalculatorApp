"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./App.css"

const App = () => {
  const [cipher, setCipher] = useState("Caesar")
  const [inputText, setInputText] = useState("")
  const [key, setKey] = useState("")
  const [action, setAction] = useState("encrypt")
  const [result, setResult] = useState("")
  const [steps, setSteps] = useState([])
  const [matrix, setMatrix] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }

    return () => {
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)

    localStorage.setItem("darkMode", newDarkMode.toString())

    if (newDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5002/api/cipher", {
        cipher,
        message: inputText,
        key,
        mode: action,
      })

      setResult(response.data.result)
      setSteps(response.data.steps)
      setMatrix(response.data.matrix || [])
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (!isMounted) {
    return (
      <div className="app-container">
        <div className="app-header">
          <h1 className="title">Cipher Tool 🔐</h1>
        </div>
        <div className="form-container">

          <div className="input-group">
            <label>Select Cipher</label>
            <select disabled>
              <option>Loading...</option>
            </select>
          </div>
          <div className="input-group">
            <label>Enter Text</label>
            <textarea disabled placeholder="Loading..."></textarea>
          </div>
          <div className="input-group">
            <label>Key</label>
            <input type="text" disabled placeholder="Loading..." />
          </div>
          <div className="input-group">
            <label>Action</label>
            <select disabled>
              <option>Loading...</option>
            </select>
          </div>
        </div>
        <button disabled>Loading...</button>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="title">Cipher Tool 🔐</h1>

        <div className="darktoggle">
          <label style={{ cursor: "pointer" }}>
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            Dark Mode
          </label>
        </div>
      </div>

      <div className="form-container">
        <div className="input-group">
          <label>Select Cipher</label>
          <select value={cipher} onChange={(e) => setCipher(e.target.value)}>
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
          <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Enter your key" />
        </div>

        <div className="input-group">
          <label>Action</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
        </div>
      </div>

      <button onClick={handleSubmit}>Process</button>

      {(result || matrix.length > 0 || steps.length > 0) && (
        <div className="results-container">
          {result && (
            <div className="result">
              <h2>Result</h2>
              <p>
                {result.split("").map((char, index) => (
                  <span key={index}>{char}</span>
                ))}
              </p>
            </div>
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
              <ul>
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App

