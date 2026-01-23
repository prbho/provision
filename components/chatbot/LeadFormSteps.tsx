interface LeadData {
  name?: string
  email?: string
  phone?: string
}

interface LeadFormStepsProps {
  step: 'name' | 'email' | 'phone'
  data: LeadData
  onChange: (field: keyof LeadData, value: string) => void
  onSubmit: () => void
}

export default function LeadFormSteps({
  step,
  data,
  onChange,
  onSubmit,
}: LeadFormStepsProps) {
  const getLabel = () => {
    switch (step) {
      case 'name':
        return 'What’s your name?'
      case 'email':
        return 'Your email address'
      case 'phone':
        return 'Phone number'
    }
  }

  const getValue = () => {
    switch (step) {
      case 'name':
        return data.name || ''
      case 'email':
        return data.email || ''
      case 'phone':
        return data.phone || ''
    }
  }

  const getField = () => step as keyof LeadData

  return (
    <div className="px-4 py-3 border-t bg-white space-y-3">
      <p className="text-sm font-medium">{getLabel()}</p>

      <input
        value={getValue()}
        onChange={(e) => onChange(getField(), e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
        placeholder="Type here…"
      />

      <button
        onClick={onSubmit}
        className="w-full py-2 text-sm font-medium rounded-lg bg-brand text-white hover:bg-brand"
      >
        {step === 'phone' ? 'Submit' : 'Continue'}
      </button>
    </div>
  )
}
