import {calcSymmetry} from './utils';
import {ANCHOR_SIZE} from './constants';

export function drawCircle(
    x: number,
    y: number,
    radius: number,
    renderingContext: CanvasRenderingContext2D,
) {
    renderingContext.beginPath();
    renderingContext.arc(x, y, radius, 0, Math.PI * 2, false);
    renderingContext.stroke();
    renderingContext.moveTo(x, y);
}

export function drawRefLine(
    refX: number,
    refY: number,
    x: number,
    y: number,
    renderingContext: CanvasRenderingContext2D,
) {
    const symmetry = calcSymmetry(refX, refY, x, y);
    drawCircle(symmetry.x, symmetry.y, ANCHOR_SIZE, renderingContext);
    renderingContext.beginPath();
    renderingContext.strokeStyle = 'blue';
    renderingContext.moveTo(symmetry.x, symmetry.y);
    renderingContext.lineTo(x, y);
    renderingContext.stroke();
    drawCircle(x, y, ANCHOR_SIZE, renderingContext);
}

export function drawHalfRefLine(
    refX: number,
    refY: number,
    x: number,
    y: number,
    renderingContext: CanvasRenderingContext2D,
) {
    drawCircle(x, y, ANCHOR_SIZE, renderingContext);
    renderingContext.beginPath();
    renderingContext.strokeStyle = 'blue';
    renderingContext.moveTo(x, y);
    renderingContext.lineTo(refX, refY);
    renderingContext.stroke();
}

export function drawLine(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    renderingContext: CanvasRenderingContext2D,
) {
    console.log(x1, y1, x2, y2);
    renderingContext.beginPath();
    renderingContext.strokeStyle = 'blue';
    renderingContext.moveTo(x1, y1);
    renderingContext.lineTo(x2, y2);
    renderingContext.stroke();
}
