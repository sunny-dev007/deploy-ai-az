import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './DocumentChat.css';

const DocumentChat = () => {
    const [messages, setMessages] = useState([
        { 
            text: "🔬 Welcome to the Research Document AI Assistant! I specialize in analyzing, summarizing, and extracting insights from your research documents. Upload documents, ask questions, or use semantic search to uncover valuable information. How can I assist your research today?", 
            isBot: true,
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [documentContext, setDocumentContext] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const fileInputRef = useRef(null);
    const documentListRef = useRef(null);
    const activeDocumentRef = useRef(null);

    // Fetch documents from database and handle loading states
    useEffect(() => {
        let isMounted = true;
        setIsLoadingDocuments(true);
        
        const fetchDocuments = async () => {
            try {
                // Simulate API call for demo purposes
                // In a real application, replace with actual API call to your database
                // const response = await axios.get('/api/documents');
                // const data = response.data;
                
                // Simulating network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                if (!isMounted) return;
                
                // Sample fallback documents - would be replaced with actual data from API
                const sampleDocs = [
                    { id: 1, name: 'Handbook Tutorial Advanced PHP.pdf', size: '4.2 MB', status: 'active' },
                    { id: 2, name: 'Generative AI - Cloud Migration.docx', size: '1.8 MB', status: 'active' },
                    { id: 3, name: 'Financial Statement Q1.xlsx', size: '3.5 MB', status: 'processing' },
                    { id: 4, name: 'Employee Handbook 2023.pdf', size: '12.1 MB', status: 'active' },
                    { id: 5, name: 'Marketing Strategy 2023-2024.pptx', size: '8.7 MB', status: 'active' },
                    { id: 6, name: 'Technical Documentation - API Reference.md', size: '0.5 MB', status: 'inactive' },
                    { id: 7, name: 'Customer Feedback Analysis.xlsx', size: '2.3 MB', status: 'active' },
                    { id: 8, name: 'Legal Contract - NDA Template.docx', size: '0.8 MB', status: 'active' },
                    { id: 9, name: 'Product Roadmap 2023-2025.pdf', size: '5.6 MB', status: 'active' },
                    { id: 10, name: 'Research Paper - AI Integration.pdf', size: '7.2 MB', status: 'processing' },
                    { id: 11, name: 'Budget Planning Worksheet.xlsx', size: '1.4 MB', status: 'active' },
                    { id: 12, name: 'Design Guidelines - Brand Assets.zip', size: '45.8 MB', status: 'inactive' }
                ];
                
                setDocuments(sampleDocs);
                setFilteredDocuments(sampleDocs);
                setIsLoadingDocuments(false);
                    setLoadError(false);
            } catch (error) {
                console.error('Error fetching documents:', error);
                if (isMounted) {
                    // Fallback to sample data
                    const fallbackDocs = [
                        { id: 1, name: 'Annual Report 2023.pdf', size: '4.2 MB', status: 'active' },
                        { id: 2, name: 'Project Proposal.docx', size: '1.8 MB', status: 'active' },
                        { id: 3, name: 'Financial Statement Q1.xlsx', size: '3.5 MB', status: 'processing' }
                    ];
                    setDocuments(fallbackDocs);
                    setFilteredDocuments(fallbackDocs);
                    setIsLoadingDocuments(false);
                    setLoadError(true);
                }
            }
        };

        fetchDocuments();
        
        return () => {
            isMounted = false;
        };
    }, []);

    // Filter documents based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredDocuments(documents);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = documents.filter(doc => 
            doc.name.toLowerCase().includes(query)
        );
        setFilteredDocuments(filtered);
    }, [searchQuery, documents]);

    // Scroll to active document in the list
    useEffect(() => {
        if (documentContext && activeDocumentRef.current) {
            // Add a small delay to ensure the DOM has updated
            setTimeout(() => {
                activeDocumentRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
    }, [documentContext]);

    // Ensure the document list is scrollable and visible
    useEffect(() => {
        if (documentListRef.current && filteredDocuments.length > 0) {
            // Reset scroll position to top when filter changes
            if (searchQuery) {
                documentListRef.current.scrollTop = 0;
            }
        }
    }, [filteredDocuments, searchQuery]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-resize input field as user types
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`;
        }
    }, [inputMessage]);

    const handleFileUpload = () => {
        fileInputRef.current?.click();
    };

    // Function to truncate text with ellipsis
    const truncateText = (text, maxLength = 28) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Handle document selection
    const handleSelectDocument = (document) => {
        // Don't allow selecting inactive documents
        if (document.status === 'inactive') return;
        
        // Update document context
        setDocumentContext(document);
        
        // Add a message to inform the user about the selected document
        setMessages(prev => [
            ...prev,
            {
                text: `I've loaded "${document.name}" for you. What would you like to know about this document?`,
                isBot: true,
                timestamp: new Date()
            }
        ]);
        
        // Auto scroll to bottom
        setTimeout(scrollToBottom, 100);
    };

    // Add user message
    const addUserMessage = (text, hasAttachment = false, attachment = null) => {
        const newMessage = {
            text,
            isBot: false,
            timestamp: new Date(),
            hasAttachment,
            attachment
        };
        setMessages(prev => [...prev, newMessage]);
    };

    // Add bot message
    const addBotMessage = (text) => {
        const newMessage = {
            text,
            isBot: true,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview the file
        setDocumentContext({
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            type: file.type
        });

        // Add message about the uploaded file
        addUserMessage(`I'd like to ask about the document: ${file.name}`, true, {
            name: file.name,
            type: file.type
        });

        // Bot response acknowledging the upload
        setTimeout(() => {
            addBotMessage(`I see you've uploaded *${file.name}*. What would you like to know about this document?`);
        }, 1000);

        // Reset file input
        e.target.value = null;
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputMessage.trim() || isSending) return;

        // Add user message
        addUserMessage(inputMessage);
        setInputMessage('');
        setIsTyping(true);
        setIsSending(true);

        // Reset input field height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        try {
            // Using the same webhook URL as in ChatBot.js
            const response = await axios.post('https://primary-production-1e6cb.up.railway.app/webhook/summarize-documents', {
                query: inputMessage,
                documentContext: documentContext ? {
                    name: documentContext.name,
                    id: documentContext.id,
                    status: documentContext.status,
                    size: documentContext.size
                } : null,
                isDocumentSearch: true, // Flag to indicate this is from DocumentChat
                useStructuredResponse: true // Request a more structured response if possible
            }, {
                timeout: 30000 // 30 second timeout
            });

            // Process the response
            let botResponse = '';
            
            // Artificial delay for typing effect
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Handle different response formats
            if (typeof response.data === 'string') {
                // Plain text response
                botResponse = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // Check if we have a simple {"output": "text"} format (as in the screenshot)
                if (Object.keys(response.data).length === 1 && 'output' in response.data) {
                    const outputContent = response.data.output;
                    
                    // If output is a string, use it directly
                    if (typeof outputContent === 'string') {
                        botResponse = outputContent;
                    } 
                    // If output is itself a JSON string that was double-encoded
                    else if (typeof outputContent === 'object') {
                        if (Object.keys(outputContent).length > 0) {
                            // Use the first value if it's a string
                            const firstValue = Object.values(outputContent)[0];
                            if (typeof firstValue === 'string') {
                                botResponse = firstValue;
                            } else {
                                botResponse = JSON.stringify(outputContent);
                            }
                        } else {
                            botResponse = "The response was empty.";
                        }
                    }
                }
                // Handle structured response
                else if (response.data.error) {
                    // Handle error from API
                    botResponse = `Error: ${response.data.error}. Please try again or rephrase your question.`;
                } else if (response.data.answer) {
                    // Standard answer field
                    botResponse = response.data.answer;
                    
                    // Check for sources/citations and append them if available
                    if (response.data.sources && response.data.sources.length > 0) {
                        botResponse += "\n\n**Sources:**\n";
                        response.data.sources.forEach((source, index) => {
                            botResponse += `${index + 1}. ${source.title || source.name} ${source.url ? `[link](${source.url})` : ''}\n`;
                        });
                    }
                } else if (response.data.results) {
                    // Search results format
                    botResponse = "Here are the search results:\n\n";
                    response.data.results.forEach((result, index) => {
                        botResponse += `**${index + 1}. ${result.title || 'Document Section'}**\n${result.content || result.snippet || 'No preview available'}\n\n`;
                    });
                } else if (response.data.summary) {
                    // Document summary format
                    botResponse = `**Document Summary**\n\n${response.data.summary}`;
                    
                    if (response.data.keyPoints && response.data.keyPoints.length > 0) {
                        botResponse += "\n\n**Key Points:**\n";
                        response.data.keyPoints.forEach((point, index) => {
                            botResponse += `${index + 1}. ${point}\n`;
                        });
                    }
                } else {
                    // Last resort - try to find any meaningful string in the object
                    try {
                        // Try to extract any useful text from the response object
                        const jsonString = JSON.stringify(response.data);
                        
                        // Check if the stringified response appears to be JSON itself
                        if (jsonString.includes('{"output":')) {
                            // Try to extract the output content
                            const match = jsonString.match(/"output":"([^"]+)"/);
                            if (match && match[1]) {
                                botResponse = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
                            } else {
                                botResponse = jsonString;
                            }
                        } else {
                            // Simple stringified JSON
                            botResponse = jsonString;
                        }
                    } catch (e) {
                        console.error("Error parsing response:", e);
                        botResponse = "I received a response but couldn't format it properly.";
                    }
                }
            } else {
                // Fallback for unexpected response
                botResponse = "I received a response but couldn't process it. Please try again.";
            }

            // Add bot message with the processed response
                addBotMessage(botResponse);
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Enhanced error logging
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('Request made but no response received:', error.request);
            } else {
                console.error('Error details:', error.message);
            }
            
            // Handle different error types
            let errorMessage = "Sorry, I encountered an error processing your request.";
            
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = `Server error (${error.response.status}): ${error.response.data.message || 'Please try again later.'}`;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = "I couldn't reach the server. Please check your connection and try again.";
            } else if (error.code === 'ECONNABORTED') {
                // Request timed out
                errorMessage = "The request took too long to process. This might be due to high server load or a complex query.";
            }
            
            addBotMessage(errorMessage);
        } finally {
                setIsTyping(false);
                setIsSending(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const clearChat = () => {
        setMessages([
            { 
                text: "🔬 Welcome to the Research Document AI Assistant! I specialize in analyzing, summarizing, and extracting insights from your research documents. Upload documents, ask questions, or use semantic search to uncover valuable information. How can I assist your research today?", 
                isBot: true,
                timestamp: new Date()
            }
        ]);
        setDocumentContext(null);
    };

    // Custom renderer for message content
    const renderMessageContent = (text, isBot, message) => {
        // If it's a bot message, render with markdown
        if (isBot) {
            return (
                <div className="message-content bot-message">
                    <div className="markdown-content">
                        <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
                                h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
                                p: ({node, ...props}) => <p className="markdown-p" {...props} />,
                                ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                                ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                                li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                                a: ({node, ...props}) => <a className="markdown-a" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
                                code: ({node, inline, className, children, ...props}) => {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <div className="code-block-container">
                                            <div className="code-block-header">
                                                <span className="code-language">{match[1]}</span>
                                                <button 
                                                    className="copy-code-button"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                                        // Could add a toast notification here
                                                    }}
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                            <pre className="markdown-pre">
                                                <code className={`markdown-code ${className}`} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    ) : (
                                        <code className={inline ? "markdown-code-inline" : "markdown-code"} {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                                table: ({node, ...props}) => <div className="table-container"><table className="markdown-table" {...props} /></div>,
                                thead: ({node, ...props}) => <thead className="markdown-thead" {...props} />,
                                tbody: ({node, ...props}) => <tbody className="markdown-tbody" {...props} />,
                                tr: ({node, ...props}) => <tr className="markdown-tr" {...props} />,
                                th: ({node, ...props}) => <th className="markdown-th" {...props} />,
                                td: ({node, ...props}) => <td className="markdown-td" {...props} />
                            }}
                        >
                            {text}
                        </ReactMarkdown>
                    </div>
                </div>
            );
        }

        // For user messages, first check if there's an attachment
        if (message.hasAttachment && message.attachment) {
                return (
                <div className="message-content">
                    <div className="message-attachment">
                        <div className="attachment-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                            </svg>
                                        </div>
                        <div className="attachment-details">
                            <div className="attachment-name">{message.attachment.name}</div>
                            <div className="attachment-type">{message.attachment.type}</div>
                            </div>
                    </div>
                    <div className="message-text">{text}</div>
                    </div>
                );
        }
        
        // Regular user message (no attachment)
        return (
            <div className="message-content">
                    {text}
            </div>
        );
    };

    // Handle document search
    const handleDocumentSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="document-chat-container">
            <div className="document-chat-sidebar">
                <div className="document-chat-logo">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>Research Assistant</span>
                </div>

                <div className="document-sidebar-content">
                    <h3 className="section-title">Research Documents</h3>
                    
                    <div className="document-search">
                        <input 
                            type="text" 
                            placeholder="Search documents..." 
                            className="document-search-input"
                            value={searchQuery}
                            onChange={handleDocumentSearch}
                        />
                    </div>

                    {/* Document Listing Section */}
                    <div className="document-listing">
                        {isLoadingDocuments ? (
                            <div className="documents-loading">
                                <div className="documents-loading-spinner"></div>
                                <p>Loading documents...</p>
                            </div>
                        ) : filteredDocuments.length === 0 ? (
                            <div className="no-documents">
                                {searchQuery ? (
                                    <p>No documents matching "{searchQuery}"</p>
                                ) : (
                                    <p>No documents found in the database.</p>
                                )}
                            </div>
                        ) : (
                            <div className="document-list" ref={documentListRef}>
                                {filteredDocuments.map((doc) => (
                                    <div 
                                        key={doc.id} 
                                        className={`document-item ${documentContext?.name === doc.name ? 'active' : ''} ${doc.status === 'inactive' ? 'inactive' : ''}`}
                                        onClick={() => doc.status !== 'inactive' && handleSelectDocument(doc)}
                                        title={doc.name} // Full name as tooltip
                                        ref={documentContext?.name === doc.name ? activeDocumentRef : null}
                                    >
                                        <div className="document-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                <polyline points="14 2 14 8 20 8"></polyline>
                                            </svg>
                                        </div>
                                        <div className="document-details">
                                            <div className="document-name-container">
                                                <span className="document-name">{truncateText(doc.name)}</span>
                                                <span className={`document-status ${doc.status}`}></span>
                                            </div>
                                            <div className="document-size">{doc.size}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {loadError && (
                            <div className="documents-error">
                                <p>Using sample data. Couldn't connect to database.</p>
                            </div>
                        )}
                    </div>

                    <div className="document-context">
                        <h3>Active Document</h3>
                        {documentContext ? (
                            <div className="active-document">
                                <div className="document-info">
                                    <div className="document-name" title={documentContext.name}>
                                        {truncateText(documentContext.name)}
                                    </div>
                                    <div className="document-meta">{documentContext.size} • {documentContext.type}</div>
                                </div>
                                <button 
                                    className="clear-document-btn"
                                    onClick={() => setDocumentContext(null)}
                                    aria-label="Clear document"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="no-document">
                                <p>No document selected</p>
                                <button 
                                    className="upload-document-btn" 
                                    onClick={handleFileUpload}
                                >
                                    Upload Document
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="document-actions">
                    <button className="action-btn" onClick={clearChat}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Clear Chat
                    </button>
                    <button className="action-btn" onClick={handleFileUpload}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        Upload
                    </button>
                </div>
            </div>
            
            <div className="document-chat-main">
                <div className="document-chat-header">
                    <h2>Research Document Assistant</h2>
                    <div>
                        <span className="status-indicator"></span>
                        {isTyping ? 'Analyzing document...' : 'Ready'}
                    </div>
                </div>
                
                <div className="messages-container">
                    {messages.length === 0 ? (
                        <div className="empty-messages">
                            <div className="empty-messages-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </div>
                            <div className="empty-messages-title">Your conversation will appear here</div>
                            <div className="empty-messages-subtitle">
                                Upload research documents or ask questions about documents in our research database. 
                                The Research Assistant can perform semantic search, summarize findings, extract insights, 
                                and answer specific research questions about document content.
                            </div>
                        </div>
                    ) : (
                        <div className="message-wrapper">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={index}
                                        className={`message ${message.isBot ? 'bot' : 'user'}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="message-meta">
                                            <div className="message-sender">
                                                {message.isBot ? 'Research Assistant' : 'You'}
                                            </div>
                                            {message.timestamp && (
                                                <div className="message-time">
                                                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </div>
                                            )}
                                        </div>
                                        <div className="message-bubble">
                                            {renderMessageContent(message.text, message.isBot, message)}
                                        </div>
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div 
                                        className="typing-indicator"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="typing-indicator-content">
                                            <div className="typing-indicator-dots">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="input-form">
                    <div className="message-input-container">
                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={documentContext 
                                ? "Ask about this document..." 
                                : "Ask about any document in the database..."}
                            className="message-input"
                            rows={1}
                            disabled={isSending}
                        />
                        <button 
                            type="button" 
                            className="upload-button"
                            onClick={handleFileUpload}
                            disabled={isSending}
                            aria-label="Upload document"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </button>
                        <button 
                            type="submit" 
                            className="send-button"
                            disabled={!inputMessage.trim() || isSending}
                            aria-label="Send message"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                    <div className="input-hint">
                        Press Enter to send, Shift+Enter for a new line
                    </div>
                </form>
                
                {/* Hidden file input */}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt,.md"
                />
            </div>
        </div>
    );
};

export default DocumentChat; 