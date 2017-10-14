import Database from './gateway/database'
import Validator from 'jsonschema'
import adSchema from './schemas/adSchema'

export default function AdsService() {
  const validateUser = user => {
    const correctness = {}
    const v = new Validator.Validator()
    const result = v.validate(user, adSchema)
    if (result.errors.length > 0) {
      correctness.result = false
      correctness.message = result.errors
      return correctness
    }
    correctness.result = true
    return correctness
  }

  return {
    getAllAds: () => {
      const adsRef = Database('ads')
      const adsArray = []
      return adsRef.once('value').then(ads => {
        ads.forEach(ad => {
          adsArray.push(ad.val())
        })
      }).then(() => adsArray)
    },

    createAd: ad => {
      const adsRef = Database('ads')
      const correctness = validateUser(ad)
      if (!correctness.result) {
        return Promise.reject(correctness.message)
      }
      return adsRef.push({
        title: ad.title,
        image: ad.image,
        state: ad.state
      })
    }
  }
}
