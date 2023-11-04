import React, {useState} from 'react';
import ImageGenerator from './imageGenerator';
import { use } from 'bcrypt/promises';


function StoryGenerator({user}) {
    const [prompt, setPrompt] = useState('')
    const [story, setStory] = useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    const [saveStory, setSaveStory] = useState(false)
    const [storyID, setStoryID] = useState(null)
    // const [showImagePrompt, setShowImagePrompt] = useState('')
    const [image64, setImage64] = useState('')

    async function handleStorySubmit(e){
        e.preventDefault();

        if (prompt.length < 15){
            setError('Prompt must be 15 chatacters long')
            return;
        }
        setGenerating(true);

        try {
            const response = await fetch('/storyGenerator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt})
            });

             if (!response.ok){
                throw new Error(`Failed to generate: ${response.status}`)
            }
            const data = await response.json();
            setStory(data.content)
            setIsStoryGenerated(true)
            // setIsStorySaved(fasle)
        } catch (error) {
            setError(error.message);
        } finally {
            setGenerating(false);
        }
    }

    function handlePromptSubmit(e){
        setPrompt(e.target.value)
        setError('')
    }

    function handleImagePrompt(baseImage){
        setImage64(baseImage)
    }

    async function handleSave() {
        try {
            const response = await fetch('/saveStories', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    storyPrompt: prompt,
                    theStory: story,
                    user_id: user.id
                })
            })
            if (!response.ok) {
                throw new Error(`Failed to save: ${response.status}`)
            }

            const data = await response.json()
            setStoryID(data.id)
            setSaveStory(true)
        } catch (error) {
            setError(error.message)
        }
    }


    return (
        <div className='text-center'>
            <form onSubmit={handleStorySubmit} className='text-center'>
                <div>
                    <label>Write a short idea for a story</label>
                </div>
                <textarea type='text' onChange={handlePromptSubmit} style={{width: '400px', height: '200px'}} className='border-2' />
                <div className='text-center'>
                    <button type='submit' className='border-2 border-black font-bold'>{isStoryGenerated ? 'Regenrate' : 'Generates'} </button>
                </div>
            </form>
            <div className='mt-20'>
                {isStoryGenerated && <button type='button' onClick={handleSave} className='border-2 mt-4 border-black font-bold'>Save Story</button>}
                <h1 className='my-2'>This is a story about..... </h1>
                <div className='flex items-center box-border h-20 w-100 p-6 mt-5'>
                    {generating ? <em>Generating...</em> : <p className=' border-black border-2'>{story}</p>}
                </div>
            </div>
            <div className='place-content-center'>
                <ImageGenerator handleImagePrompt={handleImagePrompt} storyId={storyID} story={story}/>
            </div>
        </div>
    )
}

export default StoryGenerator;