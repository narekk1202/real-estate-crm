import { devtools } from '@tanstack/devtools-vite'
import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  resolve: {
    tsconfigPaths: true,
  },
})

export default config
