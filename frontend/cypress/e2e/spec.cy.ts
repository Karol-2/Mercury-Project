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
      .type("ltruman5@hc360.com")
      .should("have.value", "ltruman5@hc360.com");

    cy.get('input[name="password"]')
      .type("full-range")
      .should("have.value", "full-range");

    cy.get('[data-testid="Login"]').click();
  });

  it("Register", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeRegister"]').click();

    cy.get('input[name="first_name"]')
      .type("John")
      .should("have.value", "John");

    cy.get('input[name="last_name"]')
      .type("Smith")
      .should("have.value", "Smith");

    cy.get('input[name="country"]')
      .focus()
      .type("Albania{enter}", { force: true });

    cy.get('input[name="mail"]')
      .type("johnsmith@mail.com")
      .should("have.value", "johnsmith@mail.com");

    cy.get('input[name="password"]')
      .type("password")
      .should("have.value", "password");

    cy.get('[data-testid="Register"]').click();

    cy.get('input[name="email"]')
      .type("johnsmith@mail.com")
      .should("have.value", "johnsmith@mail.com");

    cy.get('input[name="password"]')
      .type("password")
      .should("have.value", "password");

    cy.get('[data-testid="Login"]').click();

    cy.get('[data-testid="RemoveAccount"]').should("exist").click();
    cy.get('[data-testid="Yes"]').should("exist").click();
  });
});
