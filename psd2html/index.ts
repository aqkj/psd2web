/**
 * 主入口
 */
import PSD from './psd.js'
import { stream2Base64 } from './common/utils'
import { PNode } from './PNode'

/**
 * pasd读取
 */
export default async function PSDRead(file) {
  // 读取文件
  const psd = PSD.fromFile(file)
  // 转换
  psd.parse()
  // 生成node树
  const node: RealNode = psd.tree()
  // console.log((node.children()[0].children()[1] as any).get('vectorMask'))
  // return {}
  // 创建pnode对象
  const pNodes = new PNode(node)
  // 导出html
  const html = pNodes.exportHtml({
    deep: true
  })
  // 导出css
  const css = await pNodes.exportCss({
    deep: true
  })
  // 导出
  return {
    html,
    css
  }
}