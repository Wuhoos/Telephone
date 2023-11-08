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
            setError(null)
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
            setError(null)
            setIsStorySaved(true)
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div >
            <div className='border-2 my-2 border-black/30 bg-black/30 p-4'>
                <div className='flex justify-center ui segment'>
                    <h1 className='font-bold mb-2 ui header black header'>
                        Based on this image....
                        <img src='https://img.freepik.com/premium-photo/robot-reading-book_842454-1061.jpg' className='ui circular image ml-2'/>
                        </h1> 
                </div>
                <div >
                    <form onSubmit={handleImageToStorySubmit}>
                        <div className='flex justify-center'>
                            <div className='font-bold my-2'>
                                <button type='submit' className='border-2 border-black p-1 ui black button'>{isStoryGenerated ? 'Regenerate Story' : 'Generate Story'}</button>
                                {isStoryGenerated && <button type='button' onClick={saveImageToStory} className='border-2 border-black font-bold p-1 ml-4 ui blue button'> Save Story</button>}
                            </div>
                        </div>
                        <div className='flex justify-center my-3 mx-6'>
                            {generating ? <em>Generating...</em> : <p className='text-center border-black p-1 text-2xl'>{story}</p> }
                        </div>
                    </form>
                </div>
            </div>

            {error ? <em style={{color:'red'}}>{error}</em> : null}
           {isStoryGenerated ? <NewImageGenerator story={story} storyId={storyId}/> : null}
           {/* <NewImageGenerator story={story} storyId={storyId}/> */}
        </div>
    )
}

export default ImageToStoryGenerator;