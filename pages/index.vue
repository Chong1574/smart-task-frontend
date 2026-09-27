<template>
  <div class="relative overflow-hidden selection:bg-primary/30">
    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      <!-- Decoración de fondo: Animación abstracta premium -->
      <div class="absolute inset-0 z-0 flex justify-center items-center opacity-30 pointer-events-none">
        <div class="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-primary/20 rounded-full blur-3xl mix-blend-screen animate-pulse-slow"></div>
        <div class="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-[#F2A65A]/20 rounded-full blur-3xl mix-blend-screen animate-float-slow"></div>
        <div class="relative w-full max-w-3xl aspect-square opacity-40">
          <svg viewBox="0 0 100 100" class="w-full h-full text-primary/30 animate-pulse-slow">
            <path d="M50 100 C 50 80, 45 60, 50 40 C 40 30, 20 20, 25 10 C 30 15, 45 25, 50 40 C 60 30, 80 20, 75 10 C 70 15, 55 25, 50 40" fill="none" stroke="currentColor" stroke-width="0.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>

      <div class="container relative z-10 text-center max-w-5xl px-4 fade-in-up">
        
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border/50 text-secondary-foreground mb-8 text-sm font-medium shadow-sm backdrop-blur-sm">
          <span class="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          El Rincón de Brandy
        </div>

        <h1 class="text-5xl md:text-7xl font-serif text-foreground font-bold tracking-tight mb-6 leading-[1.1]">
          Impulsamos tus ideas con <br class="hidden md:block"/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#F2A65A] to-primary bg-[length:200%_auto] animate-gradient">
            Tecnología y Manufactura
          </span>
        </h1>
        
        <p class="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 font-light">
          Un ecosistema multidisciplinario diseñado para materializar tus proyectos. Desde prototipos 3D de alta precisión y desarrollo de software a medida, hasta soluciones sólidas de respaldo patrimonial.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#contacto" class="group relative px-8 py-4 bg-primary text-primary-foreground rounded-full overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(224,122,95,0.4)] hover:-translate-y-0.5">
            <span class="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#F2A65A] to-[#E07A5F] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"></span>
            <span class="relative flex items-center gap-2 font-medium text-lg">
              Cotizar mi Proyecto
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </a>
          <NuxtLink to="/bazar" class="group px-8 py-4 bg-secondary border border-border/50 text-secondary-foreground rounded-full transition-all hover:bg-secondary/80 hover:border-border font-medium text-lg flex items-center gap-2">
            Explorar el Bazar
          </NuxtLink>
        </div>
        
        <!-- Trust Indicators -->
        <div class="mt-16 pt-8 border-t border-border/40 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-3xl font-bold text-foreground">100%</div>
            <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">A Medida</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">+50</div>
            <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Proyectos Exitosos</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">Soporte</div>
            <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Continuo e Integral</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-foreground">SEO</div>
            <div class="text-xs text-muted-foreground uppercase tracking-wider mt-1">Optimización Web</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nuestras Ramas (Bento Grid) -->
    <section class="py-24 bg-secondary/30 relative" id="servicios">
      <div class="container max-w-6xl">
        <div class="text-center mb-16">
          <h2 class="text-primary text-sm font-bold tracking-widest uppercase mb-2">Nuestros Servicios</h2>
          <h3 class="font-serif text-3xl md:text-5xl font-bold mb-4">Soluciones Integrales</h3>
          <p class="text-muted-foreground max-w-2xl mx-auto text-lg">Las extensiones de nuestro ecosistema multidisciplinario, pensadas para cubrir cada aspecto de la evolución de tu negocio o vida personal.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[280px]">
          
          <!-- Manufactura y Diseño Físico -->
          <div class="group relative lg:col-span-2 overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 cursor-default">
            <div class="absolute top-0 right-0 p-8 opacity-5 transition-opacity duration-500 group-hover:opacity-10 group-hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-2xl font-bold mb-3 group-hover:text-primary transition-colors">Manufactura 3D y Prototipado Físico</h4>
                <p class="text-muted-foreground leading-relaxed">
                  Convertimos modelos digitales en objetos tangibles con impresión en resina y filamento. Desde refacciones mecánicas funcionales hasta accesorios personalizados y piezas de exhibición con acabados premium.
                </p>
              </div>
            </div>
          </div>

          <!-- Desarrollo e Ingeniería -->
          <div class="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-2xl hover:border-[#F2A65A]/30 hover:-translate-y-1 cursor-default">
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-14 h-14 rounded-2xl bg-[#F2A65A]/10 flex items-center justify-center text-[#F2A65A] mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-xl font-bold mb-2 group-hover:text-[#F2A65A] transition-colors">Ingeniería de Software</h4>
                <p class="text-muted-foreground text-sm">
                  Desarrollo de sistemas web Full-Stack, páginas de aterrizaje optimizadas para SEO, automatización de procesos e integraciones API para digitalizar tu empresa.
                </p>
              </div>
            </div>
          </div>

          <!-- Taskman -->
          <div class="group relative lg:col-span-2 overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-2xl hover:border-primary/30 hover:-translate-y-1 cursor-default">
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <div>
                  <h4 class="font-serif text-2xl font-bold group-hover:text-primary transition-colors">Taskman: Nuestro Producto Estrella</h4>
                  <span class="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">Gestor Personal SAAS</span>
                </div>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span><strong>Productividad:</strong> Sincronización bi-direccional con Google Calendar y Tasks.</span>
                </div>
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span><strong>Finanzas:</strong> Control total de cuentas, tarjetas, préstamos y patrimonio.</span>
                </div>
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span><strong>Hábitos:</strong> Gamificación de rutinas y seguimiento diario de metas a largo plazo.</span>
                </div>
                <div class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-primary mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                  <span><strong>Gestión de Vehículos:</strong> Bitácora de mantenimiento y rendimiento de combustible.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Electrónica -->
          <div class="group relative overflow-hidden rounded-3xl bg-card border border-border/50 p-8 transition-all hover:shadow-2xl hover:border-foreground/30 hover:-translate-y-1 cursor-default">
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground mb-6 shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
              </div>
              <div>
                <h4 class="font-serif text-xl font-bold mb-2">Electrónica IoT</h4>
                <p class="text-muted-foreground text-sm">
                  Diseño de hardware inteligente, sensores y automatización de procesos (IoT) para dotar de inteligencia a cualquier entorno operativo.
                </p>
              </div>
            </div>
          </div>

          <!-- Protección (Arveck) -->
          <div class="group relative lg:col-span-3 overflow-hidden rounded-3xl bg-[#2A313C] text-white p-8 md:p-12 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col md:flex-row items-center gap-8 border border-[#3A4352]">
            <div class="absolute inset-0 bg-gradient-to-br from-[#2A313C] via-[#2A313C] to-[#1A1F26]"></div>
            <!-- Glow effect -->
            <div class="absolute -right-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>
            
            <div class="relative z-10 w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center text-white flex-shrink-0 backdrop-blur-md border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
            </div>
            
            <div class="relative z-10 text-center md:text-left flex-1">
              <div class="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                <h4 class="font-serif text-3xl font-bold">Protección Arveck</h4>
                <span class="text-xs font-semibold px-3 py-1 bg-white/10 text-white rounded-full w-fit mx-auto md:mx-0">Respaldo Patrimonial</span>
              </div>
              <p class="text-white/80 leading-relaxed max-w-3xl text-lg">
                Innovar y construir requiere una base segura. Brindamos asesoramiento experto en seguros y estrategias de respaldo patrimonial para garantizar que el fruto de tu trabajo y el bienestar de tu familia estén blindados ante cualquier eventualidad.
              </p>
            </div>
            
            <div class="relative z-10">
              <button class="px-6 py-3 bg-white text-[#2A313C] font-bold rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap">
                Asesoría Gratuita
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- SEO / Content Section: Por qué elegirnos -->
    <section class="py-24 bg-background">
      <div class="container max-w-5xl">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 class="font-serif text-3xl md:text-4xl font-bold mb-6">Transformamos ideas abstractas en realidades tangibles</h2>
            <p class="text-muted-foreground text-lg mb-6 leading-relaxed">
              En <strong>El Rincón de Brandy</strong> no somos una agencia tradicional. Operamos como un taller de innovación multidisciplinario donde la ingeniería de software y la manufactura física colisionan para crear productos robustos.
            </p>
            <ul class="space-y-4 mb-8">
              <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-primary shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <h5 class="font-bold text-foreground">Enfoque Técnico</h5>
                  <p class="text-sm text-muted-foreground">Código limpio, arquitecturas escalables (Cloudflare/Raspberry) y modelos 3D listos para producción.</p>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <svg class="w-6 h-6 text-primary shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div>
                  <h5 class="font-bold text-foreground">Visión 360°</h5>
                  <p class="text-sm text-muted-foreground">Entendemos que un proyecto no solo necesita código o plástico, necesita resolver un problema real y estar protegido legalmente.</p>
                </div>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="aspect-square rounded-3xl bg-secondary/50 border border-border flex items-center justify-center p-8 overflow-hidden relative">
              <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div class="relative z-10 grid grid-cols-2 gap-4 w-full h-full">
                <div class="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 border border-border/50">
                  <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg></div>
                  <span class="font-medium text-sm">Desarrollo Web</span>
                </div>
                <div class="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 border border-border/50 translate-y-8">
                  <div class="w-10 h-10 rounded-full bg-[#F2A65A]/10 flex items-center justify-center text-[#F2A65A]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                  <span class="font-medium text-sm">Impresión 3D</span>
                </div>
                <div class="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 border border-border/50 -translate-y-8">
                  <div class="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="m9 12 2 2 4-4"/></svg></div>
                  <span class="font-medium text-sm">Apps Móviles</span>
                </div>
                <div class="bg-card rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center gap-2 border border-border/50">
                  <div class="w-10 h-10 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-500"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg></div>
                  <span class="font-medium text-sm">Respaldo Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Final -->
    <section class="py-24 relative overflow-hidden" id="contacto">
      <div class="absolute inset-0 bg-primary/5"></div>
      <div class="container max-w-4xl text-center relative z-10">
        <h2 class="font-serif text-4xl md:text-5xl font-bold mb-6">¿Listo para comenzar?</h2>
        <p class="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Cuéntanos sobre tu idea. Ya sea una pieza de manufactura, una plataforma web o la protección de tus activos.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="mailto:contacto@shongyi.com" class="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Escríbenos un Correo
          </a>
          <!-- Si hay un número de WhatsApp, se puede poner aquí -->
          <a href="#" class="px-8 py-4 bg-card border border-border text-foreground rounded-full font-bold shadow-sm hover:bg-secondary transition-all flex items-center justify-center gap-2">
            Agendar Videollamada
          </a>
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
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite alternate;
}

