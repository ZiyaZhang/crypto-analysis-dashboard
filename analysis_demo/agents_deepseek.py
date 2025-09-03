import json
import os
from typing import Any, Dict, List

import requests

# DeepSeek API配置
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")


def call_deepseek(prompt: str, system_prompt: str = "") -> str:
    """调用DeepSeek API的通用函数"""
    if not DEEPSEEK_API_KEY:
        raise ValueError("DEEPSEEK_API_KEY 环境变量未设置")

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json",
    }

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    messages.append({"role": "user", "content": prompt})

    payload = {
        "model": "deepseek-chat",
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": 2000,
    }

    response = requests.post(
        DEEPSEEK_API_URL, headers=headers, json=payload, timeout=60
    )
    response.raise_for_status()

    result = response.json()
    return result["choices"][0]["message"]["content"].strip()


def position_agent(txs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    持仓分析Agent - 分析交易者的持仓模式和策略

    Args:
        txs: 交易记录列表

    Returns:
        Dict: 持仓分析结果
    """
    system_prompt = """
    你是一个专业的加密货币持仓分析专家。请分析交易者的持仓模式和投资策略。
    必须返回严格的JSON格式，不要包含任何其他文字。
    """

    prompt = f"""
    请分析以下交易记录，评估交易者的持仓模式和投资策略：

    交易数据：
    {json.dumps(txs, indent=2, ensure_ascii=False)}

    请返回JSON格式的分析结果，包含以下字段：
    - position_type: 持仓类型 ["conservative", "moderate", "aggressive", "mixed"]
    - total_volume: 总交易量（ETH）
    - avg_transaction_size: 平均交易规模（ETH）
    - holding_period: 持仓周期 ["short", "medium", "long", "mixed"]
    - diversification_score: 多样化评分 (0-1)
    - risk_tolerance: 风险承受能力 ["low", "medium", "high"]
    - strategy_type: 策略类型 ["hodl", "trading", "arbitrage", "defi", "mixed"]
    - confidence: 分析置信度 (0-1)
    - summary: 分析总结（中英文双语）

    示例输出格式：
    {{
      "position_type": "moderate",
      "total_volume": "15.5",
      "avg_transaction_size": "1.55",
      "holding_period": "medium",
      "diversification_score": 0.7,
      "risk_tolerance": "medium",
      "strategy_type": "trading",
      "confidence": 0.85,
      "summary": "EN: Moderate risk trader with medium-term holding strategy | CN: 中等风险交易者，采用中期持仓策略"
    }}
    """

    try:
        result = call_deepseek(prompt, system_prompt)
        return json.loads(result)
    except Exception as e:
        return {
            "position_type": "unknown",
            "total_volume": "0",
            "avg_transaction_size": "0",
            "holding_period": "unknown",
            "diversification_score": 0.0,
            "risk_tolerance": "unknown",
            "strategy_type": "unknown",
            "confidence": 0.0,
            "summary": f"EN: Analysis failed: {str(e)} | CN: 分析失败: {str(e)}",
            "error": str(e),
        }


def signal_agent(txs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    信号分析Agent - 分析市场信号和交易时机

    Args:
        txs: 交易记录列表

    Returns:
        Dict: 信号分析结果
    """
    system_prompt = """
    你是一个专业的加密货币市场信号分析专家。请分析交易记录中的市场信号和交易时机。
    必须返回严格的JSON格式，不要包含任何其他文字。
    """

    prompt = f"""
    请分析以下交易记录，识别市场信号和交易时机：

    交易数据：
    {json.dumps(txs, indent=2, ensure_ascii=False)}

    请返回JSON格式的分析结果，包含以下字段：
    - market_sentiment: 市场情绪 ["bullish", "bearish", "neutral", "volatile"]
    - trading_frequency: 交易频率 ["low", "medium", "high"]
    - timing_quality: 时机把握质量 (0-1)
    - volume_trend: 交易量趋势 ["increasing", "decreasing", "stable", "irregular"]
    - price_sensitivity: 价格敏感度 ["low", "medium", "high"]
    - signal_strength: 信号强度 (0-1)
    - market_phase: 市场阶段 ["accumulation", "markup", "distribution", "markdown"]
    - confidence: 分析置信度 (0-1)
    - signals: 识别到的具体信号列表
    - summary: 分析总结（中英文双语）

    示例输出格式：
    {{
      "market_sentiment": "bullish",
      "trading_frequency": "medium",
      "timing_quality": 0.75,
      "volume_trend": "increasing",
      "price_sensitivity": "medium",
      "signal_strength": 0.8,
      "market_phase": "markup",
      "confidence": 0.85,
      "signals": ["volume_breakout", "price_momentum"],
      "summary": "EN: Bullish sentiment with good timing and increasing volume | CN: 看涨情绪，时机把握良好，交易量增加"
    }}
    """

    try:
        result = call_deepseek(prompt, system_prompt)
        return json.loads(result)
    except Exception as e:
        return {
            "market_sentiment": "neutral",
            "trading_frequency": "unknown",
            "timing_quality": 0.0,
            "volume_trend": "unknown",
            "price_sensitivity": "unknown",
            "signal_strength": 0.0,
            "market_phase": "unknown",
            "confidence": 0.0,
            "signals": [],
            "summary": f"EN: Signal analysis failed: {str(e)} | CN: 信号分析失败: {str(e)}",
            "error": str(e),
        }


def industry_agent(txs: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    行业分析Agent - 分析涉及的行业和生态

    Args:
        txs: 交易记录列表

    Returns:
        Dict: 行业分析结果
    """
    system_prompt = """
    你是一个专业的加密货币行业分析专家。请分析交易记录中涉及的行业和生态系统。
    必须返回严格的JSON格式，不要包含任何其他文字。
    """

    prompt = f"""
    请分析以下交易记录，识别涉及的行业和生态系统：

    交易数据：
    {json.dumps(txs, indent=2, ensure_ascii=False)}

    请返回JSON格式的分析结果，包含以下字段：
    - primary_sector: 主要行业 ["DeFi", "NFT", "Gaming", "Infrastructure", "Payment", "Mixed"]
    - ecosystem: 生态系统 ["Ethereum", "BSC", "Polygon", "Arbitrum", "Mixed"]
    - protocol_interaction: 协议交互 ["DEX", "Lending", "Yield", "Staking", "Mixed"]
    - token_categories: 代币类别 ["Native", "Stablecoin", "Utility", "Governance", "Mixed"]
    - industry_trend: 行业趋势 ["emerging", "mature", "declining", "stable"]
    - adoption_level: 采用程度 (0-1)
    - innovation_score: 创新评分 (0-1)
    - confidence: 分析置信度 (0-1)
    - summary: 分析总结（中英文双语）

    示例输出格式：
    {{
      "primary_sector": "DeFi",
      "ecosystem": "Ethereum",
      "protocol_interaction": "DEX",
      "token_categories": "Mixed",
      "industry_trend": "mature",
      "adoption_level": 0.8,
      "innovation_score": 0.7,
      "confidence": 0.85,
      "summary": "EN: Active DeFi participant on Ethereum ecosystem | CN: 以太坊生态系统的活跃DeFi参与者"
    }}
    """

    try:
        result = call_deepseek(prompt, system_prompt)
        return json.loads(result)
    except Exception as e:
        return {
            "primary_sector": "unknown",
            "ecosystem": "unknown",
            "protocol_interaction": "unknown",
            "token_categories": "unknown",
            "industry_trend": "unknown",
            "adoption_level": 0.0,
            "innovation_score": 0.0,
            "confidence": 0.0,
            "summary": f"EN: Industry analysis failed: {str(e)} | CN: 行业分析失败: {str(e)}",
            "error": str(e),
        }


def advisor_agent(
    position: Dict[str, Any], signals: Dict[str, Any], industry: Dict[str, Any]
) -> Dict[str, Any]:
    """
    投资顾问Agent - 综合所有分析结果，提供投资建议

    Args:
        position: 持仓分析结果
        signals: 信号分析结果
        industry: 行业分析结果

    Returns:
        Dict: 投资建议
    """
    system_prompt = """
    你是一个专业的加密货币投资顾问。请基于持仓、信号和行业分析结果，提供综合的投资建议。
    必须返回严格的JSON格式，不要包含任何其他文字。
    """

    prompt = f"""
    请基于以下分析结果，提供综合的投资建议：

    持仓分析：
    {json.dumps(position, indent=2, ensure_ascii=False)}

    信号分析：
    {json.dumps(signals, indent=2, ensure_ascii=False)}

    行业分析：
    {json.dumps(industry, indent=2, ensure_ascii=False)}

    请返回JSON格式的投资建议，包含以下字段：
    - overall_rating: 总体评分 (0-10)
    - risk_assessment: 风险评估 ["low", "medium", "high"]
    - recommendation: 投资建议 ["buy", "hold", "sell", "wait"]
    - confidence_level: 信心水平 (0-1)
    - key_strengths: 主要优势列表
    - key_risks: 主要风险列表
    - suggested_actions: 建议行动列表
    - time_horizon: 时间范围 ["short", "medium", "long"]
    - portfolio_allocation: 投资组合建议
    - market_outlook: 市场展望
    - summary: 综合建议（中英文双语）

    示例输出格式：
    {{
      "overall_rating": 7.5,
      "risk_assessment": "medium",
      "recommendation": "hold",
      "confidence_level": 0.8,
      "key_strengths": ["good_timing", "diversified_portfolio"],
      "key_risks": ["market_volatility", "regulatory_uncertainty"],
      "suggested_actions": ["monitor_market", "rebalance_portfolio"],
      "time_horizon": "medium",
      "portfolio_allocation": "60% ETH, 30% DeFi, 10% Cash",
      "market_outlook": "cautiously_optimistic",
      "summary": "EN: Solid portfolio with medium risk, recommend holding with monitoring | CN: 稳健的投资组合，中等风险，建议持有并持续监控"
    }}
    """

    try:
        result = call_deepseek(prompt, system_prompt)
        return json.loads(result)
    except Exception as e:
        return {
            "overall_rating": 5.0,
            "risk_assessment": "medium",
            "recommendation": "hold",
            "confidence_level": 0.0,
            "key_strengths": [],
            "key_risks": ["analysis_failed"],
            "suggested_actions": ["retry_analysis"],
            "time_horizon": "unknown",
            "portfolio_allocation": "unknown",
            "market_outlook": "unknown",
            "summary": f"EN: Advisory analysis failed: {str(e)} | CN: 顾问分析失败: {str(e)}",
            "error": str(e),
        }


if __name__ == "__main__":
    # 测试代码
    test_txs = [
        {
            "hash": "0x123...",
            "from": "0xabc...",
            "to": "0xdef...",
            "value": "1500000000000000000",
            "parsed_json": '{"action": "transfer", "token": "ETH", "amount": "1.5"}',
        }
    ]

    print("测试DeepSeek Agent分析...")

    try:
        position = position_agent(test_txs)
        print("持仓分析:", json.dumps(position, indent=2, ensure_ascii=False))

        signals = signal_agent(test_txs)
        print("信号分析:", json.dumps(signals, indent=2, ensure_ascii=False))

        industry = industry_agent(test_txs)
        print("行业分析:", json.dumps(industry, indent=2, ensure_ascii=False))

        advisor = advisor_agent(position, signals, industry)
        print("投资建议:", json.dumps(advisor, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"测试失败: {e}")
