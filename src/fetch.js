import fetch from 'node-fetch'
import config from 'config'

const baseUrl = 'https://gitlab.com/api/v4'
const token = config.get('token')

export default async (url, options = {}) => {
  const r = await fetch(baseUrl + url, {
    ...options,
    headers: {
      ...options.headers ?? {},
      'content-type': 'application/json',
      'Authorization': 'Bearer ' + token
    }
  })
  if (r.status === 204) {
    return null
  }
  return await r.json()
}
