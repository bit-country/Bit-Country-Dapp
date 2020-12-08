/// <reference types="Cypress" />

describe("Logout Test:", () => {
  beforeEach("Login", () => {
    cy.login();
  });

  // TODO this will need to be tested for client/employer later
  it("Logout", function () {
    cy.login();
    cy.visit("/");
    // perform UI logout
    cy.get("a.nav-btn > .anticon-logout").trigger("click");

    // // redirected back to login screen
    // cy.location("pathname").should("eq", "/login");
    // // check that local storage property 'authority' is set back to Guest
    // cy.getLocalStorage("authority").should("equal", '["Guest"]');
    // // check that local storage property 'token' has been cleared out
    // cy.getLocalStorage("token").then((token) => {
    //   expect(token).to.be.null;
    // });
  });
});
