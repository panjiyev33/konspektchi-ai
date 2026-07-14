/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  return (
    <div className="flex flex-col min-h-screen w-full p-4 gap-4 bg-bg-base font-sans text-text-main">
      <header className="flex justify-between items-center bg-[#161B22] border border-border-subtle p-3 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="status-dot active-glow"></div>
            <span className="font-bold text-sm tracking-tight uppercase">S-BOT COMMAND CENTER V4.0</span>
          </div>
          <div className="h-4 w-px bg-gray-700 hidden sm:block"></div>
          <span className="code-font text-xs text-accent-cyan hidden sm:block">TELEGRAM BOT BACKEND</span>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex items-center justify-center">
        <div className="panel max-w-2xl w-full rounded-lg">
          <div className="grid-header">System Architecture & Features</div>
          
          <p className="text-text-muted mb-6 text-sm">
            Ushbu loyiha asosan Node.js Telegram Bot uchun mo'ljallangan. Barcha bot kodlari 
            <code className="bg-[#0D0E12] text-accent-cyan border border-gray-800 px-2 py-1 rounded mx-2 code-font text-xs">src/bot/</code> 
            papkasida joylashgan.
          </p>

          <div className="bg-[#0D0E12] p-4 rounded border border-border-subtle">
            <h2 className="code-font text-xs text-text-muted mb-3 uppercase">Asosiy xususiyatlar</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full active-glow"></div>
                <span>Telegraf orqali modular bot arxitekturasi</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full active-glow"></div>
                <span>Supabase Database integratsiyasi</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full active-glow"></div>
                <span>OpenRouter API orqali AI imkoniyatlari</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full active-glow"></div>
                <span>Admin panel va Hamyon tizimi</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full active-glow"></div>
                <span>Cheklarni AI orqali tekshirish</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 border-t border-border-subtle pt-4">
            <p className="text-xs text-text-muted code-font">
              &gt; Loyihani ZIP shaklida yuklab olib, VS Code da ishga tushirishingiz mumkin.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
