/// <reference types="Cypress" />

describe("Upload profile photo:", () => {
  it("Upload profile photo", function () {
    cy.visit("/profile");
    cy.server();
    cy.route("POST", "**/profile").as("uploadPhoto");
    cy.intercept("/profile/updateMyProfile").as("saveProfile");

    const fileName = "images/circle.png";

    cy.fixture(fileName)
      .then(Cypress.Blob.base64StringToBlob)
      .then((blob) => {
        cy.log("this is blob: " + JSON.stringify(blob));
        // just get the first row
        cy.get(".ant-upload-select > .ant-upload").find("input").attachFile({
          fileContent: blob,
          fileName: fileName,
          mimeType: "image/png",
        });
        cy.wait("@uploadPhoto")
          .its("status")
          .should("eq", 404)
          .then((res) => {
            cy.contains("Update").click();
          });
        cy.wait("@saveProfile").then(({ response }) => {
          debugger;
          expect(response.body.isSuccess).true;
        });
      });
  });
  it("Update profile photo", function () {});
  it("Update empty file as profile", function () {});
});
