<template>
  <div class="min-h-screen flex flex-col font-sans text-foreground bg-background">
    <!-- Header flotante minimalista -->
    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div class="container flex h-20 items-center justify-between">
        
        <!-- Izquierda: Logo y Nombre -->
        <div class="flex items-center gap-3">
          <NuxtLink to="/" class="flex items-center gap-3 group transition-opacity hover:opacity-80">
            <!-- Icono simplificado (Reemplazando image_1.png temporalmente con SVG estilo brote) -->
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#logo-gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sprout">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#E07A5F" />
                  <stop offset="100%" stop-color="#3B2C23" />
                </linearGradient>
              </defs>
              <path d="M7 20h10"/>
              <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
              <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
              <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
            </svg>
            <span class="font-serif text-2xl font-semibold tracking-tight text-foreground">El Rincón de Brandy</span>
          </NuxtLink>
        </div>

        <!-- Centro: Navegación -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener noreferrer' : undefined"
            class="text-sm font-medium tracking-wide transition-colors hover:text-primary relative group"
            active-class="text-primary font-semibold"
          >
            {{ item.name }}
            <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full" :class="{ 'w-full': $route.path === item.path && !item.external }"></span>
          </NuxtLink>
        </nav>

        <!-- Derecha: CTA -->
        <div class="flex items-center gap-4">
          <NuxtLink v-if="!authStore.isAuthenticated" to="/login" class="text-sm font-medium hover:text-primary transition-colors">
            Iniciar Sesión
          </NuxtLink>
          <div v-else class="flex items-center gap-3">
            <span class="text-sm font-medium text-muted-foreground hidden sm:block">Hola, {{ authStore.user?.name || 'Usuario' }}</span>
          </div>
          <NuxtLink 
            to="/bazar"
            class="hidden lg:inline-flex items-center justify-center rounded-full border border-primary text-primary px-6 py-2.5 text-sm font-medium transition-all hover:bg-gradient-to-tr hover:from-[#F2A65A] hover:to-[#E07A5F] hover:text-white hover:border-transparent hover:shadow-lg hover:shadow-primary/20"
          >
            Empezar un Proyecto
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer minimalista -->
    <footer class="border-t border-border/40 py-12 mt-20">
      <div class="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© 2026 El Rincón de Brandy. La semilla de tu idea.</p>
        <div class="flex gap-6">
          <NuxtLink to="/privacidad" class="hover:text-primary transition-colors">Aviso de Privacidad</NuxtLink>
          <NuxtLink to="/terminos" class="hover:text-primary transition-colors">Términos y Condiciones</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const navItems = [
  { name: 'Hogar', path: '/' },
  { name: 'El Bazar', path: '/bazar' },
  { name: 'El Estudio', path: '/estudio' },
  { name: 'Protección', path: 'https://arveck.com', external: true },
  { name: 'Task-man', path: '/taskman' },
];
</script>

<style scoped>
/* Transiciones suaves y vibes */
</style>
