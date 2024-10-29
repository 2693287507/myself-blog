import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
// import { createStyleImportPlugin, AntdResolve } from 'vite-plugin-style-import'
// import postcsspxtoviewport from 'postcss-px-to-viewport'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // createStyleImportPlugin({
    //   resolves: [AntdResolve()]
    // }),
    // createSvgIconsPlugin({
    //   iconDirs: [resolve(process.cwd(), 'src/icons')],
    //   symbolId: '[name]'
    // })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src/'),
    }
  },
  css: {
    preprocessorOptions: {
      less: {
    //     javascriptEnabled: true,
        additionalData: `@import "${resolve(__dirname, 'src/global.less')}";`
      }
    },
    // postcss: {
    //   plugins: [
    //     postcsspxtoviewport({
    //       unitToConvert: 'px', // 要转化的单位
    //       viewportWidth: 1920, // UI设计稿的宽度
    //       viewportHeight: 1080, // UI设计稿的高度
    //       unitPrecision: 6, // 转换后的精度，即小数点位数
    //       propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
    //       viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
    //       fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
    //       selectorBlackList: [], // 指定不转换为视窗单位的类名，
    //       minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
    //       mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
    //       replace: true, // 是否转换后直接更换属性值
    //       exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
    //       landscape: false // 是否处理横屏情况
    //     })
    //   ]
    // }
  },
  // server: {
  //   host: '127.0.0.1',
  //   port: 5555,
  //   open: true,
  //   proxy: {
  //     '/api': {
  //       target: '',
  //       ws: false,
  //       changeOrigin: true,
  //       rewrite: path => path.replace(/^\/api/, '')
  //     }
  //   }
  // }
})
