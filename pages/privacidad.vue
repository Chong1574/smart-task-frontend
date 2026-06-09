<template>
  <div class="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <h1 class="text-4xl font-serif font-bold text-[#8E5E44] mb-8">Política de Privacidad</h1>
      
      <p>Última actualización: {{ new Date().toLocaleDateString('es-MX') }}</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">1. Información que recopilamos</h2>
      <p>Recopilamos tu dirección de correo electrónico y tu perfil básico público (nombre, foto de perfil) cuando inicias sesión con Google o Microsoft. Esta información se utiliza exclusivamente para crear y gestionar tu cuenta en Taskman.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">2. Uso de la información</h2>
      <p>La información recopilada se utiliza para:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Proporcionar, operar y mantener nuestra aplicación.</li>
        <li>Mejorar y personalizar tu experiencia.</li>
        <li>Comprender y analizar cómo utilizas nuestros servicios.</li>
      </ul>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">3. Compartir información</h2>
      <p>No compartimos, vendemos, alquilamos ni comercializamos tu información personal con terceros para sus fines comerciales. Tu información está segura y se usa exclusivamente para el funcionamiento interno de Taskman.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">4. Seguridad</h2>
      <p>Tomamos medidas razonables para ayudar a proteger la información sobre ti contra pérdida, robo, uso indebido y acceso no autorizado, divulgación, alteración y destrucción.</p>

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
</script>
