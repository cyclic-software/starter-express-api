import React from 'react'
import "./Bubbles.css"




function Bubbles() {
  const noOfBubbles=80;
  const speeds=[];
  for(let i=0;i<noOfBubbles;i++){
    speeds.push(`${Math.ceil(5+25*Math.random())}s`)
  }
  return (
    <div className="bubbles">
      
      {
        speeds.map((speed)=>{
          return (<span key={`${speed+Math.random()*1000}`} style={{
            animationDuration:speed
          }}></span>)
        })
      }
    </div>
  )
}

export default Bubbles