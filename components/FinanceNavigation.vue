<template>
  <div class="bg-secondary/40 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto border border-border/30 w-full sm:w-fit shadow-sm">
    <NuxtLink 
      to="/taskman/wallet" 
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
      :class="route.path === '/taskman/wallet' ? 'bg-background text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'"
    >
      <Wallet class="w-4 h-4 shrink-0 text-primary" />
      <span>Billetera</span>
    </NuxtLink>
    <NuxtLink 
      to="/taskman/budget" 
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
      :class="route.path === '/taskman/budget' ? 'bg-background text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'"
    >
      <TrendingUp class="w-4 h-4 shrink-0 text-emerald-500" />
      <span>Presupuesto & Proyecciones</span>
    </NuxtLink>
    <NuxtLink 
      to="/taskman/garage" 
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
      :class="route.path === '/taskman/garage' ? 'bg-background text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'"
    >
      <Car class="w-4 h-4 shrink-0 text-amber-500" />
      <span>Garage & Gasolina</span>
    </NuxtLink>
    <NuxtLink 
      to="/taskman/wishlist" 
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
      :class="route.path === '/taskman/wishlist' ? 'bg-background text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'"
    >
      <Sparkles class="w-4 h-4 shrink-0 text-amber-500" />
      <span>Wishlist</span>
    </NuxtLink>
    <NuxtLink 
      to="/taskman/dashboard" 
      class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
      :class="route.path === '/taskman/dashboard' ? 'bg-background text-foreground shadow-sm font-semibold' : 'text-muted-foreground hover:text-foreground hover:bg-background/40'"
    >
      <Activity class="w-4 h-4 shrink-0 text-blue-500" />
      <span>Dashboard & Salud</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Wallet, TrendingUp, Sparkles, Activity, Car } from 'lucide-vue-next'

const route = useRoute()
</script>
