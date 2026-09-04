const { defineConfig } = require('vite')

module.exports = defineConfig({
  // Mantém os caminhos dos arquivos relativos ao publicar em subpastas
  // ou ao abrir a versão gerada fora de um servidor local.
  base: './',
})
