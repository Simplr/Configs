import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

// prettier-ignore
export default {
    input: 'src/template-component.js',
    output: {
        dir: 'dist/src',
        format: 'es',
    },
    plugins: [
        resolve(), 
        minifyHTML(), 
        copy({
            targets: [
                { src: "index.html", dest: "dist" }
            ]
        }),
        filesize(), 
        terser()
    ],
};
