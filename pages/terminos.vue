<template>
  <div class="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <h1 class="text-4xl font-serif font-bold text-[#8E5E44] mb-8">Términos de Servicio</h1>
      
      <p>Última actualización: {{ new Date().toLocaleDateString('es-MX') }}</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">1. Aceptación de los Términos</h2>
      <p>Al acceder o utilizar Taskman ("el Servicio"), aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al Servicio.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">2. Descripción del Servicio</h2>
      <p>Taskman es una herramienta de gestión personal diseñada para organizar tareas, finanzas, proyectos, hábitos y agendas. Permite la integración y sincronización opcional con servicios de terceros como el calendario, las tareas y los recordatorios de Google. Nos reservamos el derecho de modificar, suspender o discontinuar el Servicio en cualquier momento sin previo aviso.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">3. Cuentas de Usuario</h2>
      <p>Eres responsable de salvaguardar la contraseña o credenciales (incluyendo inicio de sesión mediante terceros como Google o Microsoft) que utilizas para acceder al Servicio y de cualquier actividad o acción bajo tu cuenta.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">4. Privacidad</h2>
      <p>Tu uso del Servicio también está sujeto a nuestra <NuxtLink to="/privacidad" class="text-blue-600 underline">Política de Privacidad</NuxtLink>. Por favor, revisa nuestra Política de Privacidad, que también rige el Servicio e informa a los usuarios sobre nuestras prácticas de recopilación de datos.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">5. Cambios en los Términos</h2>
      <p>Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Al continuar accediendo o utilizando nuestro Servicio después de que esas revisiones entren en vigencia, aceptas estar sujeto a los términos revisados.</p>

      <div class="mt-12 pt-8 border-t border-gray-200">
        <NuxtLink to="/login" class="text-[#8E5E44] hover:underline">&larr; Volver al inicio</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  auth: false
})

useSeoMeta({
  title: 'Términos de Servicio — Taskman',
  description: 'Términos y condiciones de uso del servicio Taskman: gestión personal de tareas, finanzas, hábitos y sincronización con Google y Microsoft.',
  robots: 'index, follow'
})
</script>
