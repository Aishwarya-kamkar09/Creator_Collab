import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

import Campaigns from "./pages/Campaigns/Campaigns";
import CampaignDetail from "./pages/CampaignDetail/CampaignDetail";
import MyCampaigns from "./pages/MyCampaigns/MyCampaigns";
import CreateCampaign from "./pages/CreateCampaign/CreateCampaign";
import CampaignApplications from "./pages/CampaignApplications/CampaignApplications";
import MyApplications from "./pages/MyApplications/MyApplications";

import CreatorProfile from "./pages/CreatorProfile/CreatorProfile";
import BrandProfile from "./pages/BrandProfile/BrandProfile";
import CreatorsDirectory from "./pages/CreatorsDirectory/CreatorsDirectory";
import CreatorPublicProfile from "./pages/CreatorPublicProfile/CreatorPublicProfile";
import BrandsDirectory from "./pages/BrandsDirectory/BrandsDirectory";
import BrandPublicProfile from "./pages/BrandPublicProfile/BrandPublicProfile";

import MyDeals from "./pages/MyDeals/MyDeals";
import DealDetail from "./pages/DealDetail/DealDetail";

import MyCollaborations from "./pages/MyCollaborations/MyCollaborations";
import CollaborationWorkspace from "./pages/CollaborationWorkspace/CollaborationWorkspace";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Profiles */}
          <Route
            path="/profile/creator"
            element={
              <ProtectedRoute roles={["creator"]}>
                <CreatorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/brand"
            element={
              <ProtectedRoute roles={["brand"]}>
                <BrandProfile />
              </ProtectedRoute>
            }
          />

          {/* Public discovery */}
          <Route
            path="/discover/creators"
            element={
              <ProtectedRoute>
                <CreatorsDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover/creators/:username"
            element={
              <ProtectedRoute>
                <CreatorPublicProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover/brands"
            element={
              <ProtectedRoute>
                <BrandsDirectory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discover/brands/:id"
            element={
              <ProtectedRoute>
                <BrandPublicProfile />
              </ProtectedRoute>
            }
          />

          {/* Creator flow */}
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute roles={["creator"]}>
                <Campaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/:id"
            element={
              <ProtectedRoute>
                <CampaignDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={["creator"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          {/* Brand flow */}
          <Route
            path="/my-campaigns"
            element={
              <ProtectedRoute roles={["brand"]}>
                <MyCampaigns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/new"
            element={
              <ProtectedRoute roles={["brand"]}>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/:id/applications"
            element={
              <ProtectedRoute roles={["brand"]}>
                <CampaignApplications />
              </ProtectedRoute>
            }
          />

          {/* Deals (both roles) */}
          <Route
            path="/deals"
            element={
              <ProtectedRoute>
                <MyDeals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/deals/:id"
            element={
              <ProtectedRoute>
                <DealDetail />
              </ProtectedRoute>
            }
          />

          {/* Collaborations (both roles) */}
          <Route
            path="/collaborations"
            element={
              <ProtectedRoute>
                <MyCollaborations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/collaborations/:id"
            element={
              <ProtectedRoute>
                <CollaborationWorkspace />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
