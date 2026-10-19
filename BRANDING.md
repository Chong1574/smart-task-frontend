# Manual de Identidad Visual y Guía de Prompts para Nano Banana
## El Rincón de Brandy · *"La semilla de tu idea"*

> **Propósito de este documento:**  
> Servir como manual oficial de marca y directriz técnica de prompting para modelos generativos de imagen, con énfasis en el ecosistema **Nano Banana** (Google Imagen 3 / Gemini Image Ecosystem). Cualquier imagen generada para **El Rincón de Brandy** (fotografía de producto del Bazar, banners del Estudio, mockups de software o composiciones editoriales) debe alinearse rigurosamente con los patrones estéticos, cromáticos y compositivos descritos a continuación.

---

## 1. Esencia y Personalidad de Marca

### 1.1 El Concepto
**El Rincón de Brandy** no es una agencia corporativa fría ni una fábrica industrial genérica. Es un **taller boutique de innovación multidisciplinaria** donde los *bits se convierten en átomos*. Representa el punto de encuentro exacto entre la ingeniería de software rigurosa, la electrónica aplicada (IoT/control) y la manufactura física de precisión (impresión 3D en resina HD y filamento FDM).

### 1.2 La Metáfora Central: "La Semilla que Germina"
* **La Semilla / Brote (Sprout):** La idea abstracta o necesidad del cliente.
* **Las Ramas (El Taller & Estudio):** Las disciplinas que la hacen crecer (Software, Control IoT, Manufactura 3D).
* **Las Raíces (Arveck):** El respaldo patrimonial y blindaje que mantiene todo protegido ante tempestades.
* **El Fruto (El Bazar):** Los objetos físicos funcionales, estéticos y terminados a mano.

### 1.3 Arquetipo y Tono
* **Arquetipo:** *El Artesano-Ingeniero / El Hacedor Cálido* (Craftsman & Innovator).
* **Voz:** Cálida, accesible, técnica pero transparente, minuciosa y orientada al detalle tangible.
* **Atmósfera General:** Nórdica-mediterránea con alma de laboratorio maker: madera clara, terracota natural, concreto pulido, luz solar filtrada y tecnología limpia sin estridencias.

---

## 2. Sistema Cromático Oficial

Al generar imágenes en Nano Banana, utiliza siempre las referencias exactas de color y los nombres evocativos de materiales correspondientes:

| Rol de Marca | Nombre Tonal | Código Hex | HSL | Equivalente en Material Real |
| :--- | :--- | :--- | :--- | :--- |
| **Primario (Acento & Firma)** | **Terracota Artesanal** | `#E07A5F` | `hsl(13, 65%, 62%)` | Arcilla cocida, cerámica mate, filamento PLA terracota, cuero natural claro |
| **Secundario (Soporte)** | **Beige Piedra / Crema Oscuro** | `#EAE3DB` | `hsl(33, 22%, 89%)` | Papel artesanal, lino natural, piedra caliza, arena suave |
| **Fondo Base (Luz)** | **Marfil Lino / Crema Suave** | `#FBF9F6` | `hsl(36, 33%, 97%)` | Superficie de yeso claro, tela de algodón orgánico, fondo de estudio cálido |
| **Texto / Contraste Base** | **Café Tostado / Espresso** | `#3B2C23` | `hsl(22, 25%, 18%)` | Madera de nogal oscuro, café tostado oscuro, metal oxidado profundo |
| **Acento Secundario (Calidez)** | **Ámbar Dorado / Albaricoque** | `#F2A65A` | `hsl(25, 70%, 70%)` | Resina translúcida ámbar, madera de pino dorada, luz de tungsteno cálida |
| **División Arveck (Protección)** | **Pizarra Carbón Oscuro** | `#1C232B` / `#2A313C` | `hsl(215, 21%, 14%)` | Grafito mate, acero pavonado, fieltro carbón premium |

