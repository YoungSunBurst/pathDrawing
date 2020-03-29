export const ANCHOR_SIZE = 8;

export const SVGTEPLETE = text =>
    `<?xml version="1.0" encoding="UTF-8"?>
     <svg width="500px" height="500px" viewBox="0 0 2000 2000" version="1.1" xmlns="http://www.w3.org/2000/svg">
       <path d="${text}" id="Path" fill='none' stroke='black'></path>
     </svg>
`;
