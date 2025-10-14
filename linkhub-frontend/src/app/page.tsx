// src/app/page.tsx

async function getBackendMessage() {
  // Mengambil URL API dari environment variable
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    // 'force-dynamic' memastikan data selalu baru diambil dari server
    const res = await fetch(`${apiUrl}/`, { cache: 'no-store' });

    if (!res.ok) {
      return "Gagal terhubung ke backend.";
    }

    const data = await res.json();
    return data.message;
  } catch (error) {
    console.error("Fetch error:", error);
    return "Gagal terhubung ke backend. Pastikan server backend berjalan.";
  }
}

export default async function HomePage() {
  const message = await getBackendMessage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Koneksi ke Backend</h1>
      <p className="mt-4 text-lg bg-gray-800 p-4 rounded-lg">{message}</p>
    </main>
  );
}