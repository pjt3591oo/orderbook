class OrderBook {
  constructor ({market="KRW", coinTicker="BTC", displayMaXCnt=15, buy, sell}) {

    this.market = market
    this.coinTicker = coinTicker
    
    this.displayMaXCnt = displayMaXCnt

    this.orderTypeSell = "orderBySell"
    this.orderTypeBuy = "orderByBuy"

    this[this.orderTypeSell] = sell
    this[this.orderTypeBuy] = buy

    this.mappingTypeSell = "indexForPriceBySell"
    this.mappingTypeBuy = "indexForPriceByBuy"
    
    this[this.indexForPriceBySell] = {}
    this[this.indexForPriceByBuy] = {}

    this._initMapping(this[this.orderTypeSell], this.mappingTypeSell)
    this._initMapping(this[this.orderTypeBuy], this.mappingTypeBuy)
  }

  _initMapping(orders, mappingType) {
    this[mappingType] = orders.reduce((accumulator, val, idx) => {
      accumulator[val.price] = idx
      return accumulator
    }, {})
  }

  _isLessTheaOriginOrderbook(receive, orderType) {
    // 1. orderbook이 비었는지 검사.
    // 2. 데이터가 orderbook의 가장 작은 price 보다 작은 price인지 검사.
    // 3. 1, 2가 true라면 cutPoint를 orderbook.length 사용

    let orderLen = this[orderType].length 

    return (!orderLen) || (receive.price < this[orderType][orderLen - 1].price)
  }

  _isGreaterThanOrderbook(cutPoint, order, receive ) {
    // 1. 추가된데이터가 기존의 orderBook에서 몇번째 index(cutPoint)인지 검사.
    // 2. receive가 order보다 크면 그 다음의 order들 보다도 크기 때문에 처음의 cutPoint만 true 반환

    return (cutPoint < 0) && !(order.price > receive.price)
  }

  _getMappingType (orderType) {
    return orderType === "sell" 
    ? {mappingType: this.mappingTypeSell, orderType: this.orderTypeSell} 
    : {mappingType: this.mappingTypeBuy, orderType: this.orderTypeBuy}
  }

  _mapping ({orderType, mappingType, newMapping, cutPoint, receive}) {
      const origin = this[orderType]
      const front = origin.slice(0, cutPoint) 
      const back = origin.slice(cutPoint, origin.lengtn)

      front.push({
        price: receive.price,
        coinAmount: receive.coinAmount
      })

      this[orderType] = front.concat(back)
      this[mappingType] = newMapping
  }

  _split (receive, mappingType, orderType) {
    // cutPoint를 계산하고 orderBook에 대한 새로운 mapping을 만든다.
    // cutPoint는 새로운 데이터의 index값

    let orderIndex = this[mappingType][receive.price]
    let isSuccess = false
    
    if ( orderIndex ) {
      this[orderType][orderIndex].coinAmount += receive.coinAmount
      isSuccess = true
      return {isSuccess}

    } else {
      const newMapping = {}
      let point= -1
      let cutPoint = -1

      if( this._isLessTheaOriginOrderbook(receive, orderType)  ) {
        cutPoint = this[orderType].length 
        newMapping[receive.price] = this[orderType].length 
      }

      for(let order of this[orderType]) {
        point++
        
        if( this._isGreaterThanOrderbook(cutPoint, order, receive) ) {
          newMapping[receive.price] = point
          cutPoint = point
          point++
        }
        
        newMapping[order.price] = point
      }

      return {
        cutPoint, newMapping, isSuccess
      }
    }
  }

  order (receive) {
    const {mappingType, orderType} = this._getMappingType(receive.orderType)
    const { cutPoint, newMapping, isSuccess } = this._split(receive, mappingType, orderType)
    
    if (!isSuccess) {
      this._mapping({orderType, mappingType, newMapping, cutPoint, receive})
    }
    
  }

  match (receive) {
    const {mappingType, orderType} = this._getMappingType(receive.orderType)
    const index = this[mappingType][receive.price]

    this[orderType][index].coinAmount -= receive.coinAmount
  }

  show () {
    
  }
}

module.exports = OrderBook