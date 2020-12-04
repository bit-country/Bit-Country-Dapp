/// <reference types="Cypress" />
describe("Editing profile sessions", () => {
  beforeEach(() => {
    cy.visit("/profile");
    cy.fixture("profile").as("profile");
  });

  it("Updating details with valid data", () => {
    cy.intercept("/profile/updateMyProfile").as("saveProfile");

    cy.get("@profile")
      .then((profileData) => profileData.find((x) => x.valid))
      .as("validProfile");

    cy.get("@validProfile").then(({ data }) => {
      Object.keys(data).forEach((field) => {
        cy.get(`[name = ${field}]`).clear().type(data[field]);
      });
      cy.contains("Update").click();
    });

    cy.wait("@saveProfile").then(({ response }) => {
      expect(response.body.isSuccess).true;
      // reset password
      cy.get("@validProfile").then(({ data }) => {
        cy.get(`[name = currentPassword]`).clear().type(data["newPassword"]);
        cy.get(`[name = newPassword]`).clear().type(data["currentPassword"]);
        cy.get(`[name = confirmPassword]`)
          .clear()
          .type(data["currentPassword"]);
        cy.contains("Update").click();
      });
    });
  });

  // it("Updating details with invalid data", () => {});
  // it("Updating new password with wrong password ", () => {});
  // it("Updating blogUID with existing Id ", () => {});
});