### Regla Cromática 60-30-10 para Nano Banana:
* **60% Fondo / Entorno:** Tonos neutros cálidos (`#FBF9F6`, `#EAE3DB`, madera de roble claro, concreto cálido).
* **30% Estructura / Producto:** Café tostado (`#3B2C23`), grafito mate o materiales sobrios en contraste suave.
* **10% Foco de Atención:** Acentos en Terracota (`#E07A5F`) y destellos Ámbar (`#F2A65A`).

---

## 3. Tipografía de Referencia

* **Headlines & Títulos Editoriales:** *Playfair Display* (Serif elegante, editorial, refinada, con herencia tipográfica clásica).
* **Cuerpo de Texto & UI:** *Inter* (Sans-serif limpia, geométrica, neutra, ultra legible).
* **Terminales, Datos & Código:** *Monospace* (Fira Code / Roboto Mono, limpia, moderna).

> *Nota para prompts de Nano Banana:* Cuando solicites textos dentro de imágenes (pósters, empaques, logos o UI), especifica: `"Featuring clean, elegant high-contrast serif typography reminiscent of Playfair Display, paired with minimalist geometric sans-serif subtitles"`.

---

## 4. Estilo Visual y Dirección de Arte para Nano Banana

### 4.1 Iluminación (Lighting Direction)
* **Permitido / Recomendado:**
  - Luz solar suave difusa de media mañana (entre 3800K y 4500K).
  - Luz de ventana lateral suave (*soft side-window light*) que resalta el relieve de las capas de impresión 3D sin quemar los blancos.
  - Iluminación de estudio editorial con difusores grandes (*softbox lighting*).
  - Sombras suaves de contacto (*soft ambient occlusion shadows*), nunca sombras duras negras.
* **Estrictamente Prohibido:**
  - Luces estroboscópicas o de neón gamer (magenta, cian eléctrico, RGB arcoíris).
  - Flash directo de cámara con brillos duros especulares.
  - Iluminación azul fría de oficina clínica o corporativa.

### 4.2 Materiales y Texturas (Surface Shaders)
* **Piezas 3D (El Bazar / Estudio):**
  - Filamento PLA+: Acabado mate o semi-mate con microtextura sutil y limpia de capas de manufactura (*subtle tactile layer lines of precision additive manufacturing*).
  - Resina HD (Fotopolímero): Superficie lisa como cerámica o jade mate (*ultra-smooth cured photopolymer resin with satin finish*).
* **Superficies de Apoyo:**
  - Podios de concreto pigmentado en tonos crema o terracota.
  - Tableros de madera natural (roble blanco, abedul, fresno o nogal aceitado).
  - Fieltro de lana, papel kraft de alto gramaje o tela de lino crudo.
* **Hardware & Electrónica:**
  - PCBs en color negro mate o verde bosque con pistas doradas (*immaculate matte black PCB with gold immersion traces*).
  - Carcasas personalizadas impresas en 3D en tono terracota con tornillos hexagonales de acero inoxidable.

### 4.3 Composición y Encuadre
* **Fotografía de Producto (Bazar):**
  - Ángulo a 45 grados (perspectiva hero) o vista cenital pulcra (*flat-lay* editorial).
  - Profundidad de campo controlada (*shallow depth of field, f/2.8* a *f/4*), desenfoque suave tipo bokeh en el fondo.
  - Espacio negativo (*generous negative space*) en fondos crema o madera clara para permitir superposición de tipografía o banners.
* **Escenas de Taller (El Estudio):**
  - Planos medios o cerrados de mesas de trabajo ordenadas: una bobina de filamento terracota al fondo, un calibrador digital metálico, una taza de café de cerámica artesanal, un teclado minimalista.

---

## 5. Estructura de Prompt Maestra para Nano Banana

Nano Banana responde con máxima precisión cuando se construye el prompt siguiendo una jerarquía modular por capas:

