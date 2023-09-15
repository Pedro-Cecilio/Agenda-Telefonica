function MensagemDeErro({message}){
    return (
        <span className="absolute bottom-5 right-5 py-2 px-4 bg-red-600 rounded-lg text-xl text-center">{message}</span>
    )
}

export default MensagemDeErro