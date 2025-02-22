import React from 'react'
import Select from 'react-select'

interface Option {
    value: string | number
    label: string
}

interface MultiSelectProps {
    options: Option[]
    value: Option[]
    onChange: (selectedOptions: Option[]) => void
    placeholder?: string
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select multiple options',
}) => {
    return (
        <Select
            options={options}
            isMulti
            value={value}
            onChange={(selectedOptions) =>
                onChange(selectedOptions as Option[])
            }
            placeholder={placeholder}
            className="text-gray-900"
            classNamePrefix="react-select"
        />
    )
}

export default MultiSelect
