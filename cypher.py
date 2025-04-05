import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext

# Caesar Cipher
def caesar_encrypt(text, key):
    result = ""
    for char in text:
        if char.isalpha():
            shift = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - shift + int(key)) % 26 + shift)
        else:
            result += char
    return result

def caesar_decrypt(text, key):
    return caesar_encrypt(text, -int(key))

# Vigenère Cipher
def vigenere_encrypt(text, key):
    key = key.upper()
    result = ""
    k = 0
    for char in text:
        if char.isalpha():
            shift = ord(key[k % len(key)]) - ord('A')
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
            k += 1
        else:
            result += char
    return result

def vigenere_decrypt(text, key):
    key = key.upper()
    result = ""
    k = 0
    for char in text:
        if char.isalpha():
            shift = ord(key[k % len(key)]) - ord('A')
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base - shift) % 26 + base)
            k += 1
        else:
            result += char
    return result

# Playfair Cipher
def generate_playfair_matrix(key):
    key = "".join(dict.fromkeys(key.upper().replace("J", "I")))
    matrix = []
    used = set()
    for char in key:
        if char not in used and char.isalpha():
            used.add(char)
            matrix.append(char)
    for char in "ABCDEFGHIKLMNOPQRSTUVWXYZ":
        if char not in used:
            used.add(char)
            matrix.append(char)
    return [matrix[i*5:(i+1)*5] for i in range(5)]

def find_position(matrix, char):
    for i in range(5):
        for j in range(5):
            if matrix[i][j] == char:
                return i, j
    return None, None

def playfair_prepare_text(text):
    text = text.upper().replace("J", "I")
    result = ""
    i = 0
    while i < len(text):
        a = text[i]
        b = text[i+1] if i+1 < len(text) else "X"
        if a == b:
            result += a + "X"
            i += 1
        else:
            result += a + b
            i += 2
    if len(result) % 2 != 0:
        result += "X"
    return result

def playfair_encrypt(text, key):
    matrix = generate_playfair_matrix(key)
    text = playfair_prepare_text("".join(filter(str.isalpha, text)))
    result = ""
    for i in range(0, len(text), 2):
        a, b = text[i], text[i+1]
        r1, c1 = find_position(matrix, a)
        r2, c2 = find_position(matrix, b)
        if r1 == r2:
            result += matrix[r1][(c1 + 1) % 5] + matrix[r2][(c2 + 1) % 5]
        elif c1 == c2:
            result += matrix[(r1 + 1) % 5][c1] + matrix[(r2 + 1) % 5][c2]
        else:
            result += matrix[r1][c2] + matrix[r2][c1]
    return result

def playfair_decrypt(text, key):
    matrix = generate_playfair_matrix(key)
    text = "".join(filter(str.isalpha, text.upper()))
    result = ""
    for i in range(0, len(text), 2):
        a, b = text[i], text[i+1]
        r1, c1 = find_position(matrix, a)
        r2, c2 = find_position(matrix, b)
        if r1 == r2:
            result += matrix[r1][(c1 - 1) % 5] + matrix[r2][(c2 - 1) % 5]
        elif c1 == c2:
            result += matrix[(r1 - 1) % 5][c1] + matrix[(r2 - 1) % 5][c2]
        else:
            result += matrix[r1][c2] + matrix[r2][c1]
    return result

# Process function
def process():
    method = cipher_choice.get()
    text = input_text.get("1.0", "end-1c")
    key = key_entry.get()
    mode = mode_choice.get()

    if not text.strip() or not key.strip():
        messagebox.showwarning("Input Error", "Please enter both message and key.")
        return

    try:
        if method == "Caesar":
            result = caesar_encrypt(text, key) if mode == "Encrypt" else caesar_decrypt(text, key)
        elif method == "Vigenère":
            result = vigenere_encrypt(text, key) if mode == "Encrypt" else vigenere_decrypt(text, key)
        elif method == "Playfair":
            result = playfair_encrypt(text, key) if mode == "Encrypt" else playfair_decrypt(text, key)
        else:
            result = "Invalid Method"
    except Exception as e:
        result = f"Error: {str(e)}"

    output_text.config(state="normal")
    output_text.delete("1.0", "end")
    output_text.insert("end", result)
    output_text.config(state="disabled")

# GUI Setup
root = tk.Tk()
root.title("Classic Cipher Encryption Tool")
root.geometry("600x550")
root.configure(bg="#f0f4f7")

title_label = tk.Label(root, text="Classic Cipher Encryption/Decryption Tool", font=("Arial", 16, "bold"), fg="#003366", bg="#f0f4f7")
title_label.pack(pady=10)

frame = tk.Frame(root, bg="#f0f4f7")
frame.pack(pady=10)

tk.Label(frame, text="Select Cipher:", bg="#f0f4f7", font=("Arial", 11)).grid(row=0, column=0, sticky="w", padx=5, pady=5)
cipher_choice = ttk.Combobox(frame, values=["Caesar", "Vigenère", "Playfair"], width=30)
cipher_choice.current(0)
cipher_choice.grid(row=0, column=1, padx=5, pady=5)

tk.Label(frame, text="Enter Key:", bg="#f0f4f7", font=("Arial", 11)).grid(row=1, column=0, sticky="w", padx=5, pady=5)
key_entry = tk.Entry(frame, width=33, font=("Arial", 10))
key_entry.grid(row=1, column=1, padx=5, pady=5)

tk.Label(frame, text="Mode:", bg="#f0f4f7", font=("Arial", 11)).grid(row=2, column=0, sticky="w", padx=5, pady=5)
mode_choice = ttk.Combobox(frame, values=["Encrypt", "Decrypt"], width=30)
mode_choice.current(0)
mode_choice.grid(row=2, column=1, padx=5, pady=5)

tk.Label(frame, text="Enter Message:", bg="#f0f4f7", font=("Arial", 11)).grid(row=3, column=0, sticky="nw", padx=5, pady=5)
input_text = scrolledtext.ScrolledText(frame, height=5, width=40, font=("Arial", 10))
input_text.grid(row=3, column=1, padx=5, pady=5)

tk.Button(root, text="Process", command=process, font=("Arial", 11), bg="#007acc", fg="white", padx=20, pady=5).pack(pady=10)

tk.Label(root, text="Result:", bg="#f0f4f7", font=("Arial", 11)).pack()
output_text = scrolledtext.ScrolledText(root, height=5, width=60, font=("Arial", 10), wrap="word", state="disabled", borderwidth=2, relief="sunken")
output_text.pack(padx=10, pady=10)

root.mainloop()
