import React, { useEffect, useState } from 'react';
import { MDBValidation, MDBInput,MDBBtn,MDBTextArea } from 'mdb-react-ui-kit';
import {useNavigate,useParams} from 'react-router-dom';
import axios from "axios";
import {toast} from 'react-toastify';
//ggljsyi8
const initialState ={
  title: "",
  description: "",
  category: "",
  imageUrl: ""
}
const options = ["Travel","Food" , "Sports","Fashion","Tech","Fitness"];

const AddEditBlog = () => {
  const [formValue,setFormValue] = useState(initialState);
  const [categoryErrMsg, setCategoryErrMsg]= useState(null);
  const [editMode, setEditMode]= useState(false);
  
  const  { title, description,category, imageUrl } = formValue;
  const navigate =useNavigate();
  const {id}= useParams();

  useEffect(() =>
  {
    if(id)
    {
      setEditMode(true);
      getSingleBlog(id);
    }
    else{
      setEditMode(false);
      setFormValue({...initialState});
    }
  },[id])
  const getSingleBlog=async (id)=>
  {
    const singleBlog=await axios.get(`http://localhost:3333/blogs/${id}`)
    if(singleBlog.status===200)
    {
      setFormValue({...singleBlog.data});
    }
    else{
      toast.error("something went wrong");
    }
    
  }
  const getDate =()=>
  {
    let today= new Date();
    let dd=String(today.getDate()).padStart(2,"0");
    let mm=String(today.getMonth()+1).padStart(2,"0");
    let yyyy=today.getFullYear();
    today=mm+"/"+dd+"/"+yyyy;
    return today;
  };
  const handleSubmit= async (e) => 
  {
    e.preventDefault();
    if(!category)
    {
      setCategoryErrMsg("please select category");
    }
    const imageValidation=!editMode ? imageUrl:true;
    if(title && description &&  imageUrl && category)
    {
      const currentDate=getDate();
      if(!editMode){
        const updatedBlogData = { ...formValue,date:currentDate};
        const response = await axios.post(" http://localhost:3333/blogs",updatedBlogData);
        if(response.status === 201)
        {
          toast.success("blog created");
        }
        else
        {
          toast.error("something went wrong");
        }
      }else{
        const response = await axios.put(`http://localhost:3333/blogs/${id}`,formValue);
        if(response.status === 200)
        {
          toast.success("blog updated");
        }
        else
        {
          toast.error("something went wrong");
        }
      }
    
     
      setFormValue({title:"",description:"",category:"",imageUrl:""});
      navigate('/');
    }
  };
  const onInputChange =(e) => {
    let {name,value}=e.target;
    setFormValue({...formValue,[name]:value});
  }
  const onUploadImage =(file) => {
    console.log("file",file);
    const formData = new FormData();
    formData.append("file",file);
    formData.append("upload_preset","ggljsyi8");
    axios.post("http://api.cloudinary.com/v1_1/dslhpfxsr/image/upload",formData)
    .then((resp)=>
    {
      toast.info("image uploaded");
      setFormValue({...formValue,imageUrl: resp.data.url})
    })
    .catch((err)=> {
      toast.error("something went wrong");
    });

    

  };
  const onCategoryChange =(e) => {
    setCategoryErrMsg(null);
    setFormValue({...formValue,category:e.target.value});
  }
  return (
    <MDBValidation className="row g-3" style={{marginTop:"100px"} } noValidate onSubmit={handleSubmit}>
      <p className="fs-2 fw-bold">{editMode?"Edit blog":"Add BLog"}</p>
      <div
        style={{
          margin:"auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center"
        }}
        >
        <MDBInput value={title || ""}
        name="title"
        type="text"
        onChange={onInputChange}
        required
        label="title"
        validation="please provide title"
        invalid ="true"/>
        <br/>
        <MDBTextArea
         value={description || ""}
        name="description"
        
        onChange={onInputChange}
        required
        label="description"
        validation="please provide description"
        
        rows={4}
        
        invalid 
        />
        <br/>
        {!editMode &&(
          <>
             <MDBInput 
       
       type="file"
       onChange={(e) => onUploadImage(e.target.files[0])}
       required
       validation="please provide image"
       
       invalid ="true"
       />
       <br/>
          </>
        )}
       
        <select className="categoryDropdown" onChange={onCategoryChange} value={category}>
          <option>Select category</option>
          {options.map((option,index) =>(
            <option value={option || ""} key={index}>{option}</option>
          ))}
        </select>
        {categoryErrMsg && (
          <div className="categoryErrorMsg">{categoryErrMsg}</div>
        )}
        <br />
        <br/>
        
        <MDBBtn type="submit"  style={{marginRight:"10px"}}>{editMode ? "Update":"Add"}</MDBBtn> 
        <MDBBtn color="danger" style={{marginRight:"10px"}} onClick={() => navigate("/")}>Go Back</MDBBtn> 
        

      </div>
     
    </MDBValidation>
  )
}

export default AddEditBlog