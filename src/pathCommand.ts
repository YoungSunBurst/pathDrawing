import {SVGPathCommand} from './types';
import {drawCircle} from './drawings';
import {ANCHOR_SIZE} from './constants';

export abstract class AbstractPathCommand {
    type: SVGPathCommand;
    x: number;
    y: number;

    abstract draw(
        renderingContext: CanvasRenderingContext2D,
        includeCircle: boolean,
    ): void;

    isNearPoint(x: number, y: number): boolean {
        return (
            Math.abs(x - this.x) < ANCHOR_SIZE && Math.abs(y - this.y) < ANCHOR_SIZE
        );
    }

    abstract getSVGCommandString(): string;
}

export class MoveTo extends AbstractPathCommand {
    type: SVGPathCommand = SVGPathCommand.MOVETO;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    draw(
        renderingContext: CanvasRenderingContext2D,
        includeCircle: boolean = false,
    ) {
        renderingContext.moveTo(this.x, this.y);
        if (includeCircle) {
            drawCircle(this.x, this.y, ANCHOR_SIZE, renderingContext);
        }
    }

    getSVGCommandString() {
        return `M${this.x} ${this.y} `;
    }
}

export class LineTo extends AbstractPathCommand {
    type: SVGPathCommand = SVGPathCommand.LINETO;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }

    draw(
        renderingContext: CanvasRenderingContext2D,
        includeCircle: boolean = false,
    ) {
        renderingContext.lineTo(this.x, this.y);
        renderingContext.stroke();
        if (includeCircle) {
            drawCircle(this.x, this.y, ANCHOR_SIZE, renderingContext);
        }
    }

    getSVGCommandString() {
        return `L${this.x} ${this.y} `;
    }
}

export class CubicBezierCurve extends AbstractPathCommand {
    type: SVGPathCommand = SVGPathCommand.CURVETO;
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
    ) {
        super();
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    draw(
        renderingContext: CanvasRenderingContext2D,
        includeCircle: boolean = false,
    ) {
        renderingContext.bezierCurveTo(
            this.x1,
            this.y1,
            this.x2,
            this.y2,
            this.x,
            this.y,
        );
        renderingContext.stroke();
        if (includeCircle) {
            drawCircle(this.x, this.y, ANCHOR_SIZE, renderingContext);
        }
    }

    getSVGCommandString() {
        return `C${this.x1} ${this.y1} ${this.x2} ${this.y2} ${this.x} ${this.y} `;
    }
}
