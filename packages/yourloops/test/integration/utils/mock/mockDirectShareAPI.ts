import DirectShareApi from '../../../../lib/share/direct-share-api'

export const mockDirectShareApi = () => {
  jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValue([])
}
