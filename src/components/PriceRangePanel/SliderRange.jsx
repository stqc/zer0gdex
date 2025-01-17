import React, { useEffect } from "react";
import "./SliderRange.css";
import SliderInput from "./SliderInput";
import { useState } from "react";
import { useSelector } from "react-redux";


const SliderRange = ({setMinPrice, setMaxPrice }) => {
    const [minPrice, setMinPrice_] = useState(0);
    const [maxPrice, setMaxPrice_] = useState(0);
    const {lowerTick,upperTick} = useSelector(state=>state.liquidityToken)

    useEffect(()=>{

      console.log(lowerTick,upperTick)
      if(lowerTick===null){
        setMinPrice_(0);
      }
      if(upperTick===0){
        setMaxPrice_(0);
      }
    },[lowerTick,upperTick])


  return (
    <>   
    {minPrice>maxPrice && <div className="error">Min price should be less than max price</div>}        
    <div className="slider-range">
      <SliderInput
        label="Min"
        value={minPrice}
        onChange={(e) => {
            setMinPrice_(e);
            setMinPrice(e)}}
        onIncrement={() =>{
            setMinPrice_(minPrice + 1);
            setMinPrice(minPrice + 1)}}
        onDecrement={() =>{ 
            setMinPrice_(minPrice - 1);
            setMinPrice(minPrice - 1)}}
      />
      <SliderInput
        label="Max"
        value={maxPrice}
        onChange={(value) =>{ 
            setMaxPrice_(value);
            setMaxPrice(value)}}
        onIncrement={() =>{
            setMaxPrice_(maxPrice + 1);
            setMaxPrice(maxPrice + 1)}}
        onDecrement={(e) => {
            setMaxPrice_(maxPrice - 1);
            setMaxPrice(maxPrice - 1)}}
      />
    </div>
    </>
  );
};

export default SliderRange;
