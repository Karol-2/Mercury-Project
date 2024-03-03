describe("template spec", () => {
  it("checks login and register buttons on welcome", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').should("exist");
    cy.get('[data-testid="WelcomeRegister"]').should("exist");
  });

  it("Login", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();
    cy.get('input[name="email"]')
      .type("elonmusk@spacex.com")
      .should("have.value", "elonmusk@spacex.com");

    cy.get('input[name="password"]')
      .type("ILoveNASA")
      .should("have.value", "ILoveNASA");

    cy.get('[data-testid="Login"]').click();
  });
});
