const timeInLoop = require('../x/timeInLoop')

/*
 * @benchmarks
 * typeof (1) == 'number': 1e+7: 12.459ms
 * (1).constructor == Number: 1e+7: 12.729ms
 */

// timeInLoop('typeof (1) == \'number\'', 1e7, () => { typeof (1) == 'number' })

timeInLoop('(1).constructor == Number', 1e7, () => { (1).constructor == Number })
