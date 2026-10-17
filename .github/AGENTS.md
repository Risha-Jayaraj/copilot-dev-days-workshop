# Project Instructions

- Use plain HTML, CSS, and JavaScript. Do not add frameworks, build tools, or npm dependencies.
- Keep pure quiz logic in `src/quiz.js`; export it with `module.exports` and test it with `node:test`.
- Keep DOM access and event handling in `src/app.js`. Question data lives in `src/questions.js`.
- Define colors as CSS variables in `:root` in `src/style.css`; use those variables for colors.
- Keep the UI accessible: use buttons for actions, retain visible focus styles, and use `aria-live` for changing messages.
- Run `npm test` after code changes.