import React, {useState} from 'react';

function ImageGenerator({handleImagePrompt}){

    const [imagePrompt, setImagePrompt] = useState('')
    const [image64, setImage64] = useState('')
    const [error, setError] = useState('')
    const [generating, setGenerating] = useState(false)
    const [isImageGenerated, setIsImageGenerated] = useState(false)

    async function handleImageSubmit(e) {
        e.preventDefault()

        setGenerating(true)

        try {
            const response = await fetch('http://127.0.0.1:5555/imageGenerator', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({imagePrompt: imagePrompt})
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

    return (
        <div>
            <form onSubmit={handleImageSubmit}>
                <textarea type='text' value={imagePrompt} onChange={e => setImagePrompt(e.target.value)} style={{width: '250px'}}/>
                <div style={{display:'flex'}} >
                    <button type='submit'>{isImageGenerated ? 'Regenerate' : 'Generate Image'}</button>
                    
                </div>
            </form>
            {generating ? <em>Please hold, generating image...</em> : null }
            {error ? <p style={{color:'red'}}>{error}</p> : null}
            {image64 ? (
                <div>
                    <img src={`data:image/png;base64,${image64}`} alt={imagePrompt}/>
                </div>
            ) : null}
        </div>
    )
}

export default ImageGenerator