# Asexuality in Media

A comprehensive, interactive catalog of asexual characters in television and film. This project provides an engaging visualization of ace representation across different genres, languages, and time periods.

## Features

- 📊 **Interactive Visualization**: D3.js-powered scatter plot showing characters across time and genres
- 🔍 **Advanced Filtering**: Filter by genre, language, representation type, and search by name
- 💬 **Community Feedback**: GitHub Discussions integration for rating and discussing representation
- 📝 **Easy Contributions**: GitHub Issue forms for submitting new characters
- 🚀 **Automatic Deployment**: GitHub Actions deploys to GitHub Pages on every push
- 🎨 **Responsive Design**: Mobile-friendly interface with ace flag colors

## Quick Start

### Prerequisites

- [Hugo](https://gohugo.io/installation/) (v0.155.3 or later)
- Python 3.x (for data conversion scripts)
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yejukebox/asexualityinmedia.git
   cd asexualityinmedia
   ```

2. Start the Hugo development server:
   ```bash
   hugo server -D
   ```

3. Open your browser to `http://localhost:1313/asexualityinmedia/`

## Project Structure

```
asexualityinmedia/
├── .github/
│   ├── workflows/
│   │   └── deploy.yml          # GitHub Actions deployment
│   └── ISSUE_TEMPLATE/
│       └── character-submission.yml  # Character submission form
├── content/
│   ├── characters/             # Character markdown files
│   ├── about.md               # About page
│   └── submit.md              # Submission page
├── data/
│   └── characters.json        # Character database
├── layouts/
│   ├── _default/
│   │   ├── baseof.html        # Base template
│   │   └── single.html        # Content page template
│   ├── characters/
│   │   └── single.html        # Character detail template
│   ├── partials/
│   │   └── giscus.html        # Comment system
│   └── index.html             # Homepage with visualization
├── static/
│   ├── css/
│   │   └── style.css          # Site styling
│   └── js/
│       └── visualization.js   # D3.js visualization
├── hugo.toml                  # Hugo configuration
└── README.md
```

## Adding Characters

### Method 1: From CSV/Excel

If you have character data in a spreadsheet:

1. Place your CSV or Excel file in the `scripts/` directory
2. Run the conversion script:
   ```bash
   python3 scripts/csv_to_json.py path/to/your/file.csv
   ```
3. Generate character pages:
   ```bash
   python3 scripts/generate_character_pages.py
   ```

**Expected CSV columns:**
- Full Name (required)
- Nickname (optional)
- Title (required)
- Genre
- Year
- Rating (e.g., TV-MA, PG-13)
- Language
- Type (explicit/implicit)
- Description (optional)

### Method 2: Manual Addition

1. Add character data to `data/characters.json`
2. Run the page generator:
   ```bash
   python3 scripts/generate_character_pages.py
   ```

### Method 3: Public Submission

Users can submit characters via the [GitHub Issue form](https://github.com/yejukebox/asexualityinmedia/issues/new?template=character-submission.yml).

## Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch.

### Setting up GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" in the sidebar
3. Under "Build and deployment", select "GitHub Actions" as the source
4. The workflow will run automatically on the next push

### Configuring Giscus

To enable comments:

1. Go to [giscus.app](https://giscus.app)
2. Enter your repository: `yejukebox/asexualityinmedia`
3. Enable Discussions in your GitHub repo settings
4. Copy the configuration values
5. Update `layouts/characters/single.html` with:
   - `data-repo-id`
   - `data-category-id`

## Development Scripts

### `generate_character_pages.py`

Generates Hugo markdown files from `characters.json`:

```bash
python3 scripts/generate_character_pages.py
```

### `csv_to_json.py`

Converts CSV/Excel files to the characters.json format:

```bash
python3 scripts/csv_to_json.py input.csv [output.json]
```

## Customization

### Changing Colors

Edit `static/css/style.css` and modify the CSS variables:

```css
:root {
    --ace-black: #000000;
    --ace-gray: #a3a3a3;
    --ace-white: #ffffff;
    --ace-purple: #800080;
}
```

### Modifying the Visualization

Edit `static/js/visualization.js` to change:
- Axis scales and positioning
- Color schemes
- Tooltip content
- Animation timings

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Asexual community for advocacy and education
- Content creators who include ace representation
- All contributors to this database

## Support

For issues, questions, or suggestions:
- Open a [GitHub Issue](https://github.com/yejukebox/asexualityinmedia/issues)
- Submit a [Pull Request](https://github.com/yejukebox/asexualityinmedia/pulls)

---

Made with 💜 for the ace community
