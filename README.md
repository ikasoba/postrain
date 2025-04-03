# postrain

単純で一時だけのSNS

## 概要

投稿がリアルタイムで表示され、時間とともに消えて行くSNSです。

独り言や会話があっけなく消えていく様をお楽しみください。

## 試し方

### バックエンド
```sh
cd backend

pnpm i

docker compose -f compose.dev.yaml up -d
pnpm run dev
```

### フロントエンド
```sh
cd frontend

pnpm i
pnpm run dev
```
