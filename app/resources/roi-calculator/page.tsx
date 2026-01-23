// app/roi-calculator/page.tsx
'use client'

import { useState } from 'react'
import {
  Calculator,
  Calendar,
  DollarSign,
  Download,
  Home,
  Percent,
  Printer,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

export default function ROICalculator() {
  // Form state
  const [formData, setFormData] = useState({
    propertyValue: 50000000, // ₦50M
    purchaseCosts: 2000000, // ₦2M
    renovationCosts: 5000000, // ₦5M
    monthlyRent: 300000, // ₦300K
    annualAppreciation: 15, // 15%
    holdingPeriod: 5, // 5 years
    vacancyRate: 10, // 10%
    managementFees: 10, // 10%
    maintenanceRate: 5, // 5%
    propertyTax: 200000, // ₦200K annually
    insurance: 100000, // ₦100K annually
    mortgageRate: 18, // 18% interest
    downPayment: 30, // 30%
    mortgageTerm: 20, // 20 years
  })

  // Results state
  const [results, setResults] = useState({
    totalInvestment: 0,
    annualRentalIncome: 0,
    annualExpenses: 0,
    netAnnualIncome: 0,
    propertyValueAfterPeriod: 0,
    totalReturn: 0,
    roiPercentage: 0,
    annualizedROI: 0,
    cashOnCashReturn: 0,
    mortgagePayment: 0,
  })

  // Calculate results
  const calculateROI = () => {
    const {
      propertyValue,
      purchaseCosts,
      renovationCosts,
      monthlyRent,
      annualAppreciation,
      holdingPeriod,
      vacancyRate,
      managementFees,
      maintenanceRate,
      propertyTax,
      insurance,
      mortgageRate,
      downPayment,
      mortgageTerm,
    } = formData

    // Total investment
    const downPaymentAmount = (propertyValue * downPayment) / 100
    const totalInvestment = downPaymentAmount + purchaseCosts + renovationCosts

    // Annual rental income (adjusted for vacancy)
    const annualRentGross = monthlyRent * 12
    const vacancyLoss = (annualRentGross * vacancyRate) / 100
    const annualRentalIncome = annualRentGross - vacancyLoss

    // Annual expenses
    const managementFeesAmount = (annualRentGross * managementFees) / 100
    const maintenanceAmount = (annualRentGross * maintenanceRate) / 100
    const annualExpenses =
      managementFeesAmount + maintenanceAmount + propertyTax + insurance

    // Net annual income
    const netAnnualIncome = annualRentalIncome - annualExpenses

    // Property value after holding period
    const propertyValueAfterPeriod =
      propertyValue * Math.pow(1 + annualAppreciation / 100, holdingPeriod)

    // Mortgage calculations
    const loanAmount = propertyValue - downPaymentAmount
    const monthlyRate = mortgageRate / 100 / 12
    const totalPayments = mortgageTerm * 12
    const mortgagePayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1)

    // Total return
    const totalRentalIncome = netAnnualIncome * holdingPeriod
    const appreciationGain = propertyValueAfterPeriod - propertyValue
    const totalReturn = totalRentalIncome + appreciationGain - totalInvestment

    // ROI calculations
    const roiPercentage = (totalReturn / totalInvestment) * 100
    const annualizedROI =
      (Math.pow(1 + roiPercentage / 100, 1 / holdingPeriod) - 1) * 100
    const cashOnCashReturn = (netAnnualIncome / totalInvestment) * 100

    setResults({
      totalInvestment,
      annualRentalIncome,
      annualExpenses,
      netAnnualIncome,
      propertyValueAfterPeriod,
      totalReturn,
      roiPercentage,
      annualizedROI,
      cashOnCashReturn,
      mortgagePayment,
    })
  }

  // Handle input changes
  const handleInputChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      propertyValue: 50000000,
      purchaseCosts: 2000000,
      renovationCosts: 5000000,
      monthlyRent: 300000,
      annualAppreciation: 15,
      holdingPeriod: 5,
      vacancyRate: 10,
      managementFees: 10,
      maintenanceRate: 5,
      propertyTax: 200000,
      insurance: 100000,
      mortgageRate: 18,
      downPayment: 30,
      mortgageTerm: 20,
    })
    calculateROI()
  }

  // Print results
  const handlePrint = () => {
    const printContent = document.getElementById('roi-results')
    const printWindow = window.open('', '_blank')

    if (printWindow && printContent) {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>ROI Calculator Results</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
              h1 { color: #333; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
              .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
              .result-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
              .result-card h3 { margin: 0 0 10px 0; color: #1e40af; font-size: 16px; }
              .result-value { font-size: 24px; font-weight: bold; color: #059669; }
              .summary { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .input-summary { margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; }
              @media print {
                .no-print { display: none; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Real Estate ROI Calculator Results</h1>
            <div class="input-summary">
              <h3>Input Parameters:</h3>
              <p>Property Value: ${formatCurrency(formData.propertyValue)}</p>
              <p>Monthly Rent: ${formatCurrency(formData.monthlyRent)}</p>
              <p>Holding Period: ${formData.holdingPeriod} years</p>
              <p>Annual Appreciation: ${formData.annualAppreciation}%</p>
            </div>
            
            <div class="summary">
              <h2>Investment Summary</h2>
              <div class="result-grid">
                <div class="result-card">
                  <h3>Total Investment</h3>
                  <div class="result-value">${formatCurrency(results.totalInvestment)}</div>
                </div>
                <div class="result-card">
                  <h3>Total Return</h3>
                  <div class="result-value">${formatCurrency(results.totalReturn)}</div>
                </div>
                <div class="result-card">
                  <h3>ROI</h3>
                  <div class="result-value">${formatPercentage(results.roiPercentage)}</div>
                </div>
                <div class="result-card">
                  <h3>Annualized ROI</h3>
                  <div class="result-value">${formatPercentage(results.annualizedROI)}</div>
                </div>
              </div>
            </div>
            
            <div class="no-print">
              <p>Generated on ${new Date().toLocaleDateString()}</p>
              <p>For more detailed analysis, visit our website</p>
            </div>
          </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.focus()
        printWindow.print()
      }
    }
  }

  // Download results
  const handleDownload = () => {
    const content = `
Real Estate ROI Calculator Results
==================================

Input Parameters:
-----------------
Property Value: ${formatCurrency(formData.propertyValue)}
Purchase Costs: ${formatCurrency(formData.purchaseCosts)}
Renovation Costs: ${formatCurrency(formData.renovationCosts)}
Monthly Rent: ${formatCurrency(formData.monthlyRent)}
Annual Appreciation: ${formData.annualAppreciation}%
Holding Period: ${formData.holdingPeriod} years
Down Payment: ${formData.downPayment}%

Results:
--------
Total Investment: ${formatCurrency(results.totalInvestment)}
Annual Rental Income: ${formatCurrency(results.annualRentalIncome)}
Annual Expenses: ${formatCurrency(results.annualExpenses)}
Net Annual Income: ${formatCurrency(results.netAnnualIncome)}
Property Value After ${formData.holdingPeriod} Years: ${formatCurrency(results.propertyValueAfterPeriod)}
Total Return: ${formatCurrency(results.totalReturn)}
ROI: ${formatPercentage(results.roiPercentage)}
Annualized ROI: ${formatPercentage(results.annualizedROI)}
Cash on Cash Return: ${formatPercentage(results.cashOnCashReturn)}
Monthly Mortgage Payment: ${formatCurrency(results.mortgagePayment)}

Generated on: ${new Date().toLocaleDateString()}
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roi-calculator-results-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Initialize calculation on component mount
  useState(() => {
    calculateROI()
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-brand" />
              <h1 className="text-3xl font-bold text-gray-900">
                ROI Calculator
              </h1>
            </div>
            <p className="text-gray-600">
              Calculate potential returns on your real estate investment
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 justify-center">
            <button
              onClick={calculateROI}
              className="px-4 py-2 bg-brand text-white rounded-md hover:bg-brand/90 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Calculate
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 border border-brand/30 bg-brand/5 text-brand rounded-md hover:bg-brand/10 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center gap-2"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <Home className="h-5 w-5 text-brand" />
                Property Details
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Value
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.propertyValue}
                      onChange={(e) =>
                        handleInputChange(
                          'propertyValue',
                          Number(e.target.value)
                        )
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Costs
                    </label>
                    <input
                      type="number"
                      value={formData.purchaseCosts}
                      onChange={(e) =>
                        handleInputChange(
                          'purchaseCosts',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renovation Costs
                    </label>
                    <input
                      type="number"
                      value={formData.renovationCosts}
                      onChange={(e) =>
                        handleInputChange(
                          'renovationCosts',
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Income */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-brand" />
                Rental Income & Expenses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Rent
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) =>
                      handleInputChange('monthlyRent', Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Appreciation (%)
                  </label>
                  <input
                    type="number"
                    value={formData.annualAppreciation}
                    onChange={(e) =>
                      handleInputChange(
                        'annualAppreciation',
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vacancy Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.vacancyRate}
                    onChange={(e) =>
                      handleInputChange('vacancyRate', Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Management Fees (%)
                  </label>
                  <input
                    type="number"
                    value={formData.managementFees}
                    onChange={(e) =>
                      handleInputChange(
                        'managementFees',
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
            </div>

            {/* Financing */}
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-brand" />
                Financing Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Down Payment (%)
                  </label>
                  <input
                    type="number"
                    value={formData.downPayment}
                    onChange={(e) =>
                      handleInputChange('downPayment', Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mortgage Rate (%)
                  </label>
                  <input
                    type="number"
                    value={formData.mortgageRate}
                    onChange={(e) =>
                      handleInputChange('mortgageRate', Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mortgage Term (years)
                  </label>
                  <input
                    type="number"
                    value={formData.mortgageTerm}
                    onChange={(e) =>
                      handleInputChange('mortgageTerm', Number(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div id="roi-results" className="border rounded-lg p-6 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Investment Summary
              </h2>

              <div className="space-y-6">
                {/* ROI */}
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">Total ROI</div>
                  <div
                    className={`text-3xl font-bold ${results.roiPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatPercentage(results.roiPercentage)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Over {formData.holdingPeriod} years
                  </div>
                </div>

                {/* Annualized ROI */}
                <div className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600 mb-1">
                    Annualized ROI
                  </div>
                  <div
                    className={`text-2xl font-bold ${results.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {formatPercentage(results.annualizedROI)}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Per year</div>
                </div>

                {/* Detailed Results */}
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Total Investment
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.totalInvestment)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Total Return
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.totalReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Net Annual Income
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.netAnnualIncome)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">
                        Cash on Cash Return
                      </span>
                      <span
                        className={`font-semibold ${results.cashOnCashReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {formatPercentage(results.cashOnCashReturn)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly Mortgage
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(results.mortgagePayment)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Future Value */}
                <div className="p-4 bg-white rounded-lg border">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Future Property Value
                  </h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(results.propertyValueAfterPeriod)}
                    </div>
                    <div className="text-sm text-gray-600">
                      After {formData.holdingPeriod} years
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="border rounded-lg p-6 bg-brand/5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-brand" />
                Tips for Better ROI
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Lower vacancy rates increase rental income
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Consider areas with high appreciation potential
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Shop around for better mortgage rates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  Factor in all hidden costs upfront
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
