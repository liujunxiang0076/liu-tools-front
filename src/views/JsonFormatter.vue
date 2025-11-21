<template>
  <div class="min-h-screen bg-base-200 py-4 md:py-8">
    <div class="container mx-auto px-4 max-w-7xl">
      <!-- 成功提示 Toast -->
      <div 
        v-if="showToast" 
        class="toast toast-top toast-center z-50"
        :class="{ 'toast-success': toastType === 'success', 'toast-error': toastType === 'error' }"
      >
        <div class="alert" :class="{ 'alert-success': toastType === 'success', 'alert-error': toastType === 'error' }">
          <svg 
            v-if="toastType === 'success'"
            class="stroke-current shrink-0 h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg 
            v-else
            class="stroke-current shrink-0 h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ toastMessage }}</span>
        </div>
      </div>

      <!-- 页面标题 -->
      <div class="mb-6 md:mb-8">
        <div class="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <button 
            @click="goBack"
            class="btn btn-ghost btn-circle touch-manipulation hover:bg-primary/10"
          >
            <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="text-2xl md:text-3xl">📄</span>
          <h1 class="text-xl md:text-2xl font-bold text-base-content">JSON格式化工具</h1>
        </div>
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-0">
          <p class="text-sm md:text-base text-base-content/70 mb-3 md:mb-0">
            JSON数据格式化、压缩和验证工具，支持语法高亮和错误提示
          </p>
          
          <!-- 模式切换器 -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-base-content/60">模式:</span>
            <div class="join shadow-lg">
              <button 
                @click="switchMode('format')"
                class="btn btn-sm join-item transition-all duration-200"
                :class="{ 'btn-primary': currentMode === 'format', 'btn-outline': currentMode !== 'format' }"
              >
                <span class="mr-1">🔧</span>
                格式化
              </button>
              <button 
                @click="switchMode('diff')"
                class="btn btn-sm join-item transition-all duration-200"
                :class="{ 'btn-primary': currentMode === 'diff', 'btn-outline': currentMode !== 'diff' }"
              >
                <span class="mr-1">🔍</span>
                对比
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div v-if="currentMode === 'format'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- 输入区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON输入</h2>
            <div class="flex gap-2">
              <button 
                @click="clearInput"
                class="btn btn-sm btn-ghost"
                :disabled="!inputJson"
              >
                清空
              </button>
              <button 
                @click="loadExample"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <div class="relative">
            <textarea
              v-model="inputJson"
              @input="handleInputChange"
              placeholder="请输入JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasError }"
            ></textarea>
            
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ inputJson.length }} 字符
            </div>
          </div>
          
          <!-- 错误提示 - 增强版 -->
          <div v-if="hasError" class="mt-3 p-4 bg-gradient-to-r from-error/10 to-error/5 border border-error/30 rounded-xl transition-all duration-300">
            <div class="flex items-start gap-3">
              <div class="p-1 bg-error/20 rounded-full">
                <svg class="w-4 h-4 text-error" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="text-sm font-semibold text-error mb-1">JSON格式错误</div>
                <div class="text-xs text-error/80 mb-2 font-mono bg-error/5 p-2 rounded border-l-2 border-error/30">{{ errorMessage }}</div>
                <div class="text-xs text-base-content/60">
                  💡 提示：检查是否缺少引号、逗号或括号
                </div>
              </div>
              <button @click="fixCommonErrors" class="btn btn-xs btn-outline btn-error">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                自动修复
              </button>
            </div>
          </div>
        </div>

        <!-- 输出区域 -->
        <div class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">格式化结果</h2>
            <div class="flex gap-2">
              
              <!-- 视图模式切换 -->
              <div class="join">
                <button 
                  @click="viewMode = 'tree'"
                  class="btn btn-sm join-item"
                  :class="{ 'btn-primary': viewMode === 'tree', 'btn-ghost': viewMode !== 'tree' }"
                  :disabled="!formattedJson || hasError"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                  </svg>
                  树形
                </button>
                <button 
                  @click="viewMode = 'code'"
                  class="btn btn-sm join-item"
                  :class="{ 'btn-primary': viewMode === 'code', 'btn-ghost': viewMode !== 'code' }"
                  :disabled="!formattedJson || hasError"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                  </svg>
                  代码
                </button>
              </div>
              
              <button 
                @click="copyResult"
                class="btn btn-sm btn-primary transition-all duration-200"
                :disabled="!formattedJson || hasError"
                :class="{ 'btn-success': copySuccess }"
              >
                <svg v-if="!copySuccess" class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <svg v-else class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                {{ copySuccess ? '已复制' : '复制' }}
              </button>
              
              <button 
                @click="downloadJson"
                class="btn btn-sm btn-outline transition-all duration-200 hover:btn-primary"
                :disabled="!formattedJson || hasError"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                下载
              </button>
            </div>
          </div>
          
          <div class="relative">
            <!-- 加载状态 -->
            <div v-if="isProcessing" class="absolute inset-0 bg-base-200/80 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
              <div class="flex flex-col items-center gap-3">
                <span class="loading loading-spinner loading-lg text-primary"></span>
                <span class="text-sm text-base-content/70">处理中...</span>
              </div>
            </div>
            
            <div class="bg-base-200 rounded-lg h-[38rem] overflow-auto custom-json-viewer">
              <template v-if="!hasError && formattedJson && parsedJsonData">
                <!-- 树形视图 -->
                <div v-if="viewMode === 'tree'" class="json-tree-container p-4">
                  <JsonTreeView :data="parsedJsonData" />
                </div>
                
                <!-- 代码视图 -->
                <div v-else class="json-editor-container" ref="jsonEditorRef">
                  <div class="json-tree-view flex font-mono text-sm">
                    <!-- 行号列 -->
                    <div class="line-numbers bg-gradient-to-r from-base-300/50 to-base-300/30 px-3 py-2 text-right text-base-content/50 select-none border-r border-base-300/50" style="min-width: 3.5rem;">
                      <div 
                        v-for="(line, index) in lineNumbers" 
                        :key="index"
                        class="line-number leading-6 text-xs transition-all duration-200 hover:text-primary cursor-pointer rounded px-1 hover:bg-primary/10"
                        @click="scrollToLine(index + 1)"
                      >
                        {{ line }}
                      </div>
                    </div>
                    
                    <!-- JSON内容 -->
                    <div class="json-content flex-1 p-3">
                      <pre class="json-pre-enhanced"><code v-html="enhancedHighlightedJson"></code></pre>
                    </div>
                  </div>
                </div>
              </template>
              <div v-else-if="hasError" class="flex items-center justify-center h-full p-6">
                <div class="text-center">
                  <div class="text-6xl mb-4">⚠️</div>
                  <div class="text-lg font-semibold text-error mb-2">JSON格式错误</div>
                  <div class="text-sm text-base-content/60">请检查您的JSON语法</div>
                </div>
              </div>
              <div v-else class="flex items-center justify-center h-full p-6">
                <div class="text-center">
                  <div class="text-6xl mb-4">📝</div>
                  <div class="text-lg font-semibold text-base-content/70 mb-2">开始格式化</div>
                  <div class="text-sm text-base-content/50">在左侧输入JSON数据，格式化结果将在此显示</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 对比模式的内容区域 -->
      <div v-else-if="currentMode === 'diff'" class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- 移动端工具栏 - 优化版 -->
        <div class="lg:hidden bg-base-100 rounded-xl p-3 shadow-lg mb-4">
          <!-- 标签页切换 -->
          <div class="flex items-center justify-center mb-3">
            <div class="join w-full max-w-sm">
              <button 
                @click="setMobileTab('A')"
                class="btn btn-sm join-item flex-1 touch-manipulation"
                :class="{ 'btn-primary': mobileTab === 'A', 'btn-outline': mobileTab !== 'A' }"
              >
                <span class="text-base mr-1">📄</span>
                JSON A
              </button>
              <button 
                @click="setMobileTab('B')"
                class="btn btn-sm join-item flex-1 touch-manipulation"
                :class="{ 'btn-primary': mobileTab === 'B', 'btn-outline': mobileTab !== 'B' }"
              >
                <span class="text-base mr-1">📋</span>
                JSON B
              </button>
            </div>
          </div>
          
          <!-- 滑动提示 -->
          <div class="text-center mb-3">
            <span class="text-xs text-base-content/50">
              👆 点击切换 · 👈👉 左右滑动切换
            </span>
          </div>
          
          <!-- 对比按钮 -->
          <div class="flex justify-center">
          <button 
            @click="compareJson"
              class="btn btn-primary btn-sm touch-manipulation"
            :disabled="!jsonA || !jsonB || hasErrorA || hasErrorB"
          >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            开始对比
          </button>
          </div>
        </div>
                  <!-- 第一个JSON输入区域 -->
          <div 
            class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg"
            :class="{ 'lg:block': true, 'hidden': mobileTab === 'B', 'block': mobileTab === 'A' }"
            @touchstart="initTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchStart = { x: 0, y: 0, time: 0 }"
          >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON A</h2>
            <div class="flex gap-2">
              <button 
                @click="clearJsonA"
                class="btn btn-sm btn-ghost"
                :disabled="!jsonA"
              >
                清空
              </button>
              <button 
                @click="loadExampleA"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <div class="relative">
            <textarea
              v-model="jsonA"
              @input="handleJsonAChange"
              placeholder="请输入第一个JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasErrorA }"
            ></textarea>
            
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ jsonA.length }} 字符
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="hasErrorA" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <div class="text-sm font-medium text-error">JSON A 格式错误</div>
                <div class="text-xs text-error/80 mt-1">{{ errorMessageA }}</div>
              </div>
            </div>
          </div>
        </div>

                  <!-- 第二个JSON输入区域 -->
          <div 
            class="bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg"
            :class="{ 'lg:block': true, 'hidden': mobileTab === 'A', 'block': mobileTab === 'B' }"
            @touchstart="initTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchStart = { x: 0, y: 0, time: 0 }"
          >
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-base-content">JSON B</h2>
            <div class="flex gap-2">
              <button 
                @click="clearJsonB"
                class="btn btn-sm btn-ghost"
                :disabled="!jsonB"
              >
                清空
              </button>
              <button 
                @click="loadExampleB"
                class="btn btn-sm btn-outline"
              >
                示例
              </button>
            </div>
          </div>
          
          <div class="relative">
            <textarea
              v-model="jsonB"
              @input="handleJsonBChange"
              placeholder="请输入第二个JSON数据..."
              class="textarea textarea-bordered w-full h-[38rem] font-mono text-sm resize-none"
              :class="{ 'textarea-error': hasErrorB }"
            ></textarea>
            
            <div class="absolute bottom-2 right-2 text-xs text-base-content/50">
              {{ jsonB.length }} 字符
            </div>
          </div>
          
          <!-- 错误提示 -->
          <div v-if="hasErrorB" class="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-4 h-4 text-error flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <div class="text-sm font-medium text-error">JSON B 格式错误</div>
                <div class="text-xs text-error/80 mt-1">{{ errorMessageB }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 对比结果显示区域 -->
      <div v-if="currentMode === 'diff'" class="mt-4 md:mt-6 bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-base-content">差异对比结果</h2>
          <div class="flex gap-2">
            <button 
              @click="compareJson"
              class="btn btn-primary"
              :disabled="!jsonA || !jsonB || hasErrorA || hasErrorB"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
              开始对比
            </button>
            <button 
              @click="exportDiff"
              class="btn btn-outline"
              :disabled="!diffResult"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              导出差异
            </button>
          </div>
        </div>
        
        <div class="bg-base-200 p-4 rounded-lg h-[20rem] overflow-auto">
          <div v-if="!diffResult" class="text-base-content/40 italic">
            对比结果将在此显示...
          </div>
          <div v-else-if="diffResult.identical" class="text-success">
            ✅ 两个JSON完全相同
          </div>
          <div v-else class="space-y-2">
            <div class="flex items-center justify-between mb-3">
              <div class="text-sm font-medium text-base-content">
                发现 {{ diffResult.differences.length }} 处差异
              </div>
              <div class="flex gap-2 text-xs">
                <span class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-green-500 rounded"></div>
                  新增 {{ diffResult.differences.filter(d => d.type === 'added').length }}
                </span>
                <span class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-red-500 rounded"></div>
                  删除 {{ diffResult.differences.filter(d => d.type === 'removed').length }}
                </span>
                <span class="flex items-center gap-1">
                  <div class="w-3 h-3 bg-yellow-500 rounded"></div>
                  修改 {{ diffResult.differences.filter(d => d.type === 'changed').length }}
                </span>
              </div>
            </div>
            
            <div class="max-h-96 overflow-y-auto space-y-1">
              <div v-for="(diff, index) in diffResult.differences" :key="index" 
                   class="border-l-4 pl-4 py-2 text-sm font-mono rounded-r-lg transition-all hover:shadow-sm"
                   :class="{
                     'border-red-500 bg-red-50/50 dark:bg-red-900/10 hover:bg-red-50 dark:hover:bg-red-900/20': diff.type === 'removed',
                     'border-green-500 bg-green-50/50 dark:bg-green-900/10 hover:bg-green-50 dark:hover:bg-green-900/20': diff.type === 'added',
                     'border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-50 dark:hover:bg-yellow-900/20': diff.type === 'changed'
                   }">
                <div class="flex items-center justify-between mb-2">
                  <div class="font-semibold text-xs text-base-content/80 font-mono bg-base-200 px-2 py-1 rounded">
                    {{ diff.path }}
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full font-medium"
                        :class="{
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300': diff.type === 'removed',
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300': diff.type === 'added',
                          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300': diff.type === 'changed'
                        }">
                    {{ diff.type === 'removed' ? '删除' : diff.type === 'added' ? '新增' : '修改' }}
                  </span>
                </div>
                
                <div class="space-y-1">
                  <div v-if="diff.type === 'removed'" class="text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 p-2 rounded">
                    <span class="text-red-500 font-bold">-</span> {{ formatValue(diff.oldValue) }}
                  </div>
                  <div v-else-if="diff.type === 'added'" class="text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/20 p-2 rounded">
                    <span class="text-green-500 font-bold">+</span> {{ formatValue(diff.newValue) }}
                  </div>
                  <div v-else-if="diff.type === 'changed'" class="space-y-1">
                    <div class="text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-900/20 p-2 rounded">
                      <span class="text-red-500 font-bold">-</span> {{ formatValue(diff.oldValue) }}
                    </div>
                    <div class="text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/20 p-2 rounded">
                      <span class="text-green-500 font-bold">+</span> {{ formatValue(diff.newValue) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      


      <!-- 工具栏 - 移动端优化版 -->
      <div class="mt-4 md:mt-6 bg-base-100 rounded-2xl p-4 md:p-6 shadow-lg">
        <!-- 移动端：垂直布局 -->
        <div class="block md:hidden space-y-4">
          <!-- 主要操作按钮 -->
          <div class="grid grid-cols-1 gap-3">
            <button 
              @click="formatJson"
              class="btn btn-primary touch-manipulation transition-all duration-200 hover:scale-105"
              :disabled="!inputJson || hasError || isProcessing"
            >
              <span v-if="isProcessing" class="loading loading-spinner loading-sm mr-2"></span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              {{ isProcessing ? '处理中...' : '格式化 JSON' }}
            </button>
            
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="compressJson"
                class="btn btn-outline touch-manipulation"
                :disabled="!inputJson || hasError"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
                压缩
              </button>
              
              <button 
                @click="validateJson"
                class="btn btn-outline touch-manipulation"
                :disabled="!inputJson"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                验证
              </button>
            </div>
          </div>
          
          <!-- 设置区域 -->
          <div class="flex items-center justify-center gap-3 p-3 bg-base-200 rounded-xl">
            <span class="text-sm text-base-content/70 font-medium">缩进设置:</span>
            <select v-model="indentSize" class="select select-sm select-bordered bg-base-100 min-w-0 flex-1 max-w-32">
              <option value="2">2空格</option>
              <option value="4">4空格</option>
              <option value="tab">制表符</option>
            </select>
          </div>
        </div>
        
        <!-- 桌面端：水平布局 -->
        <div class="hidden md:flex flex-wrap gap-4 items-center justify-between">
          <div class="flex flex-wrap gap-2">
            <button 
              @click="formatJson"
              class="btn btn-primary transition-all duration-200 hover:scale-105"
              :disabled="!inputJson || hasError || isProcessing"
            >
              <span v-if="isProcessing" class="loading loading-spinner loading-sm mr-2"></span>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              {{ isProcessing ? '处理中...' : '格式化' }}
            </button>
            
            <button 
              @click="compressJson"
              class="btn btn-outline"
              :disabled="!inputJson || hasError"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
              压缩
            </button>
            
            <button 
              @click="validateJson"
              class="btn btn-outline"
              :disabled="!inputJson"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              验证
            </button>
          </div>
          
          <div class="flex items-center gap-4 text-sm text-base-content/60">
            <span>缩进:</span>
            <select v-model="indentSize" class="select select-sm select-bordered">
              <option value="2">2空格</option>
              <option value="4">4空格</option>
              <option value="tab">制表符</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div v-if="jsonStats" class="mt-6 bg-base-100 rounded-2xl p-6 shadow-lg">
        <h3 class="text-lg font-semibold text-base-content mb-4">JSON统计信息</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ jsonStats.size }}</div>
            <div class="text-sm text-base-content/60">文件大小</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-secondary">{{ jsonStats.keys }}</div>
            <div class="text-sm text-base-content/60">键数量</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-accent">{{ jsonStats.depth }}</div>
            <div class="text-sm text-base-content/60">嵌套深度</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-info">{{ jsonStats.type }}</div>
            <div class="text-sm text-base-content/60">数据类型</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import JsonTreeView from '@/components/JsonTreeView.vue'

