import React, {useState} from 'react';

function ImageToStoryGenerator({image64, storyId}) {

    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    const [story, setStory] = useState('')
    const [imageToStoryPrompt, setImageToStoryPrompt] = useState('')
    const [error, setError] = useState('')
    const [isStorySaved, setIsStorySaved] = useState(false)

    async function handleImageToStorySubmit(e) {
        e.preventDefault()
        // console.log(imageBase64)
        setGenerating(true)

        try{
            const response = await fetch('/imageToStoryGenerator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image64: image64})
            })



            if (!response.ok){
                throw new Error(`Failed to generate image: ${response.status}`)
            }

            const data = await response.json()
            setImageToStoryPrompt(data.imageToStoryPrompt)
            setStory(data.story)
            setIsStoryGenerated(true)



        }   catch (error) {
            setError(error.message)

        }   finally {
            setGenerating(false)
        }
    }

    async function saveImageToStory() {

        try {
            const response= await fetch(`/saveStories/${storyId}`, {
                method: 'PATCH',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({storyFromImage: story})
            })
            if (!response.ok) {
                throw new Error(`Failed to save: ${response.status}`)
            }
            setIsStorySaved(true)
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className='mt-5  bg-gray-300/50'>
            <h1>Based on this image....</h1>
            <div className='flex items-center p-6 mt-5'>
                {generating ? <em>Generating...</em> : <p className='text-center border-2 border-black mt-4'>{story}</p> }
                <div className='my-5 font-bold'>
                    <button type='submit' className='border-2 border-black ml-4'>{isStoryGenerated ? 'Regenerate Story' : 'Generate Story'}</button>
                </div>
                <div>
                    {isStoryGenerated && <button type='button' onClick={saveImageToStory} className='border-2 border-black ml-4 font-bold'> Save Story</button>}

                </div>
            </div>
            <form onSubmit={handleImageToStorySubmit}>
            </form>
            {error ? <p style={{color:'red'}}>{error}</p> : null}
        </div>
    )
}

export default ImageToStoryGenerator;