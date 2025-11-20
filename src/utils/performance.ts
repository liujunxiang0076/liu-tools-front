/**
 * 性能监控工具
 */

export interface PerformanceMetrics {
  // 页面加载时间
  loadTime: number
  // 首次内容绘制
  fcp: number
  // 最大内容绘制
  lcp: number
  // 首次输入延迟
  fid: number
  // 累积布局偏移
  cls: number
  // 页面交互时间
  tti: number
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {}
  private observers: PerformanceObserver[] = []

  constructor() {
    this.init()
  }

  /**
   * 初始化性能监控
   */
  private init() {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return
    }

    // 监听页面加载完成
    if (document.readyState === 'complete') {
      this.measureLoadTime()
    } else {
      window.addEventListener('load', () => this.measureLoadTime())
    }

    // 监听 FCP (First Contentful Paint)
    this.observePaint()

    // 监听 LCP (Largest Contentful Paint)
    this.observeLCP()

    // 监听 FID (First Input Delay)
    this.observeFID()

    // 监听 CLS (Cumulative Layout Shift)
    this.observeCLS()
  }

  /**
   * 测量页面加载时间
   */
  private measureLoadTime() {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (perfData) {
      this.metrics.loadTime = perfData.loadEventEnd - perfData.fetchStart
      this.metrics.tti = perfData.domInteractive - perfData.fetchStart
    }
  }

  /**
   * 监听 Paint 指标 (FCP)
   */
  private observePaint() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime
          }
        }
      })
      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    } catch (e) {
      // PerformanceObserver 不支持
    }
  }

  /**
   * 监听 LCP (Largest Contentful Paint)
   */
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(observer)
    } catch (e) {
      // PerformanceObserver 不支持
    }
  }

  /**
   * 监听 FID (First Input Delay)
   */
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any
          this.metrics.fid = fidEntry.processingStart - fidEntry.startTime
        }
      })
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    } catch (e) {
      // PerformanceObserver 不支持
    }
  }

  /**
   * 监听 CLS (Cumulative Layout Shift)
   */
  private observeCLS() {
    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value
            this.metrics.cls = clsValue
          }
        }
      })
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    } catch (e) {
      // PerformanceObserver 不支持
    }
  }

  /**
   * 获取性能指标
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics }
  }

  /**
   * 输出性能报告
   */
  report() {
    const metrics = this.getMetrics()
    console.group('📊 性能监控报告')
    console.log('页面加载时间:', metrics.loadTime ? `${metrics.loadTime.toFixed(2)}ms` : 'N/A')
    console.log('首次内容绘制 (FCP):', metrics.fcp ? `${metrics.fcp.toFixed(2)}ms` : 'N/A')
    console.log('最大内容绘制 (LCP):', metrics.lcp ? `${metrics.lcp.toFixed(2)}ms` : 'N/A')
    console.log('首次输入延迟 (FID):', metrics.fid ? `${metrics.fid.toFixed(2)}ms` : 'N/A')
    console.log('累积布局偏移 (CLS):', metrics.cls ? metrics.cls.toFixed(4) : 'N/A')
    console.log('页面交互时间 (TTI):', metrics.tti ? `${metrics.tti.toFixed(2)}ms` : 'N/A')
    console.groupEnd()

    // 性能评分
    this.scorePerformance(metrics)
  }

  /**
   * 性能评分
   */
  private scorePerformance(metrics: Partial<PerformanceMetrics>) {
    const scores: { [key: string]: string } = {}

    // FCP 评分 (< 1.8s 好, < 3s 中, >= 3s 差)
    if (metrics.fcp) {
      scores.FCP = metrics.fcp < 1800 ? '✅ 好' : metrics.fcp < 3000 ? '⚠️ 中' : '❌ 差'
    }

    // LCP 评分 (< 2.5s 好, < 4s 中, >= 4s 差)
    if (metrics.lcp) {
      scores.LCP = metrics.lcp < 2500 ? '✅ 好' : metrics.lcp < 4000 ? '⚠️ 中' : '❌ 差'
    }

    // FID 评分 (< 100ms 好, < 300ms 中, >= 300ms 差)
    if (metrics.fid) {
      scores.FID = metrics.fid < 100 ? '✅ 好' : metrics.fid < 300 ? '⚠️ 中' : '❌ 差'
    }

    // CLS 评分 (< 0.1 好, < 0.25 中, >= 0.25 差)
    if (metrics.cls) {
      scores.CLS = metrics.cls < 0.1 ? '✅ 好' : metrics.cls < 0.25 ? '⚠️ 中' : '❌ 差'
    }

    console.group('🎯 性能评分')
    Object.entries(scores).forEach(([key, value]) => {
      console.log(`${key}:`, value)
    })
    console.groupEnd()
  }

  /**
   * 测量函数执行时间
   */
  measure(name: string, fn: () => void) {
    const start = performance.now()
    fn()
    const end = performance.now()
    console.log(`⏱️ ${name} 执行时间: ${(end - start).toFixed(2)}ms`)
  }

  /**
   * 异步测量函数执行时间
   */
  async measureAsync(name: string, fn: () => Promise<void>) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    console.log(`⏱️ ${name} 执行时间: ${(end - start).toFixed(2)}ms`)
  }

  /**
   * 清理所有观察器
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 导出单例
export const performanceMonitor = new PerformanceMonitor()

// 开发环境自动输出性能报告
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.addEventListener('load', () => {
    setTimeout(() => {
      performanceMonitor.report()
    }, 3000)
  })
}
