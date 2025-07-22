'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import {
  Send, MessageSquare, BarChart3, Users, ThumbsUp, Clock,
} from 'lucide-react';

interface Question {
  id: string;
  user: string;
  question: string;
  timestamp: string;
  likes: number;
  answered: boolean;
  answer?: string;
}

interface PollOption {
  text: string;
  votes: number;
  percentage: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  timeLeft: string;
}

const RoomPage = () => {
  const { slug } = useParams();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('qa');
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [polls, setPolls] = useState<Poll[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [questions]);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const res = await fetch(`http://localhost:5000/rooms/slug/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch room');

        const room = await res.json();
        setRoomId(room.id);
      } catch (err) {
        console.error('Error fetching room:', err);
      }
    };

    fetchRoom();
  }, [slug]);

  useEffect(() => {
    if (!roomId) return;

    const fetchQuestions = async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/rooms/${roomId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setQuestions(data);
    };

    const fetchPolls = async () => {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:5000/rooms/${roomId}/polls`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPolls(data);
    };

    fetchQuestions();
    fetchPolls();
  }, [roomId]);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim() || !roomId) return;

    const token = localStorage.getItem('auth_token');

    try {
      const res = await fetch(`http://localhost:5000/rooms/${roomId}/questions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (!res.ok) throw new Error('Failed to submit question');

      const newQ = await res.json();
      setQuestions([newQ, ...questions]);
      setNewQuestion('');
    } catch (err) {
      console.error('Failed to submit question:', err);
    }
  };

  const handleLike = async (id: string) => {
    const token = localStorage.getItem('auth_token');

    await fetch(`http://localhost:5000/questions/${id}/like`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setQuestions(questions.map(q =>
      q.id === id ? { ...q, likes: q.likes + 1 } : q
    ));
  };

  const handleVote = async (pollId: string, optionIndex: number) => {
    const token = localStorage.getItem('auth_token');

    try {
      await fetch(`http://localhost:5000/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionIndex }),
      });

      // re-fetch poll results
      const res = await fetch(`http://localhost:5000/rooms/${roomId}/polls`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await res.json();
      setPolls(updated);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6" />
            <h1 className="text-xl font-bold">Live Q&A Session</h1>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>Live</span>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('qa')}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'qa' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Q&A</span>
            </button>
            <button
              onClick={() => setActiveTab('polls')}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'polls' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Polls</span>
            </button>
          </nav>
        </div>

        {/* QA Tab */}
        {activeTab === 'qa' && (
          <>
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6">
              <div className="flex space-x-3">
                <input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                  placeholder="Ask your question..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleSubmitQuestion}
                  className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div ref={messagesEndRef} />
              {questions.map(q => (
                <div key={q.id} className="bg-gray-50 border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{q.user}</span>
                      <div className="text-sm text-gray-500 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{q.timestamp}</span>
                      </div>
                    </div>
                    {q.answered && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Answered
                      </span>
                    )}
                  </div>
                  <p className="text-gray-800 mb-3">{q.question}</p>
                  {q.answer && (
                    <div className="bg-white border-l-4 border-purple-500 p-3 rounded mb-2">
                      <p className="text-sm text-gray-700 font-medium">Answer:</p>
                      <p>{q.answer}</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleLike(q.id)}
                    className="text-sm text-gray-600 hover:text-purple-600 flex items-center space-x-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>{q.likes}</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Polls Tab */}
        {activeTab === 'polls' && (
          <div className="space-y-6">
            {polls.map((poll) => (
              <div key={poll.id} className="bg-gray-50 border p-6 rounded-lg">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">{poll.question}</h3>
                  <div className="text-sm text-right">
                    <div>{poll.totalVotes} votes</div>
                    <div className="text-purple-600">Time left: {poll.timeLeft}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {poll.options.map((opt, index) => (
                    <div key={index}>
                      <button
                        onClick={() => handleVote(poll.id, index)}
                        className="w-full text-left border p-3 rounded hover:bg-gray-100"
                      >
                        <div className="flex justify-between text-sm mb-1">
                          <span>{opt.text}</span>
                          <span className="text-purple-600 font-medium">{opt.percentage}%</span>
                        </div>
                        <div className="bg-gray-200 h-2 rounded-full">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: `${opt.percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{opt.votes} votes</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
