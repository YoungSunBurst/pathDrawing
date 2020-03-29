import {State} from './types';
import {
    AbstractPathCommand,
    MoveTo,
    LineTo,
    CubicBezierCurve,
} from './pathCommand';
import {drawCircle, drawRefLine, drawHalfRefLine} from './drawings';
import {calcSymmetry} from './utils';
import {ANCHOR_SIZE} from './constants';

export class PathDrawer {
    canvasEl: HTMLCanvasElement;
    renderingContext: CanvasRenderingContext2D;
    state: State = State.init;
    path: AbstractPathCommand[] = [];
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    x?: number;
    y?: number;
    _isPrevControlPoint = false;

    constructor(canvasEl: HTMLCanvasElement) {
        this.canvasEl = canvasEl;
        this.renderingContext = canvasEl.getContext('2d');
        canvasEl.addEventListener('mousedown', this.onMouseDown);
        canvasEl.addEventListener('mousemove', this.onMouseMove);
        canvasEl.addEventListener('mouseup', this.onMouseUp);
        canvasEl.addEventListener('contextmenu', this.onRightClick);
    }

    setCurrentPos(e: MouseEvent) {
        this.x = e.offsetX * 2;
        this.y = e.offsetY * 2;
    }

    setCurrentPosByCommand(index: number) {
        this.x = this.path[index].x;
        this.y = this.path[index].y;
        this.x2 = this.path[index].x;
        this.y2 = this.path[index].y;
    }

    setControlPoint(e: MouseEvent) {
        this.x2 = e.offsetX * 2;
        this.y2 = e.offsetY * 2;
    }

    isDifferentPoint(): boolean {
        return this.x !== this.x2 || this.y !== this.y2;
    }

    isPrevControlPoint(): boolean {
        return this._isPrevControlPoint;
        // return this.x1 !== undefined && this.y1 !== undefined;
    }

    getCommand(): AbstractPathCommand {
        let com: AbstractPathCommand | undefined = undefined;
        const symmetry = calcSymmetry(this.x, this.y, this.x2, this.y2);

        if (this.path.length === 0) {
            com = new MoveTo(this.x, this.y);
            console.log(com);
        } else if (
            this.x1 === undefined &&
            this.y1 === undefined &&
            !this.isDifferentPoint()
        ) {
            com = new LineTo(this.x, this.y);
        } else {
            com = new CubicBezierCurve(
                this.x,
                this.y,
                this.x1,
                this.y1,
                symmetry.x,
                symmetry.y,
            );
        }
        this._isPrevControlPoint = this.isDifferentPoint();

        console.log(this.x, this.y, this.x2, this.y2, symmetry.x, symmetry.y);
        this.x1 = this.x2;
        this.y1 = this.y2;
        // } else {
        //   this.x1 = undefined;
        //   this.y1 = undefined;
        // }
        this.x2 = undefined;
        this.y2 = undefined;
        console.log(com);
        return com;
    }

    public getSVGCommandString() {
        return this.path.reduce((result: string, p: AbstractPathCommand) => {
            return result + p.getSVGCommandString();
        }, '');
    }

