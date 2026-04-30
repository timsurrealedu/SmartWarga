import { FileText, Database, Server, Smartphone, Cloud } from "lucide-react";

export function ArchitectureDoc() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="bg-surface p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
        <h1 className="text-3xl font-display font-bold text-text-main mb-2">SmartWarga Architecture & Guidelines</h1>
        <p className="text-text-muted">Dokumen teknis untuk membangun platform SaaS RT/RW Digital (B2B2C).</p>
      </div>

      <section className="bg-primary text-text-inverse p-8 rounded-2xl">
        <h2 className="text-2xl font-display font-semibold mb-6 text-primary flex items-center gap-2">
          <Server className="w-6 h-6" /> Rekomendasi Tech Stack
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-surface border border-border-weak p-5 rounded-xl">
            <h3 className="font-semibold text-text-muted mb-2">1. Frontend (Web & Mobile PWA)</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>• <strong>Framework:</strong> React (Vite) atau Next.js untuk SEO/SSR jika diperlukan oleh landing page publik.</li>
              <li>• <strong>Styling:</strong> Tailwind CSS untuk styling utilitas cepat & konsisten dengan tema.</li>
              <li>• <strong>State Management:</strong> Zustand (ringan & cepat).</li>
              <li>• <strong>Charts:</strong> Recharts untuk Transparansi Kas.</li>
            </ul>
          </div>

          <div className="bg-surface border border-border-weak p-5 rounded-xl">
            <h3 className="font-semibold text-text-muted mb-2">2. Backend (API Layer)</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>• <strong>Framework:</strong> Node.js dengan NestJS (Modular) atau Express (Sederhana).</li>
              <li>• <strong>API Style:</strong> RESTful API atau tRPC.</li>
              <li>• <strong>Auth:</strong> JWT & Role-Based Access Control (RBAC) middleware.</li>
            </ul>
          </div>

          <div className="bg-surface border border-border-weak p-5 rounded-xl">
            <h3 className="font-semibold text-text-muted mb-2">3. Database & Storage</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>• <strong>Primary DB:</strong> PostgreSQL (Relational) via Prisma ORM. Sangat cocok untuk relasi Keuangan & User.</li>
              <li>• <strong>Cloud Storage:</strong> AWS S3, Google Cloud Storage, atau Supabase Storage untuk Dokumen (KTP, KK).</li>
            </ul>
          </div>

          <div className="bg-surface border border-border-weak p-5 rounded-xl">
            <h3 className="font-semibold text-text-muted mb-2">4. Core Integrations</h3>
            <ul className="text-sm space-y-2 opacity-90">
              <li>• <strong>Smart OCR:</strong> Google Cloud Vision API atau Tesseract.js untuk auto-fill data KTP.</li>
              <li>• <strong>Surat & QR:</strong> <code className="bg-surface px-1 rounded">pdf-lib</code> untuk generate PDF, <code className="bg-surface px-1 rounded">qrcode</code> untuk validasi URL.</li>
              <li>• <strong>Panic Button:</strong> Socket.io (WebSocket) untuk real-time alert, terintegrasi dengan Twilio/WA API.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
        <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2 text-text-main">
          <Database className="w-6 h-6 text-accent" /> Skema Database Relasional (PostgreSQL)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b-2 border-border-strong">
                <th className="pb-3 pt-4 px-4 font-semibold text-text-main">Table Name</th>
                <th className="pb-3 pt-4 px-4 font-semibold text-text-main">Key Columns</th>
                <th className="pb-3 pt-4 px-4 font-semibold text-text-main">Relations & Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-semibold text-text-main">Users</td>
                <td className="p-4 font-mono text-xs opacity-80">id, nik, name, role (WARGA|ADMIN), phone, address</td>
                <td className="p-4 opacity-80">Menyimpan data warga & pengurus RT.</td>
              </tr>
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-semibold text-text-main">Documents</td>
                <td className="p-4 font-mono text-xs opacity-80">id, user_id, doc_type, file_url, verified_at</td>
                <td className="p-4 opacity-80">Many-to-One dengan Users. Cloud Storage referensi.</td>
              </tr>
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-semibold text-text-main">Letters (Surat)</td>
                <td className="p-4 font-mono text-xs opacity-80">id, user_id, type, status, approved_by, pdf_url, qr_hash</td>
                <td className="p-4 opacity-80">Request E-Surat. Many-to-One ke Users (Requester & Approver).</td>
              </tr>
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-semibold text-text-main">Transactions</td>
                <td className="p-4 font-mono text-xs opacity-80">id, user_id, amount, type (IURAN|PENGELUARAN), date, proof_url</td>
                <td className="p-4 opacity-80">Ledger kas RT/RW. Transparansi untuk Dashboard.</td>
              </tr>
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-semibold text-text-main">Reports (Tickets)</td>
                <td className="p-4 font-mono text-xs opacity-80">id, reporter_id, category, status, description, lat, lng</td>
                <td className="p-4 opacity-80">Log pelaporan warga (E-Reporting). Menyimpan status resolusi.</td>
              </tr>
              <tr className="hover:bg-surface-hover transition-colors">
                <td className="p-4 font-semibold text-text-main">Emergencies</td>
                <td className="p-4 font-mono text-xs opacity-80">id, user_id, timestamp, location</td>
                <td className="p-4 opacity-80">Log dari Panic Button.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-surface p-8 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] border border-border-weak">
        <h2 className="text-2xl font-display font-semibold mb-6 flex items-center gap-2 text-text-main">
          <FileText className="w-6 h-6 text-accent" /> Struktur Direktori Frontend (React/Vite)
        </h2>
        <div className="bg-primary text-text-inverse p-6 rounded-xl font-mono text-sm leading-relaxed overflow-x-auto">
<pre>{`src/
âââ components/
â   âââ layout/         # Sidebar, Header, PageContainer
â   âââ ui/             # Reusable UI (Buttons, Cards, Modals)
â   âââ dashboard/      # Custom charts, transparency widgets
âââ views/            # Main Screens (UserDashboard, AdminDashboard)
âââ lib/              # Utils, OCR parser logic, API clients
âââ hooks/            # Custom hooks (e.g., useAuth, useWebSocket)
âââ store/            # Zustand global stores (UserSession)
âââ App.tsx           # Entry point & Routing
`}</pre>
        </div>
      </section>
    </div>
  );
}
