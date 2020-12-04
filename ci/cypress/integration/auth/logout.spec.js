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
    cy.viewport(1400, 800);
    cy.get(".ant-avatar").trigger("click");

    cy.get(".ant-dropdown-menu > :nth-child(4)").then((email) => {
      cy.contains("Logout").click();
    });

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
