import Database from './gateway/database'

export default function UserService() {
  return {
    create: username => {
      const usersRef = Database('users')

      return usersRef.push({
        name: username,
        age: 23
      })
    },
    get: username => {
      const usersRef = Database('users')
      return usersRef.orderByChild('name').equalTo(username).once('value', snap => {
        snap.forEach(childSnap => childSnap.val().name)
      })
    },
    getAllUsers: () => Database('users').once('value')
  }
}