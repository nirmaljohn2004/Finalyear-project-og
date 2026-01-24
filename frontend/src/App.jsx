import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Learning from './pages/Learning';
import RoadmapPage from './pages/RoadmapPage';
import LevelSelect from './pages/LevelSelect';
import QuizPage from './pages/QuizPage';
import TopicPage from './pages/TopicPage';
import Competitive from './pages/Competitive';
import ProblemPage from './pages/ProblemPage';
import Profile from './pages/Profile';
import InterviewPage from './pages/InterviewPage';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                    <Route element={<DashboardLayout />}>
                        {/* Redirections for old routes or default dashboard entry */}
                        <Route path="/dashboard" element={<Home />} />
                        <Route path="/learning" element={<Learning />} />
                        <Route path="/learning/:language" element={<RoadmapPage />} />
                        <Route path="/learning/:language/level-select" element={<LevelSelect />} />
                        <Route path="/learning/:language/quiz" element={<QuizPage />} />
                        <Route path="/learning/:language/topic/:topicId" element={<TopicPage />} />
                        <Route path="/competitive" element={<Competitive />} />
                        <Route path="/competitive/problem/:problemId" element={<ProblemPage />} />

                        <Route path="/interview" element={<InterviewPage />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Route>

                {/* Catch all - Redirect to Landing Page instead of Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
