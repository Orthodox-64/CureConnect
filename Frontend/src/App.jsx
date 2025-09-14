import { useEffect } from "react";
import "./i18";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginSignup from "./components/User/LoginSignup";
import Profile from "./components/User/Profile.jsx";
import VideoCall from "./components/VideoCall.jsx";
import MedicalAssistant from "./components/MedicalAssistant.jsx";
import { loadUser } from './actions/userActions.js';
import { useSelector } from 'react-redux';
import { persistReduxStore } from './store.js'
import AnalysisBot from "./pages/AnalysisBot.jsx";
import SpecificAnalysis from "./pages/SpecificAnalysis.jsx";
import AnalysisBotECG from "./pages/AnalysisBotECG.jsx";
import AnalysisBotXRAY from "./pages/AnalysisBotXRAY.jsx";
import HealthTips from "./components/HealthTips.jsx"
import Chat from "./components/Chat/Chat.jsx"
import Landing from "./pages/Landing.jsx";
import MedicalVisionAI from "./pages/FinalCancer.jsx"
import AlzheimerVisionAI from "./pages/Alziemer.jsx"
import AlzheimerVideoAnalysis from "./pages/AlzheimerVideoAnalysis.jsx"
import SkinVisionAI from "./pages/SkinAnalysis.jsx"
import SkinVideoAnalysis from "./pages/SkinVideoAnalysis.jsx";
import RetinolVisionAI from "./pages/Retinopathy.jsx"
import CancerVideoAnalysis from "./pages/CancerVideoAnalysis.jsx";
import RetinopathyVideoAnalysis from './pages/RetinopathyVideoAnalysis';
import XRayVideoAnalysis from './pages/XRayVideoAnalysis';
import ECGVideoAnalysis from './pages/ECGVideoAnalysis';
import GeneralAnalysis from './pages/GeneralAnalysis.jsx';
import Appointments from './pages/Appointments.jsx';
import Prescriptions from './pages/Prescriptions.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import VideoAnalysisTest from './components/VideoAnalysisTest.jsx';

function App() {
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    persistReduxStore.dispatch(loadUser());
  }, []);

  return (
    <div className="flex items-center flex-col">
      <Navbar />
      <div className="pt-20 w-full">
        <Routes>
          <Route path='/' element={<Landing />}></Route>
          <Route path='/analysis' element={<AnalysisBot />}></Route>
          <Route path='/analysis/specific' element={<SpecificAnalysis />}></Route>
          <Route path='/analysis/ecg' element={<AnalysisBotECG />}></Route>
          <Route path='/analysis/ecg-video' element={<ECGVideoAnalysis />}></Route>
          <Route path='/analysis/xray' element={<AnalysisBotXRAY />}></Route>
          <Route path='/analysis/xray-video' element={<XRayVideoAnalysis />}></Route>
          <Route path='/analysis/cancer' element={<MedicalVisionAI />}></Route>
          <Route path='/analysis/cancer-video' element={<CancerVideoAnalysis />}></Route>
          <Route path='/analysis/alzheimer' element={<AlzheimerVisionAI />}></Route>
          <Route path='/analysis/alzheimer-video' element={<AlzheimerVideoAnalysis />}></Route>
          <Route path='/analysis/skin' element={<SkinVisionAI />}></Route>
          <Route path='/analysis/skin-video' element={<SkinVideoAnalysis />}></Route>
          <Route path='/analysis/retinopathy' element={<RetinolVisionAI />}></Route> 
          <Route path='/analysis/retinopathy-video' element={<RetinopathyVideoAnalysis />} />
          <Route path='/health' element={<HealthTips/>}></Route>
          <Route path='/chat' element={<Chat/>}></Route>
          <Route path='/analysis/general' element={<GeneralAnalysis/>}></Route>
          <Route 
            path='/telemedicine' 
            element={<VideoCall />} 
          />
          <Route exact path='/login' element={<LoginSignup />} />
          <Route exact path='/account' element={<Profile user={user} />} />
          <Route exact path='/appointments' element={<Appointments />} />
          <Route exact path='/prescriptions' element={<ErrorBoundary><Prescriptions /></ErrorBoundary>} />
          <Route exact path='/test-video' element={<VideoAnalysisTest />} />
        </Routes>
        <Footer />
        <MedicalAssistant/>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
}

export default App;