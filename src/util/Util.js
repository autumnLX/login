function getCookie(name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    return decodeURIComponent(arr[2])
  } else {
    return null
  }
}

function setCookie(name, value, days) {
  let jdcpIP = window.ConfigNew.jdcpIP
  let zy = window.location.host.split('.').reverse()
  let cp = jdcpIP.replace(/(http|https):\/\/([^/]*)\//g, '$2').split('.').reverse()
  let lgt = Math.min(zy.length, cp.length)
  let _domain = ''

  for (var i = 0; i < lgt; i++) {
    if (zy[i] === cp[i]) {
      _domain = '.' + zy[i] + _domain;
    } else {
      break;
    }
  }

  let expires
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toGMTString()
  } else {
    expires = ''
  }

  document.cookie = name + '=' + value + expires + '; path=/;domain=' + _domain
}

const $cookie = {
  get: getCookie,
  set: setCookie
}

export {
  $cookie
}

export function trim(text) {
  return text.replace(/(^\s+)|(\s+$)/g, '')
}
