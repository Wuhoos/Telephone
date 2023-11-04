import React, {useState} from 'react';
import ImageToStoryGenerator from './imageToStoryGenerator';

function ImageGenerator({handleImagePrompt, storyId, story}){

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
            console.log(imagePrompt)
            console.log(`this is the response : ${response}`)

            if (!response.ok){
                throw new Error(`Failed to generate image: ${response.status}`)
            }

            const data = await response.json()
            setImage64(data.image64)
            handleImagePrompt(data.image64)
            setIsImageGenerated(true)
            console.log(data.image64)

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
        <div className='place-content-center mt-5'>
            <form onSubmit={handleImageSubmit}>
                <div className='font-bold'>
                    <button type='submit' className='border-2 border-black mt-5 '>{isImageGenerated ? 'Regenerate' : 'Generate Image'}</button>
                    {isImageGenerated && <button type="button" onClick={handleSaveImage} className='border-2 border-black ml-3'>Save Image</button>}
                </div>
            </form>
            {generating ? <em>Please hold, generating image...</em> : null }
            {error ? <p style={{color:'red'}}>{error}</p> : null}
            <div className='flex justify-center mt-5'>
                {image64 ? (
                    <div>
                        <img src={`data:image/png;base64,${image64}`} alt={imagePrompt} className='mt-5'/>
                    </div>
                ) : null}
            </div>
            <ImageToStoryGenerator image64={image64} storyId={storyId}/>
        </div>
    )
}

export default ImageGenerator