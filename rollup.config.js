import resolve from '@rollup/plugin-node-resolve';

export default [
    {
        input: 'src/esm.js',
        output: {
            file: 'dist/bootstrap-form-builder.esm.js',
            format: 'es',
            sourcemap: true
        },
        plugins: [
            resolve()
        ]
    },
    {
        input: 'src/umd.js',
        output: {
            file: 'dist/bootstrap-form-builder.umd.js',
            format: 'umd',
            name: 'formBuilder',
            exports: 'default',
            sourcemap: true
        },
        plugins: [
            resolve()
        ]
    }
];
