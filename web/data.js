var base = {
  location: {
    lat: 13.750472, //0.02
    lng: 100.503982 //0.05
  },
  capacity: 1000,
  charge: 500 //1000
}

/**
 * 
 * @param {obj} basement 
 * @param {number} number
 * 返回一个数组，存放着各种的mock data 
 */
function produceData(basement,number) {
  var result = [];
  var baseLongitude = base.location.lng,
  baseLatitude = base.location.lat,
  baseCharge = base.charge;


  function produceRandomLon(number) {
    var a = 0.02 * Math.random()*(Math.random()>0.5?1:-1)
    a = a-0;
    return (number + a).toFixed(6)-0;
  }

  function produceRandomLat(number) {
    var a = 0.05 * Math.random()*(Math.random()>0.5?1:-1)
    a = a - 0 ;
    return (number + a).toFixed(6)-0;
  }

  function produceRandomCharge(number) {
    var a = 500 * Math.random()*(Math.random()>0.5?1:-1)
    a = parseInt(a)-0;
    return number + a
  }
  
  for(var i = 0;i<number;i++) {
    var mock = {
      location: {
        lng: produceRandomLon(baseLongitude),
        lat: produceRandomLat(baseLatitude)
      },
      capacity: basement.capacity,
      charge: produceRandomCharge(baseCharge)
    }
    result.push(mock)
  }
  return result
}

var mockData = produceData(base,500)