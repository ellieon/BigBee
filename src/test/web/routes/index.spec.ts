import { expect } from 'chai'
import * as request from 'supertest'

describe('Index page', async () => {
  describe('On GET', async () => {
    it('should redirect to HTTPS when HTTP is attempted to be accessed', async () => {
      const data = await request('http://localhost')
        .get('/')
        .expect(302)
      expect(data.header.location).to.contain('https://')
    })

    it('should not redirect when HTTPS is accessed', async () => {
      await request('https://localhost')
        .get('/')
        .expect(200)
    })
  })
})
