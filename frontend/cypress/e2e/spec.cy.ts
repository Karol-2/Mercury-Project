describe("E2E tests", () => {
  it("Welcome page buttons exist", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').should("exist");
    cy.get('[data-testid="WelcomeRegister"]').should("exist");
    cy.contains("button", "Join Us!").should("exist");
  });

  it("Login", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("lewy.robi@pzpn.pl");
      cy.get("#password").type("Euro2012");
      cy.get("#kc-login").should("exist").click();
    });

    cy.wait(2000);

    cy.get('[data-testid="Edit"]').should("exist");
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

    cy.wait(2000);

    cy.get('[data-testid="Edit"]').should("exist");
    cy.get('[data-testid="RemoveAccount"]').should("exist");
  });

  it("Edit data", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("johnsmith@mail.com");
      cy.get("#password").type("password");
      cy.get("#kc-login").should("exist").click();
    });

    cy.wait(2000);

    cy.get('[data-testid="Edit"]').should("exist").click();

    cy.wait(3000);

    cy.get('input[name="first_name"]').clear().type("Johnny");
    cy.get('input[name="last_name"]').clear().type("Blacksmith");
    cy.get('input[name="mail"]').clear().type("johnnyblacksmith@mail.com");
    cy.get('[data-testid="Save"]').should("exist").click();

    cy.wait(2000);

    cy.get('[data-testid="My Profile"]').should("exist").click();

    cy.wait(1000);

    cy.contains("p", "Johnny Blacksmith").should("exist");
    cy.contains("p", "johnnyblacksmith@mail.com").should("exist");
    cy.get('[data-testid="Edit"]').should("exist");
    cy.get('[data-testid="RemoveAccount"]').should("exist");
  });

  it("Change password", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("johnsmith@mail.com");
      cy.get("#password").type("password");
      cy.get("#kc-login").should("exist").click();
    });

    cy.wait(2000);

    cy.get('[data-testid="Edit"]').should("exist").click();

    cy.wait(3000);

    cy.get('[data-testid="Change"]').should("exist").click();

    cy.wait(4000);

    cy.origin("http://localhost:3000", () => {
      cy.get("#password-new").type("password2");
      cy.get("#password-confirm").type("password2");
      cy.get('input[type="submit"]').should("exist").click();
    });

    cy.wait(2000);

    cy.get('[data-testid="Edit"]').should("exist");
    cy.get('[data-testid="RemoveAccount"]').should("exist");
  });

  it("Search users", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("johnsmith@mail.com");
      cy.get("#password").type("password2");
      cy.get("#kc-login").should("exist").click();
    });

    cy.wait(2000);

    cy.get('[data-testid="Search"]').should("exist").click();
    cy.wait(1000);
    cy.get('[data-testid="SearchBox"]').type("Robert Lewandowski");
    cy.get('[data-testid="SearchButton"]').should("exist").click();

    cy.wait(1000);

    cy.contains("p", "Robert Lewandowski").should("exist");
  });

  it("Remove account", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="WelcomeLogin"]').click();

    cy.origin("http://localhost:3000", () => {
      cy.get("#username").type("johnsmith@mail.com");
      cy.get("#password").type("password2");
      cy.get("#kc-login").should("exist").click();
    });

    cy.wait(2000);

    cy.get('[data-testid="RemoveAccount"]').should("exist").click();
    cy.get('[data-testid="Yes"]').should("exist").click();
  });
});