const router = useRouter()

// 响应式数据
const inputJson = ref(localStorage.getItem('json-formatter-input') || '')
const formattedJson = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const indentSize = ref('2')
const isProcessing = ref(false)
const copySuccess = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error' | 'warning'>('success')
const viewMode = ref<'tree' | 'code'>('tree') // 新增：视图模式

// 对比模式相关状态
const currentMode = ref<'format' | 'diff'>('format')
const jsonA = ref('')
const jsonB = ref('')
const hasErrorA = ref(false)
const hasErrorB = ref(false)
const errorMessageA = ref('')
const errorMessageB = ref('')

// 移动端相关状态
const mobileTab = ref<'A' | 'B'>('A')
const setMobileTab = (tab: 'A' | 'B') => {
  mobileTab.value = tab
}

// 移动端手势处理 - 优化版
const handleTouchStart = ref({ x: 0, y: 0, time: 0 })
const handleTouchMove = (event: TouchEvent) => {
  if (!handleTouchStart.value.x || !handleTouchStart.value.y) return
  
  const deltaX = event.touches[0].clientX - handleTouchStart.value.x
  const deltaY = event.touches[0].clientY - handleTouchStart.value.y
  const deltaTime = Date.now() - handleTouchStart.value.time
  
  // 只处理水平滑动，忽略垂直滑动，增加速度检测
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30 && deltaTime < 300) {
    // 防止事件冒泡
    event.preventDefault()
    
    if (deltaX > 0 && mobileTab.value === 'B') {
      setMobileTab('A')
      // 触觉反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(10)
      }
    } else if (deltaX < 0 && mobileTab.value === 'A') {
      setMobileTab('B')
      // 触觉反馈（如果支持）
      if (navigator.vibrate) {
        navigator.vibrate(10)
    }
    }
    handleTouchStart.value = { x: 0, y: 0, time: 0 }
  }
}

