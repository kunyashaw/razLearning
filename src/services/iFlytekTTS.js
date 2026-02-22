const APP_KEY = import.meta.env.VITE_BAIDU_APP_KEY || ''
const APP_SECRET = import.meta.env.VITE_BAIDU_APP_SECRET || ''
const APP_ID = import.meta.env.VITE_BAIDU_APP_ID || ''
// 开发环境用Vite代理(/baidu-token)，生产环境用Nginx代理(/api/baidu-token)
const API_PREFIX = import.meta.env.DEV ? '' : (import.meta.env.VITE_API_PREFIX || '')

let accessToken = null
let tokenExpireTime = 0

async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpireTime) {
    return accessToken
  }
  
  const url = `${API_PREFIX}/baidu-token?grant_type=client_credentials&client_id=${APP_KEY}&client_secret=${APP_SECRET}`
  
  const response = await fetch(url, {
    method: 'POST'
  })
  
  const data = await response.json()
  console.log('Baidu token response:', data)

  if (data.access_token) {
    accessToken = data.access_token
    tokenExpireTime = Date.now() + (data.expires_in - 300) * 1000
    return accessToken
  } else {
    throw new Error('Failed to get access token: ' + JSON.stringify(data))
  }
}

let currentAudio = null

export async function speak(text) {
  try {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio = null
    }
    
    const token = await getAccessToken()
    
    const params = new URLSearchParams({
      tex: text,
      lan: 'zh',
      ctp: 1,
      cuid: APP_ID,
      tok: token,
      per: 0,
      spd: 5,
      pit: 5,
      vol: 5,
      aue: 3
    })
    
    const url = `${API_PREFIX}/baidu-tts?${params.toString()}`
    console.log('Baidu TTS url:', url)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Baidu TTS error:', response.status, errorText)
      return
    }
    
    const blob = await response.blob()
    console.log('Baidu TTS audio blob size:', blob.size)
    
    if (blob.size < 1000) {
      const text = await blob.text()
      console.error('Baidu TTS error response:', text)
      return
    }
    
    const url2 = URL.createObjectURL(blob)
    currentAudio = new Audio(url2)
    
    await new Promise((resolve, reject) => {
      currentAudio.onended = resolve
      currentAudio.onerror = reject
      currentAudio.play()
    })
    
    console.log('Baidu TTS played successfully')
    
    URL.revokeObjectURL(url2)
    currentAudio = null
    
  } catch (e) {
    console.error('Baidu TTS error:', e)
  }
}

export function stop() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
}
