import json
import os
from typing import Any, Dict

import requests

# DeepSeek API配置
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# DeepSeek Prompt模板
DEEPSEEK_PROMPT = """
你是一个专业的区块链交易分析专家。请分析以下以太坊交易数据，并严格按照JSON格式返回分析结果。

交易数据：
{transaction_data}

请分析这笔交易并返回JSON格式的结果，包含以下字段：
- action: 交易类型，必须是以下之一：["transfer", "swap", "mint", "burn", "contract_interaction", "unknown"]
- token: 代币符号或合约地址（如 "ETH", "USDC", "0x...")
- amount: 交易金额（数字或字符串）
- time: ISO8601格式的时间戳
- confidence: 分析置信度（0-1之间的数字）
- description: 交易描述（中英文双语，格式："EN: English description | CN: 中文描述"）
- risk_level: 风险等级 ["low", "medium", "high"]
- gas_used: Gas使用量（如果可用）
- gas_price: Gas价格（如果可用）

输出要求：
1. 必须返回有效的JSON格式
2. 不要包含任何其他文字或解释
3. 如果某些字段无法确定，使用null值
4. 时间格式必须为ISO8601标准

示例输出格式：
{
  "action": "transfer",
  "token": "ETH",
  "amount": "1.5",
  "time": "2024-01-15T10:30:00Z",
  "confidence": 0.95,
  "description": "EN: ETH transfer between addresses | CN: 以太坊地址间转账",
  "risk_level": "low",
  "gas_used": "21000",
  "gas_price": "20000000000"
}
"""


def parse_with_deepseek(tx: Dict[str, Any]) -> str:
    """
    使用DeepSeek API解析以太坊交易数据

    Args:
        tx: 以太坊交易数据字典

    Returns:
        str: JSON格式的解析结果
    """
    if not DEEPSEEK_API_KEY:
        raise ValueError("DEEPSEEK_API_KEY 环境变量未设置")

    try:
        # 准备交易数据（只保留关键字段）
        transaction_data = {
            "hash": tx.get("hash", ""),
            "from": tx.get("from", ""),
            "to": tx.get("to", ""),
            "value": tx.get("value", "0"),
            "timeStamp": tx.get("timeStamp", "0"),
            "gas": tx.get("gas", "0"),
            "gasPrice": tx.get("gasPrice", "0"),
            "gasUsed": tx.get("gasUsed", "0"),
            "isError": tx.get("isError", "0"),
            "methodId": tx.get("methodId", ""),
            "functionName": tx.get("functionName", ""),
            "contractAddress": tx.get("contractAddress", ""),
            "input": (
                tx.get("input", "")[:200] if tx.get("input") else ""
            ),  # 限制input长度
        }

        # 构建提示词
        prompt = DEEPSEEK_PROMPT.format(
            transaction_data=json.dumps(transaction_data, indent=2)
        )

        # 调用DeepSeek API
        headers = {
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1,
            "max_tokens": 1000,
        }

        response = requests.post(
            DEEPSEEK_API_URL, headers=headers, json=payload, timeout=30
        )
        response.raise_for_status()

        result = response.json()
        result_text = result["choices"][0]["message"]["content"].strip()

        # 验证JSON格式
        try:
            parsed_result = json.loads(result_text)
            # 确保必要字段存在
            required_fields = ["action", "token", "amount", "time", "confidence"]
            for field in required_fields:
                if field not in parsed_result:
                    parsed_result[field] = None

            return json.dumps(parsed_result, ensure_ascii=False)

        except json.JSONDecodeError as e:
            # 如果返回的不是有效JSON，返回默认结构
            default_result = {
                "action": "unknown",
                "token": "ETH",
                "amount": tx.get("value", "0"),
                "time": f"2024-01-01T00:00:00Z",  # 默认时间
                "confidence": 0.1,
                "description": "EN: Failed to parse transaction | CN: 交易解析失败",
                "risk_level": "medium",
                "gas_used": tx.get("gasUsed", "0"),
                "gas_price": tx.get("gasPrice", "0"),
                "error": f"JSON解析错误: {str(e)}",
            }
            return json.dumps(default_result, ensure_ascii=False)

    except Exception as e:
        # 发生错误时返回默认结构
        error_result = {
            "action": "unknown",
            "token": "ETH",
            "amount": tx.get("value", "0"),
            "time": f"2024-01-01T00:00:00Z",
            "confidence": 0.0,
            "description": f"EN: Analysis failed: {str(e)} | CN: 分析失败: {str(e)}",
            "risk_level": "high",
            "gas_used": tx.get("gasUsed", "0"),
            "gas_price": tx.get("gasPrice", "0"),
            "error": str(e),
        }
        return json.dumps(error_result, ensure_ascii=False)


def parse_transaction_simple(tx: Dict[str, Any]) -> Dict[str, Any]:
    """
    简单解析交易数据（当API不可用时使用）

    Args:
        tx: 以太坊交易数据字典

    Returns:
        Dict: 解析结果
    """
    # 简单的交易类型判断
    value = int(tx.get("value", "0"))
    is_contract = tx.get("contractAddress", "") != ""

    if value > 0 and not is_contract:
        action = "transfer"
        token = "ETH"
    elif is_contract:
        action = "contract_interaction"
        token = "Contract"
    else:
        action = "unknown"
        token = "ETH"

    return {
        "action": action,
        "token": token,
        "amount": str(value / 10**18) if value > 0 else "0",
        "time": f"2024-01-01T00:00:00Z",  # 需要转换时间戳
        "confidence": 0.7,
        "description": f"EN: {action} transaction | CN: {action} 交易",
        "risk_level": "medium",
        "gas_used": tx.get("gasUsed", "0"),
        "gas_price": tx.get("gasPrice", "0"),
    }


if __name__ == "__main__":
    # 测试代码
    test_tx = {
        "hash": "0x123...",
        "from": "0xabc...",
        "to": "0xdef...",
        "value": "1500000000000000000",  # 1.5 ETH
        "timeStamp": "1642234567",
        "gas": "21000",
        "gasPrice": "20000000000",
        "gasUsed": "21000",
        "isError": "0",
    }

    try:
        result = parse_with_deepseek(test_tx)
        print("DeepSeek解析结果:")
        print(result)
    except Exception as e:
        print(f"DeepSeek解析失败: {e}")
        print("使用简单解析:")
        simple_result = parse_transaction_simple(test_tx)
        print(json.dumps(simple_result, indent=2, ensure_ascii=False))
