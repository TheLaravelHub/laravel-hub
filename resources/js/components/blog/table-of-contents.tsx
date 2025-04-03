import React, { useEffect, useState } from 'react'
import { List, ChevronDown, ChevronUp } from 'lucide-react'

interface TableOfContentsProps {
  content: string
  className?: string
}

interface TocItem {
  id: string
  text: string
  level: number
  children: TocItem[]
}

const TableOfContents = ({ content, className = '' }: TableOfContentsProps) => {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    if (!content) return

    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const matches = [...content.matchAll(headingRegex)]

    if (matches.length === 0) return

    const items: TocItem[] = []
    const stack: TocItem[][] = [[]]

    matches.forEach((match) => {
      const level = match[1].length
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

      const item: TocItem = {
        id,
        text,
        level,
        children: [],
      }

      // Find the appropriate parent level in the stack
      while (stack.length > level) {
        stack.pop()
      }

      // If we need to go deeper, add new levels
      while (stack.length < level) {
        const lastItem = stack[stack.length - 1]?.[stack[stack.length - 1]?.length - 1]
        if (lastItem) {
          stack.push(lastItem.children)
        } else {
          stack.push([])
        }
      }

      // Add the item to the current level
      stack[stack.length - 1].push(item)

      // If this is a top-level heading, add it to the main items array
      if (level === 1) {
        items.push(item)
      }
    })

    setTocItems(items)
  }, [content])

  const handleItemClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Calculate the element's position
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      
      // Store the clicked ID in localStorage to prevent it from being lost
      localStorage.setItem('lastClickedHeadingId', id)
      
      // Update URL with hash without page reload
      window.history.replaceState({}, '', `#${id}`)
      
      // Smoothly scroll to the element
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      
      // On mobile, collapse the TOC after clicking
      if (window.innerWidth < 768) {
        setIsExpanded(false)
      }
      
      // Prevent default anchor behavior
      return false
    }
  }
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const renderTocItems = (items: TocItem[], depth = 0) => {
    if (items.length === 0) return null

    return (
      <ul className={`${depth > 0 ? 'ml-4 mt-2' : ''} space-y-2`}>
        {items.map((item) => (
          <li key={item.id} className="text-gray-700">
            <button
              onClick={() => handleItemClick(item.id)}
              className={`hover:text-primary focus:outline-none ${
                item.level === 1 ? 'font-bold' : ''
              } ${item.level === 2 ? 'font-semibold' : ''} text-left`}
            >
              {item.text}
            </button>
            {item.children.length > 0 && renderTocItems(item.children, depth + 1)}
          </li>
        ))}
      </ul>
    )
  }

  if (tocItems.length === 0) return null

  return (
    <div className={`rounded-lg border border-gray-200 bg-gray-50 p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <List size={18} className="mr-2 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">Table of Contents</h2>
        </div>
        <button 
          onClick={toggleExpanded}
          className="rounded-full p-1 hover:bg-gray-200 focus:outline-none"
          aria-label={isExpanded ? 'Collapse table of contents' : 'Expand table of contents'}
        >
          {isExpanded ? (
            <ChevronUp size={18} className="text-gray-600" />
          ) : (
            <ChevronDown size={18} className="text-gray-600" />
          )}
        </button>
      </div>
      {isExpanded && renderTocItems(tocItems)}
    </div>
  )
}

export default TableOfContents
