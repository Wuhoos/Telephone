import React, {useState} from 'react';

function ImageToStoryGenerator({image64}) {

    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    const [story, setStory] = useState('')
    const [imageToStoryPrompt, setImageToStoryPrompt] = useState('')
    const [error, setError] = useState('')

    async function handleImageToStorySubmit(e) {
        e.preventDefault()

        setGenerating(true)

        try{
            const response = await fetch('/imageToStoryGenerator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image64: image64})
            })
            console.log(imageToStoryPrompt)
            console.log(`this is the response: ${response}`)

            if (!response.ok){
                throw new Error(`Failed to generate image: ${response.status}`)
            }

            const data = await response.json()
            setImageToStoryPrompt(data.imageToStoryPrompt)
            setStory(data.story)
            setIsStoryGenerated(true)
            console.log(data.image64)
            console.log(data.story)

        }   catch (error) {
            setError(error.message)

        }   finally {
            setGenerating(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleImageToStorySubmit}>
                <div>
                    <button type='submit'>{isStoryGenerated ? 'Regenerate' : 'Generate Story'}</button>
                </div>
            </form>
            <h1>Based on this image....</h1>
            {generating ? <em>Generating...</em> : <pre>{story}</pre> }
            {error ? <p style={{color:'red'}}>{error}</p> : null}
        </div>
    )
}

export default ImageToStoryGenerator;