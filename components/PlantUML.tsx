'use client'

interface PlantUMLProps {
  code: string
}

export default function PlantUML({ code }: PlantUMLProps) {
  // Encode PlantUML code for the public server
  // Using the text format which is simpler and more reliable
  const encodeToURL = (plantUMLCode: string): string => {
    // Add @startuml and @enduml if not present
    let formattedCode = plantUMLCode.trim()
    if (!formattedCode.startsWith('@startuml')) {
      formattedCode = '@startuml\n' + formattedCode
    }
    if (!formattedCode.endsWith('@enduml')) {
      formattedCode = formattedCode + '\n@enduml'
    }

    // Use the text encoding endpoint of PlantUML server
    // This is more reliable than custom encoding
    const encoded = encodeURIComponent(formattedCode)
    return `https://www.plantuml.com/plantuml/svg/~1${encoded}`
  }

  const imageUrl = encodeToURL(code)

  return (
    <div className="plantuml-diagram my-4 flex justify-center">
      <img src={imageUrl} alt="PlantUML Diagram" className="max-w-full h-auto" />
    </div>
  )
}