const initTouchStart = (event: TouchEvent) => {
  handleTouchStart.value = {
    x: event.touches[0].clientX,
    y: event.touches[0].clientY,
    time: Date.now()
  }
}

// 差异对比结果
interface DiffItem {
  path: string
  type: 'added' | 'removed' | 'changed'
  oldValue?: any
  newValue?: any
}

interface DiffResult {
  identical: boolean
  differences: DiffItem[]
}

const diffResult = ref<DiffResult | null>(null)

// 新增功能状态
const foldedPaths = ref<Set<string>>(new Set())
const allFolded = ref(false)
const foldLevel = ref(0) // 折叠级别：0=展开全部，1=折叠1级，2=折叠2级，等等
const jsonEditorRef = ref<HTMLElement>()
const parsedJsonData = ref<any>(null)

// JSON统计信息
interface JsonStats {
  size: string
  keys: number
  depth: number
  type: string
}

const jsonStats = ref<JsonStats | null>(null)

// 示例JSON数据
const exampleJson = `{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "address": {
    "city": "北京",
    "district": "朝阳区",
    "street": "建国路123号"
  },
  "hobbies": ["读书", "旅游", "摄影"],
  "isActive": true,
  "profile": {
    "bio": "软件开发工程师",
    "skills": ["JavaScript", "Vue.js", "Node.js"],
    "experience": {
      "years": 3,
      "companies": ["公司A", "公司B"]
    }
  }
}`

