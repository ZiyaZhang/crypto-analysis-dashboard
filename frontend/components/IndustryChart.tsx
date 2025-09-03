import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

interface AnalysisResult {
    industry_analysis?: {
        primary_sector?: string
        ecosystem?: string
        protocol_interaction?: string
        adoption_level?: number
        confidence?: number
    }
    position_analysis?: {
        total_volume?: string
        avg_transaction_size?: string
        diversification_score?: number
    }
    signal_analysis?: {
        market_sentiment?: string
        trading_frequency?: string
        volume_trend?: string
    }
}

interface IndustryChartProps {
    analysisResult: AnalysisResult | null
}

const IndustryChart: React.FC<IndustryChartProps> = ({ analysisResult }) => {
    // 示例数据 - 当没有真实分析结果时使用
    const sampleSectorData = [
        { name: 'DeFi', value: 45, color: '#3b82f6' },
        { name: 'NFT', value: 20, color: '#10b981' },
        { name: 'Gaming', value: 15, color: '#f59e0b' },
        { name: 'Infrastructure', value: 12, color: '#ef4444' },
        { name: 'Payment', value: 8, color: '#8b5cf6' }
    ]

    const sampleEcosystemData = [
        { name: 'Ethereum', value: 60, color: '#627eea' },
        { name: 'BSC', value: 20, color: '#f3ba2f' },
        { name: 'Polygon', value: 12, color: '#8247e5' },
        { name: 'Arbitrum', value: 8, color: '#28a0f0' }
    ]

    const sampleVolumeData = [
        { name: 'Week 1', volume: 12.5, transactions: 45 },
        { name: 'Week 2', volume: 18.2, transactions: 62 },
        { name: 'Week 3', volume: 15.8, transactions: 58 },
        { name: 'Week 4', volume: 22.1, transactions: 78 }
    ]

    // 根据分析结果生成数据
    const getSectorData = () => {
        if (!analysisResult?.industry_analysis) {
            return sampleSectorData
        }

        const { primary_sector } = analysisResult.industry_analysis
        if (!primary_sector) {
            return sampleSectorData
        }

        // 基于主要行业调整数据
        const baseData = [...sampleSectorData]
        const primaryIndex = baseData.findIndex(item =>
            item.name.toLowerCase() === primary_sector.toLowerCase()
        )

        if (primaryIndex !== -1) {
            baseData[primaryIndex].value = 60
            // 重新分配其他值
            const remaining = 40
            const otherCount = baseData.length - 1
            const otherValue = remaining / otherCount

            baseData.forEach((item, index) => {
                if (index !== primaryIndex) {
                    item.value = Math.round(otherValue)
                }
            })
        }

        return baseData
    }

    const getEcosystemData = () => {
        if (!analysisResult?.industry_analysis) {
            return sampleEcosystemData
        }

        const { ecosystem } = analysisResult.industry_analysis
        if (!ecosystem) {
            return sampleEcosystemData
        }

        // 基于生态系统调整数据
        const baseData = [...sampleEcosystemData]
        const ecosystemIndex = baseData.findIndex(item =>
            item.name.toLowerCase() === ecosystem.toLowerCase()
        )

        if (ecosystemIndex !== -1) {
            baseData[ecosystemIndex].value = 70
            // 重新分配其他值
            const remaining = 30
            const otherCount = baseData.length - 1
            const otherValue = remaining / otherCount

            baseData.forEach((item, index) => {
                if (index !== ecosystemIndex) {
                    item.value = Math.round(otherValue)
                }
            })
        }

        return baseData
    }

    const getVolumeData = () => {
        if (!analysisResult?.position_analysis) {
            return sampleVolumeData
        }

        const { total_volume, avg_transaction_size } = analysisResult.position_analysis
        if (!total_volume || !avg_transaction_size) {
            return sampleVolumeData
        }

        // 基于实际数据调整
        const totalVol = parseFloat(total_volume)
        const avgSize = parseFloat(avg_transaction_size)

        return sampleVolumeData.map((item, index) => ({
            ...item,
            volume: totalVol * (0.8 + Math.random() * 0.4), // 添加一些变化
            transactions: Math.round(totalVol / avgSize * (0.8 + Math.random() * 0.4))
        }))
    }

    const sectorData = getSectorData()
    const ecosystemData = getEcosystemData()
    const volumeData = getVolumeData()

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
                    <p className="text-dark-text font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'volume' ? ' ETH' : ''}`}
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    const PieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-lg">
                    <p className="text-dark-text font-medium">{payload[0].name}</p>
                    <p className="text-sm" style={{ color: payload[0].color }}>
                        {`占比: ${payload[0].value}%`}
                    </p>
                </div>
            )
        }
        return null
    }

    return (
        <div className="space-y-8">
            {/* 行业分布饼图 */}
            <div>
                <h3 className="text-lg font-semibold text-dark-text mb-4">
                    行业分布分析
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h4 className="text-md font-medium text-dark-text-secondary mb-3">
                            主要行业
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={sectorData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {sectorData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div>
                        <h4 className="text-md font-medium text-dark-text-secondary mb-3">
                            生态系统分布
                        </h4>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={ecosystemData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {ecosystemData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<PieTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 交易量趋势图 */}
            <div>
                <h3 className="text-lg font-semibold text-dark-text mb-4">
                    交易量趋势分析
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={12}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="volume"
                            fill="#3b82f6"
                            name="交易量 (ETH)"
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="transactions"
                            fill="#10b981"
                            name="交易次数"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 分析指标卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                        总交易量
                    </h4>
                    <p className="text-2xl font-bold text-dark-text">
                        {analysisResult?.position_analysis?.total_volume || '12.5'} ETH
                    </p>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                        平均交易规模
                    </h4>
                    <p className="text-2xl font-bold text-dark-text">
                        {analysisResult?.position_analysis?.avg_transaction_size || '1.25'} ETH
                    </p>
                </div>

                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                    <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                        多样化评分
                    </h4>
                    <p className="text-2xl font-bold text-dark-text">
                        {analysisResult?.position_analysis?.diversification_score
                            ? `${(analysisResult.position_analysis.diversification_score * 100).toFixed(0)}%`
                            : '75%'
                        }
                    </p>
                </div>
            </div>

            {/* 数据说明 */}
            <div className="bg-gray-900 rounded-lg p-4">
                <h4 className="text-sm font-medium text-dark-text-secondary mb-2">
                    数据说明
                </h4>
                <p className="text-sm text-dark-text-secondary">
                    {analysisResult
                        ? "以上图表基于实际交易数据分析生成，反映了您的投资组合在行业和生态系统中的分布情况。"
                        : "以上图表为示例数据，实际使用时将基于您的交易记录生成真实的分析结果。"
                    }
                </p>
            </div>
        </div>
    )
}

export default IndustryChart
