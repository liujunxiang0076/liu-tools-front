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
import UuidGenerator from '@/views/UuidGenerator.vue'
import CaseConverter from '@/views/CaseConverter.vue'
import TextStatistics from '@/views/TextStatistics.vue'
import TextDiff from '@/views/TextDiff.vue'
import UnitConverter from '@/views/UnitConverter.vue'
import DateCalculator from '@/views/DateCalculator.vue'
import JwtDecoder from '@/views/JwtDecoder.vue'
import CssGradientGenerator from '@/views/CssGradientGenerator.vue'
import HashCalculator from '@/views/HashCalculator.vue'
import UserAgentParser from '@/views/UserAgentParser.vue'
import CssShadowGenerator from '@/views/CssShadowGenerator.vue'

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
      },
      {
        path: 'uuid-generator',
        name: 'ToolUuidGenerator',
        component: UuidGenerator
      },
      {
        path: 'case-converter',
        name: 'ToolCaseConverter',
        component: CaseConverter
      },
      {
        path: 'text-statistics',
        name: 'ToolTextStatistics',
        component: TextStatistics
      },
      {
        path: 'text-diff',
        name: 'ToolTextDiff',
        component: TextDiff
      },
      {
        path: 'unit-converter',
        name: 'ToolUnitConverter',
        component: UnitConverter
      },
      {
        path: 'date-calculator',
        name: 'ToolDateCalculator',
        component: DateCalculator
      },
      {
        path: 'jwt-decoder',
        name: 'ToolJwtDecoder',
        component: JwtDecoder
      },
      {
        path: 'css-gradient',
        name: 'ToolCssGradient',
        component: CssGradientGenerator
      },
      {
        path: 'hash-calculator',
        name: 'ToolHashCalculator',
        component: HashCalculator
      },
      {
        path: 'user-agent-parser',
        name: 'ToolUserAgentParser',
        component: UserAgentParser
      },
      {
        path: 'css-shadow',
        name: 'ToolCssShadow',
        component: CssShadowGenerator
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
