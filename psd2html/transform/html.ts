// 转换html

import { isTextLayer } from "../common/utils"
import { PNode } from "../PNode"

/**
 * 转换html
 * @param node 节点
 * @param childHtmls 子渲染
 */
export function transformHtml(node: PNode, childHtmls: string): string {
  const realNode = node.realNode
  const jsonData = node.jsonData
  // 判断是否为组
  // if (realNode.isRoot()) return `<div class="${node.className}">${childHtmls}</div>`
  // else if (realNode.isGroup()) return `<div class="group-${node.uid}">${childHtmls}</div>`
  // else if (isTextLayer(realNode)) return `<div class="text-${node.uid}">${jsonData.text.value}</div>`
  return `<div class="${node.className}">${node.type === 'text' ? jsonData.text.value : childHtmls}</div>`
}