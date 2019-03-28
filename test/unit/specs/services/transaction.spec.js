import TransactionService from '@/services/transaction'
import store from '@/store'

const transactionPropertyArray = [
  'id',
  'blockId',
  'type',
  'timestamp',
  'amount',
  'fee',
  'sender',
  'recipient',
  'signature',
  'confirmations'
].sort()
// Note: asset, recipientId, signSignature and vendorField can also be returned, but are optional

describe('Transaction Service', () => {
  beforeAll(() => {
 // store.dispatch('network/setServer', 'https://explorer.laroue.orgo/api/v2')
    store.dispatch('network/setServer', 'https://explorer.ark.io/api/v2')
  })

  it('should return the latest transactions ordered by timestamp descending', async () => {
    const data = await TransactionService.latest()
    expect(data).toHaveLength(25)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix > b.timestamp.unix)).toEqual(data)
  })

  it('should find a transaction by its id', async () => {
    const data = await TransactionService.find('bd8a71caeeab36339ac5baf832bb0e150549629c1992dc749a79ff3cdcd449fc')
    expect(Object.keys(data).sort()).toEqual(expect.arrayContaining(transactionPropertyArray.concat(['asset']).sort()))
  })

  it('should fail if no transaction can be found for given id', async () => {
    await expect(TransactionService.find('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')).rejects.toThrow()
  })

  it('should filter the transactions and only return type 3 transactions', async() => {
    const { meta, data } = await TransactionService.filterByType(1, 3)
    expect(data).toHaveLength(25)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
      expect(transaction.type === 3)
    })
  })

  it('should return latest transactions for an address and page offset', async() => {
    const { meta, data } = await TransactionService.allByAddress('AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK', 1)
    expect(data).toHaveLength(25)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix < b.timestamp.unix)).toEqual(data)
  })

  it('should return latest transactions for an address with page offset and given limit', async() => {
    const { meta, data } = await TransactionService.allByAddress('AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK', 2, 40)
    expect(data).toHaveLength(40)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix < b.timestamp.unix)).toEqual(data)
  })

  it('should return all outgoing transactions for an address', async () => {
    const { meta, data } = await TransactionService.sentByAddress('AYCTHSZionfGoQsRnv5gECEuFWcZXS38gs')
    expect(data).toHaveLength(25)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix < b.timestamp.unix)).toEqual(data)
  })

  it('should return all outgoing transactions for an address with page offset', async () => {
    const { meta, data } = await TransactionService.sentByAddress('AYCTHSZionfGoQsRnv5gECEuFWcZXS38gs', 3, 40)
    expect(data).toHaveLength(40)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix < b.timestamp.unix)).toEqual(data)
  })

  it('should return all incoming transactions for an address', async () => {
    const { meta, data } = await TransactionService.receivedByAddress('AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK')
    expect(data).toHaveLength(25)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix < b.timestamp.unix)).toEqual(data)
  })

  it('should return all incoming transactions for an address with page offset', async () => {
    const { meta, data } = await TransactionService.receivedByAddress('AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK', 3, 40)
    expect(data).toHaveLength(40)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
    expect(data.sort((a, b) => a.timestamp.unix < b.timestamp.unix)).toEqual(data)
  })

  it('should fail when searching for outgoing transactions if address does not exist', async () => {
    expect(TransactionService.sentByAddress('AYCTHSZionfGoQsRnv5gECEuFWcZXS38gz')).rejects.toThrow()
  })

  it('should fail when searching for incoming transactions if address does not exist', async () => {
    expect(TransactionService.receivedByAddress('AYCTHSZionfGoQsRnv5gECEuFWcZXS38gz')).rejects.toThrow()
  })

  it('should return count of outgoing transactions for an address', async () => {
    const data = await TransactionService.sentByAddressCount('AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK')
    expect(Number(data)).toBeGreaterThan(0)
  })

  it('should return count of incoming transactions for an address', async () => {
    const data = await TransactionService.receivedByAddressCount('AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK')
    expect(Number(data)).toBeGreaterThan(0)
  })

  it('should return the transactions for a given block', async () => {
    const { meta, data } = await TransactionService.byBlock('8034780571166969612')
    expect(data).toHaveLength(1)
    data.forEach(transaction => {
      expect(Object.keys(transaction).sort()).toEqual(expect.arrayContaining(transactionPropertyArray))
    })
  })

  it('should return an empty list if page offset is larger than the amount of transactions', async () => {
    const { meta, data } = await TransactionService.byBlock('8034780571166969612', 2)
    expect(data).toHaveLength(0)
  })

  xit('should return and empty list if no transactions in a block', async () => {
    const data = await TransactionService.byBlock('7818295669546141032')
    expect(data).toHaveLength(0)
  })

  xit('should return an empty list of transactions when an incorrect block id is given', async () => {
    const data = await TransactionService.byBlock('0')
    expect(data).toHaveLength(0)
  })
})
