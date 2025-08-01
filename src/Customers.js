import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMsal } from '@azure/msal-react';
import { 
  FaFile, 
  FaTag, 
  FaChevronRight, 
  FaFolderOpen, 
  FaChartLine, 
  FaTasks, 
  FaCalendar, 
  FaUser, 
  FaFileAlt,
  FaRobot,
  FaBrain,
  FaSearch,
  FaCloudUploadAlt,
  FaDownload,
  FaEye,
  FaCog,
  FaStar,
  FaLightbulb,
  FaNetworkWired
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DocumentDetails from './DocumentDetails';
import './Customers.css';

// Enhanced static research documents data
const staticDocumentsData = [
  {
    "id": 1,
    "name": "Transformer Architecture Evolution in NLP",
    "fileName": "transformer_nlp_evolution_2024.pdf",
    "size": "4.2 MB",
    "uploadDate": "2024-01-15",
    "category": "Research Papers", 
    "status": "processed",
    "author": "Dr. Sarah Chen et al.",
    "summary": "Comprehensive analysis of transformer architectures and their evolutionary impact on natural language processing tasks.",
    "tags": ["machine learning", "NLP", "transformers", "deep learning"],
    "confidenceScore": 95,
    "keyInsights": 12,
    "citationCount": 45
  },
  {
    "id": 2,
    "name": "Quantum Computing Applications in Finance",
    "fileName": "quantum_finance_applications.docx",
    "size": "2.8 MB",
    "uploadDate": "2024-01-12",
    "category": "Financial Reports",
    "status": "processed", 
    "author": "Quantum Finance Research Lab",
    "summary": "Exploration of quantum computing applications in financial modeling and risk assessment.",
    "tags": ["quantum computing", "finance", "modeling", "risk assessment"],
    "confidenceScore": 88,
    "keyInsights": 8,
    "citationCount": 23
  },
  {
    "id": 3,
    "name": "AI Ethics Framework for Healthcare",
    "fileName": "ai_ethics_healthcare_2024.pdf",
    "size": "3.1 MB",
    "uploadDate": "2024-01-10",
    "category": "Whitepapers",
    "status": "processing",
    "author": "Healthcare AI Ethics Consortium",
    "summary": "Comprehensive framework for implementing ethical AI practices in healthcare systems.",
    "tags": ["AI ethics", "healthcare", "framework", "governance"],
    "confidenceScore": 92,
    "keyInsights": 15,
    "citationCount": 67
  },
  {
    "id": 4,
    "name": "Climate Change Impact Modeling",
    "fileName": "climate_modeling_research.pdf",
    "size": "5.7 MB",
    "uploadDate": "2024-01-08",
    "category": "Environmental Studies",
    "status": "processed",
    "author": "Climate Research Institute",
    "summary": "Advanced modeling techniques for predicting climate change impacts on global ecosystems.",
    "tags": ["climate change", "modeling", "environment", "prediction"],
    "confidenceScore": 91,
    "keyInsights": 18,
    "citationCount": 89
  },
  {
    "id": 5,
    "name": "Cybersecurity in IoT Networks",
    "fileName": "iot_cybersecurity_analysis.docx",
    "size": "2.3 MB",
    "uploadDate": "2024-01-05",
    "category": "Technology Reports",
    "status": "processed",
    "author": "IoT Security Research Team",
    "summary": "Comprehensive analysis of cybersecurity challenges and solutions in IoT network infrastructures.",
    "tags": ["cybersecurity", "IoT", "networks", "security"],
    "confidenceScore": 87,
    "keyInsights": 11,
    "citationCount": 34
  },
  {
    "id": 6,
    "name": "Sustainable Energy Storage Solutions",
    "fileName": "sustainable_energy_storage.pdf",
    "size": "4.8 MB",
    "uploadDate": "2024-01-03",
    "category": "Energy Research",
    "status": "analyzed",
    "author": "Green Energy Solutions Lab",
    "summary": "Research on innovative sustainable energy storage technologies for renewable energy systems.",
    "tags": ["sustainable energy", "storage", "renewable", "innovation"],
    "confidenceScore": 94,
    "keyInsights": 20,
    "citationCount": 56
  }
];

// Enhanced analytics data for dashboard
const getAnalyticsData = () => {
  const processedDocuments = staticDocumentsData.filter(doc => doc.status === 'processed').length;
  const totalInsights = staticDocumentsData.reduce((sum, doc) => sum + (doc.keyInsights || 0), 0);
  const avgConfidence = Math.round(
    staticDocumentsData.reduce((sum, doc) => sum + (doc.confidenceScore || 0), 0) / staticDocumentsData.length
  );
  
  return {
    totalDocuments: staticDocumentsData.length,
    processedDocuments,
    processedRate: Math.round((processedDocuments / staticDocumentsData.length) * 100),
    averageProcessingTime: 2.3,
    monthlyUploads: 12,
    totalInsights,
    avgConfidenceScore: avgConfidence,
    totalCitations: staticDocumentsData.reduce((sum, doc) => sum + (doc.citationCount || 0), 0),
    categories: [...new Set(staticDocumentsData.map(doc => doc.category))].length
  };
};

const Documents = () => {
  const { accounts } = useMsal();
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const analyticsData = getAnalyticsData();
  
  // Get user information dynamically from MSAL
  const getUserInfo = () => {
    const bypassMode = sessionStorage.getItem('bypass_auth') === 'true';
    if (bypassMode) {
      return {
        name: 'Deepak Singh',
        email: 'deepak.singh@nitor.infortech.com',
        initials: 'DS'
      };
    }
    
    const user = accounts[0];
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      const initials = nameParts.length > 1 
        ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
        : user.name?.[0] || user.username?.[0] || 'U';
      
      return {
        name: user.name || user.username || 'User',
        email: user.username || user.email || '',
        initials: initials.toUpperCase()
      };
    }
    
    return {
      name: 'User',
      email: '',
      initials: 'U'
    };
  };

  const userInfo = getUserInfo();
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Filter documents based on category and search
  const filteredDocuments = staticDocumentsData.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', ...new Set(staticDocumentsData.map(doc => doc.category))];

  // Handle view details
  const handleViewDetails = (document) => {
    setSelectedDocument(document);
    setShowDetailsModal(true);
  };

  // Handle close details
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedDocument(null);
  };

  // Get selected document data
  const getSelectedDocumentData = () => {
    if (!selectedDocument) return null;
    return staticDocumentsData.find(doc => doc.id === selectedDocument.id) || selectedDocument;
  };

  return (
    <div className="modern-dashboard">
      {/* Animated Background Elements */}
      <div className="dashboard-background">
        <motion.div 
          className="ai-particle particle-1"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 360, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="ai-particle particle-2"
          animate={{ 
            x: [0, 40, 0],
            y: [0, -20, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="ai-particle particle-3"
          animate={{ 
            x: [0, -25, 0],
            y: [0, 35, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
      </div>

      {/* Welcome Header */}
      <motion.div 
        className="welcome-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="welcome-content">
          <div className="welcome-text">
            <motion.h1 
              className="welcome-title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {getGreeting()}, {userInfo.name.split(' ')[0]}!
            </motion.h1>
            <motion.p 
              className="welcome-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Ready to explore your research documents with AI-powered insights
            </motion.p>
          </div>
          <motion.div 
            className="user-avatar"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="avatar-circle">
              <span>{userInfo.initials}</span>
              <div className="avatar-status"></div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* AI Analytics Dashboard */}
      <motion.div 
        className="analytics-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="analytics-grid">
          {[
            {
              icon: <FaFileAlt />,
              value: analyticsData.totalDocuments,
              label: "Total Documents",
              color: "blue",
              trend: `+${analyticsData.monthlyUploads} this month`,
              delay: 0.1
            },
            {
              icon: <FaBrain />,
              value: analyticsData.totalInsights,
              label: "AI Insights Generated",
              color: "purple",
              trend: "AI-powered analysis",
              delay: 0.2
            },
            {
              icon: <FaSearch />,
              value: `${analyticsData.avgConfidenceScore}%`,
              label: "Avg Confidence Score",
              color: "green",
              trend: "High accuracy",
              delay: 0.3
            },
            {
              icon: <FaNetworkWired />,
              value: analyticsData.totalCitations,
              label: "Total Citations",
              color: "orange",
              trend: "Research impact",
              delay: 0.4
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className={`analytics-card ${stat.color}`}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: stat.delay, type: "spring", stiffness: 100 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="analytics-icon">
                {stat.icon}
              </div>
              <div className="analytics-data">
                <motion.div 
                  className="analytics-value"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: stat.delay + 0.3, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
                <div className="analytics-label">{stat.label}</div>
                <div className="analytics-trend">{stat.trend}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="quick-actions-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="section-title">
          <FaLightbulb className="section-icon" />
          Quick Actions
        </h3>
        <div className="quick-actions-grid">
          {[
            {
              icon: <FaCloudUploadAlt />,
              title: "Upload Documents",
              description: "Add new research papers",
              link: "/upload",
              color: "blue"
            },
            {
              icon: <FaRobot />,
              title: "AI Chat Assistant",
              description: "Get research insights",
              link: "/document-chat",
              color: "purple"
            },
            {
              icon: <FaSearch />,
              title: "Semantic Search",
              description: "Find relevant content",
              link: "/document-chat",
              color: "green"
            },
            {
              icon: <FaChartLine />,
              title: "Analytics Dashboard",
              description: "View detailed reports",
              link: "/mcp-analytics",
              color: "orange"
            }
          ].map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
            >
              <Link to={action.link} className="quick-action-card">
                <div className={`action-icon ${action.color}`}>
                  {action.icon}
                </div>
                <div className="action-content">
                  <h4 className="action-title">{action.title}</h4>
                  <p className="action-description">{action.description}</p>
                </div>
                <FaChevronRight className="action-arrow" />
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Document Library */}
      <motion.div 
        className="document-library-section"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="library-header">
          <div className="library-title-section">
            <h3 className="section-title">
              <FaFolderOpen className="section-icon" />
              Research Document Library
            </h3>
            <div className="library-stats">
              <span className="stat-item">
                <FaFileAlt /> {filteredDocuments.length} documents
              </span>
              <span className="stat-item">
                <FaCalendar /> {categories.length - 1} categories
              </span>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="library-controls">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search documents, tags, or authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-container">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <motion.div 
          className="documents-grid"
          layout
        >
          <AnimatePresence>
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                className="document-card-modern"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                layout
              >
                <div className="document-header">
                  <div className="document-category">{document.category}</div>
                  <div className={`document-status ${document.status}`}>
                    {document.status}
                  </div>
                </div>
                
                <div className="document-content">
                  <h4 className="document-title">{document.name}</h4>
                  <p className="document-summary">{document.summary}</p>
                  
                  <div className="document-meta">
                    <div className="meta-item">
                      <FaUser className="meta-icon" />
                      <span>{document.author}</span>
                    </div>
                    <div className="meta-item">
                      <FaCalendar className="meta-icon" />
                      <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="meta-item">
                      <FaFile className="meta-icon" />
                      <span>{document.size}</span>
                    </div>
                  </div>

                  <div className="document-insights">
                    <div className="insight-item">
                      <FaBrain className="insight-icon" />
                      <span>{document.keyInsights} insights</span>
                    </div>
                    <div className="insight-item">
                      <FaStar className="insight-icon" />
                      <span>{document.confidenceScore}% confidence</span>
                    </div>
                    <div className="insight-item">
                      <FaNetworkWired className="insight-icon" />
                      <span>{document.citationCount} citations</span>
                    </div>
                  </div>

                  <div className="document-tags">
                    {document.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="document-tag">
                        {tag}
                      </span>
                    ))}
                    {document.tags.length > 3 && (
                      <span className="tag-more">+{document.tags.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="document-actions">
                  <button 
                    className="action-btn primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(document);
                    }}
                  >
                    <FaEye /> View Details
                  </button>
                  <button 
                    className="action-btn secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle download functionality
                      console.log('Download document:', document.name);
                    }}
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div 
            className="no-documents"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <FaSearch className="no-docs-icon" />
            <h4>No documents found</h4>
            <p>Try adjusting your search terms or category filter</p>
          </motion.div>
        )}
      </motion.div>

      {/* Document Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedDocument && (
          <motion.div
            className="details-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseDetails}
          >
            <motion.div
              className="details-modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <DocumentDetailsModal
                document={getSelectedDocumentData()}
                onClose={handleCloseDetails}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Document Details Modal Component
const DocumentDetailsModal = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="document-details-modal">
      {/* Modal Header */}
      <div className="modal-header">
        <div className="modal-title-section">
          <h2 className="modal-title">{document.name}</h2>
          <div className="modal-subtitle">
            <span className="document-category-badge">{document.category}</span>
            <span className={`document-status-badge ${document.status}`}>
              {document.status}
            </span>
          </div>
        </div>
        <button className="modal-close-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Modal Content */}
      <div className="modal-body">
        {/* Document Summary */}
        <div className="details-section">
          <h3 className="section-header">
            <FaFileAlt className="section-icon" />
            Document Summary
          </h3>
          <p className="document-description">{document.summary}</p>
        </div>

        {/* Document Info Grid */}
        <div className="details-section">
          <h3 className="section-header">
            <FaUser className="section-icon" />
            Document Information
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Author:</span>
              <span className="info-value">{document.author}</span>
            </div>
            <div className="info-item">
              <span className="info-label">File Name:</span>
              <span className="info-value">{document.fileName}</span>
            </div>
            <div className="info-item">
              <span className="info-label">File Size:</span>
              <span className="info-value">{document.size}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Upload Date:</span>
              <span className="info-value">{new Date(document.uploadDate).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Category:</span>
              <span className="info-value">{document.category}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Status:</span>
              <span className="info-value">{document.status}</span>
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="details-section">
          <h3 className="section-header">
            <FaBrain className="section-icon" />
            AI Analysis Results
          </h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-icon">
                <FaBrain />
              </div>
              <div className="insight-content">
                <span className="insight-number">{document.keyInsights}</span>
                <span className="insight-label">Key Insights</span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">
                <FaStar />
              </div>
              <div className="insight-content">
                <span className="insight-number">{document.confidenceScore}%</span>
                <span className="insight-label">Confidence Score</span>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-icon">
                <FaNetworkWired />
              </div>
              <div className="insight-content">
                <span className="insight-number">{document.citationCount}</span>
                <span className="insight-label">Citations</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document Tags */}
        <div className="details-section">
          <h3 className="section-header">
            <FaTag className="section-icon" />
            Tags & Keywords
          </h3>
          <div className="tags-container">
            {document.tags.map((tag, index) => (
              <span key={index} className="detail-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="modal-footer">
        <button className="modal-action-btn secondary" onClick={onClose}>
          Close
        </button>
        <button className="modal-action-btn primary">
          <FaDownload /> Download Document
        </button>
        <button className="modal-action-btn primary">
          <FaSearch /> Analyze with AI
        </button>
      </div>
    </div>
  );
};

export default Documents;
