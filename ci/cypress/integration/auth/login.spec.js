/// <reference types="Cypress" />
import url from "url";

describe("Login", () => {
  it("sets auth cookie", function () {
    cy.visit("login");
    cy.get("@credentials").then((credential) => {
      const { email, password } = credential.find((x) => x.valid);
      cy.get(":nth-child(4) > .ant-input").type(email);
      cy.get(":nth-child(5) > .ant-input").type(password);
      cy.get(".ant-btn").click();
    });
 //   expect(".ant-avatar").to.not.null;

    //check that new page content has been loaded post login action
    cy.get(".ant-avatar")
      // .contains('body', 'Awesome!', { timeout: 10000 }) // default is 4 secs, it sometimes loads very slowly
      .should((body) => {
        debugger;
        //expect(body).to.have.contain("Error while processing request");
      });
  });
});
