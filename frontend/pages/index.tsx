import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import TxTable from '../components/TxTable'
import AdviceCard from '../components/AdviceCard'
import IndustryChart from '../components/IndustryChart'

interface Transaction {
  hash: string
  from_addr: string
  to_addr: string
  value: string
  time: number
  raw_json: string
  parsed_json: string
}

interface AnalysisResult {
  position_analysis?: any
  signal_analysis?: any
  industry_analysis?: any
  advisor_analysis?: any
  metadata?: any
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:8000/transactions?limit=20')
      const data = await response.json()

      if (data.success) {
        setTransactions(data.transactions)
      } else {
        setError('获取交易数据失败')
      }
    } catch (err) {
      setError('连接后端服务失败，请确保后端服务正在运行')
      console.error('Fetch transactions error:', err)
    }
  }

  const fetchAnalysisResult = async () => {
    try {
      const response = await fetch('http://localhost:8000/analysis')
      const data = await response.json()

      if (data.success) {
        setAnalysisResult(data.result)
      } else {
        console.log('分析结果不存在或未完成')
      }
    } catch (err) {
      console.error('Fetch analysis error:', err)
    }
  }

  const refreshAnalysis = async () => {
    setLoading(true)
    try {
      // 这里可以调用后端API重新运行分析
      await fetchAnalysisResult()
    } catch (err) {
      console.error('Refresh analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchTransactions(),
        fetchAnalysisResult()
      ])
      setLoading(false)
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-dark-text-secondary">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Crypto Analysis Dashboard</title>
        <meta name="description" content="Crypto Transaction Analysis Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-dark-bg">
        {/* Header */}
        <header className="bg-dark-card border-b border-dark-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-dark-text">
                  Crypto Analysis Dashboard
                </h1>
                <p className="text-dark-text-secondary mt-2">
                  实时加密货币交易分析与投资建议
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={fetchTransactions}
                  className="btn-secondary"
                >
                  刷新交易
                </button>
                <button
                  onClick={refreshAnalysis}
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? '分析中...' : '刷新分析'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Transaction Table */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold text-dark-text mb-4">
                  最近交易记录
                </h2>
                <TxTable transactions={transactions} />
              </div>
            </div>

            {/* Right Column - Advice Card */}
            <div className="lg:col-span-1">
              <AdviceCard
                analysisResult={analysisResult}
                onRefresh={refreshAnalysis}
                loading={loading}
              />
            </div>
          </div>

          {/* Bottom Section - Industry Chart */}
          <div className="card">
            <h2 className="text-xl font-semibold text-dark-text mb-4">
              行业资金流分析
            </h2>
            <IndustryChart analysisResult={analysisResult} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark-card border-t border-dark-border mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-dark-text-secondary">
              <p>&copy; 2024 Crypto Analysis Dashboard. 仅供学习和研究使用。</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

