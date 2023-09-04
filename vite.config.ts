import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import createVitePlugins from './vite/plugins'
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    base: VITE_APP_ENV === 'production' ? './' : './',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      // 忽略后缀
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: 8086,
      host: '0.0.0.0',
      open: true,
      proxy: {
        '/piano': {
          target: 'https://dev.yuepong.cn',
          changeOrigin: true,
          secure: false
        }
      }
    },
    // 构建配置
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js'
        }
      },
      terserOptions: {
        compress: {
          // warnings: false,
          drop_console: VITE_APP_ENV === 'production' ? true : false, //打包时删除console
          drop_debugger: VITE_APP_ENV === 'production' ? true : false, //打包时删除 debugger
          pure_funcs: ['console.log']
        },
        output: {
          // 去掉注释内容
          comments: true
        }
      },
      outDir: env.VITE_APP_DIST
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 引入此scss文件 这样就可以在全局中使用预定义的变量了
          additionalData: '@import "./src/assets/styles/variables.module.scss";'
        }
      }
    }
  }
})
