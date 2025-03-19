# My Interactive CV

This project is an interactive and customizable CV built with HTML, CSS, and JavaScript. It allows users to display their professional and personal information in a visually appealing and interactive format.

## Features

- **Interactive Timeline**: Displays career milestones and positions with hover and click interactions.
- **Skill Visualization**: Showcases skills with dynamic bubble charts.
- **Preferences Visualization**: Displays personal preferences using treemaps or bar charts.
- **Multilingual Support**: Supports English and German translations.
- **High Contrast Mode**: Accessibility feature for better visibility.
- **Print-Friendly**: Optimized for printing the CV.
- **Encrypted Configuration**: Protects sensitive data with AES-GCM encryption.

## Getting Started

### Prerequisites

- A modern web browser with JavaScript enabled.
- Internet connection for external resources (e.g., Bootstrap, D3.js).

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mycv
   ```

2. Open the `index.html` file in your browser:
   ```bash
   open index.html
   ```

### Usage

1. **Unlock Encrypted Data**:
   - Enter the passphrase in the input field at the top of the page.
   - Click the "Unlock" button to decrypt and load your personal data.

2. **Switch Language**:
   - Use the "Deutsch/English" button to toggle between languages.

3. **Toggle High Contrast Mode**:
   - Click the "High Contrast" button for better visibility.

4. **Print the CV**:
   - Click the "Print" button to generate a print-friendly version.

5. **Interactive Features**:
   - Hover over timeline items, skills, or accomplishments for additional details.
   - Click on skills or timeline items to filter related positions.

## Configuration

### Default Configuration

The default configuration is embedded in the `index.html` file under the `<script id="default-config">` tag. It includes placeholders for personal information, positions, skills, and preferences.

### Custom Configuration

To use a custom configuration:
1. Create a YAML file with your personal data. For example:
   ```yaml
   page_title: "My Custom CV"
   personal_info:
     name: "Jane Doe"
     title: "Software Engineer"
     email: "jane.doe@example.com"
     phone: "+1 234-567-8901"
   positions:
     - id: "software_engineer"
       category: "work"
       start: "2020-01"
       end: "2023-01"
       translations:
         en:
           title: "Software Engineer"
           company: "Tech Corp"
           description: "Developed scalable web applications."
   skills:
     - id: "JavaScript"
       level: 9
   preferences:
     - id: "remote_work"
       level: 8
       translations:
         en: "Remote Work"
   ```

2. Encrypt the YAML file using AES-GCM encryption.

#### Linux CLI Example

You can use OpenSSL to encrypt the YAML file:

```bash
# Generate a random salt and IV
SALT=$(openssl rand -base64 16)
IV=$(openssl rand -base64 12)

# Encrypt the YAML file
openssl enc -aes-256-gcm -pbkdf2 -iter 100000 -salt -S "$(echo $SALT | base64 -d | xxd -p)" -iv "$(echo $IV | base64 -d | xxd -p)" -in custom-config.yaml -out custom-config.enc -pass pass:your-passphrase

# Convert the encrypted file to base64
ENCODED=$(base64 -w 0 custom-config.enc)

# Create the JSON structure
cat <<EOF > encrypted-config.json
{
  "salt": "$SALT",
  "iv": "$IV",
  "ciphertext": "$ENCODED"
}
EOF

echo "Encrypted configuration saved to encrypted-config.json"
```

3. Replace the content of the `<script id="custom-config">` tag in `index.html` with the encrypted JSON from `encrypted-config.json`.

### Translation Configuration

Translations are defined in the `<script id="translation-config">` tag. You can add or modify translations for additional languages.

## Development

### File Structure

- `index.html`: Main HTML file containing the structure and scripts.
- `README.md`: Documentation for the project.
- External libraries:
  - Bootstrap: For styling.
  - D3.js: For data visualization.
  - js-yaml: For parsing YAML configurations.

### Adding New Features

1. Modify the `index.html` file to add new sections or features.
2. Update the YAML configuration for new data fields.
3. Test the changes in a browser.

### Debugging

- Open the browser's developer tools to inspect elements and debug JavaScript.
- Check the console for error messages.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/)
- [D3.js](https://d3js.org/)
- [js-yaml](https://github.com/nodeca/js-yaml)
- [DiceBear Avatars](https://dicebear.com/)
