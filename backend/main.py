from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
import json
from typing import List, Dict, Any
from db import init_database, insert_transaction, get_recent_transactions, get_transaction_count
from parser import parse_with_claude
from parser_deepseek import parse_with_deepseek

app = FastAPI(title="Crypto Transaction Analysis API", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化数据库
init_database()

@app.get("/")
async def root():
    """根路径，返回API信息"""
    return {
        "message": "Crypto Transaction Analysis API",
        "version": "1.0.0",
        "endpoints": {
            "fetch_eth": "/fetch_eth/{address}",
            "transactions": "/transactions",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "transaction_count": get_transaction_count()}

@app.get("/fetch_eth/{address}")
async def fetch_eth_transactions(address: str, limit: int = 10):
    """
    从Etherscan API拉取以太坊地址的交易记录
    
    Args:
        address: 以太坊地址
        limit: 获取交易数量限制（默认10条）
    """
    api_key = os.getenv("ETHERSCAN_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500, 
            detail="ETHERSCAN_API_KEY 环境变量未设置"
        )
    
    try:
        # 调用Etherscan API
        url = f"https://api.etherscan.io/api"
        params = {
            "module": "account",
            "action": "txlist",
            "address": address,
            "startblock": 0,
            "endblock": 99999999,
            "page": 1,
            "offset": limit,
            "sort": "desc",
            "apikey": api_key
        }
        
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        
        data = response.json()
        
        if data["status"] != "1":
            raise HTTPException(
                status_code=400,
                detail=f"Etherscan API错误: {data.get('message', '未知错误')}"
            )
        
        transactions = data.get("result", [])
        processed_count = 0
        
        for tx in transactions:
            try:
                # 保存原始JSON
                tx["raw_json"] = json.dumps(tx)
                
                # 使用AI解析交易（优先使用DeepSeek，如果不可用则使用Claude）
                try:
                    if os.getenv("DEEPSEEK_API_KEY"):
                        parsed_result = parse_with_deepseek(tx)
                    else:
                        parsed_result = parse_with_claude(tx)
                except Exception as e:
                    print(f"AI解析失败，使用简单解析: {e}")
                    # 简单解析作为备选
                    parsed_result = json.dumps({
                        "action": "transfer" if int(tx.get('value', '0')) > 0 else "unknown",
                        "token": "ETH",
                        "amount": str(int(tx.get('value', '0')) / 10**18),
                        "time": "2024-01-01T00:00:00Z",
                        "confidence": 0.5,
                        "description": "EN: Simple parsed transaction | CN: 简单解析的交易",
                        "risk_level": "medium",
                        "gas_used": tx.get('gasUsed', '0'),
                        "gas_price": tx.get('gasPrice', '0')
                    })
                
                tx["parsed_json"] = parsed_result
                
                # 存入数据库
                insert_transaction(tx)
                processed_count += 1
                
            except Exception as e:
                print(f"处理交易 {tx.get('hash', 'unknown')} 时出错: {e}")
                continue
        
        return {
            "success": True,
            "address": address,
            "total_fetched": len(transactions),
            "processed": processed_count,
            "message": f"成功处理 {processed_count} 笔交易"
        }
        
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"网络请求失败: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理失败: {str(e)}")

@app.get("/transactions")
async def get_transactions(limit: int = 20):
    """
    获取最近的交易记录
    
    Args:
        limit: 返回交易数量限制（默认20条）
    """
    try:
        transactions = get_recent_transactions(limit)
        return {
            "success": True,
            "count": len(transactions),
            "transactions": transactions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取交易记录失败: {str(e)}")

@app.get("/analysis")
async def get_analysis_result():
    """
    获取分析结果（从analysis_demo/result.json读取）
    """
    try:
        result_file = "analysis_demo/result.json"
        if not os.path.exists(result_file):
            return {
                "success": False,
                "message": "分析结果文件不存在，请先运行分析"
            }
        
        with open(result_file, 'r', encoding='utf-8') as f:
            result = json.load(f)
        
        return {
            "success": True,
            "result": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"读取分析结果失败: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

