import DirectShareApi from '../../../lib/share/direct-share-api'

export const addDirectShareMock = jest.spyOn(DirectShareApi, 'addDirectShare').mockResolvedValue(undefined)
export const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare').mockResolvedValue(undefined)
export const mockDirectShareApi = () => {
  jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValue([])
}
