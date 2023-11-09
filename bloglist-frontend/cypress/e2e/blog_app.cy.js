const username = 'TestUser'
const password = '1234567'
import { blogs } from "../testData.js/blogs"

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.createAccount({ username, password, name: 'Guy' })
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('Log in')
  })

  describe('Login', function () {
    it('Succeeds with correct credentials', function () {
      cy.get('#username').type(username)
      cy.get('#password').type(password)
      cy.get('#loginButton').click()
      cy.contains('Logged in')
    })

    it('Fails with wrong credentials', function () {
      cy.get('#username').type(username)
      cy.get('#password').type('wrongpassword')
      cy.get('#loginButton').click()
      cy.contains('Username or Password is incorrect')
    })
  })

  describe('When logged in', function () {
    // Log in user
    beforeEach(function () {
      cy.login({ username, password })
    })

    const firstBlogTitle = blogs[0].title
    const firstBlogAuthor = blogs[0].author
    const firstBlogUrl = blogs[0].url

    it('A blog can be created', function  () {
      cy.get('#openCreateBlogButton').click()
      cy.get('#createBlogTitle').type(firstBlogTitle)
      cy.get('#createBlogAuthor').type(firstBlogAuthor)
      cy.get('#createBlogUrl').type(firstBlogUrl)
      cy.get('#submitCreateBlogButton').click()
      cy.contains(`Blog "${firstBlogTitle}" by ${firstBlogAuthor} added`)
      cy.get('.blog-list-wrapper').contains(firstBlogTitle)
      cy.get('.blog-list-wrapper').contains(firstBlogAuthor)
    })

    describe('and blogs exists', function () {
      beforeEach(function () {
        // Create first blog as current logged in user
        cy.createBlog({ title: firstBlogTitle, author: firstBlogAuthor, url: firstBlogUrl })
        const user2 = {
          username: 'TestUser2',
          password: 'testpsw',
          name: 'Test User2'
        }
        cy.createAccount({ username: user2.username, password: user2.password, name: user2.name })
        cy.login({ username: user2.username, password: user2.password })
        // Create additional blogs under different user
        // Start at index 1 to avoid duplicating the first blog
        for (let i = 1; i < blogs.length; i++) {
          cy.createBlog({ title: blogs[i].title, author: blogs[i].author, url: blogs[i].url })
        }
      })
      it('A blog can be liked', function () {
        cy.get('.toggle-view-more-button').first().click()
        cy.get('.likes-count').as('likesCount').then(function ($currentLikes) {
          const likesBefore = parseInt($currentLikes.text())
          cy.get('.increment-likes-button').first().click()
          cy.get('@likesCount').first().should(function ($currentLikes) {
            const likesAfter = parseInt($currentLikes.text())
            expect(likesAfter).to.equal(likesBefore + 1)
          })
        })
      })

      it('A user can delete a blog they created', function () {
        cy.get('.users-blog').first().then(function ($usersBlog) {
          cy.wrap($usersBlog).find('.blog-info span').then(function ($blogTitle) {
            // Get text from '.blog-info > span' and assigne value to 'foundBlogTitle'
            const foundBlogTitle = $blogTitle.text()

            cy.wrap($usersBlog).find('.toggle-view-more-button').click()
            cy.wrap($usersBlog).find('.delete-button').click()
            cy.get('.blog-list-wrapper').contains(foundBlogTitle).should('not.exist')
          })
        })
      })
      it('Delete button only appears for blogs created by the user', function () {
        cy.get('.blog-item').each(($el) => {
          cy.wrap($el).find('.toggle-view-more-button').click()
          if ($el.hasClass('users-blog')) {
            cy.wrap($el).find('.delete-button').should('exist')
          } else {
            cy.wrap($el).find('.delete-button').should('not.exist')
          }
        })
      })
      it('Blogs are sorted by likes, from high to low', function () {
        // Randomize likes for each blog
        cy.get('.blog-item').each(($blog) => {
          const randomNum = Math.floor((Math.random() * 7) + 1)
          cy.wrap($blog).find('.toggle-view-more-button').click()
          for (let i = 0; i < randomNum; i ++) {
            cy.wrap($blog).find('.increment-likes-button').click()
          }
        })
        cy.visit('')
        cy.request('GET', `${Cypress.env('BACKEND')}/blogs`).then((blogs) => {
          const sortedBlogs = blogs.body.toSorted((a, b) => b.likes - a.likes)
          for (let i = 0; i < sortedBlogs.length; i++) {
            cy.get('.blog-item').eq(i).should('contain', sortedBlogs[i].title)
          }
        })
      })
    })

  })
})