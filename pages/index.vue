<template>
  <div class="relative overflow-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <!-- Decoración de fondo: Animación de "Semillas de Luz" flotantes y silueta de árbol -->
      <div class="absolute inset-0 z-0 flex justify-center items-center opacity-20 pointer-events-none">
        <div class="relative w-full max-w-3xl aspect-square">
          <!-- Silueta del árbol abstracta y minimalista -->
          <svg viewBox="0 0 100 100" class="w-full h-full text-primary/30 animate-pulse-slow">
            <path d="M50 100 C 50 80, 45 60, 50 40 C 40 30, 20 20, 25 10 C 30 15, 45 25, 50 40 C 60 30, 80 20, 75 10 C 70 15, 55 25, 50 40" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
          </svg>
          <!-- Semillas flotantes -->
          <div class="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-primary/40 shadow-[0_0_15px_rgba(224,122,95,0.8)] animate-float-slow"></div>
          <div class="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-primary/20 shadow-[0_0_20px_rgba(224,122,95,0.6)] animate-float-delayed"></div>
          <div class="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-[#F2A65A]/50 shadow-[0_0_10px_rgba(242,166,90,0.8)] animate-float"></div>
        </div>
      </div>

      <div class="container relative z-10 text-center max-w-4xl px-4 fade-in-up">
        
        <h1 class="text-5xl md:text-7xl font-serif text-foreground font-bold tracking-tight mb-4">
          El Rincón de Brandy
        </h1>
        <h2 class="text-2xl md:text-4xl font-serif italic text-foreground/80 mb-8">
          "Encuentra lo que no sabías que necesitabas."
        </h2>
        
        <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
          Un ecosistema de soluciones. Desde manufactura de alta precisión y desarrollo de productos físicos, hasta ingeniería de software y respaldo patrimonial.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/bazar" class="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(224,122,95,0.4)]">
            <span class="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#F2A65A] to-[#E07A5F] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
            <span class="relative flex items-center gap-2 font-medium">
              Explorar el Bazar
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Nuestras Ramas (Bento Grid) -->
    <section class="py-24 bg-secondary/30">
      <div class="container max-w-6xl">
        <div class="text-center mb-16">
          <h3 class="font-serif text-3xl md:text-4xl font-bold mb-4">Nuestras Ramas</h3>
          <p class="text-muted-foreground">Las extensiones de nuestro ecosistema multidisciplinario.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
          
          <!-- Manufactura y Diseño Físico (Ocupa 2 columnas en lg) -->
          <div class="group relative lg:col-span-2 overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-xl hover:-translate-y-1">
            <div class="absolute top-0 right-0 p-8 opacity-5 transition-opacity group-hover:opacity-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-2xl font-bold mb-3">Manufactura y Diseño Físico</h4>
                <p class="text-muted-foreground leading-relaxed">
                  Prototipado en resina/filamento y diseño de productos tangibles. Precisión tecnológica con alma artesanal, ideal para crear desde refacciones funcionales hasta ese accesorio robusto que te acompaña en tu ruta diaria.
                </p>
              </div>
            </div>
          </div>

          <!-- Desarrollo e Ingeniería -->
          <div class="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-xl hover:-translate-y-1">
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-12 h-12 rounded-full bg-[#F2A65A]/10 flex items-center justify-center text-[#F2A65A] mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-xl font-bold mb-2">Desarrollo e Ingeniería</h4>
                <p class="text-muted-foreground text-sm">
                  Soluciones Full-Stack y proyectos de automatización. Estructuras sólidas para ideas complejas.
                </p>
              </div>
            </div>
          </div>

          <!-- Taskman -->
          <div class="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-xl hover:-translate-y-1">
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-square"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-xl font-bold mb-2">Taskman</h4>
                <p class="text-muted-foreground text-sm">
                  Gestión inteligente de tareas sincronizada con tu Calendario, Tareas y Recordatorios de Google para un control unificado y seguro de tu tiempo.
                </p>
              </div>
            </div>
          </div>

          <!-- Electrónica -->
          <div class="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-xl hover:-translate-y-1">
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center text-foreground mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-xl font-bold mb-2">Electrónica</h4>
                <p class="text-muted-foreground text-sm">
                  Componentes y proyectos electrónicos a medida para darle vida inteligente a tu ecosistema.
                </p>
              </div>
            </div>
          </div>

          <!-- Protección (Arveck) -->
          <div class="group relative lg:col-span-2 overflow-hidden rounded-3xl bg-[#2A313C] text-white p-8 transition-all hover:shadow-xl hover:-translate-y-1">
            <div class="absolute inset-0 bg-gradient-to-br from-[#2A313C] to-[#1A1F26]"></div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-2xl font-bold mb-2">Protección (Arveck)</h4>
                <p class="text-white/70 leading-relaxed max-w-lg">
                  Seguros y respaldo patrimonial. Porque lo que construimos y lo que valoras, merece estar firmemente protegido desde la raíz.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite alternate;
}

@keyframes pulse-slow {
  0% { opacity: 0.1; transform: scale(0.98); }
  100% { opacity: 0.3; transform: scale(1.02); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float 9s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float 7s ease-in-out infinite 2s;
}

@keyframes float {
  0% { transform: translateY(0) translateX(0); }
  33% { transform: translateY(-10px) translateX(5px); }
  66% { transform: translateY(5px) translateX(-5px); }
  100% { transform: translateY(0) translateX(0); }
}
</style>

<script setup>
useSeoMeta({
  title: 'El Rincón de Brandy — Manufactura 3D, software y respaldo patrimonial',
  description: 'Ecosistema multidisciplinario: manufactura de alta precisión, ingeniería de software a medida, productos físicos en 3D y respaldo patrimonial Arveck.',
  ogTitle: 'El Rincón de Brandy — La semilla de tu idea',
  ogDescription: 'Manufactura, software, productos 3D y protección patrimonial bajo un mismo techo.',
  ogType: 'website',
  ogUrl: 'https://shongyi.com/',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'El Rincón de Brandy',
        alternateName: ['Rincón de Brandy', 'Shongyi'],
        url: 'https://shongyi.com',
        logo: 'https://shongyi.com/logo.png',
        description: 'Ecosistema multidisciplinario: manufactura de alta precisión, desarrollo de software, productos físicos en impresión 3D y respaldo patrimonial.',
        knowsAbout: [
          'Impresión 3D',
          'Manufactura de precisión',
          'Desarrollo de software',
          'Automatización industrial',
          'Ingeniería de control',
          'Seguros patrimoniales'
        ]
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'El Rincón de Brandy',
        url: 'https://shongyi.com',
        inLanguage: 'es-MX'
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Taskman',
        applicationCategory: 'ProductivityApplication',
        operatingSystem: 'Web, Android, iOS',
        url: 'https://shongyi.com/taskman',
        description: 'Gestor personal que auto-agenda tareas en Google Calendar según prioridad, con módulos de finanzas, hábitos, metas, vehículos y suscripciones.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'MXN' },
        publisher: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
      })
    }
  ]
})
</script>
