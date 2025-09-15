import React, { useState } from "react";

export const Ask = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Function to remove single and double asterisks from text
  const removeAsterisks = (text) => {
    return text.replace(/\*{1,2}/g, '');
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setCopied(false);

    try {
      const res = await fetch("http://127.0.0.1:8000/asks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      
      // Apply client-side filtering as well (in case backend filtering fails)
      const filteredAnswer = removeAsterisks(data.answer);
      setAnswer(filteredAnswer);
    } catch {
      setAnswer("Sorry, I encountered an error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAsk();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      // Reset the copied status after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = answer;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-light text-gray-800 mb-2">Ask a Question</h2>
          <p className="text-gray-500">Get answers to anything on your mind</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to know?"
            className="flex-grow p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400 transition duration-200 bg-white"
            disabled={loading}
          />
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition duration-200 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? "Asking..." : "Ask"}
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin mb-3"></div>
            <p className="text-gray-500">Thinking...</p>
          </div>
        )}

        {answer && !loading && (
          <div className="mt-6 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex justify-between items-center p-4 border-b border-blue-100">
              <h3 className="font-medium text-gray-700">Answer:</h3>
              <button
                onClick={copyToClipboard}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition duration-200"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div className="p-5">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};