// 移除parsedJson和isDarkTheme相关内容
// const parsedJson = computed(() => {
//   if (hasError.value || !inputJson.value.trim()) return null
//   try {
//     return JSON.parse(inputJson.value)
//   } catch {
//     return null
//   }
// })

// 返回上一页
const goBack = () => {
  router.back()
}

// 防抖处理输入变化
let inputTimeout: NodeJS.Timeout | null = null

const handleInputChange = () => {
  // 清除之前的定时器
  if (inputTimeout) {
    clearTimeout(inputTimeout)
  }
  
  // 设置新的定时器，避免频繁处理
  inputTimeout = setTimeout(() => {
    if (!inputJson.value.trim()) {
      hasError.value = false
      errorMessage.value = ''
      formattedJson.value = ''
      jsonStats.value = null
      parsedJsonData.value = null
      return
    }
    
    // 自动验证
    const parsed = validateJson()
    if (parsed !== null) {
      parsedJsonData.value = parsed
      // 自动格式化（仅当没有错误时）
      if (!hasError.value) {
        // 根据当前折叠级别格式化
        if (foldLevel.value === 0) {
          const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value)
          formattedJson.value = JSON.stringify(parsed, null, indent)
        } else {
          formattedJson.value = formatJsonWithFolding(parsed, 0)
        }
      }
    }
  }, 300) // 300ms 防抖
}

// 验证JSON
const validateJson = () => {
  if (!inputJson.value.trim()) {
    hasError.value = false
    errorMessage.value = ''
    return
  }
  
  try {
    const parsed = JSON.parse(inputJson.value)
    hasError.value = false
    errorMessage.value = ''
    
    // 生成统计信息
    generateStats(parsed)
    
    return parsed
  } catch (error) {
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : '未知错误'
    jsonStats.value = null
    return null
  }
}

// 格式化JSON
const formatJson = async () => {
  const parsed = validateJson()
  if (parsed !== null) {
    isProcessing.value = true
    
    // 对于大文件，使用异步处理
    await new Promise(resolve => setTimeout(resolve, 10))
    
    try {
      if (foldLevel.value === 0) {
        // 标准格式化
        const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value)
        formattedJson.value = JSON.stringify(parsed, null, indent)
      } else {
        // 应用当前折叠级别
        formattedJson.value = formatJsonWithFolding(parsed, 0)
      }
      showToastMessage('格式化成功！', 'success')
    } catch (error) {
      showToastMessage('格式化失败', 'error')
    } finally {
      isProcessing.value = false
    }
  }
}

