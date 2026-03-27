import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCompetition } from 'api/competitions'
import { useToastStore } from '../../api/stores/useToastStore'

export const useCompetitionParticipants = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToastStore()

  const [competition, setCompetition] = useState<any>(null)
  const [participants, setParticipants] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingParticipant, setEditingParticipant] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    const fetchCompetition = async () => {
      try {
        const response = await getCompetition(Number(id))
        const data = response?.data
        setCompetition(data || null)
        setParticipants(data.teams || [])
      } catch (err: any) {
        showToast(err || 'Failed to load competition.', false)
        navigate('/competitions')
      }
    }
    fetchCompetition()
  }, [id, navigate, showToast])

  const handleEditParticipant = (index: number) => {
    setEditingId(index)
    setEditingParticipant({ ...participants[index] })
  }

  const handleCancel = (resetNew?: () => void) => {
    setIsAdding(false)
    setEditingId(null)
    setEditingParticipant(null)
    resetNew?.()
  }

  const handleBackClick = (resetNew?: () => void) => {
    setIsAdding(false)
    setEditingId(null)
    setEditingParticipant(null)
    resetNew?.()
    navigate(`/competition/${id}`)
  }

  return {
    id,
    competition,
    participants,
    setParticipants,
    isAdding,
    setIsAdding,
    editingId,
    setEditingId,
    editingParticipant,
    setEditingParticipant,
    handleEditParticipant,
    handleCancel,
    handleBackClick,
    showToast,
  }
}
