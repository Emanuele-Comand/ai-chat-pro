import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Film, Play } from "lucide-react"

export function VideoGenerationSection() {
  const [videoPrompt, setVideoPrompt] = useState("")
  const [videoDuration, setVideoDuration] = useState(15)
  const [videoModel, setVideoModel] = useState("standard")

  return (
    <div className="flex flex-col h-full p-6">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">AI Video Generation</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="video-prompt" className="block text-sm font-medium text-gray-300 mb-2">Video Prompt</label>
            <Input
              id="video-prompt"
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="w-full bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
            />
          </div>
          <div>
            <label htmlFor="video-duration" className="block text-sm font-medium text-gray-300 mb-2">Video Duration (seconds)</label>
            <input
              type="range"
              id="video-duration"
              min="5"
              max="60"
              step="5"
              value={videoDuration}
              onChange={(e) => setVideoDuration(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm text-gray-400 mt-1">{videoDuration} seconds</span>
          </div>
          <div>
            <label htmlFor="video-model" className="block text-sm font-medium text-gray-300 mb-2">Video Model</label>
            <select
              id="video-model"
              value={videoModel}
              onChange={(e) => setVideoModel(e.target.value)}
              className="w-full bg-gray-800 border-gray-700 text-gray-100 rounded-md p-2"
            >
              <option value="standard">Standard</option>
              <option value="high-quality">High Quality</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Generate Video
            <Play className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
          <Film className="w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400 text-center">Your generated video will appear here</p>
        </div>
      </div>
    </div>
  )
}