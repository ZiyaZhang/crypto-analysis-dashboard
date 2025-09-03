import React, { useState } from 'react'

interface AnalysisResult {
  position_analysis?: {
    position_type?: string
    risk_tolerance?: string
    strategy_type?: string
    confidence?: number
    summary?: string
  }
  signal_analysis?: {
    market_sentiment?: string
    trading_frequency?: string
    timing_quality?: number
    signal_strength?: number
    confidence?: number
    summary?: string
  }
  industry_analysis?: {
    primary_sector?: string
    ecosystem?: string
    protocol_interaction?: string
    adoption_level?: number
    confidence?: number
    summary?: string
  }
  advisor_analysis?: {
    overall_rating?: number
    risk_assessment?: string
    recommendation?: string
    confidence_level?: number
    key_strengths?: string[]
    key_risks?: string[]
    suggested_actions?: string[]
    time_horizon?: string
    portfolio_allocation?: string
    market_outlook?: string
    summary?: string
  }
  metadata?: {
    transaction_count?: number
    analysis_timestamp?: string
    status?: string
  }
}

interface AdviceCardProps {
  analysisResult: AnalysisResult | null
  onRefresh: () => void
  loading: boolean
}

const AdviceCard: React.FC<AdviceCardProps> = ({ analysisResult, onRefresh, loading }) => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'position' | 'signal' | 'industry'>('advisor')

  const getRecommendationColor = (recommendation?: string): string => {
    switch (recommendation) {
      case 'buy':
        return 'status-success'
      case 'hold':
        return 'status-warning'
      case 'sell':
        return 'status-error'
      case 'wait':
        return 'status-info'
      default:
        return 'status-info'
    }
  }

  const getSentimentColor = (sentiment?: string): string => {
    switch (sentiment) {
      case 'bullish':
        return 'status-success'
      case 'bearish':
        return 'status-error'
      case 'neutral':
        return 'status-info'
      case 'volatile':
        return 'status-warning'
      default:
        return 'status-info'
    }
  }

  const getRiskColor = (risk?: string): string => {
    switch (risk) {
      case 'low':
        return 'status-success'
      case 'medium':
        return 'status-warning'
      case 'high':
        return 'status-error'
      default:
        return 'status-info'
    }
  }

  const formatConfidence = (confidence?: number): string => {
    if (confidence === undefined) return 'N/A'
    return `${(confidence * 100).toFixed(1)}%`
  }

  const formatRating = (rating?: number): string => {
    if (rating === undefined) return 'N/A'
    return `${rating.toFixed(1)}/10`
  }

  if (!analysisResult) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-text mb-4">
          投资建议
        </h3>
        <div className="text-center py-8">
          <p className="text-dark-text-secondary mb-4">
            暂无分析结果
          </p>
          <button
            onClick={onRefresh}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '分析中...' : '开始分析'}
          </button>
        </div>
      </div>
    )
  }

  const { advisor_analysis, position_analysis, signal_analysis, industry_analysis } = analysisResult

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-dark-text">
          投资建议
        </h3>
        <button
          onClick={onRefresh}
          className="btn-secondary text-sm"
          disabled={loading}
        >
          {loading ? '刷新中...' : '刷新'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-gray-800 rounded-lg p-1">
        {[
          { key: 'advisor', label: '建议' },
          { key: 'position', label: '持仓' },
          { key: 'signal', label: '信号' },
          { key: 'industry', label: '行业' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${
              activeTab === key
                ? 'bg-accent-blue text-white'
                : 'text-dark-text-secondary hover:text-dark-text'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'advisor' && advisor_analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-text-secondary text-sm">总体评分</span>
                <div className="text-2xl font-bold text-dark-text">
                  {formatRating(advisor_analysis.overall_rating)}
                </div>
              </div>
              <div>
                <span className="text-dark-text-secondary text-sm">投资建议</span>
                <div className="mt-1">
                  <span className={`status-badge ${getRecommendationColor(advisor_analysis.recommendation)}`}>
                    {advisor_analysis.recommendation || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-text-secondary text-sm">风险评估</span>
                <div className="mt-1">
                  <span className={`status-badge ${getRiskColor(advisor_analysis.risk_assessment)}`}>
                    {advisor_analysis.risk_assessment || 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-dark-text-secondary text-sm">信心水平</span>
                <div className="text-dark-text font-medium">
                  {formatConfidence(advisor_analysis.confidence_level)}
                </div>
              </div>
            </div>

            {advisor_analysis.key_strengths && advisor_analysis.key_strengths.length > 0 && (
              <div>
                <span className="text-dark-text-secondary text-sm">主要优势</span>
                <div className="mt-1 space-y-1">
                  {advisor_analysis.key_strengths.map((strength, index) => (
                    <div key={index} className="text-sm text-accent-green">
                      • {strength}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {advisor_analysis.key_risks && advisor_analysis.key_risks.length > 0 && (
              <div>
                <span className="text-dark-text-secondary text-sm">主要风险</span>
                <div className="mt-1 space-y-1">
                  {advisor_analysis.key_risks.map((risk, index) => (
                    <div key={index} className="text-sm text-accent-red">
                      • {risk}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {advisor_analysis.suggested_actions && advisor_analysis.suggested_actions.length > 0 && (
              <div>
                <span className="text-dark-text-secondary text-sm">建议行动</span>
                <div className="mt-1 space-y-1">
                  {advisor_analysis.suggested_actions.map((action, index) => (
                    <div key={index} className="text-sm text-accent-blue">
                      • {action}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {advisor_analysis.summary && (
              <div>
                <span className="text-dark-text-secondary text-sm">综合建议</span>
                <p className="text-dark-text text-sm mt-1 leading-relaxed">
                  {advisor_analysis.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'position' && position_analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-text-secondary text-sm">持仓类型</span>
                <div className="text-dark-text font-medium">
                  {position_analysis.position_type || 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-dark-text-secondary text-sm">风险承受</span>
                <div className="mt-1">
                  <span className={`status-badge ${getRiskColor(position_analysis.risk_tolerance)}`}>
                    {position_analysis.risk_tolerance || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <span className="text-dark-text-secondary text-sm">策略类型</span>
              <div className="text-dark-text font-medium">
                {position_analysis.strategy_type || 'N/A'}
              </div>
            </div>
            {position_analysis.summary && (
              <div>
                <span className="text-dark-text-secondary text-sm">分析总结</span>
                <p className="text-dark-text text-sm mt-1 leading-relaxed">
                  {position_analysis.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'signal' && signal_analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-text-secondary text-sm">市场情绪</span>
                <div className="mt-1">
                  <span className={`status-badge ${getSentimentColor(signal_analysis.market_sentiment)}`}>
                    {signal_analysis.market_sentiment || 'N/A'}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-dark-text-secondary text-sm">交易频率</span>
                <div className="text-dark-text font-medium">
                  {signal_analysis.trading_frequency || 'N/A'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-text-secondary text-sm">时机质量</span>
                <div className="text-dark-text font-medium">
                  {formatConfidence(signal_analysis.timing_quality)}
                </div>
              </div>
              <div>
                <span className="text-dark-text-secondary text-sm">信号强度</span>
                <div className="text-dark-text font-medium">
                  {formatConfidence(signal_analysis.signal_strength)}
                </div>
              </div>
            </div>
            {signal_analysis.summary && (
              <div>
                <span className="text-dark-text-secondary text-sm">信号总结</span>
                <p className="text-dark-text text-sm mt-1 leading-relaxed">
                  {signal_analysis.summary}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'industry' && industry_analysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-dark-text-secondary text-sm">主要行业</span>
                <div className="text-dark-text font-medium">
                  {industry_analysis.primary_sector || 'N/A'}
                </div>
              </div>
              <div>
                <span className="text-dark-text-secondary text-sm">生态系统</span>
                <div className="text-dark-text font-medium">
                  {industry_analysis.ecosystem || 'N/A'}
                </div>
              </div>
            </div>
            <div>
              <span className="text-dark-text-secondary text-sm">协议交互</span>
              <div className="text-dark-text font-medium">
                {industry_analysis.protocol_interaction || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-dark-text-secondary text-sm">采用程度</span>
              <div className="text-dark-text font-medium">
                {formatConfidence(industry_analysis.adoption_level)}
              </div>
            </div>
            {industry_analysis.summary && (
              <div>
                <span className="text-dark-text-secondary text-sm">行业总结</span>
                <p className="text-dark-text text-sm mt-1 leading-relaxed">
                  {industry_analysis.summary}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdviceCard

