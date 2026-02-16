# Contributing to Asexuality in Media

Thank you for your interest in contributing to this project! This guide will help you get started.

## Ways to Contribute

### 1. Submit Character Data

The easiest way to contribute is by submitting asexual characters you know about:

- Use our [Character Submission Form](https://github.com/yejukebox/asexualityinmedia/issues/new?template=character-submission.yml)
- Provide as much detail as possible
- Include evidence for explicit or implicit representation

### 2. Improve Documentation

- Fix typos or unclear instructions
- Add examples to the README
- Improve code comments
- Translate documentation

### 3. Enhance the Visualization

- Improve D3.js visualization features
- Add new filtering options
- Optimize performance
- Enhance mobile responsiveness

### 4. Fix Bugs

- Report bugs via GitHub Issues
- Submit pull requests with fixes
- Add tests to prevent regressions

## Development Workflow

### Prerequisites

- Git
- Hugo (v0.155.3+)
- Python 3.x
- Text editor or IDE

### Setup

1. Fork the repository on GitHub

2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/asexualityinmedia.git
   cd asexualityinmedia
   ```

3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/yejukebox/asexualityinmedia.git
   ```

### Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test locally:
   ```bash
   hugo server -D
   ```

4. Build to verify:
   ```bash
   hugo --minify
   ```

### Submitting Changes

1. Commit your changes:
   ```bash
   git add .
   git commit -m "Brief description of changes"
   ```

2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Open a Pull Request on GitHub

## Code Style Guidelines

### HTML/Hugo Templates

- Use semantic HTML elements
- Follow Hugo template conventions
- Keep templates modular and reusable
- Use partials for repeated content

### CSS

- Follow existing naming conventions
- Use CSS variables for colors and common values
- Write mobile-first responsive styles
- Keep selectors simple and maintainable

### JavaScript

- Use ES6+ features
- Write clear, descriptive variable names
- Comment complex logic
- Keep functions focused and small

### Python Scripts

- Follow PEP 8 style guide
- Use meaningful variable names
- Add docstrings to functions
- Handle errors gracefully

## Data Guidelines

### Character Data Quality

When adding characters to `data/characters.json`:

- **ID**: Use lowercase, hyphenated slugs (e.g., "todd-chavez")
- **Full Name**: Use complete character name as shown in media
- **Nickname**: Common or preferred name if different
- **Title**: Exact show/film title
- **Genre**: Use consistent genre categories
- **Year**: First release year
- **Rating**: Use standard rating system (TV-MA, PG-13, etc.)
- **Language**: Primary language of the media
- **Type**: "explicit" or "implicit"
- **Description**: Brief, informative summary

### Explicit vs. Implicit

**Explicit Representation:**
- Character states they are asexual
- Creator confirms asexuality
- Clear narrative confirmation

**Implicit Representation:**
- Consistent behavioral patterns
- Character traits align with asexuality
- Lack of sexual/romantic interest portrayed meaningfully

## Testing

Before submitting:

1. Test the visualization with your changes
2. Verify all filters work correctly
3. Check character pages display properly
4. Test on mobile devices
5. Verify links work
6. Build with `hugo --minify` without errors

## Commit Message Guidelines

Write clear, descriptive commit messages:

```
Add feature: Brief description

- Detailed point about change
- Another point if needed
- Reference issues: #123
```

**Good examples:**
- "Add year range filter to visualization"
- "Fix mobile responsive layout for character pages"
- "Update character data: Add 5 new characters"

**Avoid:**
- "Update files"
- "Fix bug"
- "Changes"

## Pull Request Guidelines

When submitting a PR:

1. **Title**: Clear, descriptive title
2. **Description**: Explain what and why
3. **Testing**: Describe how you tested
4. **Screenshots**: Include for visual changes
5. **Issues**: Link related issues

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Changes have been tested locally
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Builds successfully with `hugo --minify`
- [ ] Commit messages are clear
- [ ] PR description is complete

## Review Process

1. Maintainers review your PR
2. Feedback may be provided
3. Make requested changes if needed
4. Once approved, PR will be merged
5. Changes deploy automatically to GitHub Pages

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Ideas**: Open an Issue with "enhancement" label
- **Urgent**: Tag maintainers in comments

## Code of Conduct

Be respectful and constructive:

- Use welcoming and inclusive language
- Respect differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy toward others

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Release notes for significant contributions
- Project documentation

## Questions?

If you're unsure about anything, don't hesitate to ask! Open an issue or discussion, and we'll help you get started.

Thank you for contributing! 💜
