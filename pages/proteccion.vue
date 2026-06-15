<template>
  <div class="min-h-screen bg-[#1C232B] text-white py-20 selection:bg-primary/30">
    <div class="container max-w-4xl px-4">
      
      <!-- Cabecera Arveck -->
      <div class="flex flex-col items-center text-center mb-20 fade-in-up">
        <div class="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-white/80"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h1 class="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-6">
          Arveck
        </h1>
        <h2 class="text-xl md:text-2xl font-serif italic text-white/70 mb-8">
          La tranquilidad que permite que tus ideas florezcan.
        </h2>
        <div class="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </div>

      <!-- Contenido -->
      <div class="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm">
        <div class="max-w-2xl mx-auto space-y-8 text-white/80 leading-relaxed">
          <p class="text-lg">
            En <strong>El Rincón de Brandy</strong>, no solo nos dedicamos a construir y crear. Entendemos que aquello que cuesta esfuerzo, tiempo e ingenio merece ser protegido desde sus cimientos.
          </p>
          <p class="text-lg">
            <strong class="text-white font-serif text-xl">Arveck</strong> es nuestra división dedicada al respaldo patrimonial y seguros. Funciona como las raíces profundas de nuestro ecosistema: invisibles a simple vista, pero esenciales para mantener el árbol firme ante cualquier eventualidad.
          </p>
          
          <div class="grid sm:grid-cols-2 gap-6 pt-8 border-t border-white/10">
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                <h3 class="font-semibold">Planes a Medida</h3>
              </div>
              <p class="text-sm">Asesoría personalizada para asegurar tus equipos, salud y patrimonio.</p>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-center gap-3 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                <h3 class="font-semibold">Respaldo Absoluto</h3>
              </div>
              <p class="text-sm">Alianzas con las mejores aseguradoras para garantizar tu tranquilidad.</p>
            </div>
          </div>
        </div>

        <div class="mt-12 flex justify-center">
          <button class="px-8 py-3 bg-white text-[#1C232B] font-semibold rounded-full hover:bg-white/90 transition-colors shadow-lg shadow-white/5">
            Solicitar Asesoría
          </button>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Arveck — Respaldo patrimonial y seguros',
  description: 'Arveck es la división de respaldo patrimonial de El Rincón de Brandy. Seguros y protección para que tus ideas y bienes se mantengan firmes.',
  ogTitle: 'Arveck — Protección patrimonial',
  ogDescription: 'Las raíces invisibles que sostienen tu patrimonio.',
  ogType: 'website',
  ogUrl: 'https://shongyi.com/proteccion',
  twitterCard: 'summary_large_image'
})
</script>

<style scoped>
.fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
