import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { dpKey } from '@/apiKey'

const DeepSeekStreamChat = ({ apiKey = dpKey }) => {
  const [inputText, setInputText] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);

  const API_URL = 'https://api.deepseek.com/v1/chat/completions';
  const MODEL_NAME = 'deepseek-chat';

  // 清除当前会话
  const clearConversation = () => {
    setConversation([]);
    setError(null);
  };

  // 停止流式响应
  const stopStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  // 处理流式响应
  const handleStreamResponse = async (reader) => {
    let fullResponse = '';
    let assistantMessageIndex = -1;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = new TextDecoder().decode(value);
        const lines = textChunk.split('\n').filter(line => line.trim().startsWith('data: '));

        for (const line of lines) {
          try {
            const data = JSON.parse(line.replace('data: ', ''));
            if (data.choices?.[0]?.delta?.content) {
              fullResponse += data.choices[0].delta.content;

              // 优化更新性能：只在有实际内容时更新
              setConversation(prev => {
                // 查找最后一个assistant消息
                const lastAssistantMsgIndex = prev.map((msg, idx) => 
                  msg.role === 'assistant' ? idx : -1
                ).filter(idx => idx !== -1).pop();

                if (lastAssistantMsgIndex !== undefined) {
                  // 更新现有消息
                  const newMessages = [...prev];
                  newMessages[lastAssistantMsgIndex] = {
                    ...newMessages[lastAssistantMsgIndex],
                    content: fullResponse
                  };
                  return newMessages;
                } else {
                  // 添加新消息
                  return [
                    ...prev,
                    { role: 'assistant', content: fullResponse }
                  ];
                }
              });
            }
          } catch (e) {
            console.error('解析流数据出错:', e);
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('流式传输中断: ' + err.message);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // 提交问题
  const handleSubmit = async () => {
    if (!inputText.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    setIsStreaming(true);

    // 添加用户消息
    setConversation(prev => [
      ...prev,
      { role: 'user', content: inputText.trim() }
    ]);

    // 清除输入
    setInputText('');

    // 创建中止控制器
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            ...conversation,
            { role: 'user', content: inputText.trim() }
          ],
          stream: true,
          // temperature: 0.7,
          // search_enabled: true,
          // thinking_enabled: true
          search: true,
          temperature: true ? 0.3 : 0.7,
          max_tokens: true ? 2000 : 1000
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || '请求失败');
      }

      // 处理流式响应
      const reader = response.body.getReader();
      await handleStreamResponse(reader);

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        console.error('API请求错误:', err);
      }
    } finally {
      abortControllerRef.current = null;
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 组件卸载时中止请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="deepseek-stream-container">
      <div className="header">
        <h2>DeepSeek 流式对话</h2>
        <button 
          onClick={clearConversation}
          disabled={isLoading || conversation.length === 0}
          className="clear-btn"
        >
          清空对话
        </button>
      </div>

      <div className="chat-history">
        {conversation.length === 0 ? (
          <div className="empty-state">
            <p>输入问题开始与AI对话...</p>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role} ${msg.role === 'assistant' ? 'streaming' : ''}`}
            >
              <div className="message-header">
                <strong>{msg.role === 'user' ? '你' : 'AI助手'}</strong>
              </div>
              <div className="message-content">
                {msg.content || (msg.role === 'assistant' && isLoading ? '思考中...' : '')}
              </div>
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="input-area">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          disabled={isLoading}
          rows={3}
        />
        <div className="button-group">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !inputText.trim()}
            className="submit-btn"
          >
            {isStreaming ? '生成中...' : '发送'}
          </button>
          {isStreaming && (
            <button
              onClick={stopStream}
              className="stop-btn"
            >
              停止
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .deepseek-stream-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          border-radius: 12px;
          background: #f8f9fa;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        h2 {
          margin: 0;
          color: #333;
        }
        
        .clear-btn {
          padding: 6px 12px;
          background: #f1f3f5;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .clear-btn:hover {
          background: #e9ecef;
        }
        
        .clear-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .chat-history {
          height: 500px;
          overflow-y: auto;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6c757d;
        }
        
        .message {
          margin-bottom: 15px;
          padding: 12px 15px;
          border-radius: 8px;
          line-height: 1.5;
        }
        
        .message.user {
          background: #e3f2fd;
          margin-left: 20%;
          border-bottom-right-radius: 0;
        }
        
        .message.assistant {
          background: #f5f5f5;
          margin-right: 20%;
          border-bottom-left-radius: 0;
        }
        
        .message.streaming {
          background: #f0f0f0;
        }
        
        .message-header {
          font-weight: 600;
          margin-bottom: 5px;
          color: #495057;
        }
        
        .message-content {
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        .error-message {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          margin-bottom: 15px;
          background: #f8d7da;
          color: #721c24;
          border-radius: 5px;
          font-size: 14px;
        }
        
        .error-message button {
          background: none;
          border: none;
          color: #721c24;
          font-size: 16px;
          cursor: pointer;
        }
        
        .input-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #ced4da;
          border-radius: 6px;
          resize: vertical;
          font-size: 16px;
          min-height: 80px;
        }
        
        textarea:disabled {
          background: #e9ecef;
        }
        
        .button-group {
          display: flex;
          gap: 10px;
        }
        
        .submit-btn {
          flex: 1;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          transition: background 0.2s;
        }
        
        .submit-btn:hover {
          background: #0069d9;
        }
        
        .submit-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }
        
        .stop-btn {
          padding: 12px 20px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .stop-btn:hover {
          background: #c82333;
        }
        
        @media (max-width: 600px) {
          .deepseek-stream-container {
            padding: 15px;
          }
          
          .chat-history {
            height: 400px;
          }
          
          .message.user {
            margin-left: 10%;
          }
          
          .message.assistant {
            margin-right: 10%;
          }
        }
      `}</style>
    </div>
  );
};

export default DeepSeekStreamChat;