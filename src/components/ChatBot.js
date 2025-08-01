import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ChatBot.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "🔬 Hello! I'm your Research AI Assistant. I can help you with document analysis, research questions, data insights, and academic inquiries. What research topic would you like to explore today?", isBot: true }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputMessage.trim() || isSending) return;

        // Add user message
        const userMessage = { text: inputMessage, isBot: false };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setIsSending(true);

        // Reset input field height
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
        }

        try {
            const response = await axios.post('https://n8n.srv810548.hstgr.cloud/webhook/search-wiki-ai-agent', {
                message: inputMessage
            });

            // Process the response to extract the content properly
            let botResponse = '';
            
            if (typeof response.data === 'string') {
                // If it's already a string, use it directly
                botResponse = response.data;
            } else if (response.data && typeof response.data === 'object') {
                // Check if the response data exactly matches the format from the screenshot {"output": "text"}
                if (Object.keys(response.data).length === 1 && 'output' in response.data) {
                    const outputContent = response.data.output;
                    
                    // If output is a string, use it directly
                    if (typeof outputContent === 'string') {
                        botResponse = outputContent;
                    } 
                    // If output is itself an object
                    else if (typeof outputContent === 'object') {
                        // Try to extract a string value
                        if (Object.keys(outputContent).length > 0) {
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
                // If it's an object, try other extraction methods
                else if (response.data.output && typeof response.data.output === 'string') {
                    // If there's an output field that's a string, use it
                    botResponse = response.data.output;
                } else if (response.data.output && typeof response.data.output === 'object') {
                    // If output is itself an object (from the screenshot), check if there are any string properties
                    if (Object.keys(response.data.output).length > 0) {
                        // Try to extract meaningful text data from any string property
                        // This is a heuristic approach since we don't know the exact structure
                        const firstValue = Object.values(response.data.output)[0];
                        if (typeof firstValue === 'string') {
                            botResponse = firstValue;
                        } else {
                            // If that fails, stringify the output object
                            botResponse = JSON.stringify(response.data.output, null, 2);
                        }
                    } else {
                        botResponse = "I received an empty response object.";
                    }
                } else if (response.data.response) {
                    // Fallback to response field
                    botResponse = response.data.response;
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
                botResponse = "I received your message, but couldn't process the response format.";
            }

            // Add a small delay to simulate typing
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    text: botResponse,
                    isBot: true
                }]);
                setIsTyping(false);
                setIsSending(false);
            }, 800);
        } catch (error) {
            console.error('Error:', error);
            
            // Enhanced error logging
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('Request made but no response received:', error.request);
            } else {
                console.error('Error details:', error.message);
            }
            
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    text: "Sorry, I'm having trouble processing your request right now. Please try again later.",
                    isBot: true
                }]);
                setIsTyping(false);
                setIsSending(false);
            }, 800);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };



    // Custom renderer for markdown content
    const renderMessageContent = (text, isBot) => {
        if (!isBot) {
            return <div className="message-content">{text}</div>;
        }
        
        return (
            <div className="message-content">
                <div className="markdown-content">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // Override default elements with custom styling
                            h1: ({node, ...props}) => <h1 className="markdown-h1" {...props} />,
                            h2: ({node, ...props}) => <h2 className="markdown-h2" {...props} />,
                            h3: ({node, ...props}) => <h3 className="markdown-h3" {...props} />,
                            p: ({node, ...props}) => <p className="markdown-p" {...props} />,
                            ul: ({node, ...props}) => <ul className="markdown-ul" {...props} />,
                            ol: ({node, ...props}) => <ol className="markdown-ol" {...props} />,
                            li: ({node, ...props}) => <li className="markdown-li" {...props} />,
                            code: ({node, inline, ...props}) => 
                                inline 
                                    ? <code className="markdown-inline-code" {...props} />
                                    : <div className="markdown-code-block">
                                        <code {...props} />
                                    </div>,
                            pre: ({node, ...props}) => <pre className="markdown-pre" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="markdown-blockquote" {...props} />,
                            table: ({node, ...props}) => <table className="markdown-table" {...props} />,
                            a: ({node, ...props}) => <a className="markdown-link" target="_blank" rel="noopener noreferrer" {...props} />
                        }}
                    >
                        {text}
                    </ReactMarkdown>
                </div>
            </div>
        );
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>AI Assistant</h2>
                <div>
                    <span className="status-indicator"></span>
                    {isTyping ? 'Thinking...' : 'Online'}
                </div>
            </div>
            
            <div className="messages-container">
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
                                        {message.isBot ? 'AI Assistant' : 'You'}
                                    </div>
                                </div>
                                <div className="message-bubble">
                                    {renderMessageContent(message.text, message.isBot)}
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
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="input-form">
                <div className="message-input-container">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Message AI assistant..."
                        className="message-input"
                        rows={1}
                        disabled={isSending}
                    />
                    <button 
                        type="submit" 
                        className="send-button"
                        disabled={!inputMessage.trim() || isSending}
                        aria-label="Send message"
                    >
                    </button>
                </div>
                <div className="input-hint">
                    Press Enter to send, Shift+Enter for a new line
                </div>
            </form>
        </div>
    );
};

export default ChatBot; 