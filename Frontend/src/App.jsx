import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// ── Public pages ──────────────────────────────────────────────────────────────
import TheJurney from './pages/public/TheJurney';
import TheBatch from './pages/public/TheBatch';
import TheWall from './pages/public/TheWall';
import Album from './pages/public/Album';

// ── Auth page (semi-public) ───────────────────────────────────────────────────
import Login from './pages/mates/Login';

// ── Mates-only pages (protected) ─────────────────────────────────────────────
import AddMessage from './pages/mates/AddMessage';
import Profile from './pages/mates/Profile';
import StickersDisplay from './pages/mates/StickersDisplay';
import UploadSticker from './pages/mates/UploadSticker';
import UploadToAlbum from './pages/mates/UploadtoAlbum';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
            <Routes>
              {/* ── Public routes ── */}
              <Route path="/"         element={<TheJurney />} />
              <Route path="/batch"    element={<TheBatch />} />
              <Route path="/wall"     element={<TheWall />} />
              <Route path="/album"    element={<Album />} />

              {/* ── Auth route ── */}
              <Route path="/login"    element={<Login />} />

              {/* ── Mates-only routes (require auth) ── */}
              <Route
                path="/create-memory"
                element={
                  <ProtectedRoute>
                    <AddMessage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stickers"
                element={
                  <ProtectedRoute>
                    <StickersDisplay />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-sticker"
                element={
                  <ProtectedRoute>
                    <UploadSticker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-to-album"
                element={
                  <ProtectedRoute>
                    <UploadToAlbum />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    );
}

export default App;