// 压缩JSON
const compressJson = async () => {
  const parsed = validateJson()
  if (parsed !== null) {
    isProcessing.value = true
    
    try {
      await new Promise(resolve => setTimeout(resolve, 10))
      formattedJson.value = JSON.stringify(parsed)
      showToastMessage('压缩成功！', 'success')
    } catch (error) {
      showToastMessage('压缩失败', 'error')
    } finally {
      isProcessing.value = false
    }
  }
}

// 生成统计信息
const generateStats = (data: any) => {
  const jsonString = JSON.stringify(data)
  const sizeInBytes = new Blob([jsonString]).size
  
  // 格式化文件大小
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
  
  // 计算键数量
  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0
    
    let count = 0
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        count += countKeys(item)
      })
    } else {
      count += Object.keys(obj).length
      Object.values(obj).forEach(value => {
        count += countKeys(value)
      })
    }
    return count
  }
  
  // 计算嵌套深度
  const calculateDepth = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0
    
    let maxDepth = 0
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        maxDepth = Math.max(maxDepth, calculateDepth(item))
      })
    } else {
      Object.values(obj).forEach(value => {
        maxDepth = Math.max(maxDepth, calculateDepth(value))
      })
    }
    return maxDepth + 1
  }
  
  // 确定数据类型
  const getDataType = (data: any): string => {
    if (Array.isArray(data)) return 'Array'
    if (typeof data === 'object' && data !== null) return 'Object'
    return typeof data
  }
  
  jsonStats.value = {
    size: formatSize(sizeInBytes),
    keys: countKeys(data),
    depth: calculateDepth(data),
    type: getDataType(data)
  }
}

// 显示 Toast 提示
const showToastMessage = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

// 复制结果
const copyResult = async () => {
  let textToCopy = formattedJson.value
  
  // 如果在树视图模式下，formattedJson 可能为空，从 parsedJsonData 生成标准 JSON
  if (!textToCopy && parsedJsonData.value) {
    try {
      const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value) || 2
      textToCopy = JSON.stringify(parsedJsonData.value, null, indent)
    } catch (error) {
      console.error('生成 JSON 字符串失败:', error)
      showToastMessage('复制失败，数据格式错误', 'error')
      return
    }
  }
  
  if (!textToCopy) {
    showToastMessage('没有可复制的内容', 'warning')
    return
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy)
    copySuccess.value = true
    showToastMessage('复制成功！', 'success')
    
    // 2秒后重置按钮状态
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('复制失败:', error)
    showToastMessage('复制失败，请手动复制', 'error')
  }
}

