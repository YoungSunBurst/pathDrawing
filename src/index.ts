import {PathDrawer} from './PathDrawer';
import {SVGTEPLETE} from './constants';

const canvasEl: HTMLCanvasElement = document.getElementById(
    'canvas',
) as HTMLCanvasElement;

const pathDrawer: PathDrawer = new PathDrawer(canvasEl);

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) {
        navigator.clipboard.writeText(SVGTEPLETE(pathDrawer.getSVGCommandString()));
    }
});
