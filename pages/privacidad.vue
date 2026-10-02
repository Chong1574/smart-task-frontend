<template>
  <div class="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans p-8">
    <div class="max-w-3xl mx-auto space-y-6">
      <h1 class="text-4xl font-serif font-bold text-[#8E5E44] mb-8">Política de Privacidad</h1>
      
      <p>Última actualización: {{ new Date().toLocaleDateString('es-MX') }}</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">1. Información que recopilamos</h2>
      <p>Recopilamos tu dirección de correo electrónico y tu perfil básico público (nombre, foto de perfil) cuando inicias sesión con Google o Microsoft. Esta información se utiliza exclusivamente para crear y gestionar tu cuenta en Taskman.</p>
      <p>Adicionalmente, con tu consentimiento explícito, nuestra aplicación puede acceder a tu información de <strong>calendario, tareas y recordatorios</strong> de Google. Este acceso es necesario únicamente para integrar y sincronizar tus eventos, pendientes y alertas directamente dentro de Taskman.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">2. Uso de la información</h2>
      <p>La información recopilada se utiliza para:</p>
      <ul class="list-disc pl-6 space-y-2">
        <li>Proporcionar, operar y mantener nuestra aplicación.</li>
        <li>Sincronizar y gestionar tus calendarios, tareas y recordatorios en tiempo real.</li>
        <li>Mejorar y personalizar tu experiencia.</li>
        <li>Comprender y analizar cómo utilizas nuestros servicios.</li>
      </ul>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">3. Procesamiento de Pagos y Compras</h2>
      <p>Cuando realizas una compra en nuestra tienda, recopilamos tu nombre, dirección y datos de contacto estrictamente para coordinar el envío de tus productos. <strong>No almacenamos, procesamos ni retenemos directamente la información confidencial de tus tarjetas de crédito o métodos de pago en nuestros servidores.</strong> Todo el procesamiento de pagos se realiza a través de pasarelas de terceros certificadas bajo estrictos estándares de ciberseguridad (como PCI-DSS).</p>
      <p>Tus datos de pago se utilizan única y exclusivamente para generar el cobro y validar la transacción. Nunca utilizaremos estos datos sensibles para fines de marketing ni los compartiremos con terceros ajenos al proceso de pago.</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">4. Compartir información</h2>
      <p>No compartimos, vendemos, alquilamos ni comercializamos tu información personal con terceros para sus fines comerciales. Tu información está segura y se usa exclusivamente para el funcionamiento interno de Taskman y la logística de tus envíos.</p>
      <p>El uso y transferencia por parte de Taskman a cualquier otra aplicación de la información recibida de las APIs de Google se adherirá a la <strong>Google API Services User Data Policy</strong>, incluyendo los requisitos de uso limitado (Limited Use Requirements).</p>

      <h2 class="text-2xl font-serif font-bold text-[#8E5E44] mt-8">5. Ciberseguridad y Protección de Datos</h2>
      <p>Nos tomamos tu seguridad muy en serio. Implementamos encriptación de extremo a extremo en todas las transmisiones de datos, políticas estrictas de control de acceso, y medidas de ciberseguridad para proteger tu información contra pérdida, robo, uso indebido y acceso no autorizado, divulgación, alteración y destrucción.</p>

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
  title: 'Política de Privacidad — Taskman',
  description: 'Política de privacidad de Taskman: cómo se recopila, usa y protege tu información, incluyendo el acceso a las APIs de Google Calendar y Tasks.',
  robots: 'index, follow'
})
</script>
