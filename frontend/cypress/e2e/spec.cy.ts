describe("template spec", () => {
  it("checks login and register buttons on welcome", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').should("exist");
    cy.get('[data-testid="WelcomeRegister"]').should("exist");
  });

  it("Login", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("ltruman5@hc360.com");
      cy.get("#password").type("full-range");
      cy.get("#kc-login").should("exist").click();
    });

    cy.get('[data-testid="RemoveAccount"]').should("exist");
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

    cy.wait(2000);

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("johnsmith@mail.com");
      cy.get("#password").type("password");
      cy.get("#kc-login").should("exist").click();
    });

    cy.get('[data-testid="RemoveAccount"]').should("exist").click();
    cy.get('[data-testid="Yes"]').should("exist").click();
  });

  it("Change password", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("ltruman5@hc360.com");
      cy.get("#password").type("full-range");
      cy.get("#kc-login").should("exist").click();
    });

    cy.wait(4000);

    cy.get('[data-testid="Edit"]').should("exist").click();

    cy.wait(4000);

    cy.get('[data-testid="Change"]').should("exist").click();

    cy.wait(4000);

    cy.origin("http://localhost:3000", () => {
      cy.get("#password-new").type("password2");
      cy.get("#password-confirm").type("password2");
      cy.get('input[type="submit"]').should("exist").click();
    });

    cy.get('[data-testid="RemoveAccount"]').should("exist");
  });
});
