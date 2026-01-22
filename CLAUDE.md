# Project: Payjoin Integrations Tracker

Turn a CSV export of Payjoin integrations into a GitHub Pages site using **MkDocs Material**, rendering the data as a table from a canonical YAML file.

Assume
- A CSV export already exists at the repo in ExportBlock folder (e.g. `integrations.csv`)
- This repo is otherwise empty


The end state should be:
- Canonical data stored as YAML
- A rendered table on a docs site
- Deployed automatically via GitHub Pages (GitHub Actions)

---

# Tasks (in order)

## 1. Repo scaffold

Create the following structure:
.
├── mkdocs.yml
├── docs/
│ ├── index.md
│ └── integrations.md
├── data/
│ └── integrations.yaml
├── .github/
│ └── workflows/
│ └── deploy.yml
└── integrations.csv


Do NOT delete the CSV yet.

---

## 2. Convert CSV → YAML

- Read `integrations.csv`
- Convert each row into a YAML list entry
- Preserve all columns as keys
- Normalize keys to `snake_case`
- Output to `data/integrations.yaml`

If a column is empty, still include the key with a null value.

This YAML file is the **single source of truth** going forward.

---

## 3. MkDocs configuration

Create `mkdocs.yml` with:
- `material` theme
- `search` plugin
- `table-reader` plugin enabled
- Clean, minimal config (no extra features)

Site title can be something neutral like:
> Payjoin Integration Tracker

---

## 4. Docs pages

### `docs/index.md`
- Short explanation of what this tracker is
- State that data is canonical and lives in the repo
- Mention that updates happen via PRs

### `docs/integrations.md`
- Render the table directly from `data/integrations.yaml`
- Use the table-reader plugin (no manual tables)
- No hardcoded data in Markdown

---

## 5. GitHub Pages deployment

Create a GitHub Actions workflow that:
- Runs on `push` to `main`
- Installs Python + MkDocs Material + table-reader
- Builds the site
- Deploys to GitHub Pages

Use the standard MkDocs → Pages pattern.
Do NOT use deprecated `gh-pages` actions.

---

## 6. Constraints / style

- Prefer clarity over cleverness
- No JavaScript, no React, no custom tooling
- Everything must be reviewable in PRs
- Assume non-technical contributors may edit YAML later

---

# Deliverables

When done, output:
1. All created file contents (verbatim)
2. A brief checklist of **manual steps I must do in GitHub UI** to finish setup (Pages enablement)

Do not include explanations beyond that.


---

## To-replace Project Overview

This repository tracks Payjoin integration candidates - a CRM-style pipeline for Bitcoin wallet and service providers who may integrate the Payjoin protocol. The data includes contact information, integration status, estimated value, and programming languages used by each candidate.

## To-replace Data Structure

The CSV files in `ExportBlock-*/` contain integration candidate data with the following fields:
- **Name**: Contact person(s)

- **Priority**: High or blank
- **Estimated Value**: Potential deal value
- **Company**: Organization name
- **Last Contact**: Date of last communication
- **Language**: Programming languages used (relevant for integration: Rust, TypeScript, WASM, Flutter, React Native, UniFFI, Python, C#, etc.)
- **Bounty**: Integration bounty amount if applicable

## Integration Status Pipeline (to replace)

1. Lead - Initial prospect
2. Contacted - Reached out
3. Qualified - Confirmed interest/fit
4. Negotiation - Discussing terms
5. Draft Integration - Technical work started
6. Beta 💪 - Integration in testing
7. Lost - Did not proceed
