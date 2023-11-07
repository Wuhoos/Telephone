import React, {useState, useEffect} from 'react';
import StoryItem from './story';

function StoryList({user}) {

    const [stories, setStories] = useState('')
    
    
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

        <div className=' bg-gray-300/70'>
            {user ? <h1 className=' text-center font-bold font-serif text-5xl mb-4 underline'>Your Stories</h1> : null}
            {[...stories].filter((story)=>{
                return (
                    story.theStory &&
                    story.imageBase64 &&
                    story.storyFromImage &&
                    story.imageFromNewStory
                )
            })
            .reverse()
            .map((story)=> (
                <div key={story.id} className='justify-items-center'>
                    <StoryItem story={story} onDelete={handleDelete}/>
                </div>))
            }
        </div>
    )
}

export default StoryList;