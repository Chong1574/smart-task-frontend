import { ref } from 'vue';
import api from '~/utils/api';

export function useR2Upload() {
    const progress = ref(0);
    const error = ref<string | null>(null);

    async function upload(file: File, kind: 'image' | 'file'): Promise<{ key: string; token: string }> {
        error.value = null;
        progress.value = 0;

        const { data } = await api.post('/products/upload-url', {
            kind,
            contentType: file.type || (kind === 'file' ? 'application/octet-stream' : 'image/jpeg'),
            size: file.size,
        });

        const { uploadUrl, key, uploadToken } = data as {
            uploadUrl: string; key: string; uploadToken: string;
        };

        // XHR nos da progreso; fetch() no.
        await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', uploadUrl);
            xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100);
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error(`R2 upload falló: ${xhr.status}`));
            };
            xhr.onerror = () => reject(new Error('Error de red al subir a R2'));
            xhr.send(file);
        }).catch((e: Error) => {
            error.value = e.message;
            throw e;
        });

        return { key, token: uploadToken };
    }

    return { upload, progress, error };
}
