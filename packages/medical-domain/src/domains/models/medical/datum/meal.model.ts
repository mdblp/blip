import BaseDatum from './basics/base-datum.model'

type Meal = BaseDatum & {
  type: 'food'
  uploadId: string
  meal: 'rescuecarbs'
  nutrition: {
    carbohydrate: {
      net: number
      units: string
    }
  }
}

export default Meal
