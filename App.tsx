
import React, { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { ChatMessage, MessageRole, QueryClassification } from './types';
import { classifyPrompt } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: MessageRole.USER,
      content,
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Step 1: Classify the prompt for UI feedback
      const classification = await classifyPrompt(content);

      // Step 2: Add a placeholder for the assistant's response
      const assistantMessageId = uuidv4();
      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: MessageRole.ASSISTANT,
        content: '',
        classification,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Step 3: Fetch the streaming response from the local smart router
      const response = await fetch('http://localhost:3000/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemini-router', // Model is ignored by the router but good practice to send
          messages: [{ role: 'user', content }],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}. Is the local server running?`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            if (data === '[DONE]') {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices[0]?.delta?.content || '';
              if (delta) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: msg.content + delta }
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Failed to parse stream chunk:', data);
            }
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.role === MessageRole.ASSISTANT && lastMsg.content === '') {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <MessageList messages={messages} />
      {error && (
        <div className="px-6 pb-2 text-red-400 text-center text-sm">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
