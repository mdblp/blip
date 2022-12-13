import BaseDatum from './basics/base-datum.model'

type Upload = BaseDatum & {
  type: 'upload'
  uploadId: string

  _dataState: string
  _deduplicator: {
    name: string
    version: string
  }
  _state: string
  client: {
    name: string
    version: string
  }
  dataSetType: string
  deviceManufacturers: string[]
  deviceModel: string
  deviceTags: string[]
  revision: string

  version: string
}

export default Upload
