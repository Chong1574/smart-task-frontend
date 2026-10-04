<template>
  <div class="relative overflow-hidden">
    <!-- Decoración de fondo -->
    <div class="absolute inset-0 z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

    <div class="container max-w-6xl px-4 py-12 md:py-20 relative z-10">
      
      <!-- Cabecera -->
      <div class="text-center max-w-3xl mx-auto mb-20 md:mb-24">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 text-secondary-foreground mb-6 text-sm font-medium">
          La Ventanilla al Taller
        </div>
        <h1 class="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-foreground">
          El Estudio
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed">
          Bienvenido a nuestro centro de operaciones. Da un recorrido por nuestras estaciones de trabajo y descubre cómo convergen el código, la electrónica y la manufactura física.
        </p>
      </div>

      <!-- Recorrido por el Taller -->
      <section class="mb-32">
        <h2 class="text-sm font-bold tracking-widest text-primary uppercase mb-12 text-center">Nuestras Áreas de Ingeniería</h2>
        
        <div class="space-y-16 md:space-y-24">
          <!-- Estación 1: Software -->
          <div class="flex flex-col lg:flex-row items-center gap-8 md:gap-12 bg-secondary/20 p-6 md:p-12 rounded-[2rem] border border-border/50 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>
                Estación 01
              </div>
              <h3 class="text-3xl md:text-4xl font-serif font-bold text-foreground">La Incubadora de Software</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Aquí construimos plataformas digitales robustas. Como muestra está <strong class="text-foreground">Taskman</strong>, nuestro propio SAAS desarrollado <i>in-house</i> que sincroniza calendarios, finanzas y hábitos gamificados en un ecosistema web ultra rápido.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Vue / Nuxt</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">TypeScript</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Node.js</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Arquitectura Web</span>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Contenedor de Video -->
              <div class="relative w-full aspect-[16/10] bg-black rounded-2xl overflow-hidden border border-border/50 shadow-2xl group">
                <video class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" autoplay loop muted playsinline>
                  <source src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-in-a-dark-room-43403-large.mp4" type="video/mp4" />
                  Tu navegador no soporta el video.
                </video>
                <div class="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"></div>
                <!-- Play overlay icon -->
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/20">
                   <div class="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-white backdrop-blur-md shadow-lg shadow-primary/30">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
                   </div>
                </div>
              </div>
              <p class="text-xs text-center text-muted-foreground mt-4 italic">Demostración en video de Taskman (En desarrollo).</p>
            </div>
          </div>

          <!-- Estación 2: Control -->
          <div class="flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-12 p-2 md:p-12">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 text-foreground text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
                Estación 02
              </div>
              <h3 class="text-3xl font-serif font-bold text-foreground">El Laboratorio de Control</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                El puente entre el software y el mundo físico. En esta estación escribimos el código profundo que automatiza procesos, lee telemetría de sensores IoT y controla hardware industrial o domótico en tiempo real.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">Python</span>
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">C / C++</span>
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">IoT / Microcontroladores</span>
                <span class="px-3 py-1 bg-secondary/50 border border-border rounded-md text-xs font-medium">Telemetría</span>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Placeholder de código o terminal estilo IDE -->
              <div class="relative w-full aspect-video bg-[#0d1117] rounded-2xl overflow-hidden border border-[#30363d] shadow-xl font-mono text-sm p-5 text-[#c9d1d9] flex flex-col">
                <div class="flex gap-2 mb-4 border-b border-[#30363d] pb-3">
                  <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div class="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div class="flex-1 overflow-hidden select-none whitespace-pre font-light tracking-wide text-xs md:text-sm">
<span class="text-[#ff7b72]">import</span> automation_engine <span class="text-[#ff7b72]">as</span> ae
<span class="text-[#ff7b72]">from</span> sensors <span class="text-[#ff7b72]">import</span> Telemetry

<span class="text-[#ff7b72]">def</span> <span class="text-[#d2a8ff]">monitor_system</span>():
    engine = ae.Controller(port=<span class="text-[#79c0ff]">8080</span>)
    engine.start()
    
    <span class="text-[#ff7b72]">while</span> <span class="text-[#79c0ff]">True</span>:
        data = Telemetry.read()
        <span class="text-[#ff7b72]">if</span> data.threshold_exceeded():
            engine.trigger_alert()
            engine.auto_correct_valves()
            
<span class="text-[#8b949e]"># Terminal Output</span>
<span class="text-[#7ee787] animate-pulse">>> Conectando a sensores... OK [200]</span></div>
              </div>
            </div>
          </div>

          <!-- Estación 3: Manufactura -->
          <div class="flex flex-col lg:flex-row items-center gap-8 md:gap-12 bg-secondary/20 p-6 md:p-12 rounded-[2rem] border border-border/50 transition-all hover:border-border hover:shadow-xl">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/10 text-foreground text-sm font-bold border border-border">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                Estación 03
              </div>
              <h3 class="text-3xl font-serif font-bold text-foreground">El Taller de Manufactura</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Nuestra área de maquinaria. Aquí es donde los bits se convierten en átomos. Operamos software de diseño paramétrico e impresoras de alta resolución para materializar prototipos funcionales y piezas mecánicas finales.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">CAD Paramétrico</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Resina HD</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Impresión FDM (PLA/ABS)</span>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Placeholder de 3D / Render -->
              <div class="relative w-full aspect-video bg-gradient-to-tr from-[#2A313C] to-[#1A1F26] rounded-2xl overflow-hidden border border-border/50 shadow-xl flex flex-col items-center justify-center text-white/50 group">
                <!-- Icono de cubo isométrico abstracto -->
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-700 opacity-30"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <p class="absolute bottom-4 right-4 text-xs font-medium uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">[ Espacio para Fotos Reales del Taller ]</p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      <!-- CTA -->
      <div class="text-center pb-12">
        <h3 class="text-3xl font-serif font-bold mb-6">¿Quieres construir algo en nuestro estudio?</h3>
        <p class="text-muted-foreground mb-8 max-w-lg mx-auto">Ya sea desarrollo de software, integración IoT o prototipado físico, nuestras estaciones están listas.</p>
        <NuxtLink to="/#contacto" class="inline-flex px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Cotizar un Proyecto
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'El Estudio — Taller de Software, Automatización y Manufactura 3D',
  description: 'Da un recorrido por nuestras estaciones de trabajo: incubadora de software (Taskman), laboratorio de control con Python/C++, y taller de manufactura 3D.',
  ogTitle: 'El Estudio — Taller de Innovación Tecnológica',
  ogDescription: 'Conoce nuestras áreas de ingeniería: desarrollo de SaaS, domótica e IoT, y diseño paramétrico 3D.',
  ogType: 'website',
  ogUrl: 'https://shongyi.com/estudio',
  twitterCard: 'summary_large_image'
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'El Estudio — El Rincón de Brandy',
      url: 'https://shongyi.com/estudio',
      description: 'Taller de innovación y desarrollo de software, automatización industrial, control e ingeniería 3D.',
      areaServed: 'MX',
      serviceType: [
        'Desarrollo web',
        'Aplicaciones SaaS',
        'Automatización con Python',
        'Sistemas IoT y C++',
        'Ingeniería de control',
        'Manufactura 3D'
      ],
      parentOrganization: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
    })
  }]
})
</script>
