import React, {useState, useEffect} from 'react';
import StoryItem from './story';

function StoryList({user}) {

    const [stories, setStories] = useState('')
    const [search, setSearch] = useState('')
    
    useEffect(() => {
        fetch(`/users/${user.id}/stories`)
        .then((res) => res.json())
        .then((data) => {
            setStories(data)
        }).catch(error => {
            console.log(error);
        })
    },[user.id])
    
    function handleDelete(id) {
        setStories((currentStories)=> currentStories.map((story) => story.id !== id))
    }

    return (
        <div>
            {[...stories].filter((story)=>{
                return (
                    story.theStory &&
                    story.imageBase64 &&
                    story.storyFromImage
                )
            })
            .reverse()
            .map((story)=> (
                <div key={story.id} className='justify-items-center'>
                    <StoryItem story={story} onDelete={handleDelete}/>
                </div>
            ))
            }
        </div>
    )
}

export default StoryList;