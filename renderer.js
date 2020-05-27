// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const moment = require('moment')

function getParams (str) {
  var queryString = str || window.location.search || ''
  var keyValPairs = []
  var params = {}
  queryString = queryString.replace(/.*?\?/, '')

  if (queryString.length) {
    keyValPairs = queryString.split('&')
    for (pairNum in keyValPairs) {
      var key = keyValPairs[pairNum].split('=')[0]
      if (!key.length) continue
      if (typeof params[key] === 'undefined') params[key] = []
      params[key].push(keyValPairs[pairNum].split('=')[1])
    }
  }
  return params
}

const scannedText = document.getElementById('scanned')
const inputHost = document.getElementById('qr-code')
const clearBtn = document.getElementById('clear')
const oktogo = document.getElementById('oktogo')
const logger = document.getElementById('logger')
let i = []
let s = ''
var regex = new RegExp('[a-zA-Z0-9=]')
var regNumbers = new RegExp('[0-9]')
var timeoutID

const refreshTimeRender = refreshTime => {
  window.clearTimeout(timeoutID)
  const refreshTimeUnix = moment.unix(parseInt(refreshTime))
  const refreshTimeFormatted = moment(refreshTimeUnix).format(
    'dddd, MMMM Do YYYY, h:mm:ss a'
  )
  // console.log('refresh time formatted', refreshTimeFormatted)
  const currentTime = moment()
  // const currentTimeFormatted = moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
  // console.log('current time is ', currentTimeFormatted)
  const refresh = moment(refreshTimeUnix).isBefore(currentTime)
  if (refreshTimeFormatted === 'Invalid date') {
    scannedText.innerHTML = 'Invalid Code'
  } else {
    scannedText.innerHTML = 'Refresh Time:: ' + refreshTimeFormatted
    const refreshClass = 'oktogo_' + refresh.toString()
    const render = refresh
      ? `<span class=${refreshClass} >NO</span>`
      : `<span class=${refreshClass}>YES</span>`
    oktogo.innerHTML = '<h1>Proceed::' + render + '</h1>'
    timeoutID = window.setTimeout(() => {
      scannedText.innerHTML = ''
      oktogo.innerHTML = ''
    }, 5 * 1000)
    // oktogo.className = refreshClass
  }
  console.log('refresh timestamp::', refreshTimeFormatted)
  console.log('time to refresh::', refresh)
}

const doSomething = e => {
  if (e.key === 'Enter') {
    scannedText.value = ''
    inputHost.value = ''
    // scannedText.innerHTML = ''
    console.log('we are done!')
    s = i.join('')
    console.log('s', s)
    console.log('i', i)
    // scannedText.innerHTML = s
    scannedText.value = s
    // window.location = s
    var params = getParams(s)
    if (params['refresh']) {
      refreshTimeRender(params['refresh'])
    }
    s = ''
    i = []
    console.log('s', s)
    console.log('i', i)
  } else {
    console.log('e is', e.key)
    //SHIFT + something
    if (e.shiftKey) {
      switch (e.code) {
        case 'Semicolon':
          // console.log('Shift + ;')
          i.push(':')
          break
        case 'Slash':
          // console.log('shift + /')
          i.push('?')
          break
        default:
          if (e.code !== 'ShiftLeft') {
            // console.log('shift + ', e.code)
            i.push(e.code.replace('Key', ''))
          }
          break
      }
    } else {
      // logger.innerHTML = e.key
      if (regex.test(e.key)) {
        i.push(e.key)
      }
    }
  }
}

window.addEventListener('keydown', doSomething, true)

inputHost.addEventListener('keydown', e => {
  if (!regNumbers.test(e.key)) {
    let data = inputHost.value
  }
  // scannedText.innerHTML = data
  // logger.innerHTML = e.key
  // console.log('data', data)
})

clearBtn.addEventListener('click', e => {
  const data = inputHost.value
  refreshTimeRender(data)
  inputHost.value = ''
})
