document.getElementById('audio')
    .addEventListener("change", (event) => {
        const file = event.target.files[0]

        const reader = new FileReader()

        reader.addEventListener('load', (event) => {
            const arrayBuffer = event.target.result

            const audioContext = new (window.AudioContext || window.webkitAudioContext)()

            audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
                visualize(audioBuffer, audioContext)
            })
        })
        reader.readAsArrayBuffer(file)


    })

function visualize(audioBuffer, audioContext) {

    const canvas = document.getElementById("canvas")
    canvas.width = canvas.clientWidth
    canvas.height = 300

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    const frequencyBufferLength = analyser.frequencyBinCount
    const frequencyData = new Uint8Array(frequencyBufferLength)

    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(analyser)
    analyser.connect(audioContext.destination)
    source.start()

    const canvasContext = canvas.getContext("2d")
    
    const barwidth = canvas.width / frequencyBufferLength

    function draw() {
        requestAnimationFrame(draw)
        canvasContext.fillStyle = "#F4c2c2"
        canvasContext.fillRect(0,0,canvas.width,canvas.height)
        
        
        analyser.getByteFrequencyData(frequencyData)
        
        for (let i = 0; i < frequencyBufferLength; i++) {
            canvasContext.fillStyle = `rgba(82,113,255,${frequencyData[i]/255})`
            canvasContext.fillRect(
                i * barwidth,
                canvas.height - frequencyData[i],
                barwidth -1,
                frequencyData[i]
            )
        }
    }

    draw()
}