```text
[Sujeto Principal y Geometría]
+ [Materiales y Acabados de Superficie]
+ [Entorno, Superficie de Apoyo y Objetos Secundarios]
+ [Iluminación, Atmósfera y Temperatura de Color]
+ [Paleta de Colores de Marca: Terracotta #E07A5F, Warm Cream #FBF9F6, Deep Espresso #3B2C23]
+ [Composición de Cámara, Lente y Estilo Editorial]
+ [Directrices de Calidad y Restricciones Estilísticas]
```

### Palabras Clave de Poder (Golden Keywords para Nano Banana)
* `Artisanal precision engineering`, `warm minimalist workshop aesthetic`, `scandinavian maker studio`, `matte terracotta tone (#E07A5F)`, `warm cream linen background (#FBF9F6)`, `soft diffused morning daylight`, `shallow depth of field`, `clean product photography`, `tactile 3D printed texture`, `elegant editorial composition`.

### Anti-Prompt / Lista de Exclusión (Negative Prompts)
Añade siempre o ten en cuenta excluir:
* `cheap shiny plastic, toy-like appearance, neon cyan, glowing cyber gamer RGB, messy clutter, chaotic background, harsh dark flash shadows, blurry details, distorted geometry, low-poly artifacts, oversaturated colors, cold clinical blue lighting`.

---

## 6. Banco de Prompts Listos para Usar en Nano Banana

### Categoría 1: Productos de "El Bazar" (Fotografía Comercial)

#### Prompt 1.1: Organizador de Escritorio Paramétrico
```text
Commercial product photography of a modern minimalist desktop organizer with geometric faceted compartments, 3D printed with high-precision terracotta matte finish (#E07A5F). Placed elegantly on a smooth warm cream limestone pedestal (#FBF9F6). Subtle tactile layer textures showcasing premium craftsmanship. Soft diffuse natural morning sunlight streaming from the left with delicate soft shadows. In the soft-focus background: a polished light oak desk and a single architectural pencil. Editorial design magazine aesthetic, shot on 85mm lens, f/2.8, pristine focus, warm balanced color grading, no harsh highlights.
```

#### Prompt 1.2: Maceta / Jarrón Escultural Geométrico
```text
Studio product shot of a contemporary sculptural plant pot with organic wave contours, crafted in warm terracotta (#E07A5F) PLA with a delicate satin finish, holding a miniature green succulent. Resting on a warm beige textured linen surface (#EAE3DB) next to a clean ceramic coaster. Soft warm ambient studio lighting (4000K), gentle gradients, balanced composition with generous negative space. High-end Scandinavian home decor catalog photography, razor-sharp details, elegant simplicity.
```

#### Prompt 1.3: Soporte Ergonómico para Smartphone / Audífonos
```text
Clean commercial product photograph of a sleek ergonomic headphone and phone stand made from custom 3D printed matte dark espresso (#3B2C23) with subtle warm amber accents (#F2A65A). Set against a minimalist warm ivory backdrop (#FBF9F6). Studio lighting with a wide softbox highlighting the clean curves and chamfered edges of the piece. Minimalist tech aesthetic, warm artisan touch, ultra-high resolution, premium product packaging visual.
```

---

### Categoría 2: "El Estudio" y el Taller de Innovación

#### Prompt 2.1: El Taller Maker en Acción (Macro Boquilla 3D)
```text
Macro cinematic close-up of a precision 3D printer nozzle extruding fine lines of warm terracotta colored filament onto a heated textured plate. Soft golden amber rim light highlighting the molten bead and the metallic nozzle. In the soft out-of-focus background: neat wooden tool racks, spools of earthy toned filaments, and clean workshop atmosphere. Warm, authentic craftsmanship meets high-tech engineering, 100mm macro photography, shallow depth of field, tactile realism.
```

