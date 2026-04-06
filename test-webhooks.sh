#!/bin/bash

BASE_URL="http://localhost:3000"
APP_SECRET="test_secret"

echo "=== Gửi webhooks Facebook (Bình luận & Tin nhắn) để test với X-Hub-Signature-256 ==="
echo ""

# Dùng Node.js để tính toán mã HMAC-SHA256 nhằm đảm bảo sự chính xác giống hệ thống
function get_signature() {
  local payload="$1"
  node -e "
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', process.env.APP_SECRET).update(process.env.PAYLOAD).digest('hex');
    console.log('sha256=' + hash);
  "
}

# 1. Test Tin Nhắn Tới Page
export PAYLOAD='{
  "object": "page",
  "entry": [{
    "id": "PAGE_ID",
    "time": 1458692752478,
    "messaging": [{
      "sender": { "id": "123456789" },
      "recipient": { "id": "PAGE_ID" },
      "message": { "text": "Xin chào, tôi muốn hỏi về dịch vụ này!" }
    }]
  }]
}'
export APP_SECRET="$APP_SECRET"

SIGNATURE=$(get_signature "$PAYLOAD")

echo "[1] Gửi tin nhắn test tới page..."
curl -s -X POST -H "Content-Type: application/json" -H "X-Hub-Signature-256: $SIGNATURE" -d "$PAYLOAD" "${BASE_URL}/gateway/facebook/webhook"
echo -e "\n-----------------------------------"

# 2. Test Comment Bài Viết
export PAYLOAD='{
  "object": "page",
  "entry": [{
    "id": "PAGE_ID",
    "time": 1520033100,
    "changes": [{
      "field": "feed",
      "value": {
        "item": "comment",
        "verb": "add",
        "from": { "id": "987654321", "name": "Nguyễn Văn A" },
        "post_id": "POST_ID",
        "comment_id": "COMMENT_ID",
        "message": "Sản phẩm này có size XL không shop?"
      }
    }]
  }]
}'

SIGNATURE=$(get_signature "$PAYLOAD")

echo "[2] Gửi comment bài viết test tới page..."
curl -s -X POST -H "Content-Type: application/json" -H "X-Hub-Signature-256: $SIGNATURE" -d "$PAYLOAD" "${BASE_URL}/gateway/facebook/webhook"
echo -e "\n-----------------------------------"

echo "=== Đã hoàn thành gửi test cURL! ==="
