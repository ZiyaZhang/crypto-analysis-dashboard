import { useState } from 'react'

interface Transaction {
  hash: string
  from_addr: string
  to_addr: string
  value: string
  time: number
  raw_json: string
  parsed_json: string
}

interface TxTableProps {
  transactions: Transaction[]
}

interface ParsedTransaction {
  action?: string
  token?: string
  amount?: string
  time?: string
  confidence?: number
  description?: string
  risk_level?: string
  gas_used?: string
  gas_price?: string
}

const TxTable: React.FC<TxTableProps> = ({ transactions }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (hash: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(hash)) {
      newExpanded.delete(hash)
    } else {
      newExpanded.add(hash)
    }
    setExpandedRows(newExpanded)
  }

  const formatValue = (value: string): string => {
    try {
      const wei = BigInt(value)
      const eth = Number(wei) / 1e18
      return eth.toFixed(4)
    } catch {
      return value
    }
  }

  const formatTime = (timestamp: number): string => {
    try {
      return new Date(timestamp * 1000).toLocaleString('zh-CN')
    } catch {
      return 'Invalid Date'
    }
  }

  const parseTransaction = (parsedJson: string): ParsedTransaction | null => {
    try {
      return JSON.parse(parsedJson)
    } catch {
      return null
    }
  }

  const getActionColor = (action?: string): string => {
    switch (action) {
      case 'transfer':
        return 'status-info'
      case 'swap':
        return 'status-warning'
      case 'mint':
        return 'status-success'
      case 'burn':
        return 'status-error'
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

  const truncateAddress = (address: string): string => {
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-dark-text-secondary">暂无交易记录</p>
        <p className="text-sm text-dark-text-secondary mt-2">
          请先通过后端API拉取交易数据
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="text-left py-3 px-4 text-dark-text-secondary font-medium">
              交易哈希
            </th>
            <th className="text-left py-3 px-4 text-dark-text-secondary font-medium">
              类型
            </th>
            <th className="text-left py-3 px-4 text-dark-text-secondary font-medium">
              金额
            </th>
            <th className="text-left py-3 px-4 text-dark-text-secondary font-medium">
              时间
            </th>
            <th className="text-left py-3 px-4 text-dark-text-secondary font-medium">
              风险等级
            </th>
            <th className="text-left py-3 px-4 text-dark-text-secondary font-medium">
              操作
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const parsed = parseTransaction(tx.parsed_json)
            const isExpanded = expandedRows.has(tx.hash)
            
            return (
              <React.Fragment key={tx.hash}>
                <tr className="table-row">
                  <td className="py-3 px-4">
                    <code className="text-sm text-accent-blue">
                      {truncateAddress(tx.hash)}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    {parsed?.action && (
                      <span className={`status-badge ${getActionColor(parsed.action)}`}>
                        {parsed.action}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-dark-text">
                      {parsed?.amount ? `${parsed.amount} ${parsed.token}` : `${formatValue(tx.value)} ETH`}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-dark-text-secondary text-sm">
                    {formatTime(tx.time)}
                  </td>
                  <td className="py-3 px-4">
                    {parsed?.risk_level && (
                      <span className={`status-badge ${getRiskColor(parsed.risk_level)}`}>
                        {parsed.risk_level}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleRow(tx.hash)}
                      className="text-accent-blue hover:text-blue-400 text-sm"
                    >
                      {isExpanded ? '收起' : '详情'}
                    </button>
                  </td>
                </tr>
                
                {isExpanded && (
                  <tr className="table-row">
                    <td colSpan={6} className="py-4 px-4">
                      <div className="bg-gray-900 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-dark-text-secondary">发送方:</span>
                            <code className="ml-2 text-accent-blue">
                              {truncateAddress(tx.from_addr)}
                            </code>
                          </div>
                          <div>
                            <span className="text-dark-text-secondary">接收方:</span>
                            <code className="ml-2 text-accent-blue">
                              {truncateAddress(tx.to_addr)}
                            </code>
                          </div>
                        </div>
                        
                        {parsed && (
                          <div className="space-y-2">
                            <div>
                              <span className="text-dark-text-secondary">描述:</span>
                              <p className="text-dark-text mt-1">{parsed.description}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-dark-text-secondary">置信度:</span>
                                <span className="ml-2 text-dark-text">
                                  {parsed.confidence ? `${(parsed.confidence * 100).toFixed(1)}%` : 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-dark-text-secondary">Gas使用:</span>
                                <span className="ml-2 text-dark-text">{parsed.gas_used || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-dark-text-secondary">Gas价格:</span>
                                <span className="ml-2 text-dark-text">{parsed.gas_price || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TxTable

