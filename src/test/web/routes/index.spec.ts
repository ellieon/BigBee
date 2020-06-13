import { expect } from 'chai'
import * as request from 'supertest'
import { server } from 'web/index'

describe('Index page', async () => {
  describe('On GET', async () => {
    it('should redirect to HTTPS when HTTP is attempted to be accessed', async () => {
      const data = await request(server.httpServer)
        .get('/')
        .expect(302)
      expect(data.header.location).to.contain('https://')
    })

    it('should not redirect when HTTPS is accessed', async () => {
      await request(server)
        .get('/')
        .expect(200)
    })

    it('Should redirect to HTTPS when X-Forwarded-Proto is http', async () => {
      process.env.BEE_ENV = 'prod'
      const data = await request(server.httpServer)
        .get('/')
        .set('X-Forwarded-Proto', 'http')
        .expect(302)
      process.env.BEE_ENV = 'debug'
      expect(data.header.location).to.contain('https://')

    })
  })
})
