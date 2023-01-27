import axios from 'axios';
import { MDBRow,MDBCol,MDBContainer,MDBTypography } from 'mdb-react-ui-kit';
import React,{useState,useEffect} from 'react';
import { toast } from 'react-toastify';
import Blogs from '../components/Blogs'; 
import Category from '../components/Category';
import LatestBlog from '../components/LatestBlog';
import Search  from '../components/Search';

const Home = () => {
  const [data,setData] = useState([]);
  const [latestBlog,setlatestBlog] = useState([]);
  const [searchValue, setSearchValue]=useState("");
  const options = ["Travel","Food" , "Sports","Fashion","Tech","Fitness"];
  useEffect(() => {
    loadBlogsData();
    fetchLatestBlog();
  },[])
  const loadBlogsData = async()=>
  {
    const response = await axios.get("http://localhost:3333/blogs");
    if(response.status === 200)
    {
      setData(response.data)
    }
    else{
      toast.error("something went wrong");
    }
  }
  const fetchLatestBlog = async () =>
  {
    const totalBlog= await axios.get("http://localhost:3333/blogs");
    const start = totalBlog.data.length -2;
    const end = totalBlog.data.length;
    const response= await axios.get(`http://localhost:3333/blogs?_start=${start}&_end=${end}`);
    if(response.status === 200)
    {
      setlatestBlog(response.data)
    }
    else{
      toast.error("something went wrong");
    }
  }
  console.log("data",data);
  const handleDelete= async (id) => {
    if(window.confirm("Are u sure you want to delete blog"))
    {
      const response=await axios.delete(`http://localhost:3333/blogs/${id}`);
      if(response.status===200)
      {
        toast.success("Blog deleted");
        loadBlogsData();
      }
      else{
        toast.error("something went wrong");
      }
    }
  };
  const excerpt=(str) =>
  {
    if(str.length>50)
    {
      str=str.substring(0,50)+"...";
    }
    return str;
  };
  const onInputChange= (e) => {
    if(!e.target.value) {
      loadBlogsData();
    }
    setSearchValue(e.target.value);
  }
 
  const handleSearch = async(e) =>
  {
    e.preventDefault();
    const response = await axios.get(`http://localhost:3333/blogs?q=${searchValue}`)
    if(response.status===200){
      setData(response.data)
    }
    else{
      toast.error("something went wrong")
    }
  }
  const handleCategory= async (category) =>
  {
    const response =await axios.get(`http://localhost:3333/blogs?category=${category}`);
    if(response.status===200)
    {
      setData(response.data);
    }
    else{
      toast.error("something went wrong");
    }
  }
  return (
    <>
    <Search  searchValue={searchValue} onInputChange={onInputChange} handleSearch={handleSearch}
    />
    <MDBRow>
      {
        data.length === 0 && (
          <MDBTypography className="text-center mb-0" tag="h2">
            No BLog found
          </MDBTypography>
        )
      }
      <MDBCol>
        <MDBContainer>
          <MDBRow>
            {data && data.map((item,index) => (
              <Blogs 
              key={index}
              {...item}
              excerpt={excerpt}
              handleDelete={handleDelete}
              />
            ))}
          </MDBRow>
        </MDBContainer>
      </MDBCol>
      <MDBCol size="3">
        <h4 className="text-start">Latest Blog</h4>
        {latestBlog && latestBlog.map((item,index) =>
        (
          <LatestBlog key={index} {...item}/>
        ))}
        <Category options={options} handleCategory={handleCategory}/>
      </MDBCol>
    </MDBRow>
    </>
  )
}

export default Home