    private onDraw = () => {
        this.renderingContext.clearRect(0, 0, 2000, 2000);
        this.renderingContext.beginPath();
        this.renderingContext.lineWidth = 2;
        this.renderingContext.strokeStyle = 'black';
        this.path.forEach(p => {
            p.draw(this.renderingContext, this.state !== State.end);
        });
        if (this.state === State.init) {
        } else if (this.state === State.pointSet) {
            if (this.path.length > 0 && this.isPrevControlPoint()) {
                const lastPath = this.path[this.path.length - 1];
                // drawCircle(this.x, this.y, ANCHOR_SIZE, this.renderingContext);
                drawHalfRefLine(
                    lastPath.x,
                    lastPath.y,
                    this.x1,
                    this.y1,
                    this.renderingContext,
                );
                this.renderingContext.moveTo(lastPath.x, lastPath.y);
            }
            this.drawCurrentPoint(this.renderingContext);
            drawCircle(this.x, this.y, ANCHOR_SIZE, this.renderingContext);
            if (this.isDifferentPoint()) {
                drawRefLine(this.x, this.y, this.x2, this.y2, this.renderingContext);
            }
        } else if (this.state === State.nextPoint) {
            if (this.path.length > 0 && this.isPrevControlPoint()) {
                const lastPath = this.path[this.path.length - 1];
                drawCircle(this.x, this.y, ANCHOR_SIZE, this.renderingContext);
                drawRefLine(
                    lastPath.x,
                    lastPath.y,
                    this.x1,
                    this.y1,
                    this.renderingContext,
                );
                this.renderingContext.moveTo(lastPath.x, lastPath.y);
            }
            this.drawCurrentPoint(this.renderingContext);
        }
    };

    private drawCurrentPoint(renderingContext: CanvasRenderingContext2D) {
        renderingContext.strokeStyle = 'black';
        const symmetry = calcSymmetry(this.x, this.y, this.x2, this.y2);
        if (this.isPrevControlPoint()) {
            renderingContext.bezierCurveTo(
                this.x1,
                this.y1,
                symmetry.x,
                symmetry.y,
                this.x,
                this.y,
            );
        } else if (this.isDifferentPoint()) {
            renderingContext.quadraticCurveTo(symmetry.x, symmetry.y, this.x, this.y);
        } else {
            renderingContext.lineTo(this.x, this.y);
        }
        renderingContext.stroke();
    }

    private onMouseMove = (e: MouseEvent) => {
        if (this.state === State.pointSet) {
            this.setControlPoint(e);
        } else if (this.state === State.nextPoint) {
            const index = this.getClickablePoint(e);
            if (index > -1) {
                this.canvasEl.style.cursor = 'crosshair';
            } else {
                this.canvasEl.style.cursor = 'default';
            }
            this.setControlPoint(e);
            this.setCurrentPos(e);
        }
        this.onDraw();
    };

    private onMouseUp = (e: MouseEvent) => {
        console.log('onMouseUp', this.state, e.offsetX, e.offsetY);
        if (this.state === State.pointSet) {
            this.path.push(this.getCommand());
            this.setCurrentPos(e);
            this.setControlPoint(e);
            this.state = State.nextPoint;
        }
        this.onDraw();
    };

    private onMouseDown = (e: MouseEvent) => {
        // TODO: right click
        if (e.button === 0) {
            console.log('onMouseDown', this.state, e.offsetX, e.offsetY);
            if (this.state === State.init) {
                this.setCurrentPos(e);
                this.setControlPoint(e);

                this.state = State.pointSet;
            } else if (this.state === State.pointSet) {
            } else if (this.state === State.nextPoint) {
                const index = this.getClickablePoint(e);
                if (index > -1) {
                    this.setCurrentPosByCommand(index);
                    this.path.push(this.getCommand());
                    this.canvasEl.style.cursor = 'default';
                    this.state = State.end;
                } else {
                    this.setCurrentPos(e);
                    this.setControlPoint(e);
                    this.state = State.pointSet;
                }
            }
            this.onDraw();
        }
    };

    private onRightClick = (e: MouseEvent) => {
        if (this.state !== State.end) {
            this.path.push(this.getCommand());
            this.canvasEl.style.cursor = 'default';
            this.state = State.end;
        } else {
            this.path.splice(0, this.path.length);
            this.state = State.init;
        }
        this.onDraw();
        e.preventDefault();
        return false;
    };

    private getClickablePoint(e: MouseEvent) {
        // this.path.forEach(p => {
        for (let i = 0; i < this.path.length; i++) {
            if (this.path[i].isNearPoint(e.offsetX * 2, e.offsetY * 2)) {
                return i;
            }
        }
        return -1;
    }
}
