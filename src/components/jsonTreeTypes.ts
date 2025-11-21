export interface VisualNode {
  id: string
  key: string
  value: any
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'
  line: number
  closeLine?: number // 容器类型的结束行号
  depth: number
  path: string
  isLast: boolean
  children: VisualNode[]
  itemCount: number
}

export class LineCounter {
  count = 0
  next() {
    return ++this.count
  }
  reset() {
    this.count = 0
  }
}

export function buildVisualTree(
  data: any,
  key: string = '',
  depth: number = 0,
  path: string = 'root',
  isLast: boolean = true,
  counter: LineCounter = new LineCounter()
): VisualNode {
  const currentLine = counter.next()
  const type = getType(data)
  const isContainer = type === 'object' || type === 'array'
  
  const node: VisualNode = {
    id: `${path}-${currentLine}`,
    key,
    value: data,
    type,
    line: currentLine,
    depth,
    path,
    isLast,
    children: [],
    itemCount: 0
  }

  if (isContainer && data !== null) {
    const keys = Object.keys(data)
    node.itemCount = keys.length
    
    if (keys.length > 0) {
      keys.forEach((k, index) => {
        const isLastChild = index === keys.length - 1
        // 如果当前节点是数组，子节点的 key 设为空字符串（不显示下标）
        const childKey = Array.isArray(data) ? '' : k
        const childNode = buildVisualTree(
          data[k],
          childKey,
          depth + 1,
          `${path}.${k}`,
          isLastChild,
          counter
        )
        node.children.push(childNode)
      })
      // 容器结束行
      node.closeLine = counter.next()
    } else {
      // 空容器占2行（开始和结束）或者1行？
      // 这里我们让空容器也占两行以便显示完整结构，或者可以优化为单行显示
      // 既然用户要求行号，通常 {} 也是占两行比较清晰：
      // {
      // }
      node.closeLine = counter.next()
    }
  }

  return node
}

function getType(data: any): VisualNode['type'] {
  if (data === null) return 'null'
  if (Array.isArray(data)) return 'array'
  return typeof data as VisualNode['type']
}