@keyframes pulse-slow {
  0% { opacity: 0.1; transform: scale(0.95); }
  100% { opacity: 0.3; transform: scale(1.05); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float 9s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% auto;
  animation: textGradient 5s linear infinite;
}

@keyframes textGradient {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
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
  title: 'Desarrollo de Software y Manufactura 3D | El Rincón de Brandy',
  description: 'Agencia tecnológica y de manufactura. Impresión 3D de alta precisión, ingeniería de software a medida, aplicaciones web y respaldo patrimonial.',
  ogTitle: 'Desarrollo de Software y Manufactura 3D | El Rincón de Brandy',
  ogDescription: 'Transformamos ideas abstractas en realidades tangibles. Desarrollo Full-Stack, IoT y prototipado 3D.',
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
        '@type': 'ProfessionalService',
        name: 'El Rincón de Brandy',
        image: 'https://shongyi.com/logo.png',
        url: 'https://shongyi.com',
        description: 'Ecosistema multidisciplinario: manufactura de alta precisión, desarrollo de software, productos físicos en impresión 3D y respaldo patrimonial.',
        areaServed: 'MX',
        priceRange: '$$',
        knowsAbout: [
          'Impresión 3D',
          'Manufactura de precisión',
          'Desarrollo de software a medida',
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
    }
  ]
})
</script>
