import React from 'react'
import Select from 'react-select'
import { SelectOption } from '@/types'

interface SingleSelectProps {
    options: SelectOption[]
    value: SelectOption | null
    onChange: (selectedOption: SelectOption | null) => void
    placeholder?: string
}

const SingleSelect: React.FC<SingleSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select an option',
}) => {
    return (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="text-gray-900"
            classNamePrefix="react-select"
        />
    )
}

export default SingleSelect
