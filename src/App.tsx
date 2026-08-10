import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';

import { wagmiConfig } from './config/chain';
import { DisputeProvider } from './context/DisputeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { HomePage } from './pages/HomePage';
import { FileDisputePage } from './pages/FileDisputePage';
import { DisputeDetailPage } from './pages/DisputeDetailPage';
import { JurorDashboardPage } from './pages/JurorDashboardPage';
import { MyDisputesPage } from './pages/MyDisputesPage';
import { AdminPage } from './pages/AdminPage';

const queryClient = new QueryClient();

export function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: '#8E4585',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <DisputeProvider>
            <Router>
              <div className="min-h-screen flex flex-col bg-[#fbf9f8] text-[#1b1c1c] font-sans antialiased selection:bg-[#ffd7f4] selection:text-[#722d6c]">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/file-dispute" element={<FileDisputePage />} />
                    <Route path="/dispute/:id" element={<DisputeDetailPage />} />
                    <Route path="/jurors" element={<JurorDashboardPage />} />
                    <Route path="/my-disputes" element={<MyDisputesPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
          </DisputeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
