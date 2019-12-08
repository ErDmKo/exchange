import * as fs from 'fs';
import glob from 'glob';
import * as rollup from 'rollup';
import path from "path";
import typescript from 'rollup-plugin-typescript2';
//@ts-ignore
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import postcss from 'rollup-plugin-postcss-modules';
import autoprefixer from 'autoprefixer';
import urlPlugin from 'postcss-url';
import nestedPlugin from 'postcss-nested';
import cssnano from 'cssnano';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
//@ts-ignore
import alias from '@rollup/plugin-alias';
import copy from 'rollup-plugin-copy';
//@ts-ignore
import html from 'rollup-plugin-html-bundle'
//@ts-ignore
import serve from 'rollup-plugin-serve';
import commandLineArgs from 'command-line-args';

const extensions = ['.js', '.ts', '.tsx'];

const commandLineOptions = commandLineArgs([
    {name: 'no-uglify', alias: 'u', type: Boolean},
    {name: 'watch', alias: 'w', type: Boolean}
]);

const pluginsFn = (env: string) => {
    return [
        commonjs({
            include: 'node_modules/**',
            namedExports: {
                'node_modules/react-is/index.js': [
                    'isContextConsumer',
                    'isValidElementType'
                ]
            }
        }),
        alias({
            entries: {
                "react": path.resolve(
                    __dirname,
                    "node_modules",
                    "preact",
                    "compat",
                    "dist",
                    "compat.module.js"
                ),
                "react-dom": path.resolve(
                    __dirname,
                    "node_modules",
                    "preact",
                    "compat",
                    "dist",
                    "compat.module.js"
                )
            }
        }),
        env === 'browser' ? html({
            inline: true
        }) : '',
        resolve({
            extensions,
            preferBuiltins: false
        }),
        copy({
            targets: [{
                src: './assets', dest: './dist'
            }]
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        env == 'browser' ? postcss({
            extract: true,  // extracts to `${basename(dest)}.css`
            plugins: [
                autoprefixer(),
                nestedPlugin(),
                cssnano({
                    preset: 'advanced'
                }),
                urlPlugin({
                    url: 'copy',
                    assetsPath: './img',
                    useHash: true
                })
            ],
            writeDefinitions: true,
            modules: Object.assign({
            }, !commandLineOptions['no-uglify'] ? {
                generateScopedName: '[hash:base64:5]'
            } : {})
        } as any) : '',
        typescript({
            clean: true,
            objectHashIgnoreUnknownHack: true,
            tsconfig: './tsconfig.rollup.json'
        }),
        !commandLineOptions['no-uglify'] ? compiler({
            language_in: 'ECMASCRIPT_2018',
            language_out: 'ECMASCRIPT5',
            process_common_js_modules: true,
            externs: './closure-compiler.js',
            strict_mode_input: false,
            compilation_level: env == 'browser' ? 'ADVANCED' : 'SIMPLE_OPTIMIZATIONS',
            isolation_mode: 'IIFE',
            rewrite_polyfills: false,
            env: 'BROWSER',
        }) : '', 
        commandLineOptions.watch && env == 'browser' ? serve({
            contentBase: 'dist'
        }) : ''
    ]
};

const rollUpInputOptions: rollup.InputOptions[] = [{
    input: './src/index.ts',
    plugins: pluginsFn('browser')
}, {
    input: './src/worker.ts',
    plugins: pluginsFn('worker')
}];

const rollUpOutputOptions: rollup.OutputOptions = {
    strict: false,
    dir: './dist',
    format: 'iife',
    freeze: false,
    name: 'exchangeApp'
};

const build = async() => {
    if (commandLineOptions.watch) {
        await new Promise(async (resolve, reject) => {
            const optList = rollUpInputOptions
                .map((opt) => {
                     (opt as any).output = rollUpOutputOptions;
                    return opt;
                })
            const watcher = rollup.watch(optList);
            watcher.on('event', (event) => {
                const { code, duration, error} = event;
                if (duration) {
                    console.log(`${code} - ${duration}`);
                }
                if (['ERROR', 'FATAL'].includes(code)) {
                    console.log(code, error);
                }
            })
            process.on('SIGINT', () => {
                watcher.close();
                resolve();
            });
        });
    } else {
        const tasks = rollUpInputOptions.map((inputOptions) => {
            return rollup.rollup(inputOptions)
                .then((bundle) => {
                    return bundle
                        .generate(rollUpOutputOptions)
                        .then(() => bundle)
                }).then((bundle) => {
                    return bundle.write(rollUpOutputOptions);
                })
        });
        await Promise.all(tasks).catch(console.error)
    }
}

if (!module.parent) {
    glob.sync('src/**/*.css').forEach((css) => {  // Use forEach because https://github.com/rollup/rollup/issues/1873
        const definition = `${css}.d.ts`
        fs.writeFileSync(definition, 'const mod: { [cls: string]: string }\nexport default mod\n')
    });
    (async () => {
        try {
            await build()
        } catch (e) {
            throw e;
        }
    })();
}