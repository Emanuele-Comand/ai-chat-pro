"use client"

import { Button } from "./button"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay scuro */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className=" bg-red-500 hover-bg-700 border-red-500 hover:bg-red-600 hover:border-red-600 hover:text-white"
          >
            Annulla
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-white text-black hover:bg-black hover:text-white"
          >
            Conferma
          </Button>
        </div>
      </div>
    </div>
  )
} 