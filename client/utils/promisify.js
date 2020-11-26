var { promisify } = require('util')

function promisifyAll(client) {
  const _to = {}
  for(let i in client) {
    if(typeof client[i] != "function") continue;
    _to[i] = promisify(client[i].bind(client))
  }

  return _to;
}

module.exports = promisifyAll
