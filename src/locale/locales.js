import es from "./translations/es.json";

// English is the default message in each of our source files, so no need for a separate en.json file
const en = {
  "app.title": "Bit.Country",
  "app.welcome": "Welcome"
};

const cn = {
  "app.title": "Bit.Country",
  "app.welcome": "Welcome"
};

// If we add more than just spanish, just import the files and export it below: export default { en, es, de }
export default { en, es, cn };