# 05-notehub

**NoteHub** — a note-taking app built with **React**, **TypeScript**, and [Vite](https://vitejs.dev/). It is a homework project from the [GoIT](https://goit.global/) course that practices full CRUD work with a REST API using [TanStack Query](https://tanstack.com/query), form handling and validation with Formik and Yup, debounced search, and pagination.

## 📋 About

Users can create, browse, search, and delete notes stored on the GoIT NoteHub API:

- **Notes list** — notes are fetched from the API 12 per page and shown as cards with a title, content, and a tag (`Todo`, `Work`, `Personal`, `Meeting`, `Shopping`).
- **Debounced search** — the search box updates the query one second after the user stops typing ([use-debounce](https://github.com/xnimorz/use-debounce)) and resets the page to 1. A toast is shown when nothing is found.
- **Pagination** — [react-paginate](https://github.com/AdeleD/react-paginate) appears when there is more than one page and stays in sync with the current page. `keepPreviousData` keeps the previous page visible while the next one loads.
- **Creating notes** — the **Create note +** button opens a modal (rendered with `createPortal`) with a [Formik](https://formik.org/) form. Validation is defined with [Yup](https://github.com/jquense/yup): the title is required, 3–50 characters, with no leading or trailing spaces; the content is up to 500 characters; the tag must be one of the five allowed values. On success the notes list is refreshed and the modal closes.
- **Deleting notes** — each card has a **Delete** button; the list is refetched after a successful deletion, and the button is disabled while the request is pending.
- **Modal** — closes on the Cancel button, a backdrop click, or the `Escape` key, and page scrolling is locked while it is open.
- **Loading and errors** — a bar loader ([react-spinners](https://github.com/davidhu2000/react-spinners)) is shown during loading, and request errors are displayed as toast messages ([react-hot-toast](https://react-hot-toast.com/)).
- **Devtools** — React Query Devtools are included for inspecting the query cache during development.

### Components

- `App` — holds the search, page, and modal state and runs the notes query.
- `SearchBox` — the search input.
- `NoteList` — the list of note cards and the delete mutation.
- `NoteForm` — the note creation form with validation and the create mutation.
- `Modal` — a reusable modal window.
- `Pagination` — a wrapper around `react-paginate`.
- `Loader` — the loading indicator.

API requests (`fetchNotes`, `createNote`, `deleteNote`) live in `src/services/noteService.ts`, and the `Note`, `NoteTag`, and `CreateNote` types in `src/types/note.ts`.

## 🛠️ Tech Stack

- [React](https://react.dev/) 19 (function components, hooks, portals)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — dev server and bundler
- [TanStack Query](https://tanstack.com/query) v5 with Devtools — data fetching, mutations, and caching
- [Formik](https://formik.org/) and [Yup](https://github.com/jquense/yup) — forms and validation
- [axios](https://axios-http.com/) — HTTP client
- [react-paginate](https://github.com/AdeleD/react-paginate), [use-debounce](https://github.com/xnimorz/use-debounce), [react-hot-toast](https://react-hot-toast.com/), [react-spinners](https://github.com/davidhu2000/react-spinners)
- [React Compiler](https://react.dev/learn/react-compiler) — enabled via Babel preset in `vite.config.ts`
- CSS Modules for component styles, plus [modern-normalize](https://github.com/sindresorhus/modern-normalize)
- ESLint (`typescript-eslint`, `react-hooks`, `react-refresh`) and Prettier

## 📁 Project Structure

```
05-notehub-main/
├── src/
│   ├── components/
│   │   ├── App/             # Root component: search, pagination, modal state
│   │   ├── SearchBox/        # Search input
│   │   ├── NoteList/          # Note cards and delete mutation
│   │   ├── NoteForm/           # Create-note form (Formik + Yup)
│   │   ├── Modal/               # Reusable modal
│   │   ├── Pagination/           # react-paginate wrapper
│   │   └── Loader/                # Loading indicator
│   ├── services/
│   │   └── noteService.ts         # NoteHub API requests
│   ├── types/
│   │   └── note.ts                 # Note types
│   ├── global.css                   # Global styles
│   └── main.tsx                      # Entry point, QueryClientProvider
├── public/                            # Static files (favicon, icons)
├── index.html
├── vite.config.ts                      # Vite configuration
├── eslint.config.js                     # ESLint configuration
└── package.json
```

## 🚀 Getting Started

Requires an LTS version of [Node.js](https://nodejs.org/) and a NoteHub API token (issued as part of the GoIT course).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root and add your token:

   ```
   VITE_NOTEHUB_TOKEN=your_notehub_token
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

Other scripts:

```bash
npm run lint      # Lint the code
npm run build     # Type-check and build for production
npm run preview   # Preview the production build
```

> **Note:** Vite embeds `VITE_*` variables into the client bundle, so the token is visible in the built app. Never commit your `.env` file.
