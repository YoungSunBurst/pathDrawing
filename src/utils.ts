export function calcSymmetry(refX: number, refY: number, x: number, y: number) {
    return {x: refX - (x - refX), y: refY - (y - refY)};
}
