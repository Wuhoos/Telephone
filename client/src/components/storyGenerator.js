import React, {useState} from 'react';
import ImageGenerator from './imageGenerator';
import { use } from 'bcrypt/promises';
import ImageToStoryGenerator from './imageToStoryGenerator';


function StoryGenerator({user}) {
    const [prompt, setPrompt] = useState('')
    const [story, setStory] = useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    const [saveStory, setSaveStory] = useState(false)
    const [storyID, setStoryID] = useState(null)
    const [imageBase64, setImageBase64] = useState('')
    const [showGenerator, setShowGenerator] = useState(true)



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
        <div className='flex flex-col justify-evenly'>
            <div className='text-center bg-gray-300/70'>
                {user ? <h1 className=' text-center font-bold font-serif text-5xl mb-8 underline'>Tell Me A Story</h1> : null}
                <form onSubmit={handleStorySubmit} className='text-center'>
                    <div>
                        <label>Write a short idea for a story:</label>
                    </div>
                    <textarea type='text' onChange={handlePromptSubmit} style={{width: '400px', height: '200px'}} className='border-2' />
                    <div className='text-center'>
                        <button type='submit' className='border-2 border-black font-bold mr-3 p-1' >
                            {isStoryGenerated ? 'Regenerate' : 'Generate'} 
                        </button>
                    </div>
                </form>
                <div className='mt-10'>
                    {isStoryGenerated ? <h1 className='my-2'>This is a story about..... </h1> : null}

                    <div className='flex justify-center p-6 mt-5'>
                        {generating ? <em>Generating...</em> : <p className=' border-black border-2 font-bold p-1'>{story}</p>}
                        <div className='ml-2'>
                            {isStoryGenerated ? (
                                <button type='button' onClick={handleSave} className='border-2 -4 border-black font-bold p-1'>
                                Save Story
                            </button>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {/* {isStoryGenerated ?  <ImageGenerator storyId={storyID} story={story} setImageBase64={setImageBase64}/> : null} */}
                <ImageGenerator storyId={storyID} story={story} setImageBase64={setImageBase64}/>
            </div>
        </div>
    )
}

export default StoryGenerator;