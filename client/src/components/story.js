import React, { useState, useEffect } from 'react';


function StoryItem({story, onDelete}) {

    const {id, theStory, storyPrompt, imageBase64, storyFromImage, imageFromNewStory} = story

    // const [newStoryPrompt, setNewStoryPrompt] = useState(storyPrompt)
    // const [newTheStory, setNewTheStory] = useState(theStory)
    // const [newImageBase, setNewImageBase] = useState(imageBase64)
    // const [newStoryFromImage, setNewStoryFromImage] = useState(storyFromImage)

    function handleDelete() {
        fetch(`/stories/${id}`, {
            method: 'DELETE',
        }).then (res => {
            if(res.ok) {
                onDelete(id)
            }
        })
    }



    return (
        <div className='flex items-center space-y-2 '>
            <div className='flex items-center flex-col border-2 ml-5 mt-2 p-15 border-black'>
                <div className='mt-2'>
                    <h2>PROMPT: {storyPrompt}</h2>
                    
                </div>
                <div className='mx-2'>
                    <h2 className='underline'>
                    STORY:
                    </h2>
                    <p>{theStory}</p>
                </div>
                <div className='my-3'>
                    <p>
                        <img src={`data:image/png;base64,${imageBase64}`} alt={`${storyPrompt}`}/>
                    </p>
                </div>
                <div className='mx-2'>
                    <h2 className='underline'>
                        STORY FROM THE IMAGE: 
                    </h2>
                    <p> {storyFromImage}</p>
                </div>
                <div className='my-3'>
                    <img src={`data:image/png;base64,${imageFromNewStory}`} alt={`${storyFromImage}`} />
                </div>
            </div>
            <div>
                <button onClick={handleDelete} className='border-2 text-white bg-black border-black ml-2 mr-2'>DELETE</button>
            </div>
        </div>
    )

}

export default StoryItem;