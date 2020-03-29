export enum State {
    init,
    pointSet,
    nextPoint,
    end,
}

export enum SVGPathCommand {
    MOVETO = 'M',
    LINETO = 'L',
    HORIZONTAL_LINETO = 'H',
    VERTICAL_LINETO = 'V',
    CURVETO = 'C',
    SMOOTH_CURVETO = 'S',
    QUADRATIC_BEZIER_CURVE = 'Q',
    SMOOTH_QUADRATIC_BEZIER_CURVETO = 'T',
    ELLIPTICAL_ARC = 'A',
    CLOSEPATH = 'Z',
}

