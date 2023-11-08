import React, {useState} from 'react';
import ImageToStoryGenerator from './imageToStoryGenerator';

function ImageGenerator({ storyId, story, setImageBase64}){

    const [imagePrompt, setImagePrompt] = useState('')
    const [image64, setImage64] = useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [isImageGenerated, setIsImageGenerated] = useState(false)
    const [imageSaved, setimageSaved] = useState(false)

    async function handleImageSubmit(e) {
        e.preventDefault()

        setGenerating(true)

        try {
            const response = await fetch('/imageGenerator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({imagePrompt: story})
            })

            if (!response.ok){
                throw new Error(`Failed to generate image: ${response.status}`)
            }

            const data = await response.json()
            setImage64(data.image64)
            setImageBase64(data.image64)
            setIsImageGenerated(true)


        } catch (error) {
            setError(error.message);
            

        } finally {
            setGenerating(false)
        }
    }

    
    async function handleSaveImage() {
        
        try {
            const response= await fetch(`/saveStories/${storyId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({imageBase64: image64})
            })
            if (!response.ok) {
                throw new Error(`Failed to save image: ${response.status}`)
            }
            setimageSaved(true)
        } catch (error) {
            setError(error.message)
        }
    }
    
    
    return (
        <div >
            <div className=' p-4 mt-2 border-2 border-black/30 bg-gray-300/70'>
                <form onSubmit={handleImageSubmit}>
                    <div className='flex justify-center'>
                        <div className='font-bold mb-2 '>
                            <button type='submit' className='border-2 border-black p-1'>{isImageGenerated ? 'Regenerate Image' : 'Generate Image'}</button>
                            {isImageGenerated && <button type="button" onClick={handleSaveImage} className='border-2 border-black ml-4 p-1'>Save Image</button>}
                        </div>
                    </div>
                    <div className='flex justify-center mb-2'>
                        {generating ? <em>Please hold, generating image...</em> : null }
                        {error ? <p style={{color:'red'}}>{error}</p> : null}
                        <em>Please hold, generating image...</em> 
                    </div>
                    <div className='flex justify-center'>
                        {image64 ? (
                                <img src={`data:image/png;base64,${image64}`} alt={imagePrompt}/>
                        ) :null}
                    </div>
                </form>
                
            </div>
            {/* {isImageGenerated ? <ImageToStoryGenerator image64={image64} storyId={storyId}/> : null} */}
            <ImageToStoryGenerator image64={image64} storyId={storyId}/>
        </div>
    )
}

export default ImageGenerator