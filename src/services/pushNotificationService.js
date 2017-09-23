import Database from './gateway/database'
import { Messaging } from './gateway/messaging'

export const PushNotificationService = () => {
  const getUser = user => {
    const usersRef = Database('users')
    return usersRef.child(`${user}`).once('value').then(user => {
      return user.val()
    })
  }

  const sendMatchPush = (user1, user2) => {
    const payload = {
      notification: {
        title: 'Nuevo link!',
        body: `${user2.name} también quiere linkear con vos! Sé el primero en iniciar la conversación! 😉`,
        clickAction: 'com.google.firebase.MESSAGING_EVENT'
      },
      data: {
        Uid: user2.Uid,
        name: user2.name,
        photo: user2.photoUrl
      }
    }
    return Messaging().sendToDevice(user1.tokenFCM, payload)
  }

  const onError = (user, error) => {
    console.log(`Error sending message to user ${user.Uid}:`, error)
    return error
  }

  const onSuccess = (user, response) => {
    console.log(`Successfully sent message to user ${user.Uid}:`, response)
    return response
  }

  return {
    sendMatchPush: (user1, user2) => {
      let firstUser
      return getUser(user1).then(user => {
        firstUser = user
        return getUser(user2).then(secondUser => {
          // Here we send the match push notification personalized for each user
          return sendMatchPush(firstUser, secondUser)
            .then(response => {
              onSuccess(firstUser, response)
              return sendMatchPush(secondUser, firstUser)
                .then(response => {
                  return onSuccess(secondUser, response)
                })
                .catch(error => {
                  return onError(secondUser, error)
                })
            })
            .catch(error => {
              return onError(firstUser, error)
            })
        })
      })
    }
  }
}
