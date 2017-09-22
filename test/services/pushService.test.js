import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { describe, it, before } from 'mocha'
import { PushNotificationService } from '../../src/services/pushNotificationService'
import { User } from './usersFactory'
import Database from '../../src/services/gateway/database'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('PushService', () => {
  describe('#sendMatchPush(user1, user2)', () => {
    const user1 = new User().male().get()
    const user2 = new User().female().get()

    before(() => {
      const users = {
        [user1.Uid]: user1,
        [user2.Uid]: user2
      }
      const usersRef = Database('users')
      usersRef.set(users)
    })

    it('sends the match push notification', () => {
      return PushNotificationService().sendMatchPush(user1.Uid, user2.Uid).then(response => {
        expect(response.successCount).to.equal(1)
      })
    })
  })
})