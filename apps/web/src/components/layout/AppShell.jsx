import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AppShell = ({
  children,
  showRightPanel = false,
  rightPanel = null,
  contentClassName = '',
  containerClassName = '',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* 1. Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main app area */}
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          {/* 2. Top bar */}
          <Header onMenuClick={() => setSidebarOpen(true)} />

          {/* 3. Main screen */}
          <main className={`flex-1 ${containerClassName}`}>
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
              {showRightPanel ? (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                  <div className={`min-w-0 xl:col-span-8 ${contentClassName}`}>
                    {children}
                  </div>

                  <aside className="min-w-0 xl:col-span-4">
                    <div className="space-y-6">
                      {rightPanel}

                      {/* Quiet ad / recommendation area */}
                      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-5 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Recommended
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-gray-900">
                          Need expert help?
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                          Connect with a verified CA for filing support, review,
                          and tax planning.
                        </p>
                        <button className="mt-4 w-full rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700">
                          Book Consultation
                        </button>
                      </div>
                    </div>
                  </aside>
                </div>
              ) : (
                <div className={contentClassName}>{children}</div>
              )}
            </div>
          </main>

          {/* 4. Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppShell;

