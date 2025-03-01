import React, { useState } from 'react';
import { FileText, Upload, Award, BarChart2, BookOpen, CheckCircle, Edit3, Eye, Save, Trash2 } from 'lucide-react';
import ResumeEditor from './components/ResumeEditor';
import ResumeAnalysis from './components/ResumeAnalysis';
import JobDescriptionAnalyzer from './components/JobDescriptionAnalyzer';
import Header from './components/Header';
import Footer from './components/Footer';
import SavedResumes from './components/SavedResumes';

// Mock AI analysis function (in a real app, this would call an API)
const analyzeResume = (resumeText: string, jobDescription: string = '') => {
  // This is a simplified mock of what an AI would return
  const score = 7.5;
  
  const strengths = [
    'Clear work experience section with detailed job responsibilities.',
    'Good use of action verbs like "managed," "developed," and "implemented."',
  ];
  
  const improvements = [
    'Missing Keywords: Add keywords like "project management," "data analysis," and "team leadership" to align with the target job description.',
    'Skills Section: Include a dedicated skills section with both technical (e.g., Python, SQL) and soft skills (e.g., communication, teamwork).',
    'Achievements: Quantify achievements (e.g., "Increased sales by 20% over 6 months" instead of "Improved sales").',
    'Formatting: Use consistent bullet points and fonts. Ensure proper spacing between sections.',
    'Tailoring: Add a "Summary" section tailored to the job description.',
  ];
  
  const suggestions = `
Summary: Results-driven marketing professional with 5+ years of experience in digital campaigns, data analysis, and team leadership. Increased ROI by 25% through targeted strategies.  
Skills: Digital Marketing, SEO, Google Analytics, Team Leadership, Data Analysis.  
Achievements:  
- Led a team of 5 to launch a successful campaign, increasing website traffic by 40%.  
- Optimized ad spend, reducing costs by 15% while maintaining performance.
  `;
  
  const keywords = jobDescription 
    ? ['project management', 'data analysis', 'team leadership', 'marketing', 'SEO', 'ROI']
    : [];
    
  return { score, strengths, improvements, suggestions, keywords };
};

function App() {
  const [activeTab, setActiveTab] = useState('editor');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [currentResumeName, setCurrentResumeName] = useState('My Resume');

  const handleAnalyzeResume = () => {
    const result = analyzeResume(resumeText, jobDescription);
    setAnalysis(result);
    setActiveTab('analysis');
  };

  const handleSaveResume = () => {
    const newSavedResume = {
      id: Date.now(),
      name: currentResumeName,
      text: resumeText,
      score: analysis?.score || 0,
      date: new Date().toISOString(),
    };
    
    setSavedResumes([...savedResumes, newSavedResume]);
  };

  const handleLoadResume = (resume) => {
    setResumeText(resume.text);
    setCurrentResumeName(resume.name);
    setActiveTab('editor');
  };

  const handleDeleteResume = (id) => {
    setSavedResumes(savedResumes.filter(resume => resume.id !== id));
  };

  const handleFeedback = (helpful) => {
    // In a real app, this would send feedback to the AI system
    setFeedbackGiven(true);
    // You could also store this feedback for improving the AI
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex border-b">
            <button 
              className={`px-6 py-3 flex items-center ${activeTab === 'editor' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('editor')}
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Resume Editor
            </button>
            <button 
              className={`px-6 py-3 flex items-center ${activeTab === 'analysis' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('analysis')}
              disabled={!analysis}
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              AI Analysis
            </button>
            <button 
              className={`px-6 py-3 flex items-center ${activeTab === 'job' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('job')}
            >
              <FileText className="w-5 h-5 mr-2" />
              Job Description
            </button>
            <button 
              className={`px-6 py-3 flex items-center ${activeTab === 'saved' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
              onClick={() => setActiveTab('saved')}
            >
              <Save className="w-5 h-5 mr-2" />
              Saved Resumes
            </button>
          </div>
          
          {/* Content Area */}
          <div className="p-6">
            {activeTab === 'editor' && (
              <ResumeEditor 
                resumeText={resumeText} 
                setResumeText={setResumeText}
                currentResumeName={currentResumeName}
                setCurrentResumeName={setCurrentResumeName}
                onAnalyze={handleAnalyzeResume}
                onSave={handleSaveResume}
              />
            )}
            
            {activeTab === 'analysis' && analysis && (
              <ResumeAnalysis 
                analysis={analysis}
                onFeedback={handleFeedback}
                feedbackGiven={feedbackGiven}
              />
            )}
            
            {activeTab === 'job' && (
              <JobDescriptionAnalyzer 
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                onAnalyze={handleAnalyzeResume}
              />
            )}
            
            {activeTab === 'saved' && (
              <SavedResumes 
                savedResumes={savedResumes}
                onLoad={handleLoadResume}
                onDelete={handleDeleteResume}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;