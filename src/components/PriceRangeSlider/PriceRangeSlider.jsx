import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    width: '100%',
    height: '150px',
    position: 'relative',
    marginTop:"10px",
    
  },
  line: {
    position: 'absolute',
    bottom: '40px',
    left: '0',
    right: '0',
    height: '2px',
    backgroundColor: '#E074DD'
  },
  marker: {
    position: 'absolute',
    top: '20px',
    width: '30px',
    height: '30px',
    backgroundColor: '#E074DD',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
    touchAction: 'none',
    userSelect: 'none',
    
  },
  markerText: {
    position: 'absolute',
    top: '-25px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  },
  currentPrice: {
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 16px',
    backgroundColor: '#D8B4FE',
    color: 'white',
    borderRadius: '8px',
    fontSize: '16px'
  },
  ticks: {
    position: 'absolute',
    bottom: '10px',
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    color: '#333',
    fontSize: '16px'
  }
};

const PriceRangeSlider = ({updateTokenA,updateTokenB,price}) => {
  const [leftPos, setLeftPos] = useState(20);
  const [rightPos, setRightPos] = useState(80);
  
  const calculateNewPosition = (clientX, containerRect) => {
    const containerWidth = containerRect.width;
    return ((clientX - containerRect.left) / containerWidth) * 100;
  };

  const handleStart = (e, isLeft) => {
    e.preventDefault();
    const slider = e.target;
    const container = slider.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    const handleMove = (moveEvent) => {
      const clientX = moveEvent.type.includes('mouse') 
        ? moveEvent.clientX 
        : moveEvent.touches[0].clientX;
      
      const newPos = calculateNewPosition(clientX, containerRect);
      
      if (isLeft) {
        if (newPos >= 0 && newPos <= rightPos-5) {
          setLeftPos(newPos);

        }
      } else {
        if (newPos <= 95 && newPos >= leftPos+5) {
          setRightPos(newPos);
        }
      }
    };
    
    
    const handleEnd = () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
    
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
  };

  const getLeftValue =()=>{

    return leftPos/47.5<1?`-${(100-leftPos*100/47.5).toFixed(2)}`:`${(leftPos*100/47.5-100).toFixed(2)}`

  }

  const getRightValue =()=>{

    return rightPos/47.5>1?`${(rightPos*100/47.5-100).toFixed(2)}`:`-${(100-rightPos*100/47.5).toFixed(2)}`

  }

  useEffect(()=>{
      let percent = getLeftValue();
      price += price*percent/100;
      updateTokenA(price);

  },[leftPos])
  
  useEffect(()=>{
    let percent = getRightValue();
    price += price*percent/100;
    updateTokenB(price);

},[rightPos])

  return (
    <div style={styles.container}>      
      <div style={styles.line} />
      
      <div 
        style={{
          ...styles.marker,
          left: `${leftPos}%`
        }}
        onMouseDown={(e) => handleStart(e, true)}
        onTouchStart={(e) => handleStart(e, true)}
      >
        ||
        <span style={styles.markerText} 
        >{getLeftValue()}%</span>
        <div style={{position:"absolute",height:"60px", width:"5px", borderLeft:"0px solid #E074DD", background:"#E074DD",top:"30px"}}></div>
      </div>
      
      <div 
        style={{
          ...styles.marker,
          left: `${rightPos}%`
        }}
        onMouseDown={(e) => handleStart(e, false)}
        onTouchStart={(e) => handleStart(e, false)}
      >
        ||
        <span style={styles.markerText}>{getRightValue()}%</span>
        <div style={{position:"absolute",height:"60px", width:"5px", borderLeft:"0px solid #E074DD", background:"#E074DD",top:"30px"}}></div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;