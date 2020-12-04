// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "cypress-file-upload";
import { BackEnd } from "./endpoints";
import Cookies from "js-cookie";

// Cypress.Commands.add("syncCandidates", () => {
//     // is there a quick way of checking if sync needs to happen?
//     // not checking if the user is loged in as employer or recruiter
//     // that should have been tested as part of API testing
//     cy.getLocalStorage('token').then((token) => {
//         cy
//             .request({
//                 method: 'GET',
//                 url: 'https://localhost:44398/api/recruiter/candidates/zoho/sync',
//                 headers: {
//                     authorization: `Bearer ${token}`
//                 },
//                 timeout: 60000 // could take a while
//             })
//             .its('status').should('be', 200);
//     });
// });

// Cypress.Commands.add("register", (userRole) => {
//     cy.get('@credentials').then((credentials) => {
//         const email = credentials.find(user => user.role === userRole)?.email;
//         expect(email).to.not.be.null;
//         cy.wrap(email).as('email');
//     });

//     cy.get('@email').then((email) => {
//         cy
//             .request({
//                 method: 'POST',
//                 url: 'https://localhost:44398/api/Auth/account/recruiter/signup',
//                 body: {
//                     email: email,
//                     password: 'password', // dummy password as account is actually passwordless
//                     confirmPassword: 'password',
//                     termsConditionsAccepted: true
//                 },
//                 failOnStatusCode: false // to ignore failures for previously registering the user
//             })
//             .then((response) => {
//                 expect(response, 'Failed to register').to.satisfy(function (resp) {
//                     return response.status === 200 ||
//                         (response.status === 400 &&
//                             response.body === 'The account is already existed in our system');
//                 });
//             });
//     });

// });

Cypress.Commands.add("logout", () => {
  Cookies.remove("bitToken");

  cy.visit("/login");
});

Cypress.Commands.add("login", () => {
  // NOTE: credentials have been loaded in global before hook
  cy.get("@credentials").then((user) => {
    const { email, password } = user.find((x) => x.valid);
    cy.request({
      method: "POST",
      // this url differs from the baseUrl defined in cypress config
      url: `${BackEnd}/authentication/signin`,
      body: {
        email,
        password,
      },
    })
      // .its("status")
      // .should("be", 200)
      .then((res) => {
         expect(res.status).to.eq(200);
        expect(res.body.token.token).to.not.null;
        Cookies.set("bitToken", res.body.token.token);

        // document.cookie = `bitToken=${res.body.token.token}`;
      });
  });
});

Cypress.Commands.add("getLocalStorage", (key) => {
  cy.window().then((window) => window.localStorage.getItem(key));
});

Cypress.Commands.add("setLocalStorage", (key, value) => {
  cy.window().its("localStorage").invoke("setItem", key, value);
});
