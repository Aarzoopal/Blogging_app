import React from 'react';
import {MDBCard,MDBListGroup,MDBListGroupItem} from "mdb-react-ui-kit"

const Category = ({handleCategory,options}) => {
  function changeBackground(e) {
    e.target.style.background='grey'
  }
  function changeColor(e) 
  {
    e.target.style.background='white';
  }
  return (
    <MDBCard style={{width: "18rem",marginTo: "20px",marginTop:"10px"}}>
    <h4>Categories</h4>
    <MDBListGroup flush>
      {options.map((item,index) =>
      (
          <MDBListGroupItem key={index} style={{cursor: "pointer",border: "1px solid"}} onMouseOver={changeBackground} onMouseOut={changeColor} onClick={() => handleCategory(item)}>
               {item}
              </MDBListGroupItem>
      ))}
    </MDBListGroup>
    </MDBCard>
  )
}

export default Category