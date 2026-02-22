import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    static: [
      {
        directory: path.resolve(__dirname, 'myBooks'),
        publicPath: '/myBooks'
      }
    ],
    proxy: {
      '/baidu-token': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baidu-token/, '/oauth/2.0/token')
      },
      '/baidu-tts': {
        target: 'https://tsn.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baidu-tts/, '/text2audio')
      },
      '/baidu-asr': {
        target: 'https://vop.baidu.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baidu-asr/, '/server_api')
      }
    }
  },
  build: {
    target: 'es2015',
    cssTarget: 'chrome61',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/\.(css)$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  esbuild: {
    target: 'es2015',
    legalComments: 'none'
  }
})
