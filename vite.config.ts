import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    /**
     * Aplicativo instalavel DESLIGADO em 18/08/2026, a pedido dela.
     *
     * O plugin continua aqui de proposito, em modo `selfDestroying`: ele gera um
     * service worker cuja unica funcao e se apagar e limpar o cache de quem ja
     * tinha o site guardado. Sem isso, o service worker antigo continuaria vivo
     * nos aparelhos, servindo uma versao velha do site para sempre — foi o que
     * escondeu tres correcoes ao longo do dia.
     *
     * `manifest: false` tira o convite de instalacao: o site deixa de ser
     * instalavel como aplicativo e deixa de funcionar offline.
     *
     * Quando ja tiver passado tempo suficiente para todo mundo ter aberto o site
     * ao menos uma vez (algumas semanas), o plugin inteiro pode sair daqui.
     */
    VitePWA({
      selfDestroying: true,
      manifest: false,
      injectRegister: 'auto',
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          charts: ['recharts'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
}));
