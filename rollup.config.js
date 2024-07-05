import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'es',
    name: 'react-delta-hooks',
    sourcemap: true,
  },
  external: ['react', 'react-dom', 'lodash-es'],
  plugins: [typescript({ tsconfig: 'tsconfig.json' })],
});
