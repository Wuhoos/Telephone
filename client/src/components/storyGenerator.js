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
            <div className='text-center border-2 border-black/30 bg-black/30'>
                

                <div className='flex justify-center my-4'>
                    <img src='https://www.davidmeermanscott.com/hs-fs/hubfs/AI%20telephone.jpg?width=450&height=301&name=AI%20telephone.jpg' class='ui medium circular image ml-2'/>
                </div>
                {user ? (<h1 className=' text-center font-bold font-serif text-5xl my-6 underline ui header'>
                        Did Your Hear About ...
                    </h1>) : null}
                
                <form onSubmit={handleStorySubmit} className='text-center'>
                    <div className='my-2'>
                        <label className='ui blue label'>Write a short idea for a movie :</label>
                    </div>
                    <textarea type='text' onChange={handlePromptSubmit} style={{width: '400px', height: '200px'}} className='border-2' />
                    <div className='text-center'>
                        {!isStoryGenerated ?
                            <button type='submit' className='border-2 border-black font-bold mr-3 p-1' class='ui black button '>
                                Generate
                            </button> : null
                        }
                    </div>
                    <div className='mt-10'>
                        <div className='ui segment'>

                            {isStoryGenerated ? (<h1 className='my-2 ui header black header'>
                                <img src='https://assets-global.website-files.com/627a5f477d5ec9079c88f0e2/63a572326ccbdb4afe5caeb8_ai-writing-assistant-image.jpg' className='ui circular image ml-2'/>
                                This is about..... 
                                </h1>) : null}
                        </div>

                        <div className='flex justify-center p-6 m-5 ui fluid container'>
                            {generating ? <em>Generating...</em> : <p className=' border-black  p-1 text-2xl'>{story}</p>}
                            <div className='ml-2 '>
                                {isStoryGenerated ? <button  type='submit' className='border-2 border-black font-bold mr-3 p-1' class='ui black button '> Regenerate</button> : null}
                                {isStoryGenerated ? (
                                    <button type='button' onClick={handleSave} className='border-2 -4 border-black font-bold p-1 ui blue button'>
                                    Save Story
                                    </button>) : null}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                {isStoryGenerated ?  <ImageGenerator storyId={storyID} story={story} setImageBase64={setImageBase64}/> : null}
                {/* <ImageGenerator storyId={storyID} story={story} setImageBase64={setImageBase64}/> */}
            </div>
        </div>
    )
}

export default StoryGenerator;