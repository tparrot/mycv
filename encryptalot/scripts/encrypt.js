document.addEventListener("DOMContentLoaded", () => {
    const encryptButton = document.getElementById("encryptButton");
    const yamlInput = document.getElementById("yamlInput");
    const passphraseInput = document.getElementById("passphraseInput");
    const passphraseConfirm = document.getElementById("passphraseConfirm");
    const encryptedOutput = document.getElementById("encryptedOutput");
    const copyButton = document.getElementById("copyButton");

    if (encryptButton && yamlInput && passphraseInput && encryptedOutput) {
        encryptButton.addEventListener("click", async () => {
            const yamlData = yamlInput.value.trim();
            const passphrase = passphraseInput.value.trim();
            const confirmPass = passphraseConfirm.value.trim();

            if (!yamlData || !passphrase) {
                alert("Please provide both YAML data and a passphrase.");
                return;
            }

            if (passphrase !== confirmPass) {
                alert("Passphrases do not match!");
                return;
            }

            try {
                const encryptedData = await encryptText(yamlData, passphrase);
                encryptedOutput.value = encryptedData;
                copyButton.style.display = "block";
            } catch (error) {
                alert("Encryption failed: " + error.message);
            }
        });

        copyButton.addEventListener("click", () => {
            encryptedOutput.select();
            document.execCommand("copy");
            alert("Encrypted data copied to clipboard!");
        });
    }
});

// Add the missing encryption functions
async function importKey(passphrase) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(passphrase),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );
    return keyMaterial;
}

async function deriveKey(passphrase, salt) {
    const keyMaterial = await importKey(passphrase);
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt"]
    );
}

async function encryptText(text, passphrase) {
    // Generate random salt and iv
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await deriveKey(passphrase, salt);

    // Encrypt the text
    const enc = new TextEncoder();
    const ciphertext = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        enc.encode(text)
    );

    // Convert binary data to base64 strings
    const saltBase64 = btoa(String.fromCharCode(...salt));
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

    // Return JSON containing all the encryption data
    return JSON.stringify({
        salt: saltBase64,
        iv: ivBase64,
        ciphertext: ciphertextBase64
    });
}
