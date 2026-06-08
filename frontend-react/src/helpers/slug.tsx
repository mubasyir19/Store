export const createSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W\s]+/g, '-') // Mengganti spasi dan karakter non-kata dengan tanda strip (-)
    .replace(/-+/g, '-') // Mengganti tanda strip yang ganda/berurutan menjadi satu strip
    .replace(/^-+|-+$/g, ''); // Menghapus tanda strip di awal dan akhir teks
};
