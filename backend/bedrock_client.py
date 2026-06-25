"""
bedrock_client.py - AWS Bedrock LLM Client

Replaces Google Gemini with AWS Bedrock (Claude model).
Uses environment variables for AWS authentication.
"""

import os
import json
import logging

logger = logging.getLogger(__name__)

# Try to import boto3 for AWS Bedrock
try:
    import boto3
    from botocore.config import Config
    HAS_BEDROCK = True
except ImportError:
    HAS_BEDROCK = False
    logger.warning("boto3 not installed. Bedrock calls will use fallback.")


def get_bedrock_client():
    """Create AWS Bedock runtime client using env credentials."""
    if not HAS_BEDROCK:
        return None
    region = os.environ.get('AIOS_BEDROCK_REGION', 'us-east-1')
    try:
        client = boto3.client(
            'bedrock-runtime',
            region_name=region,
            config=Config(read_timeout=300, connect_timeout=10)
        )
        return client
    except Exception as e:
        logger.error(f"Bedrock client creation failed: {e}")
        return None


def call_claude(prompt, max_tokens=2048, temperature=0.7):
    """Call Claude via AWS Bedrock."""
    client = get_bedrock_client()
    if not client:
        return None
    model_id = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-haiku-20240307-v1:0')
    try:
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens,
            "temperature": temperature,
            "messages": [{"role": "user", "content": prompt}]
        }
        response = client.invoke_model(modelId=model_id, body=json.dumps(body))
        response_body = json.loads(response['body'].read())
        content = response_body.get('content', [])
        return content[0].get('text', '') if content else None
    except Exception as e:
        logger.error(f"Bedrock call failed: {e}")
        return None


def is_available():
    """Check if Bedrock is configured and available."""
    return get_bedrock_client() is not None
