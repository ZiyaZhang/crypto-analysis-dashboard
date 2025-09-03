#!/usr/bin/env python3
"""
多Agent分析运行脚本 - DeepSeek版本
从数据库读取交易记录，执行多Agent分析，保存结果
"""

import json
import os
import sqlite3
import sys
from datetime import datetime
from typing import Any, Dict, List

# 添加backend目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from agents_deepseek import advisor_agent, industry_agent, position_agent, signal_agent
from workflow import create_workflow_instance


def load_transactions_from_db(
    db_path: str = "transactions.db", limit: int = 20
) -> List[Dict[str, Any]]:
    """
    从数据库加载交易记录

    Args:
        db_path: 数据库文件路径
        limit: 加载记录数量限制

    Returns:
        List[Dict]: 交易记录列表
    """
    if not os.path.exists(db_path):
        print(f"数据库文件不存在: {db_path}")
        return []

    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT * FROM transactions
            ORDER BY time DESC
            LIMIT ?
        """,
            (limit,),
        )

        rows = cursor.fetchall()
        conn.close()

        transactions = []
        for row in rows:
            tx_dict = dict(row)

            # 如果parsed_json为空，尝试解析raw_json
            if not tx_dict.get("parsed_json"):
                try:
                    raw_data = json.loads(tx_dict.get("raw_json", "{}"))
                    # 简单解析
                    parsed_data = {
                        "action": (
                            "transfer"
                            if int(tx_dict.get("value", "0")) > 0
                            else "unknown"
                        ),
                        "token": "ETH",
                        "amount": str(int(tx_dict.get("value", "0")) / 10**18),
                        "time": datetime.fromtimestamp(
                            int(tx_dict.get("time", "0"))
                        ).isoformat()
                        + "Z",
                        "confidence": 0.5,
                        "description": "EN: Simple parsed transaction | CN: 简单解析的交易",
                        "risk_level": "medium",
                        "gas_used": tx_dict.get("gas_used", "0"),
                        "gas_price": tx_dict.get("gas_price", "0"),
                    }
                    tx_dict["parsed_json"] = json.dumps(parsed_data)
                except Exception as e:
                    print(f"解析交易 {tx_dict.get('hash', 'unknown')} 失败: {e}")
                    continue

            transactions.append(tx_dict)

        print(f"从数据库加载了 {len(transactions)} 笔交易")
        return transactions

    except Exception as e:
        print(f"从数据库加载交易失败: {e}")
        return []


def create_sample_transactions() -> List[Dict[str, Any]]:
    """
    创建示例交易数据（当数据库为空时使用）

    Returns:
        List[Dict]: 示例交易数据
    """
    sample_txs = [
        {
            "hash": "0x1234567890abcdef1234567890abcdef12345678",
            "from_addr": "0xabcdef1234567890abcdef1234567890abcdef12",
            "to_addr": "0x9876543210fedcba9876543210fedcba98765432",
            "value": "1500000000000000000",  # 1.5 ETH
            "time": 1642234567,
            "raw_json": json.dumps(
                {
                    "hash": "0x1234567890abcdef1234567890abcdef12345678",
                    "from": "0xabcdef1234567890abcdef1234567890abcdef12",
                    "to": "0x9876543210fedcba9876543210fedcba98765432",
                    "value": "1500000000000000000",
                    "timeStamp": "1642234567",
                    "gas": "21000",
                    "gasPrice": "20000000000",
                    "gasUsed": "21000",
                }
            ),
            "parsed_json": json.dumps(
                {
                    "action": "transfer",
                    "token": "ETH",
                    "amount": "1.5",
                    "time": "2024-01-15T10:30:00Z",
                    "confidence": 0.95,
                    "description": "EN: ETH transfer between addresses | CN: 以太坊地址间转账",
                    "risk_level": "low",
                    "gas_used": "21000",
                    "gas_price": "20000000000",
                }
            ),
        },
        {
            "hash": "0x2345678901bcdef1234567890abcdef1234567890",
            "from_addr": "0x9876543210fedcba9876543210fedcba98765432",
            "to_addr": "0x1234567890abcdef1234567890abcdef12345678",
            "value": "500000000000000000",  # 0.5 ETH
            "time": 1642234568,
            "raw_json": json.dumps(
                {
                    "hash": "0x2345678901bcdef1234567890abcdef1234567890",
                    "from": "0x9876543210fedcba9876543210fedcba98765432",
                    "to": "0x1234567890abcdef1234567890abcdef12345678",
                    "value": "500000000000000000",
                    "timeStamp": "1642234568",
                    "gas": "21000",
                    "gasPrice": "25000000000",
                    "gasUsed": "21000",
                }
            ),
            "parsed_json": json.dumps(
                {
                    "action": "transfer",
                    "token": "ETH",
                    "amount": "0.5",
                    "time": "2024-01-15T10:31:00Z",
                    "confidence": 0.95,
                    "description": "EN: ETH transfer between addresses | CN: 以太坊地址间转账",
                    "risk_level": "low",
                    "gas_used": "21000",
                    "gas_price": "25000000000",
                }
            ),
        },
    ]

    print(f"创建了 {len(sample_txs)} 笔示例交易")
    return sample_txs


def run_analysis():
    """运行完整的分析流程"""
    print("=" * 60)
    print("开始执行多Agent分析工作流 (DeepSeek版本)")
    print("=" * 60)

    # 检查环境变量
    if not os.getenv("DEEPSEEK_API_KEY"):
        print("警告: DEEPSEEK_API_KEY 环境变量未设置，将使用示例数据")

    # 加载交易数据
    transactions = load_transactions_from_db()

    if not transactions:
        print("数据库中没有交易记录，使用示例数据")
        transactions = create_sample_transactions()

    if not transactions:
        print("错误: 没有可用的交易数据进行分析")
        return

    print(f"准备分析 {len(transactions)} 笔交易")

    # 执行分析
    try:
        results = {}

        # Step 1: 持仓分析
        print("执行持仓分析...")
        position_result = position_agent(transactions)
        results["position_analysis"] = position_result

        # Step 2: 信号分析
        print("执行信号分析...")
        signal_result = signal_agent(transactions)
        results["signal_analysis"] = signal_result

        # Step 3: 行业分析
        print("执行行业分析...")
        industry_result = industry_agent(transactions)
        results["industry_analysis"] = industry_result

        # Step 4: 投资顾问分析
        print("执行投资顾问分析...")
        advisor_result = advisor_agent(position_result, signal_result, industry_result)
        results["advisor_analysis"] = advisor_result

        # 添加元数据
        results["metadata"] = {
            "workflow_version": "1.0.0",
            "transaction_count": len(transactions),
            "analysis_timestamp": datetime.now().isoformat() + "Z",
            "ai_provider": "DeepSeek",
            "status": "completed",
        }

        # 保存结果
        result_file = "analysis_demo/result.json"
        with open(result_file, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2, ensure_ascii=False)

        print(f"\n分析结果已保存到: {result_file}")

        # 打印关键结果
        print("\n" + "=" * 60)
        print("分析结果摘要")
        print("=" * 60)

        if "advisor_analysis" in results:
            advisor = results["advisor_analysis"]
            print(f"总体评分: {advisor.get('overall_rating', 'N/A')}/10")
            print(f"风险评估: {advisor.get('risk_assessment', 'N/A')}")
            print(f"投资建议: {advisor.get('recommendation', 'N/A')}")
            print(f"信心水平: {advisor.get('confidence_level', 'N/A')}")
            print(f"建议总结: {advisor.get('summary', 'N/A')}")

        print("\n详细结果请查看 result.json 文件")

    except Exception as e:
        print(f"分析执行失败: {e}")
        import traceback

        traceback.print_exc()


def main():
    """主函数"""
    print("多Agent加密货币交易分析系统 (DeepSeek版本)")
    print("=" * 60)

    # 检查数据库
    db_path = "transactions.db"
    if os.path.exists(db_path):
        print(f"找到数据库文件: {db_path}")
    else:
        print(f"数据库文件不存在: {db_path}")
        print("将使用示例数据进行演示")

    # 运行分析
    run_analysis()


if __name__ == "__main__":
    main()
