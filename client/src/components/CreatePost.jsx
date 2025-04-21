import React, { useState,useEffect } from "react";
import {useNavigate} from "react-router-dom"
import M from "materialize-css";

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        if(url){

            fetch(`${import.meta.env.VITE_API_URL}/createpost`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")       //getting jwt as authorization from local storage
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.error) {
                    M.toast({html: data.error});
                } else {
                    M.toast({html: "Post Created"});
                    navigate('/'); // Example navigation, adjust as needed
                }
            })
            .catch(err => {
                console.log(err);
            });
        }
    },[body, navigate, title, url])
    
    const postDetails = () => {
        const formData = new FormData();
        formData.append("file", image);  // Assuming 'image' is already the File object from input
        formData.append("upload_preset", "insta-Clone");
        formData.append("cloud_name", "raman-scloud");
    
        // Upload image to Cloudinary
        fetch("https://api.cloudinary.com/v1_1/raman-scloud/image/upload", {
            method: "post",
            body: formData,
        })
        .then(res => res.json())
        .then(data => {
            // Handle Cloudinary response here
            console.log(data);
            // Assuming 'setUrl' is a state setter function to store the URL returned by Cloudinary
            setUrl(data.url); // Make sure 'setUrl' is defined and correctly handles the state update
        })
        .catch(err => {
            console.log(err);
        });
    
        // Example fetch request to "/createpost" (assuming 'password' and 'email' are defined somewhere)
        
    };
  

    return (
        <>
            <div
                className="card input-filled"
                style={{
                    margin: "30px auto",
                    maxWidth: "500px",
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Body"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                   

                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>postDetails()}
                    >
                        Submit Post
                    </button>
                
        </div>
        </>
    )
};

export default CreatePost