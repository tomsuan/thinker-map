// pages/index.js

import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';

export default function Home() {
  const [ideas, setIdeas] = useState([]);
  const nodeRefs = useRef({});

  // Load ideas from localStorage when page first loads
  useEffect(() => {
    const savedIdeas = JSON.parse(localStorage.getItem('ideas')) || [];
    setIdeas(savedIdeas);

    // Create refs for existing ideas
    savedIdeas.forEach(idea => {
      nodeRefs.current[idea.id] = React.createRef();
    });
  }, []);

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ideas', JSON.stringify(ideas));
  }, [ideas]);

  const addIdea = () => {
    const id = Date.now();
    nodeRefs.current[id] = React.createRef();
    const newIdea = {
      id,
      x: 100,
      y: 100,
      text: 'New Idea',
    };
    setIdeas(prev => [...prev, newIdea]);
  };

  const updateIdeaText = (id, newText) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, text: newText } : idea
      )
    );
  };

  const updateIdeaPosition = (id, data) => {
    setIdeas(prev =>
      prev.map(idea =>
        idea.id === id ? { ...idea, x: data.x, y: data.y } : idea
      )
    );
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      position: 'relative',
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {ideas.map((idea) => (
        <Draggable
          key={idea.id}
          nodeRef={nodeRefs.current[idea.id]}
          position={{ x: idea.x, y: idea.y }}
          onStop={(e, data) => updateIdeaPosition(idea.id, data)}
        >
          <div ref={nodeRefs.current[idea.id]} style={{
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            position: 'absolute',
            cursor: 'move',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.1)',
            minWidth: '150px'
          }}>
            <input
              type="text"
              value={idea.text}
              onChange={(e) => updateIdeaText(idea.id, e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                backgroundColor: 'transparent',
                color: '#000'
              }}
            />
          </div>
        </Draggable>
      ))}

      {/* Floating + Button */}
      <button 
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#000',
          color: '#fff',
          fontSize: '30px',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={addIdea}
      >
        +
      </button>
    </div>
  );
}
