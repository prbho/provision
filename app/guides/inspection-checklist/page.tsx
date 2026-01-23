// app/guides/inspection-checklist/page.tsx
'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Download,
  Droplets,
  FileText,
  Home,
  MapPin,
  Printer,
  Search,
  Shield,
  Zap,
} from 'lucide-react'

export default function PropertyInspectionChecklist() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [completedItems, setCompletedItems] = useState<number[]>([])
  const [inspectionType, setInspectionType] = useState<
    'residential' | 'commercial' | 'land'
  >('residential')
  const checklistRef = useRef<HTMLDivElement>(null)

  const checklistCategories = [
    {
      id: 1,
      title: 'Structural Elements',
      description: 'Check foundation, walls, roof, and structural integrity',
      items: [
        'Foundation cracks or settlement',
        'Wall cracks (horizontal/vertical)',
        'Roof condition and leaks',
        'Ceiling stains or sagging',
        'Floor levelness and integrity',
        'Doors and windows operation',
      ],
      icon: Building,
    },
    {
      id: 2,
      title: 'Electrical Systems',
      description: 'Inspect wiring, panels, outlets, and electrical safety',
      items: [
        'Electrical panel condition',
        'GFCI outlets in wet areas',
        'Proper grounding system',
        'Lighting fixtures operation',
        'Switch functionality',
        'Visible wiring condition',
      ],
      icon: Zap,
    },
    {
      id: 3,
      title: 'Plumbing Systems',
      description: 'Test water pressure, leaks, drainage, and fixtures',
      items: [
        'Water pressure test',
        'Leaks under sinks and toilets',
        'Hot water heater condition',
        'Drainage speed and clogs',
        'Water quality test',
        'Sump pump operation',
      ],
      icon: Droplets,
    },
    {
      id: 4,
      title: 'Exterior & Grounds',
      description:
        'Examine drainage, grading, boundaries, and exterior features',
      items: [
        'Drainage away from foundation',
        'Grading and soil condition',
        'Fence and gate condition',
        'Driveway and walkway condition',
        'Landscaping and tree proximity',
        'Boundary markers verification',
      ],
      icon: MapPin,
    },
  ]

  const redFlags = [
    'Major foundation cracks (>1/4 inch)',
    'Active water leaks in ceiling/walls',
    'Knob-and-tube wiring present',
    'Asbestos or lead paint (pre-1980s)',
    'Poor drainage toward foundation',
    'Mold smell or visible growth',
  ]

  const tools = [
    {
      title: 'Checklist PDF',
      description: 'Printable inspection checklist',
      icon: FileText,
      href: '/downloads/inspection-checklist.pdf',
    },
    {
      title: 'Issue Tracker',
      description: 'Track and document issues',
      icon: Shield,
      href: '/tools/issue-tracker',
    },
    {
      title: 'Repair Cost Guide',
      description: 'Estimate repair costs',
      icon: AlertTriangle,
      href: '/tools/repair-cost-guide',
    },
  ]

  const handleToggleItem = (categoryIndex: number, itemIndex: number) => {
    const itemId = categoryIndex * 10 + itemIndex
    setCompletedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const totalItems = checklistCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  )
  const completionPercentage = Math.round(
    (completedItems.length / totalItems) * 100
  )

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow && checklistRef.current) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Property Inspection Checklist</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; text-align: center; }
              .section { margin: 30px 0; }
              .category { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
              .category-title { font-size: 18px; font-weight: bold; color: #1e40af; margin-bottom: 10px; }
              .item { margin: 8px 0; padding-left: 20px; position: relative; }
              .item:before { content: "□"; position: absolute; left: 0; }
              .item.completed:before { content: "✓"; color: #10b981; }
              .progress { margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 8px; }
              .red-flags { margin: 30px 0; padding: 15px; background: #fffbeb; border: 1px solid #fbbf24; border-radius: 8px; }
              .red-flag { margin: 8px 0; padding-left: 20px; }
              .red-flag:before { content: "⚠"; margin-right: 8px; }
              @media print {
                body { padding: 0; }
                .no-print { display: none; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Property Inspection Checklist</h1>
            <div class="progress">
              <h3>Inspection Progress: ${completedItems.length} of ${totalItems} items (${completionPercentage}%)</h3>
            </div>
            
            ${checklistCategories
              .map(
                (category, categoryIndex) => `
              <div class="category">
                <div class="category-title">${category.title}</div>
                <div>${category.description}</div>
                <div class="items">
                  ${category.items
                    .map((item, itemIndex) => {
                      const itemId = categoryIndex * 10 + itemIndex
                      const isCompleted = completedItems.includes(itemId)
                      return `
                      <div class="item ${isCompleted ? 'completed' : ''}">
                        ${item}
                      </div>
                    `
                    })
                    .join('')}
                </div>
              </div>
            `
              )
              .join('')}
            
            <div class="red-flags">
              <h3>Critical Red Flags to Watch For:</h3>
              ${redFlags
                .map(
                  (flag) => `
                <div class="red-flag">${flag}</div>
              `
                )
                .join('')}
            </div>
            
            <div class="no-print" style="margin-top: 30px; text-align: center;">
              <p>Generated from RealtyHub Inspection Checklist</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()

      // Wait for content to load before printing
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  const handleDownloadPDF = () => {
    // Create a data URL for a basic PDF-like content
    const checklistContent = `
Property Inspection Checklist
============================

Inspection Type: ${inspectionType.charAt(0).toUpperCase() + inspectionType.slice(1)}
Date: ${new Date().toLocaleDateString()}
Progress: ${completedItems.length}/${totalItems} items (${completionPercentage}%)

${checklistCategories
  .map(
    (category, categoryIndex) => `
${category.title}
${'='.repeat(category.title.length)}
${category.description}

${category.items
  .map((item, itemIndex) => {
    const itemId = categoryIndex * 10 + itemIndex
    const isCompleted = completedItems.includes(itemId)
    return `[${isCompleted ? '✓' : ' '}] ${item}`
  })
  .join('\n')}

`
  )
  .join('\n')}

Critical Red Flags
==================
${redFlags.map((flag) => `• ${flag}`).join('\n')}

---
Generated by RealtyHub Inspection Checklist
For professional inspection services, visit: ${window.location.origin}/contact
    `

    // Create a Blob and download link
    const blob = new Blob([checklistContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `property-inspection-checklist-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div ref={checklistRef} className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Property Inspection Checklist
            </h1>
            <p className="text-gray-600">
              Comprehensive checklist to ensure you don&apos;t miss critical
              details during property inspection
            </p>
          </div>

          {/* Progress Section */}
          <div className="mb-6 p-4 border border-brand/20 bg-brand/5 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Inspection Progress
                </h3>
                <p className="text-sm text-gray-600">
                  {completedItems.length} of {totalItems} items checked
                </p>
              </div>
              <span className="px-3 py-1 bg-brand text-white text-sm font-medium rounded-full">
                {completionPercentage}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-brand h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setCompletedItems([])}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                Reset Checklist
              </button>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 text-sm border border-brand/30 bg-brand/5 text-brand rounded hover:bg-brand/10 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Inspection Type Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Select Property Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'residential',
                label: 'Residential',
                icon: Home,
                count: 24,
              },
              {
                id: 'commercial',
                label: 'Commercial',
                icon: Building,
                count: 32,
              },
              { id: 'land', label: 'Land/Raw', icon: MapPin, count: 18 },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() =>
                  setInspectionType(
                    type.id as 'residential' | 'commercial' | 'land'
                  )
                }
                className={`p-4 border rounded-lg text-center transition-colors ${
                  inspectionType === type.id
                    ? 'border-brand bg-brand/5'
                    : 'hover:border-gray-300'
                }`}
              >
                <type.icon className="h-6 w-6 text-brand mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {type.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {type.count} checkpoints
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Checklist Categories */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Inspection Checklist
          </h2>
          <div className="space-y-4">
            {checklistCategories.map((category, categoryIndex) => (
              <div
                key={category.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  activeCategory === categoryIndex
                    ? 'border-brand bg-brand/5'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setActiveCategory(categoryIndex)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded ${
                      activeCategory === categoryIndex
                        ? 'bg-brand/10 text-brand'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <category.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    {activeCategory === categoryIndex && (
                      <div className="space-y-2 pt-3 border-t border-gray-100">
                        {category.items.map((item, itemIndex) => {
                          const itemId = categoryIndex * 10 + itemIndex
                          return (
                            <div
                              key={itemIndex}
                              className="flex items-start gap-3"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleToggleItem(categoryIndex, itemIndex)
                                }}
                                className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border flex items-center justify-center ${
                                  completedItems.includes(itemId)
                                    ? 'bg-brand border-brand'
                                    : 'border-gray-300 hover:border-brand'
                                }`}
                              >
                                {completedItems.includes(itemId) && (
                                  <CheckCircle className="h-3 w-3 text-white" />
                                )}
                              </button>
                              <span className="text-sm text-gray-700 flex-1">
                                {item}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tools */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Inspection Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="border rounded-lg p-4 hover:border-brand/30 hover:bg-brand/5 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-brand/10 rounded">
                    <tool.icon className="h-5 w-5 text-brand" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{tool.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Red Flags */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-gold" />
            <h2 className="text-xl font-semibold text-gray-900">
              Critical Red Flags
            </h2>
          </div>
          <div className="p-4 border border-gold-50 bg-yellow-50 rounded-lg">
            <ul className="space-y-2">
              {redFlags.map((flag, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="w-2 h-2 bg-gold-600 rounded-full mt-1.5"></span>
                  <span className="text-gray-700">{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 bg-brand/5 border border-brand/20 rounded-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Search className="h-5 w-5 text-brand" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Need Professional Inspection?
                </h3>
              </div>
              <p className="text-gray-700">
                Our certified inspectors provide comprehensive reports and peace
                of mind.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-2 bg-brand text-white rounded-md hover:bg-brand/95 text-center"
            >
              Book Inspection
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
