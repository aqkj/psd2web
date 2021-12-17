// 颜色
import { normal } from 'color-blend'
/**
 * 颜色混合
 * @param c1 颜色1
 * @param c2 颜色2
 */
export function colorBlend(c1: number[], c2: number[]) {
  const color1 = {
    r: c1[0],
    g: c1[1],
    b: c1[2],
    a: c1[3] / 255
  }
  const color2 = {
    r: c2[0],
    g: c2[1],
    b: c2[2],
    a: c2[3] / 255
  }
  const resultColor = normal(color1, color2)
  return [resultColor.r, resultColor.g, resultColor.b, Math.min(Math.ceil(resultColor.a * 255), 255)]
}
// export function colorBlend(c1: number[], c2: number[]) {
// 	const fAlp1 = c1[3] / 255.0
// 	const fAlp2 = c1[3] / 255.0
// 	const fAlpBlend = fAlp1 + fAlp2 - fAlp1 * fAlp2
// 	const fRed1 = c1[0] / 255.0
// 	const fRed2 = c2[0] / 255.0
// 	const fRedBlend = calculateBlend(fAlp1, fAlp2, fRed1, fRed2)
// 	const fGreen1 = c1[1] / 255.0
// 	const fGreen2 = c2[1] / 255.0
// 	const fGreenBlend = calculateBlend(fAlp1, fAlp2, fGreen1, fGreen2)
// 	const fBlue1 = c1[2] / 255.0
// 	const fBlue2 = c2[2] / 255.0
// 	const fBlueBlend = calculateBlend(fAlp1, fAlp2, fBlue1, fBlue2)
//   return [fAlpBlend * 255, fRedBlend * 255, fGreenBlend * 255, fBlueBlend * 255]
// }
// /**
//  * 颜色计算
//  */
// function calculateBlend(a1: number, a2: number, c1: number, c2: number) {
//   return (c1 * a1 * (1.0 - a2) + c2 * a2) / (a1 + a2 - a1 * a2)
// }
// function colorBlend (c1, c2){
//   var a = c1.a + c2.a*(1-c1.a); return { r: (c1.r * c1.a + c2.r * c2.a * (1 - c1.a)) / a, g: (c1.g * c1.a + c2.g * c2.a * (1 - c1.a)) / a, b: (c1.b * c1.a + c2.b * c2.a * (1 - c1.a)) / a, a: a }
// } 