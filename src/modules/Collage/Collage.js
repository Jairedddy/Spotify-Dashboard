import React, { useMemo, useContext, useState, useRef } from 'react';
import Card from '../../components/Card';
import { UserDataContext } from '../../context/UserDataContext';

export default function Collage() {
    const { topTracks } = useContext(UserDataContext);
    const [selected, setSelected] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [positions, setPositions] = useState({});
    const canvasRef = useRef(null);

    const covers = useMemo(() => {
        const seen = new Set();
        return topTracks
            .map(t => ({
                url: t.album.images?.[0].url,
                name: t.album.name,
                artist: t.artists[0].name,
                track: t.name,
                id: t.album.id,
            }))
            .filter(c=>c.url && !seen.has(c.id) && seen.add(c.id));
    }, [topTracks]);

    // Initialize positions with random placement
    const initializePositions = () => {
        const newPositions = {};
        const positions_list = [
            { top: '10%', left: '5%', transform: 'rotate(-5deg)' },
            { top: '15%', left: '25%', transform: 'rotate(3deg)' },
            { top: '5%', left: '45%', transform: 'rotate(-2deg)' },
            { top: '20%', left: '65%', transform: 'rotate(4deg)' },
            { top: '8%', left: '80%', transform: 'rotate(-3deg)' },
            { top: '35%', left: '10%', transform: 'rotate(2deg)' },
            { top: '40%', left: '30%', transform: 'rotate(-4deg)' },
            { top: '30%', left: '50%', transform: 'rotate(1deg)' },
            { top: '45%', left: '70%', transform: 'rotate(-2deg)' },
            { top: '35%', left: '85%', transform: 'rotate(3deg)' },
            { top: '60%', left: '15%', transform: 'rotate(-1deg)' },
            { top: '65%', left: '35%', transform: 'rotate(2deg)' },
            { top: '55%', left: '55%', transform: 'rotate(-3deg)' },
            { top: '70%', left: '75%', transform: 'rotate(1deg)' },
            { top: '60%', left: '90%', transform: 'rotate(-2deg)' },
            { top: '80%', left: '20%', transform: 'rotate(2deg)' },
        ];
        
        covers.slice(0, 16).forEach((cover, i) => {
            if (!positions[cover.id]) {
                newPositions[cover.id] = positions_list[i] || { top: '50%', left: '50%', transform: 'rotate(0deg)' };
            }
        });
        setPositions(prev => ({ ...prev, ...newPositions }));
    };

    // Initialize positions on component mount
    React.useEffect(() => {
        if (covers.length > 0) {
            const hasPositions = covers.slice(0, 16).some(cover => positions[cover.id]);
            if (!hasPositions) {
                initializePositions();
            }
        }
    }, [covers.length]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleMouseDown = (e, cover) => {
        e.preventDefault();
        setDraggedItem(cover);
        setSelected(cover.id);
    };

    const handleMouseMove = (e) => {
        if (!draggedItem) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // Keep within bounds
        const clampedX = Math.max(0, Math.min(90, x));
        const clampedY = Math.max(0, Math.min(90, y));
        
        setPositions(prev => ({
            ...prev,
            [draggedItem.id]: {
                ...prev[draggedItem.id],
                top: `${clampedY}%`,
                left: `${clampedX}%`,
            }
        }));
    };

    const handleMouseUp = () => {
        setDraggedItem(null);
    };

    // Download canvas as image
    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Create a temporary canvas for high-quality export
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 1200;
        tempCanvas.height = 800;
        
        // Fill background
        tempCtx.fillStyle = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Create gradient background
        const gradient = tempCtx.createLinearGradient(0, 0, tempCanvas.width, tempCanvas.height);
        gradient.addColorStop(0, '#1a1a1a');
        gradient.addColorStop(1, '#2d2d2d');
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Draw album covers
        covers.slice(0, 16).forEach((cover, i) => {
            if (!cover || !cover.url || !cover.id) return;
            
            const pos = positions[cover.id];
            if (pos) {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const x = (parseFloat(pos.left) / 100) * tempCanvas.width;
                    const y = (parseFloat(pos.top) / 100) * tempCanvas.height;
                    const size = 140;
                    
                    // Extract rotation from transform
                    const rotation = pos.transform ? parseFloat(pos.transform.match(/-?\d+\.?\d*/)?.[0] || 0) : 0;
                    
                    tempCtx.save();
                    tempCtx.translate(x + size/2, y + size/2);
                    tempCtx.rotate((rotation * Math.PI) / 180);
                    tempCtx.drawImage(img, -size/2, -size/2, size, size);
                    tempCtx.restore();
                    
                    // If this is the last image, trigger download
                    if (i === Math.min(15, covers.length - 1)) {
                        const link = document.createElement('a');
                        link.download = 'spotify-collage.png';
                        link.href = tempCanvas.toDataURL('image/png');
                        link.click();
                    }
                };
                img.src = cover.url;
            }
        });
    };

    return (
        <div style={{ padding: '2em', maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontWeight: 700, fontSize: '2em', marginBottom: '1em' }}>
            Collage of Covers
          </h2>
          <Card>
            <div style={{ marginBottom: '1.5em', color: 'var(--muted)' }}>
              Your most-played albums as an interactive digital collage. Drag covers to rearrange them, click for details, and download your creation as a high-quality image.
            </div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                onClick={downloadCanvas}
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: '1em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#16a34a';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--primary)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📥 Download Collage
              </button>
              <button
                onClick={initializePositions}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'var(--text)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: '1em',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🔄 Reset Layout
              </button>
            </div>
            
            <div 
              ref={canvasRef}
              style={{
                position: 'relative',
                width: '100%',
                height: 500,
                marginBottom: 24,
                background: 'linear-gradient(135deg, var(--surface) 0%, var(--background) 100%)',
                borderRadius: 20,
                overflow: 'hidden',
                padding: 20,
                border: '2px solid rgba(29, 185, 84, 0.1)',
                cursor: draggedItem ? 'grabbing' : 'default',
                userSelect: 'none'
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {covers.slice(0, 16).map((c, i) => {
                if (!c || !c.url || !c.id) return null;
                
                const pos = positions[c.id] || { top: '50%', left: '50%', transform: 'rotate(0deg)' };
                const isSelected = selected === c.id;
                const isDragging = draggedItem?.id === c.id;
                
                return (
                  <img
                    key={c.id}
                    src={c.url}
                    alt={c.name || 'Album cover'}
                    style={{
                      position: 'absolute',
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      boxShadow: isSelected 
                        ? '0 0 0 4px var(--primary), 0 8px 25px rgba(0,0,0,0.4)' 
                        : '0 4px 15px rgba(0,0,0,0.2)',
                      cursor: isDragging ? 'grabbing' : 'grab',
                      objectFit: 'cover',
                      transition: isDragging ? 'none' : 'all 0.3s ease',
                      zIndex: isSelected ? 10 : (isDragging ? 15 : 1),
                      opacity: isDragging ? 0.8 : 1,
                      transform: isDragging ? `${pos.transform} scale(1.1)` : pos.transform,
                      ...pos,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, c)}
                    onMouseEnter={(e) => {
                      if (!isDragging && !isSelected) {
                        e.target.style.transform = pos.transform + ' scale(1.05)';
                        e.target.style.zIndex = 5;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isDragging && !isSelected) {
                        e.target.style.transform = pos.transform;
                        e.target.style.zIndex = 1;
                      }
                    }}
                    draggable={false}
                  />
                );
              })}
              
              {/* Instructions overlay */}
              <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: '0.9em',
                fontWeight: 500,
                pointerEvents: 'none'
              }}>
                Drag covers to rearrange • Click to select
              </div>
            </div>
            {selected !== null && covers.find(c => c.id === selected) && (
              <div style={{
                background: 'var(--surface)',
                borderRadius: 10,
                padding: '1em',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                textAlign: 'center',
              }}>
                {(() => {
                  const selectedCover = covers.find(c => c.id === selected);
                  if (!selectedCover) return null;
                  
                  return (
                    <>
                      <img
                        src={selectedCover.url}
                        alt={selectedCover.name || 'Album cover'}
                        style={{ width: 100, height: 100, borderRadius: 12, marginBottom: 8 }}
                      />
                      <div style={{ fontWeight: 600 }}>{selectedCover.name}</div>
                      <div style={{ color: 'var(--muted)' }}>{selectedCover.artist}</div>
                      <div style={{ color: 'var(--muted)', fontSize: '0.95em' }}>
                        Track: {selectedCover.track}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </Card>
        </div>
      );
}
