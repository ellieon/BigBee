import * as logger from 'winston'
import { MockSpotifyHelper } from './helper/mockSpotifyHelper'
import { server } from 'web/index'
import { expect } from 'chai'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

before(() => {
  logger.remove(logger.transports.Console)
  logger.add(new logger.transports.Console({
    silent: true
  }))
  MockSpotifyHelper.createMockSpotifyHelper()
})

it('should run this test', () => {
  expect(true).to.be.equal(true)
})

after(async () => {
  server.close()
})
