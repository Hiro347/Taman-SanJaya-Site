/**
 * Validasi dan Sanitasi URL Marketplace Resmi untuk Taman San Jaya
 * Memastikan link yang diinputkan admin benar-benar mengarah ke platform resmi Tokopedia atau Shopee.
 */

// Domain resmi Tokopedia yang diizinkan
const ALLOWED_TOKOPEDIA_DOMAINS = [
  'tokopedia.com',
  'tokopedia.link',
  'tkp.me',
];

// Domain resmi Shopee yang diizinkan
const ALLOWED_SHOPEE_DOMAINS = [
  'shopee.co.id',
  'shp.ee',
  'shopee.com',
];

/**
 * Memvalidasi apakah string merupakan URL Tokopedia yang sah.
 * Mengembalikan true jika kosong (karena link bersifat opsional) atau jika domain valid.
 */
export function isValidTokopediaUrl(urlStr: string | null | undefined): boolean {
  if (!urlStr || urlStr.trim() === '') {
    return true; // Opsional
  }

  try {
    let normalized = urlStr.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }

    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();

    return ALLOWED_TOKOPEDIA_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Memvalidasi apakah string merupakan URL Shopee yang sah.
 * Mengembalikan true jika kosong (karena link bersifat opsional) atau jika domain valid.
 */
export function isValidShopeeUrl(urlStr: string | null | undefined): boolean {
  if (!urlStr || urlStr.trim() === '') {
    return true; // Opsional
  }

  try {
    let normalized = urlStr.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }

    const parsed = new URL(normalized);
    const hostname = parsed.hostname.toLowerCase();

    return ALLOWED_SHOPEE_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Melakukan normalisasi format URL (memastikan awalan https:// dan menghapus spasi liar).
 * Mengembalikan null jika input kosong.
 */
export function normalizeMarketplaceUrl(urlStr: string | null | undefined): string | null {
  if (!urlStr || urlStr.trim() === '') {
    return null;
  }

  let normalized = urlStr.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  return normalized;
}

/**
 * Konstanta dan Validasi Ukuran Foto Upload (Maksimal 5 MB & Maksimal 5 Foto Galeri)
 */
export const MAX_IMAGE_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGE_FILE_SIZE_MB = 5;
export const MAX_GALLERY_IMAGES = 5; // Maksimal 5 foto galeri tambahan

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Memvalidasi ukuran dan tipe file foto sebelum diunggah ke Supabase Storage.
 */
export function validateImageFile(file: File): FileValidationResult {
  // Cek ekstensi file jika type browser kosong
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'avif'];
  const hasValidExt = ext ? allowedExtensions.includes(ext) : false;

  if (file.type && !ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) && !hasValidExt) {
    return {
      valid: false,
      error: `Format file "${file.name}" tidak didukung. Harap gunakan format JPG, PNG, atau WebP.`,
    };
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ukuran foto "${file.name}" (${sizeMb} MB) melebihi batas maksimal 5 MB. Mohon gunakan foto di bawah 5 MB agar loading website tetap cepat.`,
    };
  }

  return { valid: true };
}
