document.addEventListener("DOMContentLoaded", () => {
    const decryptButton = document.getElementById("decryptButton");
    const encryptedInput = document.getElementById("encryptedInput");
    const passphraseInput = document.getElementById("passphraseInput");
    const decryptedOutput = document.getElementById("decryptedOutput");

    if (decryptButton && encryptedInput && passphraseInput && decryptedOutput) {
        decryptButton.addEventListener("click", async () => {
            const encryptedData = encryptedInput.value.trim();
            const passphrase = passphraseInput.value.trim();

            if (!encryptedData || !passphrase) {
                alert("Please provide both encrypted data and a passphrase.");
                return;
            }

            try {
                const decryptedData = await decryptText(encryptedData, passphrase);
                const yamlData = jsyaml.load(decryptedData);
                decryptedOutput.value = jsyaml.dump(yamlData);
            } catch (error) {
                alert("Decryption failed: " + error.message);
            }
        });
    }
});

// Import existing decryption functions from the CV project
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
        ["decrypt"]
    );
}

async function decryptText(encryptedData, passphrase) {
    const data = JSON.parse(encryptedData);
    const salt = Uint8Array.from(atob(data.salt), c => c.charCodeAt(0));
    const iv = Uint8Array.from(atob(data.iv), c => c.charCodeAt(0));
    const ciphertext = Uint8Array.from(atob(data.ciphertext), c => c.charCodeAt(0));

    const key = await deriveKey(passphrase, salt);
    const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decryptedBuffer);
}
