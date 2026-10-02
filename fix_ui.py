import os

path = 'components/BazarProductDetail.vue'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(
    "const raw = props.product.descriptionHtml || props.product.description || '';",
    "const raw = props.product.description || props.product.descriptionHtml || '';"
)

# Unescape HTML entities
content = content.replace(
    "return raw.replace(/<[^>]+>/g, '').trim();",
    "return raw.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').trim();"
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed UI!")
