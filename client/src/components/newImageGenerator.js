import React, {useState} from 'react';



function NewImageGenerator({story, storyId}){
    
    const [image64, setImage64]= useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [imageGenerated, setImageGenerated] = useState(false)
    const [savedImage, setSavedImage] = useState(false)

    async function handleSubmit(e){
        e.preventDefault()

        setGenerating(true)
        console.log("generate image")
        try {
            const response = await fetch('/imageGenerator',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({imagePrompt: story})
            })
            if(!response.ok){
                throw new Error(`Failed to generate new image: ${response.status}`)
            }
            const data = await response.json()
            setImage64(data.image64)
            setImageGenerated(true)
        } catch (error) {
            setError(error.message)
        } finally {
            setGenerating(false)
        }
    }
       
    async function handleSaveNewImage() {
        try {
            const response = await fetch(`/saveStories/${storyId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({imageFromNewStory: image64})
            })
            if(!response.ok){
                throw new Error(`Failed to generate new image: ${response.status}`)
            }
            setSavedImage(true)
        } catch (error){
            setError(error.message)
        }
    }
    
    return (
        <div className=' bg-gray-300/70'>
            <div className='p-4 content-evenly border-2 border-black/30'>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-center font-bold mb-2'>
                        <button type='submit' className='border-2 border-black p-1'>{imageGenerated ? 'Regenerate Image' : 'Generate Image'}</button>
                        {imageGenerated ? <button type='button' className='border-2 border-black ml-4 p-1' onClick={handleSaveNewImage}>Save Image</button> : null}
                    </div>
                </form>
                <div className='flex justify-center mb-2'>
                    {generating ? <em>Please hold, generating image...</em> : null }
                    <em>Please hold, generating image...</em>
                    {error ? <p style={{color:'red'}}>{error}</p> : null}
                </div>
                <div className='flex justify-center'>
                    {image64 ? (
                        <img src={`data:image/png;base64, ${image64}`} alt={story}/>
                    ): null}
                </div>
            </div>
        </div>
    )

}


export default NewImageGenerator;
