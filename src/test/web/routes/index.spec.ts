import { expect } from 'chai'
import * as request from 'supertest'
import { server } from 'web/index'

describe('Index page', async () => {
  describe('On GET', async () => {
    it('should redirect to HTTPS when HTTP is attempted to be accessed', async () => {
      const data = await request('http://127.0.0.1')
        .get('/')
        .expect(302)
      expect(data.header.location).to.contain('https://')
    })

    it('should not redirect when HTTPS is accessed', async () => {
      await request(server)
        .get('/')
        .expect(200)
    })
  })
})