#### Prompt 2.2: Mesa de Trabajo del Ingeniero Multidisciplinario
```text
Wide editorial flat-lay shot of an engineer's design desk. A custom terracotta colored 3D printed electronic casing houses a dark PCB with illuminated gentle warm LEDs. Arranged neatly around: a digital stainless steel caliper, technical blueprints with neat geometric diagrams, a warm ceramic espresso mug, and a sleek modern mechanical keyboard on a warm gray felt desk mat. Soft overhead diffuse daylight, clean and orderly composition, warm earthy color palette (#E07A5F, #3B2C23, #FBF9F6), Kinfolk magazine aesthetic.
```

---

### Categoría 3: Software, Control e IoT (Taskman & Laboratorio)

#### Prompt 3.1: Dispositivo IoT Inteligente con Carcasa a Medida
```text
Product photography of a compact IoT environmental sensor module encased in a custom two-tone enclosure: matte terracotta top (#E07A5F) and deep charcoal base (#1C232B), featuring a small crisp monochromatic OLED display showing clean telemetry numbers. Resting on an architectural maple wood block. Soft natural studio lighting, delicate reflections, high-tech warmth, modern industrial design showcase.
```

#### Prompt 3.2: Mockup de Taskman en Entorno Físico Realista
```text
A sleek minimalist tablet resting on a natural white oak desk displaying the clean web dashboard of 'Taskman' productivity software with warm terracotta accent buttons and clean dark coffee typography. Beside the tablet sits a 3D-printed faceted terracotta pen holder with drafting pens. Soft morning sunlight casting subtle geometric shadows across the desk. Warm, calm, highly productive atmosphere, professional interior lifestyle photography.
```

---

### Categoría 4: Protección Arveck (Respaldo Patrimonial)

#### Prompt 4.1: Composición Simbólica Arveck
```text
Minimalist conceptual brand visual for Arveck wealth protection. A solid geometric shield sculpted from dark matte slate (#1C232B) and brushed titanium, accented with a delicate warm terracotta emblem line (#E07A5F). Hovering subtly over a smooth dark stone surface with subtle warm rim lighting. Sophisticated, resilient, premium architectural feel, executive quiet luxury aesthetic, 8k resolution, cinematic lighting.
```

---

### Categoría 5: Identidad Gráfica, Iconografía y Banners Web

#### Prompt 5.1: Emblema Abstracto Brote / Semilla
```text
Minimalist geometric brand identity mark: an elegant stylized sprout emerging from a faceted seed crystal, vector-inspired 3D relief sculpture in terracotta clay (#E07A5F) with warm amber inner glow (#F2A65A). Set against a pure warm cream backdrop (#FBF9F6). Silhouette-first design, balanced negative space, clean lines, corporate premium identity, suitable for hero website banner.
```

#### Prompt 5.2: Textura Abstracta Paramétrica para Fondo Web
```text
Subtle abstract background of soft flowing organic parametric waves resembling layer lines of 3D printing and contour lines of fertile land. Rendered in monochromatic warm cream (#FBF9F6) and soft stone beige (#EAE3DB) with an ethereal warm terracotta gradient glow in one corner. Clean, unobtrusive, seamless, high-resolution texture for luxury brand website backdrop.
```

---

## 7. Protocolo de Chequeo Rápido para Nuevas Imágenes

Antes de aprobar o integrar una imagen generada en el sitio o redes sociales, valida estos 5 puntos:

1. **¿Domina la calidez?** La imagen debe sentirse acogedora y terrenal, nunca fría, azulada ni metálicamente estéril.
2. **¿Los tonos Terracota son fieles?** El acento debe tender al óxido/arcilla suave (`#E07A5F`), no a un rojo chillón ni a un naranja fosforescente.
3. **¿La textura es creíble?** Los objetos impresos deben tener la dignidad de la manufactura real: solidez, acabado mate o satinado impecable, sin brillos plásticos baratos.
4. **¿Hay espacio para respirar?** La composición debe tener aire y espacio negativo para mantener la sofisticación editorial.
5. **¿Refleja el lema *"La semilla de tu idea"*?** Debe evocar crecimiento, creación paciente, materialización de proyectos e ingenio humano.
