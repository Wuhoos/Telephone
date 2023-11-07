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
        <div>
            <div className=' mt-5 bg-gray-300/20'>
                <div className='flex justify-center mb-5 content-evenly'>
                    {image64 ? (
                        <img src={`data:image/png;base64, ${image64}`} alt={story}/>
                    ): null}
                <form onSubmit={handleSubmit}>
                    <div  className='font-bold ml-4'>
                        <button type='submit' className='border-2 border-black ml-4 mb-4 font-bold p-1'>{imageGenerated ? 'Regenerate Image' : 'Generate Image'}</button>

                        {imageGenerated ? <button type='button' className='border-2 border-black ml-4 font-bold p-1' onClick={handleSaveNewImage}>Save Image</button> : null}
                    </div>
                </form>
                </div>
            </div>
        </div>
    )

}


export default NewImageGenerator;
