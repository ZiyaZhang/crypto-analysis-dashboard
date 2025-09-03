"""
多Agent分析工作流配置
使用OpenManus框架的兼容方式定义工作流
"""

import json
from typing import Any, Dict, List

from agents import advisor_agent, industry_agent, position_agent, signal_agent


class AnalysisWorkflow:
    """分析工作流类"""

    def __init__(self):
        self.workflow_config = {
            "name": "Crypto Transaction Analysis Workflow",
            "version": "1.0.0",
            "description": "Multi-agent analysis workflow for crypto transactions",
            "agents": [
                {
                    "name": "position_agent",
                    "description": "Analyzes position and investment strategy",
                    "function": "position_agent",
                },
                {
                    "name": "signal_agent",
                    "description": "Analyzes market signals and timing",
                    "function": "signal_agent",
                },
                {
                    "name": "industry_agent",
                    "description": "Analyzes industry and ecosystem involvement",
                    "function": "industry_agent",
                },
                {
                    "name": "advisor_agent",
                    "description": "Provides comprehensive investment advice",
                    "function": "advisor_agent",
                },
            ],
            "execution_order": [
                "position_agent",
                "signal_agent",
                "industry_agent",
                "advisor_agent",
            ],
            "dependencies": {
                "advisor_agent": ["position_agent", "signal_agent", "industry_agent"]
            },
        }

    def execute_workflow(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        执行完整的工作流分析

        Args:
            transactions: 交易记录列表

        Returns:
            Dict: 完整的分析结果
        """
        results = {}

        try:
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
            advisor_result = advisor_agent(
                position_result, signal_result, industry_result
            )
            results["advisor_analysis"] = advisor_result

            # 添加元数据
            results["metadata"] = {
                "workflow_version": self.workflow_config["version"],
                "transaction_count": len(transactions),
                "analysis_timestamp": "2024-01-01T00:00:00Z",  # 实际使用时应该用当前时间
                "status": "completed",
            }

            print("工作流执行完成")
            return results

        except Exception as e:
            print(f"工作流执行失败: {e}")
            results["error"] = str(e)
            results["metadata"] = {
                "workflow_version": self.workflow_config["version"],
                "transaction_count": len(transactions),
                "analysis_timestamp": "2024-01-01T00:00:00Z",
                "status": "failed",
            }
            return results

    def get_workflow_config(self) -> Dict[str, Any]:
        """获取工作流配置"""
        return self.workflow_config

    def save_workflow_config(
        self, filepath: str = "analysis_demo/workflow_config.json"
    ):
        """保存工作流配置到文件"""
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(self.workflow_config, f, indent=2, ensure_ascii=False)
        print(f"工作流配置已保存到: {filepath}")


# OpenManus兼容的工作流定义
WORKFLOW_DEFINITION = {
    "name": "crypto_analysis_workflow",
    "description": "Multi-agent crypto transaction analysis workflow",
    "version": "1.0.0",
    "agents": {
        "position_agent": {
            "type": "analysis",
            "prompt_template": "position_analysis_prompt",
            "output_format": "json",
            "dependencies": [],
        },
        "signal_agent": {
            "type": "analysis",
            "prompt_template": "signal_analysis_prompt",
            "output_format": "json",
            "dependencies": [],
        },
        "industry_agent": {
            "type": "analysis",
            "prompt_template": "industry_analysis_prompt",
            "output_format": "json",
            "dependencies": [],
        },
        "advisor_agent": {
            "type": "advisor",
            "prompt_template": "advisor_analysis_prompt",
            "output_format": "json",
            "dependencies": ["position_agent", "signal_agent", "industry_agent"],
        },
    },
    "execution_plan": {
        "parallel": ["position_agent", "signal_agent", "industry_agent"],
        "sequential": ["advisor_agent"],
    },
    "output_schema": {
        "position_analysis": {
            "type": "object",
            "properties": {
                "position_type": {"type": "string"},
                "total_volume": {"type": "string"},
                "risk_tolerance": {"type": "string"},
                "strategy_type": {"type": "string"},
                "confidence": {"type": "number"},
            },
        },
        "signal_analysis": {
            "type": "object",
            "properties": {
                "market_sentiment": {"type": "string"},
                "trading_frequency": {"type": "string"},
                "timing_quality": {"type": "number"},
                "signal_strength": {"type": "number"},
                "confidence": {"type": "number"},
            },
        },
        "industry_analysis": {
            "type": "object",
            "properties": {
                "primary_sector": {"type": "string"},
                "ecosystem": {"type": "string"},
                "protocol_interaction": {"type": "string"},
                "adoption_level": {"type": "number"},
                "confidence": {"type": "number"},
            },
        },
        "advisor_analysis": {
            "type": "object",
            "properties": {
                "overall_rating": {"type": "number"},
                "risk_assessment": {"type": "string"},
                "recommendation": {"type": "string"},
                "confidence_level": {"type": "number"},
                "summary": {"type": "string"},
            },
        },
    },
}


def create_workflow_instance():
    """创建工作流实例"""
    return AnalysisWorkflow()


if __name__ == "__main__":
    # 测试工作流配置
    workflow = create_workflow_instance()

    print("工作流配置:")
    print(json.dumps(workflow.get_workflow_config(), indent=2, ensure_ascii=False))

    # 保存配置
    workflow.save_workflow_config()

    print("\nOpenManus兼容的工作流定义:")
    print(json.dumps(WORKFLOW_DEFINITION, indent=2, ensure_ascii=False))
