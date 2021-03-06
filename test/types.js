let test = require('ava')
let {
  VarHexBuffer,
  Time,
  BlockID,
  PubKey,
  ValidatorHashInput
} = require('../lib/types.js')

let timeFixtures = require('./fixtures/time.json')

function EncodeTest (t, type) {
  return (value, expected) => {
    let actual = type.encode(value).toString('hex')
    t.is(actual, expected, `encode ${JSON.stringify(value, null, '  ')}`)
  }
}

test('VarHexBuffer', (t) => {
  // encode
  let data = '0001020304050607'
  let output = Buffer.alloc(9)
  VarHexBuffer.encode(data, output, 0)
  t.is(output.toString('hex'), '100001020304050607')
  t.is(VarHexBuffer.encode.bytes, 9)

  // encodingLength
  let length = VarHexBuffer.encodingLength(data)
  t.is(length, 9)
})

test('Time', (t) => {
  // TODO: failure case
  for (let { value, encoding } of timeFixtures) {
    let actual = Time.encode(value).toString('hex')
    t.is(actual, encoding, `encode ${value}`)
  }
})

test('BlockID', (t) => {
  let encodeTest = EncodeTest(t, BlockID)
  encodeTest({}, '1308000404')
  encodeTest(
    {
      hash: '9B24D4DE43C0C3CE003B19796B749D56DA3C6C84',
      parts: {
        total: 1,
        hash: '0C6412C6F34FD48E88A9CEE88885342DDEF13719'
      }
    },
    '0a149b24d4de43c0c3ce003b19796b749d56da3c6c8413080212140c6412c6f34fd48e88a9cee88885342ddef137190404'
  )
})

test('PubKey', (t) => {
  let encodeTest = EncodeTest(t, PubKey)
  encodeTest(null, '00')
  encodeTest(
    {
      type: 'AC26791624DE60',
      value: 'NjjEQKUsq8F0gWxl3BoU2Li5n7hEz9H/LX80rfMxVyE='
    },
    '1624de62203638c440a52cabc174816c65dc1a14d8b8b99fb844cfd1ff2d7f34adf3315721'
  )
})

test('ValidatorHashInput', (t) => {
  let encodeTest = EncodeTest(t, ValidatorHashInput)
  encodeTest(
    {
      address: '135A9CBF8D5037E8B1507DDD3C6637364DF6D5EB',
      pub_key: {
        type: 'AC26791624DE60',
        value: 'NjjEQKUsq8F0gWxl3BoU2Li5n7hEz9H/LX80rfMxVyE='
      },
      voting_power: 100
    },
    '0a14135a9cbf8d5037e8b1507ddd3c6637364df6d5eb171624de62203638c440a52cabc174816c65dc1a14d8b8b99fb844cfd1ff2d7f34adf331572119000000000000006404'
  )
})
