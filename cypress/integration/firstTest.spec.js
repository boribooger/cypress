/// <reference types="cypress" />
/// <reference types="cypress-iframe" />


import 'cypress-iframe';

describe('My first test', () => {
    let url = 'http://the-internet.herokuapp.com';

    function checkingBrokenImage(image){
        cy.request({
            url: 'http://the-internet.herokuapp.com/broken_imagesimg/'+ image,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(404)
        })
    }

    function creatingItem(){
        cy.get('[href="/add_remove_elements/"]').click();
        cy.get('div > button').click();
        cy.get('div > button[class="added-manually"]').should('be.visible');
    }

    Cypress.Commands.add('login', () => {
        return cy
            .request({
                method: 'POST',
                url: 'http://the-internet.herokuapp.com/basic_auth',
                form: true,
                body: {
                    username: 'admin',
                    password: 'admin',
                },
            })
    })

    beforeEach(function () {
        cy.visit(url, { timeout: 100000});
    });

    it('text exist', () =>{
        cy.get(':nth-child(1) > a').click();
        cy.get('p').should(result=>{
            expect(result).to.contain('Also known as split testing. ');
        })
    })

    it('all items on the page exist', ()=>{
        cy.get('li > a').should(result =>{
            expect(result).to.have.length(44)
        })
    })

    it('create new item', ()=>{
        creatingItem();
    })

    it('delete new item what was created', ()=>{
        creatingItem();
        cy.get('div > button[class="added-manually"]').click();
        cy.get('div[id="elements"]').should(result =>{
            expect(result.nextElementSibling).to.deep.eq(undefined);
        })
    })

    it.skip('basic authorization', ()=>{
        cy.get('li > a[href="/basic_auth"]').click();
        cy.login();
    })

    it('checking broken images', ()=>{
        cy.get('[href="/broken_images"]').click();
        cy.get('div > h3').should(result=>{
            expect(result).to.contain("Broken Images");
        })
        cy.get('div[class="example"] > img').should(result=>{
            expect(result).to.have.length(3);
        })
        checkingBrokenImage('img/avatar-blank.jpg');
        checkingBrokenImage('asdf.jpg');
        checkingBrokenImage('hjkl.jpg');
    })
})
