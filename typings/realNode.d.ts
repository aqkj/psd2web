// 真实node声明文件
/**
 * 真实元素接口
 */
declare class RealNode {
  /** 获取所有后代节点，不包括当前节点 */
  descendants(): RealNode[]
  /** 获取直接子节点 */
  children(): RealNode[]
  /** 判断是否是根节点 */
  isRoot(): boolean
  /** 判断是否是组 */
  isGroup(): boolean
  /** 导出json */
  export(): NExport.IData
  /** 获取图层属性 */
  get(prop: string): any
  /** 导出png */
  toPng(): any
  /** 类型 */
  type: string
  /** 图层名称 */
  name: string
  /** 剪切蒙版 */
  clippedBy?: () => RealNode
  /** 图层信息 */
  layer: any
}
/**
 * 图层样式接口
 */
declare class RealNodeLayerStyles {
  /** 斜面和浮雕 */
  ebbl: any
  /** 描边 */
  FrFX: any
  /** 内阴影 */
  IrSh: any
  /** 内发光 */
  IrGl: any
  /** 光泽 */
  ChFX: any
  /** 颜色叠加 */
  SoFi: any
  /** 渐变叠加 */
  GrFl: any
  /** 图案叠加 */
  patternFill: any
  /** 外发光 */
  OrGl: any
  /** 投影 */
  DrSh: any
}
/**
 * 导出数据
 */
declare namespace NExport {
  /**
   * 导出data接口
   */
  interface IData {
    /** 类型 */
    type: 'layer' | 'group' | 'root' | undefined
    /** 透明度 */
    opacity: number
    /** 图层名称 */
    name: string
    /** 坐标位置 左侧 */
    left: number
    /** 坐标位置 顶部 */
    top: number
    /** 坐标位置 右侧 */
    right: number
    /** 坐标位置 底部 */
    bottom: number
    /** 高度 */
    height: number
    /** 宽度 */
    width: number
    /** 子数据数组 */
    children: IData[]
    /** 文本信息，文本图层才有 */
    text: ITextData
  }
  /**
   * 文本信息接口
   */
  interface ITextData {
    /** 文本内容 */
    value: string
    /** 字体数据 */
    font: ITextFontData,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    transform: { xx: 1, xy: 0, yx: 0, yy: 1, tx: 456, ty: 459 }
  }
  /**
   * 文本字体接口
   */
  interface ITextFontData {
    /** 字体名称 */
    name: string
    /** 字体大小 */
    sizes: number[]
    /** 颜色值 */
    colors: [number, number, number, number][]
    /** 排列方式 */
    alignment: string[]
  }
}