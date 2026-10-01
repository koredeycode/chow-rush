import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf', '**/*.ktx2'],
  server: {
    host: true,
  },
});
