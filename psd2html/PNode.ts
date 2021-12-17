// PNode对象

import { clippedBy, isTextLayer } from "./common/utils"
import { transformCss } from "./transform/css"
import { transformHtml } from "./transform/html"
/**
 * 导出配置
 */
interface IExportOptions {
  /** 是否深入 */
  deep: Boolean
}
let nodeId = 0
/**
 * pnode类
 */
export class PNode {
  /** 唯一id */
  uid: number
  /** 真实节点 */
  realNode: RealNode
  /** 父节点 */
  parent?: PNode
  /** 子节点数组 */
  children: PNode[] = []
  /** 被当前节点裁剪的节点 */
  clippedChilds: PNode[] = []
  /** json数据 */
  jsonData: NExport.IData
  /** 图层样式 */
  layerStyles?: RealNodeLayerStyles
  /** 类名 */
  className: string
  /** 类型 */
  type: string
  /** 文本数据 */
  textData?: NExport.ITextData
  /** 获取坐标定位 */
  get position(): IPosition {
    // 获取json数据
    const data = this.jsonData
    // 返回坐标位置
    return {
      left: data.left || 0,
      top: data.top || 0,
      right: data.right || 0,
      bottom: data.bottom || 0
    }
  }
  /** 获取节点大小 */
  get size(): ISize {
    // 获取json数据
    const data = this.jsonData
    // 返回大小信息
    return {
      width: data.width,
      height: data.height
    }
  }
  /**
   * 构造方法
   * @param node psdNode 
   */
  constructor(node: RealNode, parent?: PNode) {
    nodeId ++
    this.uid = nodeId
    // 设置真实node
    this.realNode = node
    // 关联
    ;(node as any).pNode = this
    // 初始化json数据
    this.jsonData = node.export()
    // 获取图层属性
    const objectEffects = node.get('objectEffects') || {}
    this.layerStyles = objectEffects.data
    // 判断是否存在父节点
    if (parent) {
      // 父子关联
      parent.children.push(this)
      // 设置父节点
      this.parent = parent
    }
    // 初始化子元素
    initChildren(this)
    // 初始化真实属性
    initRealProps(this)
  }
  /**
   * 转换成html
   */
  exportHtml(opts?: IExportOptions): string {
    const { deep } = opts || {}
    // 子节点html代码
    let childrenHtml: string = ''
    if (deep) {
      // 遍历调用
      childrenHtml = this.children.map(child => child.exportHtml({
        deep
      })).join('')
    }
    return transformHtml(this, childrenHtml)
  }
  /**
   * 转换成css
   */
  async exportCss(opts?: IExportOptions) {
    const { deep } = opts || {}
    // 子节点html代码
    let childrenStyles: string = ''
    if (deep) {
      // 遍历调用
      for (const child of this.children) {
        childrenStyles += await child.exportCss({
          deep
        })
      }
    }
    return await transformCss(this, childrenStyles)
  }
}
/**
 * 初始化子节点
 * @param parent 父
 */
function initChildren(parent: PNode) {
  // 获取子节点
  const children = parent.realNode.children() || []
  children.reverse()
  // 遍历
  children.forEach((child: RealNode) => {
    if (!child.layer.visible) return
    // 创建pNode对象
    const pNode = new PNode(child)
    // 判断是否为裁剪图层
    if (child.layer.clipped) {
      // 获取被谁裁剪
      let _clippedBy = clippedBy(child)
      // 找到对应PNode
      const clippedByPNode: PNode = (_clippedBy as any).pNode
      // 关联
      clippedByPNode.clippedChilds.push(pNode)
    } else {
      // 添加父子关系
      pNode.parent = parent
      parent.children.push(pNode)
    }
  })
}
/**
 * 初始化真实属性
 * @param node 
 */
function initRealProps(node: PNode) {
  const jsonData = node.jsonData
  const realNode = node.realNode
  const textData = node.textData = jsonData.text
  // 获取类型
  const type = textData ? 'text' : realNode.type
  // 设置类型
  node.type = type
  // 初始化className
  node.className = `${type}__${(realNode.name ? realNode.name + '--' : '').replace(/ |\?|\!|\+|\=|\./g, '') + node.uid}`
}