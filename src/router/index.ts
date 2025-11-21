import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入页面组件
import MainLayout from '@/layouts/MainLayout.vue'
import QRCodeGenerator from '@/views/QRCodeGenerator.vue'
import ColorPicker from '@/views/ColorPicker.vue'
import JsonFormatter from '@/views/JsonFormatter.vue'
import Base64Tool from '@/views/Base64Tool.vue'
import MD5Tool from '@/views/MD5Tool.vue'
import TimestampTool from '@/views/TimestampTool.vue'
import RegexTool from '@/views/RegexTool.vue'
import PasswordGenerator from '@/views/PasswordGenerator.vue'
import SnowflakeGenerator from '@/views/SnowflakeGenerator.vue'
import UrlEncodeTool from '@/views/UrlEncodeTool.vue'
import BaseConverter from '@/views/BaseConverter.vue'

// 定义路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: MainLayout
  },
  {
    path: '/qrcode',
    name: 'QRCodeGenerator',
    component: QRCodeGenerator
  },
  {
    path: '/color-picker',
    name: 'ColorPicker',
    component: ColorPicker
  },
  // 工具路由组
  {
    path: '/tool',
    redirect: '/',
    children: [
      {
        path: 'qrcode',
        name: 'ToolQRCode',
        component: QRCodeGenerator
      },
      {
        path: 'color-picker',
        name: 'ToolColorPicker',
        component: ColorPicker
      },
      {
        path: 'json-formatter',
        name: 'ToolJsonFormatter',
        component: JsonFormatter
      },
      {
        path: 'base64',
        name: 'ToolBase64',
        component: Base64Tool
      },
      {
        path: 'md5',
        name: 'ToolMD5',
        component: MD5Tool
      },
      {
        path: 'timestamp',
        name: 'ToolTimestamp',
        component: TimestampTool
      },
      {
        path: 'regex-test',
        name: 'ToolRegexTest',
        component: RegexTool
      },
      {
        path: 'password-generator',
        name: 'ToolPasswordGenerator',
        component: PasswordGenerator
      },
      {
        path: 'snowflake-generator',
        name: 'ToolSnowflakeGenerator',
        component: SnowflakeGenerator
      },
      {
        path: 'url-encode',
        name: 'ToolUrlEncode',
        component: UrlEncodeTool
      },
      {
        path: 'base-converter',
        name: 'ToolBaseConverter',
        component: BaseConverter
      }
    ]
  },
  // 404 页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 
