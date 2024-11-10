import { Button } from "./ui/button"

interface UseCase {
  icon: React.ReactNode
  title: string
  description: string
}

interface WelcomeSectionProps {
  title: string
  description: string
  useCases: UseCase[]
  onUseCaseClick: (title: string) => void
}

export function WelcomeSection({ title, description, useCases, onUseCaseClick }: WelcomeSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4">{title}</h1>
      <p className="text-xl text-gray-300 mb-8">{description}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <Button
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-left transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 h-auto flex flex-col items-start w-full"
            onClick={() => onUseCaseClick(useCase.title)}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              {useCase.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{useCase.title}</h3>
            <p className="text-gray-400 max-w-full break-words">{useCase.description}</p>
          </Button>
        ))}
      </div>
    </div>
  )
}