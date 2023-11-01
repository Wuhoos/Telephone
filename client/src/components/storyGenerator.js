import React, {useState} from 'react';
import ImageGenerator from './imageGenerator';


function StoryGenerator({user}) {
    const [prompt, setPrompt] = useState('')
    const [story, setStory] = useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    // const [storyType, setStoryType] = useState('short story')
    // const [isStorySaved, setIsStorySaved] = useState(false)
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


    return (
        <div>
            <form onSubmit={handleStorySubmit}>
                <label>Write a short idea for a story</label>
                <textarea type='text' onChange={handlePromptSubmit} style={{width: '400px', height: '200px'}} />
                <div style={{display: 'flex'}}>
                    <button type='submit'>{isStoryGenerated ? 'Regenrate' : 'Generates'}</button>
                    
                </div>
            </form>
            <h1>This is a story about..... </h1>
            {generating ? <em>Generating...</em> : <pre>{story}</pre>}
            <ImageGenerator handleImagePrompt={handleImagePrompt}/>
        </div>
    )
}

export default StoryGenerator;