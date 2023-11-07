import React, {useState} from 'react';
import NewImageGenerator from './newImageGenerator';

function ImageToStoryGenerator({image64, storyId}) {

    const [generating, setGenerating] = useState(false)
    const [isStoryGenerated, setIsStoryGenerated] = useState(false)
    const [story, setStory] = useState('')
    const [imageToStoryPrompt, setImageToStoryPrompt] = useState('')
    const [error, setError] = useState('')
    const [isStorySaved, setIsStorySaved] = useState(false)

    async function handleImageToStorySubmit(e) {
        e.preventDefault()
        console.log('somethign')
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
            console.log(data.story)
            setIsStoryGenerated(true)



        }   catch (error) {
            setError(error.message)

        }   finally {
            setGenerating(false)
        }
    }

    async function saveImageToStory() {
        console.log('test')

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
        <div className='mt-2 bg-gray-300/50'>

            {isStoryGenerated ? <h1>Based on this image....</h1> : null}
            <div className='flex justify-center p-6 '>
                <div className=' my-5 font-bold'>
                    <form onSubmit={handleImageToStorySubmit}>
                            <button type='submit' className='border-2 border-black mb-4 ml-4 p-1'>
                                {isStoryGenerated ? 'Regenerate Story' : 'Generate Story'}
                            </button>
                    </form>
                    <div className='flex justify-between'>
                        {generating ? <em>Generating...</em> : <p className='text-center border-2 border-black'>{story}</p> }
                        <div>

                            {isStoryGenerated && <button type='button' onClick={saveImageToStory} className='border-2 border-black ml-4 font-bold p-1'> Save Story</button>}
                        </div>
                    </div>
                </div>
            </div>

            {error ? <p style={{color:'red'}}>{error}</p> : null}
           {isStoryGenerated ? <NewImageGenerator story={story} storyId={storyId}/> : null}
        </div>
    )
}

export default ImageToStoryGenerator;