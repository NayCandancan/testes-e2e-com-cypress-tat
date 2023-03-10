describe('Scenarios where authentication is a pre-requirement', () => {
  beforeEach(() => cy.login())

  it('CRUDs a note', () => {
    const faker = require('faker')
    const noteDescription = faker.lorem.words(4)

    cy.intercept('GET', '**/notes').as('getNotes')

    cy.createNote(noteDescription)
    cy.wait('@getNotes')

    const updatedNoteDescription = faker.lorem.words(4)
    const attachFile = true

    cy.editNote(noteDescription, updatedNoteDescription, attachFile)
    cy.wait('@getNotes')

    cy.deleteNote(updatedNoteDescription)
    cy.wait('@getNotes')
  })
  it('successfully submits the form', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.intercept('POST', '**/prod/billing').as('paymentRequest')

    cy.fillSettingsFormAndSubmit()

    cy.wait('@getNotes')
    cy.wait('@paymentRequest').then(response => {
      expect(response.state).to.equal('Complete')
    })
  })
  it('logout', () => {
    cy.intercept('GET', '**/notes').as('getNotes')
    cy.visit('/')
    cy.wait('@getNotes')

    if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
      cy.get('.navbar-toggle.collapsed')
        .should('be.visible')
        .click()
    }

    /* ==== Generated with Cypress Studio ==== */
    cy.get('.nav > :nth-child(2) > a').click()
    cy.get('#email').should('be.visible')
    /* ==== End Cypress Studio ==== */
  })
})