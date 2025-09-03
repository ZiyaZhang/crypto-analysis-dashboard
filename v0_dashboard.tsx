"use client"

import { useState } from "react"

export default function CryptoDashboard() {
    const [activeTab, setActiveTab] = useState('advisor')
    const [loading, setLoading] = useState(false)

    const sampleTransactions = [
        {
            hash: "0x1234...5678",
            type: "transfer",
            amount: "1.5 ETH",
            time: "2024-01-15 10:30:00",
            risk: "low"
        },
        {
            hash: "0x2345...6789",
            type: "swap",
            amount: "0.5 ETH",
            time: "2024-01-15 10:31:00",
            risk: "medium"
        }
    ]

    const analysisResult = {
        overall_rating: 7.5,
        recommendation: "hold",
        risk_assessment: "medium",
        confidence_level: 0.8,
        key_strengths: ["良好的时机把握", "多样化的投资组合"],
        key_risks: ["市场波动性", "监管不确定性"],
        suggested_actions: ["监控市场动态", "重新平衡投资组合"],
        summary: "稳健的投资组合，中等风险，建议持有并持续监控"
    }

    const handleRefresh = () => {
        setLoading(true)
        setTimeout(() => setLoading(false), 1000)
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Crypto Analysis Dashboard
                            </h1>
                            <p className="text-gray-400 mt-2">
                                实时加密货币交易分析与投资建议
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={handleRefresh}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                {loading ? '刷新中...' : '刷新交易'}
                            </button>
                            <button
                                onClick={handleRefresh}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                                {loading ? '分析中...' : '刷新分析'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Transaction Table */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-white mb-4">
                                最近交易记录
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-600">
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">交易哈希</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">类型</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">金额</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">时间</th>
                                            <th className="text-left py-3 px-4 text-gray-400 font-medium">风险等级</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sampleTransactions.map((tx, index) => (
                                            <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                                                <td className="py-3 px-4">
                                                    <code className="text-sm text-blue-400">{tx.hash}</code>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.type === 'transfer' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
                                                        }`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-white">{tx.amount}</td>
                                                <td className="py-3 px-4 text-gray-400 text-sm">{tx.time}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.risk === 'low' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                                                        }`}>
                                                        {tx.risk}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Advice Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    投资建议
                                </h3>
                                <button
                                    onClick={handleRefresh}
                                    className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    刷新
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
                                        onClick={() => setActiveTab(key)}
                                        className={`flex-1 py-2 px-3 text-sm rounded-md transition-colors ${activeTab === key
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="space-y-4">
                                {activeTab === 'advisor' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">总体评分</span>
                                                <div className="text-2xl font-bold text-white">
                                                    {analysisResult.overall_rating}/10
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">投资建议</span>
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                                                        {analysisResult.recommendation}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">风险评估</span>
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                                                        {analysisResult.risk_assessment}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">信心水平</span>
                                                <div className="text-white font-medium">
                                                    {(analysisResult.confidence_level * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-gray-400 text-sm">主要优势</span>
                                            <div className="mt-1 space-y-1">
                                                {analysisResult.key_strengths.map((strength, index) => (
                                                    <div key={index} className="text-sm text-green-400">
                                                        • {strength}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-gray-400 text-sm">主要风险</span>
                                            <div className="mt-1 space-y-1">
                                                {analysisResult.key_risks.map((risk, index) => (
                                                    <div key={index} className="text-sm text-red-400">
                                                        • {risk}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-gray-400 text-sm">建议行动</span>
                                            <div className="mt-1 space-y-1">
                                                {analysisResult.suggested_actions.map((action, index) => (
                                                    <div key={index} className="text-sm text-blue-400">
                                                        • {action}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-gray-400 text-sm">综合建议</span>
                                            <p className="text-white text-sm mt-1 leading-relaxed">
                                                {analysisResult.summary}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {activeTab === 'position' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">持仓类型</span>
                                                <div className="text-white font-medium">moderate</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">风险承受</span>
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-300">
                                                        medium
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">策略类型</span>
                                            <div className="text-white font-medium">trading</div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'signal' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">市场情绪</span>
                                                <div className="mt-1">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-300">
                                                        bullish
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">交易频率</span>
                                                <div className="text-white font-medium">medium</div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">时机质量</span>
                                                <div className="text-white font-medium">75%</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">信号强度</span>
                                                <div className="text-white font-medium">80%</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'industry' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-gray-400 text-sm">主要行业</span>
                                                <div className="text-white font-medium">DeFi</div>
                                            </div>
                                            <div>
                                                <span className="text-gray-400 text-sm">生态系统</span>
                                                <div className="text-white font-medium">Ethereum</div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">协议交互</span>
                                            <div className="text-white font-medium">DEX</div>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 text-sm">采用程度</span>
                                            <div className="text-white font-medium">80%</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Industry Chart */}
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">
                        行业资金流分析
                    </h2>

                    {/* Charts Placeholder */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div>
                            <h4 className="text-md font-medium text-gray-400 mb-3">主要行业</h4>
                            <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">📊</div>
                                    <p className="text-gray-400">DeFi: 45%</p>
                                    <p className="text-gray-400">NFT: 20%</p>
                                    <p className="text-gray-400">Gaming: 15%</p>
                                    <p className="text-gray-400">Infrastructure: 12%</p>
                                    <p className="text-gray-400">Payment: 8%</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-md font-medium text-gray-400 mb-3">生态系统分布</h4>
                            <div className="bg-gray-800 rounded-lg p-4 h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">🌐</div>
                                    <p className="text-gray-400">Ethereum: 60%</p>
                                    <p className="text-gray-400">BSC: 20%</p>
                                    <p className="text-gray-400">Polygon: 12%</p>
                                    <p className="text-gray-400">Arbitrum: 8%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analysis Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">总交易量</h4>
                            <p className="text-2xl font-bold text-white">12.5 ETH</p>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">平均交易规模</h4>
                            <p className="text-2xl font-bold text-white">1.25 ETH</p>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-2">多样化评分</h4>
                            <p className="text-2xl font-bold text-white">75%</p>
                        </div>
                    </div>

                    {/* Data Description */}
                    <div className="bg-gray-800 rounded-lg p-4 mt-6">
                        <h4 className="text-sm font-medium text-gray-400 mb-2">数据说明</h4>
                        <p className="text-sm text-gray-400">
                            以上图表为示例数据，实际使用时将基于您的交易记录生成真实的分析结果。
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-700 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-gray-400">
                        <p>&copy; 2024 Crypto Analysis Dashboard. 仅供学习和研究使用。</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
