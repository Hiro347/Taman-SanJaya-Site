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

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Membaca Magic Bytes (file signature biner) dari file untuk memastikan
 * bahwa file benar-benar foto asli, bukan dokumen PDF, script executable, atau file berbahaya yang di-rename.
 */
export async function checkImageMagicBytes(
  file: File
): Promise<{ isImage: boolean; error?: string }> {
  try {
    const slice = file.slice(0, 32);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length < 4) {
      return { isImage: false, error: 'File kosong atau rusak.' };
    }

    // 1. Deteksi Dokumen PDF: %PDF (0x25 0x50 0x44 0x46)
    if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
      return {
        isImage: false,
        error: `File "${file.name}" terdeteksi sebagai dokumen PDF, bukan foto/gambar. Harap pilih file gambar (JPG, PNG, atau WebP).`,
      };
    }

    // 2. Deteksi Executable / Script berbahaya: MZ (0x4D 0x5A), ELF (0x7F 0x45 0x4C 0x46)
    if (
      (bytes[0] === 0x4d && bytes[1] === 0x5a) ||
      (bytes[0] === 0x7f && bytes[1] === 0x45 && bytes[2] === 0x4c && bytes[3] === 0x46)
    ) {
      return {
        isImage: false,
        error: 'File terdeteksi sebagai program/executable yang dilarang. Upload dibatalkan demi keamanan.',
      };
    }

    // 3. Deteksi Markup / Script HTML / SVG: '<' (0x3C)
    if (bytes[0] === 0x3c) {
      return {
        isImage: false,
        error: 'File terdeteksi berisi kode script/markup HTML/SVG. Demi mencegah injeksi XSS, upload ditolak.',
      };
    }

    // 4. Deteksi JPEG: FF D8 FF
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
      return { isImage: true };
    }

    // 5. Deteksi PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    ) {
      return { isImage: true };
    }

    // 6. Deteksi WebP: RIFF (bytes 0-3) dan WEBP (bytes 8-11)
    if (
      bytes[0] === 0x52 &&
      bytes[1] === 0x49 &&
      bytes[2] === 0x46 &&
      bytes[3] === 0x46 &&
      bytes.length >= 12 &&
      bytes[8] === 0x57 &&
      bytes[9] === 0x45 &&
      bytes[10] === 0x42 &&
      bytes[11] === 0x50
    ) {
      return { isImage: true };
    }

    // 7. Deteksi AVIF / HEIC: ftyp (bytes 4-7)
    if (
      bytes.length >= 12 &&
      bytes[4] === 0x66 &&
      bytes[5] === 0x74 &&
      bytes[6] === 0x79 &&
      bytes[7] === 0x70
    ) {
      return { isImage: true };
    }

    // Bukan signature gambar yang didukung
    return {
      isImage: false,
      error: `Format biner file "${file.name}" tidak sesuai dengan konten gambar asli. Harap gunakan foto JPG, PNG, atau WebP.`,
    };
  } catch {
    return { isImage: false, error: 'Gagal memverifikasi keaslian file gambar.' };
  }
}

/**
 * Validasi ketat foto sebelum upload:
 * - Memeriksa ukuran (maksimal 5 MB)
 * - Memeriksa ekstensi (hanya jpg, jpeg, png, webp, avif)
 * - Memeriksa MIME type
 * - Memeriksa Magic Bytes biner (anti-spoofing & anti-injection)
 */
export async function validateImageFile(file: File): Promise<FileValidationResult> {
  // 1. Cek ukuran file
  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Ukuran file "${file.name}" (${sizeMb} MB) melebihi batas maksimal 5 MB. Mohon gunakan foto di bawah 5 MB.`,
    };
  }

  // 2. Cek ekstensi file secara ketat
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
    if (ext === 'pdf') {
      return {
        valid: false,
        error: `File "${file.name}" adalah dokumen PDF! Harap pilih file foto/gambar (JPG, PNG, atau WebP).`,
      };
    }
    return {
      valid: false,
      error: `Format file ".${ext || 'unknown'}" tidak didukung! Hanya format gambar (.jpg, .jpeg, .png, .webp, .avif) yang diperbolehkan.`,
    };
  }

  // 3. Cek MIME type bawaan browser
  if (file.type) {
    const mime = file.type.toLowerCase();
    if (mime === 'application/pdf') {
      return {
        valid: false,
        error: `File "${file.name}" terdeteksi sebagai dokumen PDF, bukan gambar.`,
      };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(mime)) {
      return {
        valid: false,
        error: `Tipe file "${mime}" ditolak demi keamanan. Harap unggah foto JPG, PNG, atau WebP.`,
      };
    }
  }

  // 4. Verifikasi Magic Bytes biner (mencegah file PDF/malware yang di-rename menjadi .jpg)
  const magicCheck = await checkImageMagicBytes(file);
  if (!magicCheck.isImage) {
    return {
      valid: false,
      error: magicCheck.error || `File "${file.name}" bukan gambar yang sah.`,
    };
  }

  return { valid: true };
}

/**
 * Sanitasi ekstensi file agar aman dan konsisten
 */
export function sanitizeImageExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || 'jpg';
  if (['jpg', 'jpeg'].includes(ext)) return 'jpg';
  if (ext === 'png') return 'png';
  if (ext === 'webp') return 'webp';
  if (ext === 'avif') return 'avif';
  return 'jpg';
}

/**
 * Membuat nama file acak yang aman, mencegah directory traversal (../) dan karakter berbahaya
 */
export function generateSafeFileName(prefix: string, filename: string): string {
  const safeExt = sanitizeImageExtension(filename);
  const safeToken = Math.random().toString(36).slice(2, 9);
  return `${prefix}_${Date.now()}_${safeToken}.${safeExt}`;
}


