# SoSei

SoSei - សរសេរ is a simple template to create PDFs using HTML & CSS with [Paged.js](https://pagedjs.org/).

## Quick Start

Get started in minutes:

```bash
# Clone the repository
git clone https://github.com/samithseu/sosei.git
cd sosei

# Install dependencies
npm install

# Start the development server
npm run dev
```

Then open `src/pages/index.astro` and start editing to create your PDF.

## Features

- Print-ready components: headers, footers, and page numbers that appear on every page
- Automatic pagination with Paged.js
- Scoped CSS for easy customization
- Built with Astro 5 and TypeScript

## Usage

Once you've customized your content:

1. Run `npm run dev` to start the server
2. Open your browser to the local URL
3. Press Ctrl+P (or Cmd+P on Mac) to print to PDF

The document is automatically formatted for A4 paper size.

## Project Structure

```
sosei/
├── src/
│   ├── components/print/   # Header, footer, and positioning components
│   ├── layouts/            # Layout templates
│   └── pages/              # Your document pages
└── public/                 # Static assets
```

View the `src/pages/index.astro` file for a complete working example.
