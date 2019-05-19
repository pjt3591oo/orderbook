const OrderBook = require('..')
const {buy, sell} = require('../mock/firstOrderBook.json')
const {set1, set2, set3, set4, set5} = require('../mock/order.json').sell
const matchData = require('../mock/match.json').sell



const ob = new OrderBook({
  buy, sell
})

console.log('==== CREATED OrderBook =====')
console.log(ob)
console.log('==== ===== ===== ===== =====\n\n')

console.log('==== ADDED OrderBook =====')
ob.order(set3)
console.log(ob)
console.log('====  =====  ====  =====  =====\n\n')

console.log('==== ADDED OrderBook middle =====')
ob.order(set4)
console.log(ob)
console.log('====   =====  =====  =====  =====\n\n')

console.log('==== ADDED OrderBook small =====')
ob.order(set5)
console.log(ob)
console.log('====   =====  =====  =====  =====\n\n')

console.log('==== ADDED OrderBook greater =====')
ob.order(set1)
console.log(ob)
console.log('====   =====  =====  =====  =====\n\n')

console.log('==== match1 =====')
console.log(matchData.set1)
ob.match(matchData.set1)
console.log(ob)
console.log('====   =====  =====  =====  =====\n\n')