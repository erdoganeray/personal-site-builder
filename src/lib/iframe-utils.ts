/**
 * Iframe preview için relative asset path'lerini absolute URL'lere çevirir
 * Blob URL context'inde relative path'ler çalışmadığı için bu gerekli
 */

/**
 * HTML içindeki relative asset path'lerini absolute URL'lere çevirir
 * /_assets/profile/photo.jpg -> http://localhost:3000/api/assets/profile/photo.jpg
 * 
 * Not: Localhost için /_assets/ path'leri /api/assets/ olarak değiştirilir
 * çünkü Next.js API route /api/assets/[...path] olarak tanımlı
 */
export function convertRelativeAssetsToAbsolute(html: string): string {
    if (typeof window === 'undefined') {
        // Server-side rendering durumunda HTML'i olduğu gibi döndür
        return html;
    }

    const origin = window.location.origin;
    let result = html;

    // Localhost için: /_assets/ -> /api/assets/
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        result = result.replace(/\/_assets\//g, '/api/assets/');
    }

    // Tüm /api/assets/ path'lerini absolute URL'lere çevir
    result = result.replace(
        /src=["']\/api\/assets\//g,
        `src="${origin}/api/assets/`
    );

    return result;
}
