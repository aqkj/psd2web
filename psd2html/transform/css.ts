// 转换css

import { getTransformRotate, isSingleColor, stream2Base64 } from "../common/utils"
import { mergeChildsPixelData, mergeMaskPixelData, pixedData2Base64 } from '../common/pixel'
import { PNode } from "../PNode";

/**
 * 转换css
 * @param node 节点
 * @param childStyles 子样式字符串
 */
export async function transformCss(node: PNode, childStyles: string): Promise<string> {
  try {
    if (node.type === 'group') return childStyles
    const backgroundStyles = await getBackground(node)
    // 拼接样式
    let styles = {
      ...getPosition(node),
      ...getOpacity(node),
      ...backgroundStyles
    }
    if (node.type === 'text') {
      styles = {
        ...styles,
        ...getTextStyles(node, styles)
      }
    } else {
      styles = {
        ...styles,
        ...getSize(node),
      }
    }
    return `.${node.className}{${obj2Css(styles)}}${childStyles}`
  } catch (error) {
    console.error('转换失败', node.className, error)
  }
}
/**
 * 获取文本样式
 * @param node 节点
 */
function getTextStyles(node: PNode, defaultStyles: any) {
  const position = node.position
  const textData = node.realNode.get('typeTool')
  // const text = node.textData
  // const css = textData.toCSS()
  const color = textData.colors()[0]
  // const fonts = textData.fonts()
  // const skip = textData.skip()
  const stylesData = textData.styles()
  const leading = stylesData.Leading && stylesData.Leading[0] || '1'
  const alignment = textData.alignment()[0]
  const transform = textData.transform
  const size = Math.ceil(stylesData.FontSize[0] * transform.yy)
  const rotate = getTransformRotate(transform)
  const diffYY = 1 - transform.yy
  const styles = {
    color: `rgba(${color.join(',')})`,
    'font-size': size,
    'line-height': leading,
    'text-align': alignment,
    'transform': [`rotate(${rotate}deg)`],
    'white-space': 'pre',
    'top': defaultStyles.top - (leading - size) / 2
  }
  return styles
}
/**
 * 获取透明度
 */
function getOpacity(node: PNode) {
  const opacity = node.realNode.layer.opacity / 255
  return {
    opacity: opacity.toFixed(3)
  }
}
/**
 * 获取坐标
 * @param node 节点
 */
function getPosition(node: PNode) {
  const position = node.position
  // 样式
  const styles = {
    position: 'absolute',
    left: position.left,
    top: position.top
  }
  return styles
}
/**
 * 获取大小
 * @param node 节点
 */
function getSize(node: PNode) {
  const size = node.size
  // 返回
  return size
}
/**
 * 获取背景
 * @param node 节点
 */
async function getBackground(node: PNode) {
  // 判断是否是组或者根
  const isGroupOrRoot: boolean = !!node.type.match(/group|root/)
  // 如果是组则直接返回
  if (isGroupOrRoot) return {}
  try {
    // 层级样式
    const layerStyles = node.layerStyles
    const realNode = node.realNode
    // 像素数据
    let pixelData: Uint8Array = realNode.layer.image.pixelData
    // 样式对象
    const styles: Record<string, any> = {}
    // 获取大小
    const size = node.size
    // 判断是否存在剪切
    if (node.clippedChilds.length) {
      try {
        // 获取合并后的像素点
        pixelData = mergeChildsPixelData(node, node.clippedChilds)
      } catch (err) {
        console.error('clipped background 处理失败', err)
      }
    } else if (node.type === 'text') { // 如果是文本标签
      return styles
    }
    const mask = realNode.layer.mask
    // 判断是否存在mask蒙层
    if (mask.defaultColor) {
      pixelData = mergeMaskPixelData(node, pixelData)
      // const maskPixelData = realNode.layer.image.maskData
      // pixelData = maskPixelData
      // const base64 = await pixedData2Base64(pixelData, mask.width, mask.height)
      // styles['background'] = `url(data:image/png;base64,${base64}) no-repeat top center / 100% 100%`
      // return styles
    }
    // 转换
    const base64 = await pixedData2Base64(pixelData, size.width, size.height)
    styles['background'] = `url(data:image/png;base64,${base64}) no-repeat top center / 100% 100%`
    return styles
  } catch (error) {
    console.error('background 处理失败', node.className, error)
  }
}
/**
 * 获取文字样式
 * @param node 节点
 */
function getFontStyles(node: PNode) {
  
}
/**
 * 对象转css
 * @param obj 对象
 */
function obj2Css(obj: Record<string, any>): string {
  let styles = ''
  // 遍历
  for (const key in obj) {
    let value: string | number | any[] = obj[key]
    // 判断是否为数组
    if (Array.isArray(value)) {
      let temp = []
      value.forEach(item => {
        if (typeof value === 'number') item += 'px'
        temp.push(item)
      })
      value = temp.join(' ')
      // 判断是否为number
    } else if (typeof value === 'number') value = `${value}px`
    // 拼接
    if (!value) continue
    styles += `${key}: ${value};`
  }
  // 返回
  return styles
}