// 滚动到指定行
const scrollToLine = (lineNumber: number) => {
  const lineElement = document.querySelector(`.line-number:nth-child(${lineNumber})`)
  if (lineElement) {
    lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// 下载JSON文件
const downloadJson = () => {
  if (!formattedJson.value) return
  
  try {
    const blob = new Blob([formattedJson.value], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `formatted-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToastMessage('下载成功！', 'success')
  } catch (error) {
    showToastMessage('下载失败', 'error')
  }
}

// 加载示例
const loadExample = () => {
  inputJson.value = exampleJson
  handleInputChange()
}

// 清空输入
const clearInput = () => {
  inputJson.value = ''
  formattedJson.value = ''
  hasError.value = false
  errorMessage.value = ''
  jsonStats.value = null
  localStorage.removeItem('json-formatter-input')
}

// 监听输入变化
watch(inputJson, () => {
  if (inputJson.value.trim()) {
    formatJson()
  }
  // 持久化到localStorage
  localStorage.setItem('json-formatter-input', inputJson.value)
})

// 模式切换方法
const switchMode = (mode: 'format' | 'diff') => {
  currentMode.value = mode
  if (mode === 'diff') {
    diffResult.value = null
  }
}

// JSON A 相关方法
const handleJsonAChange = () => {
  try {
    if (jsonA.value.trim()) {
      JSON.parse(jsonA.value)
      hasErrorA.value = false
      errorMessageA.value = ''
    }
  } catch (error) {
    hasErrorA.value = true
    errorMessageA.value = error instanceof Error ? error.message : '解析错误'
  }
}

const clearJsonA = () => {
  jsonA.value = ''
  hasErrorA.value = false
  errorMessageA.value = ''
  diffResult.value = null
}

const loadExampleA = () => {
  jsonA.value = exampleJson
  handleJsonAChange()
}

// JSON B 相关方法
const handleJsonBChange = () => {
  try {
    if (jsonB.value.trim()) {
      JSON.parse(jsonB.value)
      hasErrorB.value = false
      errorMessageB.value = ''
    }
  } catch (error) {
    hasErrorB.value = true
    errorMessageB.value = error instanceof Error ? error.message : '解析错误'
  }
}

const clearJsonB = () => {
  jsonB.value = ''
  hasErrorB.value = false
  errorMessageB.value = ''
  diffResult.value = null
}

const loadExampleB = () => {
  const exampleB = `{
  "name": "李四",
  "age": 28,
  "email": "lisi@example.com",
  "address": {
    "city": "上海",
    "district": "浦东新区",
    "street": "世纪大道456号"
  },
  "hobbies": ["读书", "游戏", "音乐"],
  "isActive": false,
  "profile": {
    "bio": "产品经理",
    "skills": ["Product Design", "User Research", "Agile"],
    "experience": {
      "years": 5,
      "companies": ["公司C", "公司D", "公司E"]
    }
  }
}`
  jsonB.value = exampleB
  handleJsonBChange()
}

// 深度对比两个对象
const deepCompare = (obj1: any, obj2: any, path = ''): DiffItem[] => {
  const differences: DiffItem[] = []
  
  // 处理基本类型
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      differences.push({
        path: path || 'root',
        type: 'changed',
        oldValue: obj1,
        newValue: obj2
      })
    }
    return differences
  }
  
  // 获取所有键
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  const allKeys = new Set([...keys1, ...keys2])
  
  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key
    const hasKey1 = key in obj1
    const hasKey2 = key in obj2
    
    if (!hasKey1 && hasKey2) {
      // 新增的键
      differences.push({
        path: currentPath,
        type: 'added',
        newValue: obj2[key]
      })
    } else if (hasKey1 && !hasKey2) {
      // 删除的键
      differences.push({
        path: currentPath,
        type: 'removed',
        oldValue: obj1[key]
      })
    } else if (hasKey1 && hasKey2) {
      // 递归比较
      differences.push(...deepCompare(obj1[key], obj2[key], currentPath))
    }
  }
  
  return differences
}

// JSON对比方法
const compareJson = () => {
  try {
    const parsedA = JSON.parse(jsonA.value)
    const parsedB = JSON.parse(jsonB.value)
    
    const differences = deepCompare(parsedA, parsedB)
    
    diffResult.value = {
      identical: differences.length === 0,
      differences
    }
  } catch (error) {
    console.error('JSON对比失败:', error)
  }
}

// 导出差异结果
const exportDiff = () => {
  if (!diffResult.value) return
  
  const diffReport = {
    timestamp: new Date().toISOString(),
    identical: diffResult.value.identical,
    differences: diffResult.value.differences,
    summary: {
      totalDifferences: diffResult.value.differences.length,
      added: diffResult.value.differences.filter(d => d.type === 'added').length,
      removed: diffResult.value.differences.filter(d => d.type === 'removed').length,
      changed: diffResult.value.differences.filter(d => d.type === 'changed').length
    }
  }
  
  const blob = new Blob([JSON.stringify(diffReport, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `json-diff-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 格式化显示值
const formatValue = (value: any): string => {
  if (value === null) return 'null'
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}


// 自动修复常见错误
const fixCommonErrors = () => {
  let fixed = inputJson.value
  
  // 修复单引号为双引号
  fixed = fixed.replace(/'/g, '"')
  
  // 修复末尾多余的逗号
  fixed = fixed.replace(/,\s*([}\]])/g, '$1')
  
  // 修复未加引号的键名
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
  
  // 尝试添加缺失的引号
  try {
    JSON.parse(fixed)
    inputJson.value = fixed
    showToastMessage('已尝试自动修复，请检查结果', 'success')
    handleInputChange()
  } catch (error) {
    showToastMessage('自动修复失败，请手动检查', 'error')
  }
}

// 新的折叠功能 - 基于级别
const setFoldLevel = (level: number) => {
  foldLevel.value = level
  allFolded.value = level > 0
  
  // 重新格式化JSON以应用折叠
  if (parsedJsonData.value) {
    try {
      if (level === 0) {
        // 如果不折叠，使用标准JSON格式化
        const indent = indentSize.value === 'tab' ? '\t' : parseInt(indentSize.value)
        formattedJson.value = JSON.stringify(parsedJsonData.value, null, indent)
      } else {
        // 应用折叠
        const foldedJson = formatJsonWithFolding(parsedJsonData.value, 0)
        formattedJson.value = foldedJson
      }
    } catch (error) {
      console.error('折叠处理失败:', error)
    }
  }
}

// 根据折叠级别格式化JSON - 修复版，与JSON.stringify格式一致
const formatJsonWithFolding = (obj: any, currentLevel = 0): string => {
  const indentStr = indentSize.value === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize.value))
  
  // 如果当前级别大于等于设定的折叠级别，则折叠显示
  if (foldLevel.value > 0 && currentLevel >= foldLevel.value) {
    if (Array.isArray(obj)) {
      return `[...${obj.length} items]`
    } else if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj)
      return `{...${keys.length} keys}`
    }
  }
  
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      
      const items = obj.map(item => {
        const formatted = formatJsonWithFolding(item, currentLevel + 1)
        return indentStr.repeat(currentLevel + 1) + formatted
      })
      return '[\n' + items.join(',\n') + '\n' + indentStr.repeat(currentLevel) + ']'
    } else {
      const keys = Object.keys(obj)
      if (keys.length === 0) return '{}'
      
      const pairs = keys.map(key => {
        const value = formatJsonWithFolding(obj[key], currentLevel + 1)
        return indentStr.repeat(currentLevel + 1) + `"${key}": ${value}`
      })
      return '{\n' + pairs.join(',\n') + '\n' + indentStr.repeat(currentLevel) + '}'
    }
  }
  
  return JSON.stringify(obj)
}

// 计算行号
const lineNumbers = computed(() => {
  if (!formattedJson.value) return []
  const lines = formattedJson.value.split('\n')
  return lines.map((_, index) => index + 1)
})

