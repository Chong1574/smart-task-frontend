<template>
  <div class="relative overflow-hidden">
    <!-- Decoración de fondo -->
    <div class="absolute inset-0 z-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

    <div class="container max-w-6xl px-4 py-12 md:py-20 relative z-10">
      
      <!-- Cabecera -->
      <div class="text-center max-w-3xl mx-auto mb-20 md:mb-24">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 text-secondary-foreground mb-6 text-sm font-medium">
          Nuestra Experiencia
        </div>
        <h1 class="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 text-foreground">
          El Estudio
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed">
          Donde las ideas complejas toman forma. Nuestro portafolio de ingeniería de software, sistemas de control avanzado, automatización con Python y diseño de productos.
        </p>
      </div>

      <!-- Proyectos Destacados (NUEVO) -->
      <section class="mb-32">
        <h2 class="text-sm font-bold tracking-widest text-primary uppercase mb-12 text-center">Casos de Éxito y Proyectos</h2>
        
        <div class="space-y-16 md:space-y-24">
          <!-- Taskman Showcase -->
          <div class="flex flex-col lg:flex-row items-center gap-8 md:gap-12 bg-secondary/20 p-6 md:p-12 rounded-[2rem] border border-border/50 transition-all hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5">
            <div class="lg:w-1/2 space-y-6">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>
                Producto Insignia
              </div>
              <h3 class="text-3xl md:text-4xl font-serif font-bold text-foreground">Taskman: Sistema de Gestión Personal</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Un SAAS integral desarrollado desde cero. Sincroniza bidireccionalmente con Google Calendar y Tasks. Incluye módulos avanzados para control de finanzas, seguimiento de hábitos gamificados y bitácora de vehículos.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Vue / Nuxt</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">TypeScript</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Node.js</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Google APIs</span>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Contenedor de Video -->
              <div class="relative w-full aspect-[16/10] bg-black rounded-2xl overflow-hidden border border-border/50 shadow-2xl group">
                <!-- Reemplazar src con la ruta real del video en la carpeta public/ (ej. /videos/taskman-demo.mp4) -->
                <!-- Por ahora usamos un video placeholder elegante de código -->
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
              <p class="text-xs text-center text-muted-foreground mt-4 italic">* Placeholder: Pon aquí el video de demostración real de Taskman.</p>
            </div>
          </div>

          <!-- Automatización e Ingeniería -->
          <div class="flex flex-col lg:flex-row-reverse items-center gap-8 md:gap-12 p-2 md:p-12">
            <div class="lg:w-1/2 space-y-6">
              <h3 class="text-3xl font-serif font-bold text-foreground">Sistemas de Control y Automatización</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Diseño de scripts avanzados en Python y sistemas de bajo nivel en C/C++ para la automatización de procesos operativos. Integramos hardware IoT (microcontroladores y sensores) con dashboards web en tiempo real para telemetría industrial y control domótico.
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
            
<span class="text-[#8b949e]"># Log output</span>
<span class="text-[#7ee787] animate-pulse">>> System running... OK [200]</span></div>
              </div>
            </div>
          </div>

          <!-- Manufactura -->
          <div class="flex flex-col lg:flex-row items-center gap-8 md:gap-12 bg-secondary/20 p-6 md:p-12 rounded-[2rem] border border-border/50 transition-all hover:border-border hover:shadow-xl">
            <div class="lg:w-1/2 space-y-6">
              <h3 class="text-3xl font-serif font-bold text-foreground">Manufactura 3D y Piezas de Precisión</h3>
              <p class="text-lg text-muted-foreground leading-relaxed">
                Del plano digital al objeto físico. Creación de modelos CAD paramétricos para prototipado rápido, diseño de piezas mecánicas de reemplazo y producción de bajo volumen utilizando impresoras de resina y filamento de alta resolución.
              </p>
              <div class="flex flex-wrap gap-2 pt-2">
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">CAD Paramétrico</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">Resina HD</span>
                <span class="px-3 py-1 bg-background border border-border rounded-md text-xs font-medium">PLA / ABS / TPU</span>
              </div>
            </div>
            
            <div class="lg:w-1/2 w-full">
              <!-- Placeholder de 3D / Render -->
              <div class="relative w-full aspect-video bg-gradient-to-tr from-[#2A313C] to-[#1A1F26] rounded-2xl overflow-hidden border border-border/50 shadow-xl flex flex-col items-center justify-center text-white/50 group">
                <!-- Icono de cubo isométrico abstracto -->
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round" class="group-hover:scale-110 transition-transform duration-700 opacity-30"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <p class="absolute bottom-4 right-4 text-xs font-medium uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">[ Espacio para Fotos Reales 3D ]</p>
              </div>
              <p class="text-xs text-center text-muted-foreground mt-4 italic">* Placeholder: Sube fotos de tus impresiones 3D o modelos CAD.</p>
            </div>
          </div>
          
        </div>
      </section>

      <!-- CTA -->
      <div class="text-center pb-12">
        <h3 class="text-3xl font-serif font-bold mb-6">¿Tienes un reto técnico o una idea en mente?</h3>
        <p class="text-muted-foreground mb-8 max-w-lg mx-auto">Ya sea desarrollo web, integración IoT o prototipado físico, estamos listos para colaborar.</p>
        <NuxtLink to="/bazar" class="inline-flex px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
          Iniciar Conversación
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'El Estudio — Portafolio de Software, Control Automático y 3D',
  description: 'Proyectos destacados: aplicación Taskman, sistemas IoT con Python/C++, y manufactura paramétrica. Revisa nuestro portafolio técnico.',
  ogTitle: 'El Estudio — Portafolio de Software, Control Automático y 3D',
  ogDescription: 'Explora nuestros proyectos reales: desarrollo de SaaS, domótica e IoT, y diseño 3D.',
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
      name: 'El Estudio — Portafolio',
      url: 'https://shongyi.com/estudio',
      description: 'Portafolio de proyectos de desarrollo de software, automatización industrial, control e ingeniería.',
      areaServed: 'MX',
      serviceType: [
        'Desarrollo web',
        'Aplicaciones SaaS',
        'Automatización con Python',
        'Sistemas IoT y C++',
        'Ingeniería de control',
        'Diseño paramétrico CAD 3D'
      ],
      parentOrganization: { '@type': 'Organization', name: 'El Rincón de Brandy', url: 'https://shongyi.com' }
    })
  }]
})
</script>
