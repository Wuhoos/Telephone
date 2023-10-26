import React, {useState} from 'react';


function StoryGenerator() {
    const [prompt, setPrompt] = useState('')
    const [story, setStory] = useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    // const [storyType, setStoryType] = useState('short story')
    // const [isStorySaved, setIsStorySaved] = useState(false)
    // const [showImagePrompt, setShowImagePrompt] = useState('')
    // const [imageBase, setImageBase] = useState('')

    async function handleSubmit(e){
        e.preventDefault();

        if (prompt.length < 15){
            setError('Prompt must be 15 chatacters long')
            return;
        }
        setGenerating(true);

        try {
            const response = await fetch('http://127.0.0.1:5555/storyGenerator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({prompt})
            });

             if (!response.ok){
                throw new Error(`Filed to generate: ${response.status}`)
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


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Write a short idea for a story</label>
                <textarea type='text' onChange={handlePromptSubmit} style={{width: '400px', height: '200px'}} />
                <div style={{display: 'flex'}}>
                    <button type='submit'>{isStoryGenerated ? 'Regenrate' : 'Generates'}</button>
                </div>
            </form>
            {generating ? <em>Generating...</em> : <pre>This is a story about..... {story}</pre>}
        </div>
    )
}

export default StoryGenerator;