// 增强的高亮方法，支持折叠和搜索
const enhancedHighlightedJson = computed(() => {
  if (!formattedJson.value) return ''
  let json = formattedJson.value
  
  // HTML转义
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  
  
  // 1. 先高亮折叠的内容
  json = json.replace(/(\[\.\.\..*?\])/g, '<span class="json-folded">$1</span>')
  json = json.replace(/(\{\.\.\..*?\})/g, '<span class="json-folded">$1</span>')
  
  // 2. 语法高亮
  json = json.replace(/("[^"]*")(?=\s*:)/g, '<span class="json-key">$1</span>') // 键名
  json = json.replace(/(:\s*)"(.*?)"/g, '$1<span class="json-string">"$2"</span>') // 字符串值
  json = json.replace(/(:\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="json-number">$2</span>') // 数字
  json = json.replace(/(:\s*)(true|false)/g, '$1<span class="json-boolean">$2</span>') // 布尔值
  json = json.replace(/(:\s*)(null)/g, '$1<span class="json-null">$2</span>') // null值
  
  // 3. 括号和符号高亮
  json = json.replace(/([{}[\]])/g, '<span class="json-bracket">$1</span>')
  json = json.replace(/([,:])/g, '<span class="json-punctuation">$1</span>')
  
  // 暂时移除折叠按钮，避免全局函数错误
  // json = json.replace(/^(\s*)([{[])/gm, '$1<button class="fold-btn" onclick="toggleFoldAt(this)">▼</button>$2')
  
  return json
})

// 新增高亮方法（保留原有功能）
const highlightedJson = computed(() => {
  if (!formattedJson.value) return ''
  let json = formattedJson.value
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // 先高亮key（带冒号）
  json = json.replace(/("[^"]+")(?=\s*:)/g, '<span class="json-key">$1</span>')
  // 再高亮value的字符串（冒号后，非key）
  json = json.replace(/(:\s*)"(.*?)"/g, '$1<span class="json-string">"$2"</span>')
  // 数字
  json = json.replace(/(:\s*)(-?\d+(?:\.\d+)?)/g, '$1<span class="json-number">$2</span>')
  // 布尔
  json = json.replace(/(:\s*)(true|false)/g, '$1<span class="json-boolean">$2</span>')
  // null
  json = json.replace(/(:\s*)(null)/g, '$1<span class="json-null">$2</span>')
  return json
})
</script>

<style scoped>
.json-highlight {
  color: hsl(var(--bc));
}

/* JSON语法高亮样式 */
.json-highlight .string {
  color: #22c55e;
}

.json-highlight .number {
  color: #3b82f6;
}

.json-highlight .boolean {
  color: #f59e0b;
}

.json-highlight .null {
  color: #ef4444;
}

.json-highlight .key {
  color: #8b5cf6;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .textarea {
    height: calc(100vh - 28rem);
    min-height: 20rem;
    font-size: 16px; /* 防止iOS缩放 */
    line-height: 1.6;
    padding: 1rem !important;
  }
  
  pre {
    font-size: 16px; /* 防止iOS缩放 */
    line-height: 1.6;
  }
  
  .btn {
    min-height: 2.75rem; /* 44px 最小触摸目标 */
    height: 2.75rem;
    min-width: 2.75rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    font-size: 0.875rem;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  .btn-sm {
    min-height: 2.25rem; /* 36px */
    height: 2.25rem;
    min-width: 2.25rem;
    padding-left: 1rem;
    padding-right: 1rem;
    font-size: 0.8125rem;
    touch-action: manipulation;
  }
  
  pre {
    height: 20rem;
  }
  
  /* 输入输出区域优化 */
  .bg-base-100 {
    padding: 1rem !important;
    margin-bottom: 1rem;
  }
  
  /* 标题和描述优化 */
  .text-xl {
    font-size: 1.125rem;
  }
  
  .text-2xl {
    font-size: 1.25rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  /* 工具栏优化 */
  .flex-wrap {
    justify-content: center;
    gap: 0.5rem;
  }
  
  /* 统计信息网格优化 */
  .grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  /* 对比模式移动端优化 */
  .lg\\:hidden {
    display: block !important;
  }
  
  .lg\\:block {
    display: block !important;
  }
}

.custom-json-viewer {
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem; /* 与 rounded-lg 一致 */
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  background: #fff; /* 与 textarea-bordered 默认一致 */
  padding: 0; /* 移除容器内边距，由内部json-pre控制 */
  min-height: 20rem;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
}
.dark .custom-json-viewer {
  background: #23272e;
  border-color: #2a2e37;
}
.textarea, textarea {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  font-size: 15px;
  border: 1.5px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.06);
  background: #fff;
  padding: 0.75rem !important; /* 统一内边距 */
  line-height: 1.7; /* 与格式化结果保持一致 */
  white-space: pre-wrap; /* 与格式化结果完全一致 */
  word-break: break-all; /* 与格式化结果完全一致 */
}
.json-pre {
  margin: 0;
  font-size: 15px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  background: transparent;
  color: #22292f;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 0.75rem; /* 统一内边距 */
}
.dark .json-pre {
  color: #e5e7eb;
}
/* 增强的JSON语法高亮 */
.json-key { 
  color: #0ea5e9; 
  font-weight: 600; 
  text-shadow: 0 0 2px rgba(14, 165, 233, 0.3);
} /* 蓝色键名 */

.json-string { 
  color: #059669; 
  background: rgba(5, 150, 105, 0.05);
  padding: 1px 2px;
  border-radius: 2px;
} /* 绿色字符串值 */

.json-number { 
  color: #ea580c; 
  font-weight: 500;
  background: rgba(234, 88, 12, 0.1);
  padding: 1px 3px;
  border-radius: 2px;
} /* 橙色数字 */

.json-boolean { 
  color: #7c3aed; 
  font-weight: 600;
  background: rgba(124, 58, 237, 0.1);
  padding: 1px 3px;
  border-radius: 2px;
} /* 紫色布尔值 */

.json-null { 
  color: #6b7280; 
  font-style: italic; 
  opacity: 0.8;
  background: rgba(107, 114, 128, 0.1);
  padding: 1px 3px;
  border-radius: 2px;
} /* 灰色null值 */

.json-bracket {
  color: #1f2937;
  font-weight: 700;
}

.json-punctuation {
  color: #374151;
  font-weight: 500;
}

.dark .json-bracket {
  color: #f3f4f6;
}

.dark .json-punctuation {
  color: #d1d5db;
}

/* 折叠内容样式 */
.json-folded {
  color: #6b7280;
  font-style: italic;
  background: rgba(156, 163, 175, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px dashed rgba(156, 163, 175, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.json-folded:hover {
  background: rgba(156, 163, 175, 0.2);
  border-color: rgba(156, 163, 175, 0.5);
  transform: scale(1.02);
}

.dark .json-folded {
  color: #9ca3af;
  background: rgba(156, 163, 175, 0.15);
  border-color: rgba(156, 163, 175, 0.4);
}

.dark .json-folded:hover {
  background: rgba(156, 163, 175, 0.25);
  border-color: rgba(156, 163, 175, 0.6);
}


/* 增强的JSON预览器 */
.json-pre-enhanced {
  margin: 0;
  font-size: 15px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Menlo', 'Courier', monospace;
  background: transparent;
  color: #22292f;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  padding: 0.75rem;
}

.dark .json-pre-enhanced {
  color: #e5e7eb;
}

/* 折叠按钮 */
.fold-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  font-size: 0.75rem;
  background: hsl(var(--b3));
  color: hsl(var(--bc) / 0.7);
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  margin-right: 0.25rem;
  transition: all 0.2s;
}

.fold-btn:hover {
  transform: scale(1.1);
}

.fold-btn.folded {
  transform: rotate(-90deg);
}

/* 行号样式优化 */
.line-number {
  transition: all 0.2s ease;
  padding: 1px 4px;
  border-radius: 3px;
}

.line-number:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

/* JSON树形容器样式 */
.json-tree-container {
  min-height: 36rem;
  background: #fff;
}

.dark .json-tree-container {
  background: #1f2937;
}

/* JSON树视图容器 */
.json-tree-view {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.dark .json-tree-view {
  border-color: #374151;
  background: #1f2937;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .line-numbers {
    min-width: 2.5rem !important;
    font-size: 12px;
    padding: 0.5rem;
  }
  
  .json-pre-enhanced {
    font-size: 15px; /* 提高可读性 */
    padding: 0.75rem;
    line-height: 1.7;
  }
  
  .fold-btn {
    width: 1rem;
    height: 1rem;
    font-size: 0.875rem;
  }
  
  /* 移动端特定优化 */
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  /* 对比模式标签页优化 */
  .join-item {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
  
  /* 搜索框优化 */
  .input-sm {
    min-height: 2.5rem;
    font-size: 0.875rem;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
  }
  
  /* 移动端按钮组优化 */
  .flex.gap-2 {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  
  /* 错误提示优化 */
  .error-message {
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
}

/* 小屏幕进一步优化 */
@media (max-width: 640px) {
  .textarea {
    height: calc(100vh - 32rem);
    min-height: 18rem;
    font-size: 16px;
    padding: 0.875rem !important;
  }
  
  .custom-json-viewer,
  pre {
    height: 18rem;
    font-size: 16px;
  }
  
  /* 页面标题区域优化 */
  .mb-6 {
    margin-bottom: 1rem;
  }
  
  .text-2xl {
    font-size: 1.125rem;
  }
  
  /* 按钮优化 */
  .btn {
    min-height: 2.75rem;
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
  }
  
  .btn-sm {
    min-height: 2.25rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  /* 输入输出区域内边距 */
  .bg-base-100 {
    padding: 0.875rem !important;
    border-radius: 1rem;
  }
  
  /* 工具栏按钮组 */
  .flex-wrap {
    flex-direction: column;
    align-items: stretch;
  }
  
  .flex-wrap .btn {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  
  /* 统计信息卡片 */
  .grid-cols-4 {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  
  /* 对比结果区域移动端优化 */
  .diff-result-container {
    height: 16rem;
  }
  
  /* 字符计数显示移动端优化 */
  .character-count {
    bottom: 0.5rem;
    right: 0.5rem;
    font-size: 0.75rem;
  }
  
  /* 模式切换器 */
  .join {
    width: 100%;
  }
  
  .join-item {
    flex: 1;
    text-align: center;
    padding: 0.625rem;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .container {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  
  .textarea {
    height: calc(100vh - 36rem);
    min-height: 16rem;
    padding: 0.75rem !important;
  }
  
  .custom-json-viewer,
  pre {
    height: 16rem;
  }
  
  /* 极小屏幕按钮优化 */
  .btn {
    min-height: 2.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .btn-sm {
    min-height: 2rem;
    padding: 0.375rem 0.5rem;
    font-size: 0.6875rem;
  }
  
  /* 统计信息单列显示 */
  .grid-cols-4 {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  /* 标题进一步缩小 */
  .text-xl {
    font-size: 1rem;
  }
  
  .text-2xl {
    font-size: 1.125rem;
  }
  
  /* 输入输出区域 */
  .bg-base-100 {
    padding: 0.75rem !important;
  }
  
  /* 对比模式优化 */
  .mobile-diff-container {
    padding: 0.75rem !important;
  }
  
  /* JSON内容区域 */
  .json-content {
    padding: 0.5rem;
  }
  
  .line-numbers {
    padding: 0.5rem 0.375rem;
    min-width: 2rem !important;
    font-size: 10px;
  }
}

/* 移动端对比模式滑动动画 */
@media (max-width: 1024px) {
  .lg\\:block {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .lg\\:block.hidden {
    opacity: 0;
    transform: translateX(-20px);
    pointer-events: none;
  }
  
  .lg\\:block.block {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }
  
  /* 移动端工具栏优化 */
  .lg\\:hidden .join {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 0.75rem;
    overflow: hidden;
  }
  
  .lg\\:hidden .join-item {
    min-height: 2.75rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .lg\\:hidden .join-item.btn-primary {
    transform: scale(1.02);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }
  
  /* 滑动提示样式 */
  .lg\\:hidden .text-xs {
    padding: 0.25rem 0.75rem;
    background: hsl(var(--b2));
    border-radius: 1rem;
    display: inline-block;
  }
}

/* 触摸反馈优化 */
.touch-manipulation:active {
  transform: scale(0.98);
  transition: transform 0.1s ease;
}

/* Toast 提示样式 */
.toast {
  z-index: 9999;
}

.alert {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.alert-success {
  background: rgba(34, 197, 94, 0.9);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.alert-error {
  background: rgba(239, 68, 68, 0.9);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

/* 加载动画优化 */
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 按钮悬停效果优化 */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 行号优化 */
.line-number {
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.line-number:hover {
  background: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
  transform: scale(1.05);
}

/* JSON内容区域优化 */
.json-pre-enhanced {
  transition: all 0.3s ease;
}

.json-pre-enhanced:hover {
  background: rgba(255, 255, 255, 0.02);
}

.dark .json-pre-enhanced:hover {
  background: rgba(0, 0, 0, 0.02);
}

/* 对比模式容器优化 */
@media (max-width: 768px) {
  .grid.grid-cols-1.lg\\:grid-cols-2 {
    position: relative;
    overflow: hidden;
  }
  
  /* JSON输入区域移动端优化 */
  .bg-base-100.rounded-2xl {
    margin-bottom: 0.5rem;
  }
  
  .bg-base-100.rounded-2xl.hidden {
    display: none !important;
  }
  
  .bg-base-100.rounded-2xl.block {
    display: block !important;
    animation: slideInFromRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style> 
 