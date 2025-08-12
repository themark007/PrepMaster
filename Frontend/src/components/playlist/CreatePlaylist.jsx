import React from "react";
import {useNavigate} from "react-router-dom";

function CreatePlaylist(){
    const navigate = useNavigate();
    
    const handleCreatePlaylist = () => {
        // Logic to create a playlist
        navigate('/playlist'); 
    };
    
    return (
        <div>
        <h1>Create Playlist</h1>
        <button onClick={handleCreatePlaylist}>Create</button>
        </div>
    );
}
export default CreatePlaylist;